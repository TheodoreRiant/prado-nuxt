/**
 * Scrape all actions from itineraires.le-prado.fr and push to Prismic one by one.
 *
 * Usage: PRISMIC_WRITE_TOKEN=xxx node scripts/scrape-and-push-actions.mjs
 */

import * as prismic from '@prismicio/client';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const BASE = 'https://itineraires.le-prado.fr';
const TOKEN = process.env.PRISMIC_WRITE_TOKEN;
const RATE_MS = 500;

if (!TOKEN) { console.error('Missing PRISMIC_WRITE_TOKEN'); process.exit(1); }

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function slugify(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}

function decodeHtml(s) {
  return (s || '')
    .replace(/&#039;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ').replace(/&rsquo;/g, "'").replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»').replace(/&hellip;/g, '...').replace(/&ndash;/g, '–')
    .replace(/&eacute;/g, 'é').replace(/&egrave;/g, 'è').replace(/&agrave;/g, 'à')
    .replace(/&ocirc;/g, 'ô').replace(/&ucirc;/g, 'û').replace(/&ccedil;/g, 'ç');
}

const VALID_CATEGORIES = [
  'Bien-être', 'Découverte & orientation', 'Vie quotidienne',
  'Formations', 'Formations & Ateliers', 'Rencontres/Visites',
  'Mobilité', 'Emploi', 'Numérique', 'Droits', 'Bénévolat',
];

function mapCategory(raw) {
  const c = decodeHtml(raw).trim();
  if (VALID_CATEGORIES.includes(c)) return c;
  const lower = c.toLowerCase();
  if (lower.includes('bien') || lower.includes('santé') || lower.includes('sante')) return 'Bien-être';
  if (lower.includes('découverte') || lower.includes('decouverte') || lower.includes('orientation')) return 'Découverte & orientation';
  if (lower.includes('quotidien') || lower.includes('logement') || lower.includes('cuisine')) return 'Vie quotidienne';
  if (lower.includes('formation') || lower.includes('atelier')) return 'Formations & Ateliers';
  if (lower.includes('rencontre') || lower.includes('visite')) return 'Rencontres/Visites';
  if (lower.includes('mobilité') || lower.includes('mobilite') || lower.includes('permis')) return 'Mobilité';
  if (lower.includes('emploi') || lower.includes('insertion') || lower.includes('pro')) return 'Emploi';
  if (lower.includes('numérique') || lower.includes('numerique')) return 'Numérique';
  if (lower.includes('droit') || lower.includes('citoyen')) return 'Droits';
  if (lower.includes('bénévolat') || lower.includes('benevolat')) return 'Bénévolat';
  return 'Bien-être';
}

// ---------------------------------------------------------------------------
// Scrape
// ---------------------------------------------------------------------------

async function fetchPage(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 PradoScraper/4.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function parseHtmlToRichText(rawHtml) {
  let clean = rawHtml.replace(/<h4[^>]*>\s*Description\s*<\/h4>/gi, '');
  clean = clean.replace(/<h4[^>]*>\s*Infos pratiques[\s\S]*$/gi, '');
  clean = clean.replace(/Téléchargez le pdf[\s\S]*?ici\s*/gi, '');
  clean = clean.replace(/Notre activité est rendue possible[\s\S]*$/gi, '');

  const blocks = [];
  for (const el of clean.matchAll(/<(p|h[3-6]|li)[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const tag = el[1].toLowerCase();
    let text = decodeHtml(el[2].replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').trim());
    if (!text || text === ' ') continue;

    let type = 'paragraph';
    if (tag === 'li') {
      const before = clean.substring(0, el.index);
      type = before.lastIndexOf('<ol') > before.lastIndexOf('<ul') ? 'o-list-item' : 'list-item';
    }
    if (tag.match(/^h[3-6]$/)) type = 'heading' + tag[1];

    const spans = [];
    const inner = el[2];
    for (const sm of inner.matchAll(/<(?:strong|b)>([^<]+)<\/(?:strong|b)>/gi)) {
      const st = sm[1].trim(); const idx = text.indexOf(st);
      if (idx >= 0) spans.push({ type: 'strong', start: idx, end: idx + st.length });
    }
    for (const lm of inner.matchAll(/<a[^>]+href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)) {
      let href = lm[1]; const lt = lm[2].replace(/<[^>]+>/g, '').trim();
      if (!lt || !href) continue;
      if (!href.startsWith('http') && !href.startsWith('mailto:')) href = BASE + '/' + href.replace(/^\//, '');
      const idx = text.indexOf(lt);
      if (idx >= 0) spans.push({ type: 'hyperlink', start: idx, end: idx + lt.length, data: { link_type: 'Web', url: href } });
    }
    blocks.push({ type, text, spans });
  }
  return blocks;
}

async function scrapeActionDetail(detailPath) {
  const url = detailPath.startsWith('http') ? detailPath : BASE + detailPath;
  const html = await fetchPage(url);

  // Title: og:title or first h2 (actions don't have h1)
  const ogTitle = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/)?.[1];
  const h2Title = (html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)?.[1] || '').replace(/<[^>]+>/g, '').trim();
  const title = decodeHtml(ogTitle || h2Title);

  // Image: /assets/Event/Image/... (NOT logo)
  const contentImg = html.match(/<img[^>]+src="(\/assets\/Event\/Image\/[^"]*)"/)?.[1];
  const ogImage = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/)?.[1];
  const imgUrl = contentImg ? BASE + contentImg : (ogImage && !ogImage.includes('Logo') ? ogImage : '');

  // Category
  const catText = html.match(/<div[^>]+class="[^"]*Category[^"]*"[^>]*>([^<]*)<\/div>/)?.[1] || '';

  // Date
  const dateMatch = html.match(/<div[^>]+class="[^"]*datesAndTimeframe[^"]*"[^>]*>([\s\S]*?)<\/div>/);
  const dateText = dateMatch ? decodeHtml(dateMatch[1].replace(/<[^>]+>/g, '').trim()) : '';

  // Time
  const timeMatch = html.match(/(\d{1,2}[h:]\d{0,2}\s*[-–à]\s*\d{1,2}[h:]\d{0,2})/);
  const timeText = timeMatch ? timeMatch[1] : '';

  // Description
  const contentMatch = html.match(/<div[^>]+class="[^"]*event-content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/);
  const blocks = parseHtmlToRichText(contentMatch?.[1] || '');

  // Summary
  const ogDesc = html.match(/<meta\s+property="og:description"\s+content="([^"]*)"/)?.[1] || '';
  const summary = decodeHtml(ogDesc).replace(/^\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}\s*/, '').trim().slice(0, 300)
    || blocks[0]?.text?.slice(0, 300) || '';

  const isActivite = !dateText || dateText.toLowerCase().includes('année');
  const slug = detailPath.split('/detail/')[1] || slugify(title);

  return { title, slug, category: catText, dateText, timeText, summary, blocks, imgUrl, isActivite, sourceUrl: detailPath };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('=== Scrape & Push Actions ===\n');

  // Step 1: Collect URLs from listing pages
  console.log('[Step 1] Scanning listing pages...');
  const allUrls = new Set();
  for (let page = 0; page < 8; page++) {
    const url = `${BASE}/programmation/tous-les-evenements${page > 0 ? '?start=' + (page * 15) : ''}`;
    try {
      const html = await fetchPage(url);
      for (const m of html.matchAll(/href="([^"]*\/detail\/[^"]*)"/g)) {
        allUrls.add(m[1]);
      }
    } catch {}
    await sleep(RATE_MS);
  }
  console.log(`Found ${allUrls.size} action URLs\n`);

  // Step 2: Scrape each detail page
  console.log('[Step 2] Scraping detail pages...');
  const actions = [];
  const urls = [...allUrls];
  for (let i = 0; i < urls.length; i++) {
    const path = urls[i];
    console.log(`  ${i + 1}/${urls.length}: ${path.split('/detail/')[1]}`);
    try {
      const data = await scrapeActionDetail(path);
      if (!data.title) { console.log('    SKIP: no title'); continue; }
      actions.push(data);
      console.log(`    ✓ "${data.title}" [${data.blocks.length} blocks]`);
    } catch (err) {
      console.log(`    ERROR: ${err.message}`);
    }
    await sleep(RATE_MS);
  }
  console.log(`\nScraped: ${actions.length} actions`);

  // Save backup
  writeFileSync(join(__dirname, 'scraped-actions.json'), JSON.stringify(actions, null, 2));

  // Step 3: Push one by one
  console.log('\n[Step 3] Pushing to Prismic one by one...');
  const writeClient = prismic.createWriteClient('prado-nuxt', { writeToken: TOKEN });
  const usedUids = new Set();
  let ok = 0, errors = 0;

  for (let i = 0; i < actions.length; i++) {
    const a = actions[i];
    const title = a.title;
    if (!title || !a.blocks?.length) continue;

    // Unique UID
    let uid = slugify(title) || a.slug;
    let finalUid = uid;
    let s = 1;
    while (usedUids.has(finalUid)) { finalUid = `${uid}-${s}`; s++; }
    usedUids.add(finalUid);

    const migration = prismic.createMigration();

    const data = {
      title,
      category: mapCategory(a.category),
      date_text: a.dateText || (a.isActivite ? "Toute l'année" : ''),
      time_text: a.timeText,
      summary: a.summary,
      description: a.blocks,
      url_detail: { link_type: 'Web', url: BASE + a.sourceUrl },
      is_activite: a.isActivite,
    };

    // Download & attach image
    if (a.imgUrl) {
      try {
        const imgRes = await fetch(a.imgUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (imgRes.ok) {
          const buf = Buffer.from(await imgRes.arrayBuffer());
          const ext = a.imgUrl.match(/\.(png|jpg|jpeg|gif|webp)/i)?.[1] || 'png';
          const tmpPath = `/tmp/action-${finalUid}.${ext}`;
          writeFileSync(tmpPath, buf);
          data.image = migration.createAsset(readFileSync(tmpPath), `${finalUid}.${ext}`);
        }
      } catch {}
    }

    migration.createDocument(
      { type: 'action', uid: finalUid, lang: 'en-us', data },
      `Action: ${title}`
    );

    try {
      await writeClient.migrate(migration, { reporter: () => {} });
      ok++;
      if (ok % 10 === 0) console.log(`  ${ok}/${actions.length} pushed`);
    } catch (err) {
      errors++;
      console.log(`  ERROR ${finalUid}: ${err.message?.substring(0, 80)}`);
    }
    await sleep(300);
  }

  console.log(`\nDone! Pushed: ${ok} | Errors: ${errors}`);
  console.log('Publie la Migration Release dans le dashboard.');
}

main().catch(console.error);
