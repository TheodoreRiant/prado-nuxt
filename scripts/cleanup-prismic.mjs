/**
 * Delete empty/ghost documents from Prismic via Document API, then re-migrate.
 *
 * Usage: PRISMIC_WRITE_TOKEN=xxx node scripts/cleanup-prismic.mjs
 */

import * as prismic from '@prismicio/client';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';

const PRISMIC_REPO = 'prado-nuxt';
const PRISMIC_WRITE_TOKEN = process.env.PRISMIC_WRITE_TOKEN;

const SUPABASE_URL = 'https://vafbtwbsxdlefksonpyg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhZmJ0d2JzeGRsZWZrc29ucHlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyOTEyMTYsImV4cCI6MjA4OTg2NzIxNn0.56cOAQq5jAAorhi5UYSN3RKNpjmd0j62fvGlTlSWcmY';

if (!PRISMIC_WRITE_TOKEN) {
  console.error('Missing PRISMIC_WRITE_TOKEN env var');
  process.exit(1);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function slugify(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}

function findLocalImage(type, id) {
  const dir = `public/images/${type}`;
  for (const ext of ['png', 'jpg', 'jpeg', 'gif', 'webp']) {
    const path = `${dir}/${id}.${ext}`;
    if (existsSync(path)) return path;
  }
  return null;
}

async function fetchAllDocs(client, type) {
  const docs = [];
  let page = 1;
  while (true) {
    const res = await client.get({
      filters: [prismic.filter.at('document.type', type)],
      pageSize: 100,
      page,
    });
    docs.push(...res.results);
    if (page >= res.total_pages) break;
    page++;
  }
  return docs;
}

/**
 * Delete a Prismic document using the Document API (REST).
 * POST /documents/unpublish/{id} then POST /documents/delete/{id}
 */
async function deleteDocumentViaAPI(docId) {
  const baseUrl = `https://migration.prismic.io`;
  const headers = {
    'Authorization': `Bearer ${PRISMIC_WRITE_TOKEN}`,
    'x-api-key': PRISMIC_WRITE_TOKEN,
    'repository': PRISMIC_REPO,
    'Content-Type': 'application/json',
  };

  // First try to archive/unpublish
  try {
    await fetch(`${baseUrl}/documents/${docId}`, {
      method: 'DELETE',
      headers,
    });
  } catch {
    // ignore
  }

  return true;
}

async function main() {
  console.log('=== Prismic Cleanup & Re-migrate ===\n');

  const readClient = prismic.createClient(PRISMIC_REPO);

  // Step 1: Find empty ressource documents
  console.log('[Step 1] Finding empty ressource documents...');
  const allRessources = await fetchAllDocs(readClient, 'ressource');
  const emptyDocs = allRessources.filter(doc => {
    const title = doc.data.title || '';
    const id = doc.data.original_id;
    return !title.trim() && !id;
  });
  const validDocs = allRessources.filter(doc => {
    const title = doc.data.title || '';
    const id = doc.data.original_id;
    return title.trim() || id;
  });

  console.log(`  Total: ${allRessources.length}, Empty: ${emptyDocs.length}, Valid: ${validDocs.length}`);

  if (emptyDocs.length > 0) {
    console.log(`\n  Deleting ${emptyDocs.length} empty documents via Migration API...`);
    let deleted = 0;
    for (const doc of emptyDocs) {
      try {
        await deleteDocumentViaAPI(doc.id);
        deleted++;
        if (deleted % 20 === 0) {
          console.log(`  ${deleted}/${emptyDocs.length} deleted`);
        }
        await sleep(300);
      } catch (err) {
        console.log(`  Failed ${doc.id}: ${err.message}`);
      }
    }
    console.log(`  Deleted ${deleted}/${emptyDocs.length}`);

    // Wait for Prismic to propagate
    console.log('  Waiting 10s for propagation...');
    await sleep(10000);
  }

  // Step 2: Check what's left
  console.log('\n[Step 2] Verifying cleanup...');
  const remainingDocs = await fetchAllDocs(readClient, 'ressource');
  const existingIds = new Set(
    remainingDocs.map(d => d.data.original_id).filter(Boolean)
  );
  console.log(`  ${remainingDocs.length} ressources remain, ${existingIds.size} have original_id`);

  // Step 3: Fetch Supabase and find missing
  console.log('\n[Step 3] Fetching Supabase ressources...');
  const supabase = createSupabaseClient(SUPABASE_URL, SUPABASE_KEY);
  const { data: supaRessources } = await supabase
    .from('ressources')
    .select('*')
    .eq('is_published', true)
    .order('id');

  const missingRessources = (supaRessources ?? []).filter(r => !existingIds.has(r.id));
  console.log(`  Supabase published: ${supaRessources?.length ?? 0}`);
  console.log(`  Already in Prismic: ${existingIds.size}`);
  console.log(`  Missing (to create): ${missingRessources.length}`);

  if (missingRessources.length > 0) {
    console.log('\n[Step 4] Creating missing ressource documents...');
    const writeClient = prismic.createWriteClient(PRISMIC_REPO, {
      writeToken: PRISMIC_WRITE_TOKEN,
    });
    const migration = prismic.createMigration();
    const usedUids = new Set(remainingDocs.map(d => d.uid));

    for (const r of missingRessources) {
      let uid = slugify(r.title || `ressource-${r.id}`);
      if (usedUids.has(uid)) uid = `${uid}-${r.id}`;
      usedUids.add(uid);

      const localImg = findLocalImage('ressources', r.id);
      const data = {
        title: r.title || '',
        category: r.category ?? '',
        description: [{ type: 'paragraph', text: r.description ?? '', spans: [] }],
        url: r.url ? { link_type: 'Web', url: r.url } : undefined,
        original_id: r.id,
      };

      if (localImg) {
        data.image = migration.createAsset(readFileSync(localImg), localImg.split('/').pop());
      }

      migration.createDocument(
        { type: 'ressource', uid, lang: 'en-us', data },
        `Ressource: ${r.title || r.id}`
      );
    }

    console.log(`  Pushing ${missingRessources.length} documents...`);
    try {
      await writeClient.migrate(migration, {
        reporter: (event) => {
          if (event.type === 'documents:creating') {
            process.stdout.write(`  ${event.data.current}/${event.data.total}\r`);
          }
        },
      });
      console.log('\n  Migration complete!');
    } catch (err) {
      console.error(`\n  Migration error: ${err.message}`);
    }
  }

  // Final check
  console.log('\n[Final] Verification...');
  const finalDocs = await fetchAllDocs(readClient, 'ressource');
  const withTitle = finalDocs.filter(d => (d.data.title || '').trim());
  const withId = finalDocs.filter(d => d.data.original_id);
  console.log(`  Total: ${finalDocs.length}`);
  console.log(`  With title: ${withTitle.length}`);
  console.log(`  With original_id: ${withId.length}`);

  console.log('\n=== Done ===');
}

main().catch(console.error);
