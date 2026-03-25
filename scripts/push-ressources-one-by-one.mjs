/**
 * Push scraped ressources to Prismic ONE BY ONE.
 * Each document gets its own migrate() call to avoid the batch-empty-data bug.
 *
 * Usage: PRISMIC_WRITE_TOKEN=xxx node scripts/push-ressources-one-by-one.mjs
 */

import * as prismic from '@prismicio/client';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const TOKEN = process.env.PRISMIC_WRITE_TOKEN;
const BASE = 'https://itineraires.le-prado.fr';

if (!TOKEN) { console.error('Missing PRISMIC_WRITE_TOKEN'); process.exit(1); }

function decodeHtml(s) {
  return (s || '')
    .replace(/&#039;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ').replace(/&rsquo;/g, "'").replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»').replace(/&hellip;/g, '...').replace(/&ndash;/g, '–');
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const scraped = JSON.parse(readFileSync(join(__dirname, 'scraped-ressources.json'), 'utf8'));
  console.log(`=== Pushing ${scraped.length} ressources one by one ===\n`);

  const writeClient = prismic.createWriteClient('prado-nuxt', { writeToken: TOKEN });
  let ok = 0, errors = 0;

  for (let i = 0; i < scraped.length; i++) {
    const r = scraped[i];
    const title = decodeHtml(r.title);

    if (!title || !r.blocks?.length) {
      console.log(`  ${i + 1}/${scraped.length} SKIP: ${r.slug} (no title or blocks)`);
      continue;
    }

    // Decode HTML entities in block text too
    const blocks = r.blocks.map(b => ({
      ...b,
      text: decodeHtml(b.text),
    }));

    const migration = prismic.createMigration();

    const data = {
      title,
      category: r.category,
      description: blocks,
      url: { link_type: 'Web', url: r.resourceUrl || (BASE + r.sourceUrl) },
    };

    // Add image if local file exists
    const imgDir = join(PROJECT_ROOT, 'public/images/ressources');
    const extensions = ['png', 'jpg', 'jpeg', 'gif', 'PNG', 'JPG'];
    let imgFile = null;
    for (const ext of extensions) {
      const path = join(imgDir, `${r.slug}.${ext}`);
      if (existsSync(path)) { imgFile = path; break; }
    }
    if (imgFile) {
      data.image = migration.createAsset(readFileSync(imgFile), imgFile.split('/').pop());
    }

    migration.createDocument(
      { type: 'ressource', uid: r.slug, lang: 'en-us', data },
      `Ressource: ${title}`
    );

    try {
      await writeClient.migrate(migration, { reporter: () => {} });
      ok++;
      if (ok % 10 === 0) console.log(`  ${ok}/${scraped.length} pushed`);
    } catch (err) {
      errors++;
      console.log(`  ${i + 1} ERROR ${r.slug}: ${err.message?.substring(0, 80)}`);
    }

    await sleep(300);
  }

  console.log(`\nDone! Pushed: ${ok} | Errors: ${errors}`);
  console.log('Publie la Migration Release dans le dashboard.');
}

main().catch(console.error);
