/**
 * Full scrape of itineraires.le-prado.fr → Prismic
 *
 * 1. Scrapes all action listing pages to get detail URLs
 * 2. Scrapes all ressource listing pages to get detail URLs
 * 3. Scrapes each detail page for full content (title, description, images, metadata)
 * 4. Downloads images locally
 * 5. Pushes everything to Prismic via Migration API
 *
 * Usage:
 *   # Scrape only (save to JSON):
 *   node scripts/scrape-prado-full.mjs --scrape-only
 *
 *   # Scrape + push to Prismic:
 *   PRISMIC_WRITE_TOKEN=xxx node scripts/scrape-prado-full.mjs
 *
 *   # Test with 1 action:
 *   PRISMIC_WRITE_TOKEN=xxx node scripts/scrape-prado-full.mjs --test
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as prismic from '@prismicio/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

const PRADO_BASE = 'https://itineraires.le-prado.fr';
const RATE_LIMIT_MS = 500;
const PRISMIC_REPO = 'prado-nuxt';
const TOKEN = process.env.PRISMIC_WRITE_TOKEN;

const args = process.argv.slice(2);
const SCRAPE_ONLY = args.includes('--scrape-only');
const TEST_MODE = args.includes('--test');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&apos;/g, "'")
    .replace(/&hellip;/g, '...').replace(/&ndash;/g, '–').replace(/&mdash;/g, '—')
    .replace(/&nbsp;/g, ' ').replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Convert HTML to Prismic RichText blocks.
 * Supports: p, h3, h4, h5, ul/li, ol/li, strong, em, a
 */
function htmlToRichText(html) {
  if (!html) return [{ type: 'paragraph', text: '', spans: [] }];

  // Remove script/style tags
  let clean = html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '');
  // Remove h4 "Description" label
  clean = clean.replace(/<h4[^>]*>\s*Description\s*<\/h4>/gi, '');
  // Remove "Infos pratiques" section and everything after
  clean = clean.replace(/<h4[^>]*>\s*Infos pratiques[\s\S]*$/gi, '');
  // Remove "Téléchargez le pdf" and sponsor text
  clean = clean.replace(/Téléchargez le pdf[\s\S]*?ici\s*/gi, '');
  clean = clean.replace(/Notre activité est rendue possible[\s\S]*$/gi, '');

  const blocks = [];

  // Split into block-level elements
  const blockRegex = /<(p|h[3-6]|li|ul|ol)[^>]*>([\s\S]*?)<\/\1>/gi;
  let insideList = false;
  let listType = 'list-item';
  let match;

  // Track if we're inside a ul or ol
  const listStarts = [...clean.matchAll(/<(ul|ol)[^>]*>/gi)];
  const listPositions = new Map();
  for (const ls of listStarts) {
    const tag = ls[1].toLowerCase();
    // Find all li inside this list
    const afterList = clean.substring(ls.index);
    const endTag = afterList.indexOf(`</${tag}>`);
    const listContent = afterList.substring(0, endTag > 0 ? endTag : undefined);
    const liMatches = [...listContent.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
    for (const li of liMatches) {
      listPositions.set(ls.index + li.index, tag === 'ol' ? 'o-list-item' : 'list-item');
    }
  }

  // Parse all block elements in order
  const allBlocks = [...clean.matchAll(/<(p|h3|h4|h5|h6|li)[^>]*>([\s\S]*?)<\/\1>/gi)];

  for (const block of allBlocks) {
    const tag = block[1].toLowerCase();
    const innerHtml = block[2];
    const plainText = innerHtml
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&apos;/g, "'")
      .replace(/&nbsp;/g, ' ').replace(/&hellip;/g, '...')
      .replace(/&laquo;/g, '«').replace(/&raquo;/g, '»')
      .replace(/&ndash;/g, '–').replace(/&mdash;/g, '—')
      .trim();

    if (!plainText) continue;

    // Determine block type
    let type = 'paragraph';
    if (tag === 'h3') type = 'heading3';
    else if (tag === 'h4') type = 'heading4';
    else if (tag === 'h5') type = 'heading5';
    else if (tag === 'h6') type = 'heading6';
    else if (tag === 'li') {
      type = listPositions.get(block.index) || 'list-item';
    }

    // Extract spans (strong, em, hyperlink)
    const spans = [];
    let textSoFar = '';
    const spanRegex = /<(strong|em|b|i|a)([^>]*)>([\s\S]*?)<\/\1>/gi;
    let cursor = 0;
    const rawText = innerHtml.replace(/<br\s*\/?>/gi, '\n');

    // Simple span extraction from the plain text
    // Find strong spans
    const strongMatches = [...innerHtml.matchAll(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi)];
    for (const sm of strongMatches) {
      const spanText = sm[2].replace(/<[^>]+>/g, '').replace(/&[^;]+;/g, ' ').trim();
      if (!spanText) continue;
      const start = plainText.indexOf(spanText);
      if (start >= 0) {
        spans.push({ type: 'strong', start, end: start + spanText.length });
      }
    }

    // Find em spans
    const emMatches = [...innerHtml.matchAll(/<(em|i)([^>]*)>([\s\S]*?)<\/\1>/gi)];
    for (const em of emMatches) {
      const spanText = em[3].replace(/<[^>]+>/g, '').replace(/&[^;]+;/g, ' ').trim();
      if (!spanText) continue;
      const start = plainText.indexOf(spanText);
      if (start >= 0) {
        spans.push({ type: 'em', start, end: start + spanText.length });
      }
    }

    // Find hyperlink spans
    const linkMatches = [...innerHtml.matchAll(/<a[^>]+href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)];
    for (const lm of linkMatches) {
      let href = lm[1];
      if (href && !href.startsWith('http') && !href.startsWith('mailto:')) {
        href = PRADO_BASE + '/' + href.replace(/^\//, '');
      }
      const spanText = lm[2].replace(/<[^>]+>/g, '').replace(/&[^;]+;/g, ' ').trim();
      if (!spanText) continue;
      const start = plainText.indexOf(spanText);
      if (start >= 0) {
        spans.push({
          type: 'hyperlink',
          start,
          end: start + spanText.length,
          data: { link_type: 'Web', url: href },
        });
      }
    }

    blocks.push({ type, text: plainText, spans });
  }

  // If no blocks were parsed, return the raw text as a single paragraph
  if (blocks.length === 0) {
    const fallback = stripHtml(html);
    if (fallback) return [{ type: 'paragraph', text: fallback, spans: [] }];
    return [{ type: 'paragraph', text: '', spans: [] }];
  }

  return blocks;
}

