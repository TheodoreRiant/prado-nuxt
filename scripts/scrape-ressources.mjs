/**
 * Scrape all ressources from itineraires.le-prado.fr by category → Prismic
 *
 * 1. For each category page, paginate and collect all detail URLs
 * 2. Scrape each detail page (title, image, richtext content)
 * 3. Download images
 * 4. Push to Prismic via Migration API
 *
 * Usage: PRISMIC_WRITE_TOKEN=xxx node scripts/scrape-ressources.mjs
 */

import * as prismic from '@prismicio/client';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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

// Categories: path → Prismic category value
const CATEGORIES = {
  '/ressources/accompagnement-insertion/': 'Accompagnement/Insertion',
  '/ressources/acces-aux-droits/': 'Acces aux droits',
  '/ressources/emploi-formation/': 'Emploi/Formation',
  '/ressources/logement-mobilite/': 'Logement/Mobilite',
  '/ressources/sante/': 'Sante',
};

// ---------------------------------------------------------------------------
// Step 1: Collect all detail URLs per category
// ---------------------------------------------------------------------------

async function fetchPage(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 PradoScraper/4.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function collectCategoryUrls(catPath) {
  const allUrls = new Set();
  let page = 0;

  while (true) {
    const url = `${BASE}${catPath}${page > 0 ? '?start=' + (page * 15) : ''}`;
    try {
      const html = await fetchPage(url);
      const links = [...html.matchAll(/href="([^"]*\/detail\/[^"]*)"/g)].map(m => m[1]);
      if (links.length === 0) break;
      links.forEach(l => allUrls.add(l));

      // Check if there's a next page
      const hasNext = html.includes(`start=${(page + 1) * 15}`);
      if (!hasNext) break;
      page++;
    } catch {
      break;
    }
    await sleep(RATE_MS);
  }

  return [...allUrls];
}

// ---------------------------------------------------------------------------
// Step 2: Scrape a detail page
// ---------------------------------------------------------------------------

function parseHtmlToRichText(rawHtml) {
  const blocks = [];
  for (const el of rawHtml.matchAll(/<(p|h[3-6]|li)[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const tag = el[1].toLowerCase();
    let text = el[2]
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&hellip;/g, '...')
      .replace(/&laquo;/g, '«').replace(/&raquo;/g, '»').replace(/&rsquo;/g, "'")
      .replace(/&eacute;/g, 'é').replace(/&egrave;/g, 'è').replace(/&agrave;/g, 'à')
      .replace(/&ocirc;/g, 'ô').replace(/&ucirc;/g, 'û').replace(/&iuml;/g, 'ï')
      .replace(/&ccedil;/g, 'ç').replace(/&#039;/g, "'").replace(/&quot;/g, '"')
      .trim();
    if (!text || text === ' ') continue;

    let type = 'paragraph';
    if (tag === 'li') {
      const before = rawHtml.substring(0, el.index);
      type = before.lastIndexOf('<ol') > before.lastIndexOf('<ul') ? 'o-list-item' : 'list-item';
    }
    if (tag.match(/^h[3-6]$/)) type = 'heading' + tag[1];

    // Spans
    const spans = [];
    const inner = el[2];
    for (const sm of inner.matchAll(/<(?:strong|b)>([^<]+)<\/(?:strong|b)>/gi)) {
      const st = sm[1].trim();
      const idx = text.indexOf(st);
      if (idx >= 0) spans.push({ type: 'strong', start: idx, end: idx + st.length });
    }
    for (const lm of inner.matchAll(/<a[^>]+href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)) {
      let href = lm[1];
      const lt = lm[2].replace(/<[^>]+>/g, '').trim();
      if (!lt || !href) continue;
      if (!href.startsWith('http') && !href.startsWith('mailto:')) href = BASE + '/' + href.replace(/^\//, '');
      const idx = text.indexOf(lt);
      if (idx >= 0) spans.push({ type: 'hyperlink', start: idx, end: idx + lt.length, data: { link_type: 'Web', url: href } });
    }

    blocks.push({ type, text, spans });
  }
  return blocks;
}

async function scrapeDetail(detailPath) {
  const url = detailPath.startsWith('http') ? detailPath : BASE + detailPath;
  const html = await fetchPage(url);

  const rawTitle = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] || '').replace(/<[^>]+>/g, '');
  const title = rawTitle
    .replace(/&#039;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"')
    .replace(/&eacute;/g, 'é').replace(/&egrave;/g, 'è').replace(/&agrave;/g, 'à')
    .replace(/&rsquo;/g, "'").replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')
    .replace(/&nbsp;/g, ' ').replace(/&hellip;/g, '...').replace(/&ndash;/g, '–')
    .replace(/&ocirc;/g, 'ô').replace(/&ucirc;/g, 'û').replace(/&ccedil;/g, 'ç')
    .trim();
  const imgPath = html.match(/<img[^>]+src="(\/assets\/Uploads\/[^"]*)"/)?.[1];

  // Content from div.Content inside MainFields
  const contentMatch = html.match(/<div class="Content">([\s\S]*?)(?:<\/div>\s*<\/div>\s*(?:<div class="MainFields|<div[^>]+class="[^"]*uk-grid))/);
  const rawHtml = contentMatch?.[1] || '';
  const blocks = parseHtmlToRichText(rawHtml);

  const slug = detailPath.split('/detail/')[1] || slugify(title);

  // File/document URL: PDF or other downloadable file from /assets/MlbcResource/
  const fileLink = html.match(/<a[^>]+href="(\/assets\/MlbcResource\/[^"]*)"/)?.[1];
  const fileUrl = fileLink ? BASE + fileLink : null;

  // If no file, check for an external link in the content (first https:// link that's not le-prado.fr)
  let externalUrl = null;
  if (!fileUrl) {
    const extLinks = [...html.matchAll(/<a[^>]+href="(https?:\/\/[^"]*)"/gi)]
      .filter(m => !m[1].includes('le-prado.fr') && !m[1].includes('prismic.io'));
    if (extLinks.length > 0) externalUrl = extLinks[0][1];
  }

  const resourceUrl = fileUrl || externalUrl || (BASE + detailPath);

  return { title, slug, imgPath, blocks, sourceUrl: detailPath, resourceUrl };
}

// ---------------------------------------------------------------------------
// Step 3: Download image
// ---------------------------------------------------------------------------

async function downloadImage(imgPath, slug) {
  if (!imgPath) return null;
  const ext = imgPath.split('.').pop().toLowerCase().replace(/[^a-z]/g, '') || 'png';
  const destPath = join(PROJECT_ROOT, `public/images/ressources/${slug}.${ext}`);

  if (existsSync(destPath)) return destPath;

  try {
    const res = await fetch(BASE + imgPath, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const dir = dirname(destPath);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(destPath, buf);
    return destPath;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('=== Scrape All Ressources ===\n');

  // Step 1: Collect URLs per category
  const allRessources = [];

  for (const [catPath, catName] of Object.entries(CATEGORIES)) {
    console.log(`[${catName}] Scanning ${catPath}...`);
    const urls = await collectCategoryUrls(catPath);
    console.log(`  Found ${urls.length} ressources`);
    for (const u of urls) {
      allRessources.push({ url: u, category: catName });
    }
    await sleep(RATE_MS);
  }

  // Deduplicate by URL
  const seen = new Set();
  const unique = allRessources.filter(r => {
    if (seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });
  console.log(`\nTotal unique ressources: ${unique.length}\n`);

  // Step 2: Scrape each detail page
  const scraped = [];
  for (let i = 0; i < unique.length; i++) {
    const { url, category } = unique[i];
    console.log(`  ${i + 1}/${unique.length}: ${url.split('/detail/')[1]}`);
    try {
      const data = await scrapeDetail(url);
      if (!data.title) {
        console.log(`    SKIP: no title`);
        continue;
      }
      data.category = category;
      scraped.push(data);
      console.log(`    ✓ "${data.title}" [${data.blocks.length} blocks]`);
    } catch (err) {
      console.log(`    ERROR: ${err.message}`);
    }
    await sleep(RATE_MS);
  }

  console.log(`\nScraped: ${scraped.length} ressources`);

  // Save JSON backup
  writeFileSync(join(__dirname, 'scraped-ressources.json'), JSON.stringify(scraped, null, 2));

  // Step 3: Download images + push to Prismic
  console.log('\nDownloading images & pushing to Prismic...');

  const writeClient = prismic.createWriteClient('prado-nuxt', { writeToken: TOKEN });
  const migration = prismic.createMigration();
  const usedUids = new Set();

  for (const r of scraped) {
    // Validate
    if (!r.title?.trim()) continue;
    if (!r.blocks?.length) continue;

    // Download image
    const localImg = await downloadImage(r.imgPath, r.slug);
    await sleep(200);

    // Unique UID
    let uid = slugify(r.title);
    if (!uid) uid = r.slug;
    let finalUid = uid;
    let suffix = 1;
    while (usedUids.has(finalUid)) { finalUid = `${uid}-${suffix}`; suffix++; }
    usedUids.add(finalUid);

    const data = {
      title: r.title,
      category: r.category,
      description: r.blocks,
      url: { link_type: 'Web', url: r.resourceUrl || (BASE + r.sourceUrl) },
    };

    if (localImg && existsSync(localImg)) {
      const filename = localImg.split('/').pop();
      data.image = migration.createAsset(readFileSync(localImg), filename);
    }

    migration.createDocument(
      { type: 'ressource', uid: finalUid, lang: 'en-us', data },
      `Ressource: ${r.title}`
    );
  }

  console.log(`\nPushing ${scraped.length} ressources to Prismic...`);
  try {
    await writeClient.migrate(migration, {
      reporter: (e) => {
        if (e.type === 'assets:creating') process.stdout.write(`  Assets: ${e.data.current}/${e.data.total}\r`);
        if (e.type === 'documents:creating') process.stdout.write(`  Docs: ${e.data.current}/${e.data.total}\r`);
        if (e.type === 'end') console.log('\n\nResult:', JSON.stringify(e.data));
      }
    });
    console.log('\nDone! Publie la Migration Release dans le dashboard Prismic.');
  } catch (err) {
    console.error('\nMigration error:', err.message);
  }
}

main().catch(console.error);