function slugify(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}

function getExtFromUrl(url) {
  const match = url.match(/\.(png|jpg|jpeg|gif|webp|svg)(\?|$)/i);
  return match ? match[1].toLowerCase() : 'jpg';
}

async function fetchPage(url, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 PradoScraper/3.0' },
        redirect: 'follow',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err) {
      if (attempt === retries) throw err;
      console.log(`  [retry ${attempt}] ${err.message}`);
      await sleep(2000);
    }
  }
}

async function downloadImage(imageUrl, destPath) {
  try {
    const fullUrl = imageUrl.startsWith('http') ? imageUrl : PRADO_BASE + imageUrl;
    const res = await fetch(fullUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 PradoScraper/3.0' },
      redirect: 'follow',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const dir = dirname(destPath);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(destPath, buffer);
    return true;
  } catch (err) {
    console.log(`    [img fail] ${err.message}`);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Step 1: Scrape listing pages to get all detail URLs
// ---------------------------------------------------------------------------

async function scrapeListingPages(basePath, totalPages) {
  const urls = new Set();

  for (let page = 1; page <= totalPages; page++) {
    const url = `${PRADO_BASE}${basePath}?start=${(page - 1) * 15}`;
    console.log(`  Page ${page}/${totalPages}: ${url}`);
    try {
      const html = await fetchPage(url);

      // Extract detail links
      const linkRegex = /href="([^"]*\/detail\/[^"]*)"/g;
      let match;
      while ((match = linkRegex.exec(html)) !== null) {
        let link = match[1];
        if (!link.startsWith('http')) link = link;
        urls.add(link);
      }
    } catch (err) {
      console.log(`  [error] page ${page}: ${err.message}`);
    }
    await sleep(RATE_LIMIT_MS);
  }

  return [...urls];
}

// ---------------------------------------------------------------------------
// Step 2: Scrape action detail page
// ---------------------------------------------------------------------------

function parseActionDetail(html, url) {
  // Title: og:title or h1/h2
  const ogTitle = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/)?.[1];
  const h1Title = html.match(/<h1[^>]*>([^<]+)<\/h1>/)?.[1];
  const h2Title = html.match(/<h2[^>]*class="[^"]*event-title[^"]*"[^>]*>([^<]+)<\/h2>/)?.[1];
  const title = stripHtml(ogTitle || h2Title || h1Title || '');

  // Image: og:image
  const ogImage = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/)?.[1] || '';

  // Event image
  const eventImg = html.match(/<img[^>]+class="[^"]*event-image[^"]*"[^>]+src="([^"]*)"/)?.[1] || '';
  const image = ogImage || eventImg;

  // Category from HTML comment or class
  const catComment = html.match(/<!--\s*<div class="Category">([^<]*)<\/div>\s*-->/)?.[1];
  const catDiv = html.match(/<div[^>]+class="[^"]*Category[^"]*"[^>]*>([^<]*)<\/div>/)?.[1];
  const category = stripHtml(catComment || catDiv || '');

  // Date
  const dateMatch = html.match(/<div[^>]+class="[^"]*datesAndTimeframe[^"]*"[^>]*>([\s\S]*?)<\/div>/);
  const dateText = dateMatch ? stripHtml(dateMatch[1]) : '';

  // Time
  const timeMatch = html.match(/(\d{1,2}[h:]\d{0,2}\s*[-–à]\s*\d{1,2}[h:]\d{0,2})/);
  const timeText = timeMatch ? timeMatch[1] : '';

  // Description: event-content div — keep raw HTML for RichText conversion
  const contentMatch = html.match(/<div[^>]+class="[^"]*event-content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/);
  const descriptionHtml = contentMatch ? contentMatch[1] : '';
  const descriptionRichText = htmlToRichText(descriptionHtml);
  const description = descriptionRichText.map(b => b.text).join('\n').trim();

  // Summary from og:description — strip date prefix like "01/07/2024 00:00"
  const ogDesc = html.match(/<meta\s+property="og:description"\s+content="([^"]*)"/)?.[1] || '';
  let summary = stripHtml(ogDesc)
    .replace(/^\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}\s*/, '')
    .trim()
    .slice(0, 300);
  // If summary is empty, use first 300 chars of description
  if (!summary) summary = description.slice(0, 300);

  // Is activite (year-round) vs event (specific date)
  const isActivite = dateText.toLowerCase().includes('année') || dateText.toLowerCase().includes('annee') || !dateText;

  // Slug from URL
  const slug = url.split('/detail/')[1] || '';

  return {
    title,
    slug,
    category,
    dateText: dateText || (isActivite ? "Toute l'année" : ''),
    timeText,
    summary,
    description,
    descriptionRichText,
    image,
    isActivite,
    sourceUrl: url,
  };
}

// ---------------------------------------------------------------------------
// Step 3: Scrape ressource detail page
// ---------------------------------------------------------------------------

function parseRessourceDetail(html, url) {
  const ogTitle = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/)?.[1];
  const h1Title = html.match(/<h1[^>]*>([^<]+)<\/h1>/)?.[1];
  const title = stripHtml(ogTitle || h1Title || '');

  const ogImage = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/)?.[1] || '';

  // Category
  const catMatch = html.match(/<div[^>]+class="[^"]*Category[^"]*"[^>]*>([^<]*)<\/div>/)?.[1];
  const category = stripHtml(catMatch || '');

  // Description
  const contentMatch = html.match(/<div[^>]+class="[^"]*resource-content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/);
  const altContent = html.match(/<div[^>]+class="[^"]*uk-width-expand[^"]*"[^>]*>([\s\S]*?)<\/div>/);
  const descriptionHtml = contentMatch ? contentMatch[1] : (altContent ? altContent[1] : '');
  const description = stripHtml(descriptionHtml);

  const ogDesc = html.match(/<meta\s+property="og:description"\s+content="([^"]*)"/)?.[1] || '';

  const slug = url.split('/detail/')[1] || '';

  return {
    title,
    slug,
    category,
    description: description || stripHtml(ogDesc),
    image: ogImage,
    sourceUrl: url,
  };
}

// ---------------------------------------------------------------------------
// Step 4: Download images & push to Prismic
// ---------------------------------------------------------------------------

const VALID_ACTION_CATEGORIES = [
  'Bien-être', 'Découverte & orientation', 'Vie quotidienne',
  'Formations', 'Formations & Ateliers', 'Rencontres/Visites',
  'Mobilité', 'Emploi', 'Numérique', 'Droits', 'Bénévolat',
];

const VALID_RESSOURCE_CATEGORIES = [
  'Accompagnement/Insertion', 'Acces aux droits',
  'Emploi/Formation', 'Logement/Mobilite', 'Sante',
];

function mapActionCategory(raw) {
  if (!raw) return 'Bien-être';
  // Exact match first
  if (VALID_ACTION_CATEGORIES.includes(raw)) return raw;
  const lower = raw.toLowerCase();
  if (lower.includes('bien') || lower.includes('santé') || lower.includes('sante')) return 'Bien-être';
  if (lower.includes('découverte') || lower.includes('decouverte') || lower.includes('orientation')) return 'Découverte & orientation';
  if (lower.includes('quotidien') || lower.includes('logement') || lower.includes('cuisine') || lower.includes('budget')) return 'Vie quotidienne';
  if (lower.includes('formation') || lower.includes('atelier')) return 'Formations & Ateliers';
  if (lower.includes('rencontre') || lower.includes('visite')) return 'Rencontres/Visites';
  if (lower.includes('mobilité') || lower.includes('mobilite') || lower.includes('velo') || lower.includes('permis')) return 'Mobilité';
  if (lower.includes('emploi') || lower.includes('insertion') || lower.includes('pro')) return 'Emploi';
  if (lower.includes('numérique') || lower.includes('numerique') || lower.includes('code')) return 'Numérique';
  if (lower.includes('droit') || lower.includes('citoyen')) return 'Droits';
  if (lower.includes('bénévolat') || lower.includes('benevolat')) return 'Bénévolat';
  return 'Bien-être';
}

function mapRessourceCategory(raw) {
  if (!raw) return 'Accompagnement/Insertion';
  if (VALID_RESSOURCE_CATEGORIES.includes(raw)) return raw;
  const lower = raw.toLowerCase();
  if (lower.includes('emploi') || lower.includes('formation')) return 'Emploi/Formation';
  if (lower.includes('logement') || lower.includes('mobilit')) return 'Logement/Mobilite';
  if (lower.includes('sant') || lower.includes('addict')) return 'Sante';
  if (lower.includes('droit')) return 'Acces aux droits';
  return 'Accompagnement/Insertion';
}

async function main() {
  console.log('=== Full Prado Scraper ===\n');

  // Step 1: Get all detail URLs
  console.log('[Step 1] Scraping listing pages for detail URLs...\n');

  console.log('Actions (8 pages):');
  const actionUrls = await scrapeListingPages('/programmation/tous-les-evenements', 8);
  console.log(`  Found ${actionUrls.length} action URLs\n`);

  let ressourceUrls = [];
  if (!TEST_MODE) {
    console.log('Ressources (12 pages):');
    ressourceUrls = await scrapeListingPages('/ressources/toutes-les-ressources', 12);
    console.log(`  Found ${ressourceUrls.length} ressource URLs\n`);
  }

  // Step 2: Scrape each detail page
  console.log('[Step 2] Scraping detail pages...\n');

  const actions = [];
  const urlsToScrape = TEST_MODE ? actionUrls.slice(0, 1) : actionUrls;

  for (let i = 0; i < urlsToScrape.length; i++) {
    const path = urlsToScrape[i];
    const fullUrl = path.startsWith('http') ? path : PRADO_BASE + path;
    console.log(`  Action ${i + 1}/${urlsToScrape.length}: ${path}`);
    try {
      const html = await fetchPage(fullUrl);
      const data = parseActionDetail(html, path);

      // Validate
      if (!data.title) {
        console.log(`    SKIP: no title`);
        continue;
      }

      actions.push(data);
      console.log(`    ✓ "${data.title}" [${data.category}]`);
    } catch (err) {
      console.log(`    ERROR: ${err.message}`);
    }
    await sleep(RATE_LIMIT_MS);
  }

  const ressources = [];
  if (!TEST_MODE) {
    for (let i = 0; i < ressourceUrls.length; i++) {
      const path = ressourceUrls[i];
      const fullUrl = path.startsWith('http') ? path : PRADO_BASE + path;
      console.log(`  Ressource ${i + 1}/${ressourceUrls.length}: ${path}`);
      try {
        const html = await fetchPage(fullUrl);
        const data = parseRessourceDetail(html, path);

        if (!data.title) {
          console.log(`    SKIP: no title`);
          continue;
        }

        ressources.push(data);
        console.log(`    ✓ "${data.title}"`);
      } catch (err) {
        console.log(`    ERROR: ${err.message}`);
      }
      await sleep(RATE_LIMIT_MS);
    }
  }

  console.log(`\nScraped: ${actions.length} actions, ${ressources.length} ressources`);

  // Save to JSON
  writeFileSync(join(__dirname, 'scraped-actions.json'), JSON.stringify(actions, null, 2));
  if (ressources.length > 0) {
    writeFileSync(join(__dirname, 'scraped-ressources.json'), JSON.stringify(ressources, null, 2));
  }
  console.log('Saved to scripts/scraped-actions.json & scraped-ressources.json\n');

  if (SCRAPE_ONLY) {
    console.log('=== Scrape complete (--scrape-only) ===');
    return;
  }

  if (!TOKEN) {
    console.error('Missing PRISMIC_WRITE_TOKEN. Use --scrape-only or set the env var.');
    process.exit(1);
  }

  // Step 3: Download images
  console.log('[Step 3] Downloading images...\n');

  for (let i = 0; i < actions.length; i++) {
    const a = actions[i];
    if (!a.image) continue;
    const imgUrl = a.image.startsWith('http') ? a.image : PRADO_BASE + a.image;
    const ext = getExtFromUrl(imgUrl);
    const destPath = join(PROJECT_ROOT, `public/images/actions/${a.slug}.${ext}`);
    if (!existsSync(destPath)) {
      const ok = await downloadImage(imgUrl, destPath);
      if (ok) console.log(`  ✓ actions/${a.slug}.${ext}`);
    } else {
      console.log(`  · actions/${a.slug}.${ext} (exists)`);
    }
    a.localImage = `/images/actions/${a.slug}.${ext}`;
    await sleep(200);
  }

  for (let i = 0; i < ressources.length; i++) {
    const r = ressources[i];
    if (!r.image) continue;
    const imgUrl = r.image.startsWith('http') ? r.image : PRADO_BASE + r.image;
    const ext = getExtFromUrl(imgUrl);
    const destPath = join(PROJECT_ROOT, `public/images/ressources/${r.slug}.${ext}`);
    if (!existsSync(destPath)) {
      const ok = await downloadImage(imgUrl, destPath);
      if (ok) console.log(`  ✓ ressources/${r.slug}.${ext}`);
    } else {
      console.log(`  · ressources/${r.slug}.${ext} (exists)`);
    }
    r.localImage = `/images/ressources/${r.slug}.${ext}`;
    await sleep(200);
  }

  // Step 4: Push to Prismic
  console.log('\n[Step 4] Pushing to Prismic...\n');

  const writeClient = prismic.createWriteClient(PRISMIC_REPO, { writeToken: TOKEN });
  const migration = prismic.createMigration();
  const usedUids = new Set();

  function uniqueUid(base) {
    let uid = base;
    let i = 1;
    while (usedUids.has(uid)) { uid = `${base}-${i}`; i++; }
    usedUids.add(uid);
    return uid;
  }

  for (const a of actions) {
    const uid = uniqueUid(slugify(a.title));
    const data = {
      title: a.title,
      category: mapActionCategory(a.category),
      date_text: a.dateText,
      time_text: a.timeText,
      summary: a.summary,
      description: a.descriptionRichText?.length ? a.descriptionRichText : [{ type: 'paragraph', text: a.summary || '', spans: [] }],
      url_detail: { link_type: 'Web', url: PRADO_BASE + a.sourceUrl },
      is_activite: a.isActivite,
      original_id: null,
    };

    if (a.localImage && existsSync(join(PROJECT_ROOT, 'public' + a.localImage))) {
      data.image = migration.createAsset(
        readFileSync(join(PROJECT_ROOT, 'public' + a.localImage)),
        a.localImage.split('/').pop()
      );
    }

    migration.createDocument(
      { type: 'action', uid, lang: 'en-us', data },
      `Action: ${a.title}`
    );
  }

  for (const r of ressources) {
    const uid = uniqueUid(slugify(r.title));
    const data = {
      title: r.title,
      category: mapRessourceCategory(r.category),
      description: [{ type: 'paragraph', text: r.description, spans: [] }],
      url: r.sourceUrl ? { link_type: 'Web', url: PRADO_BASE + r.sourceUrl } : undefined,
      original_id: null,
    };

    if (r.localImage && existsSync(join(PROJECT_ROOT, 'public' + r.localImage))) {
      data.image = migration.createAsset(
        readFileSync(join(PROJECT_ROOT, 'public' + r.localImage)),
        r.localImage.split('/').pop()
      );
    }

    migration.createDocument(
      { type: 'ressource', uid, lang: 'en-us', data },
      `Ressource: ${r.title}`
    );
  }

  console.log(`Pushing ${actions.length} actions + ${ressources.length} ressources...`);
  try {
    await writeClient.migrate(migration, {
      reporter: (event) => {
        if (event.type === 'assets:creating') {
          process.stdout.write(`  Assets: ${event.data.current}/${event.data.total}\r`);
        }
        if (event.type === 'documents:creating') {
          process.stdout.write(`  Docs: ${event.data.current}/${event.data.total}\r`);
        }
      },
    });
    console.log('\n\n✓ Migration complete!');
  } catch (err) {
    console.error(`\n\nMigration error: ${err.message}`);
  }

  console.log('\n=== Done ===');
}

main().catch(console.error);
