/**
 * Fix ghost ressource documents by overwriting them in-place via Migration API PUT.
 * Uses the EXISTING UID of the ghost doc (no UID conflict).
 * Maps invalid categories to valid Prismic values.
 *
 * Usage: PRISMIC_WRITE_TOKEN=xxx node scripts/fix-ghost-ressources.mjs
 */

import * as prismic from '@prismicio/client';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const PRISMIC_REPO = 'prado-nuxt';
const TOKEN = process.env.PRISMIC_WRITE_TOKEN;
const SUPABASE_URL = 'https://vafbtwbsxdlefksonpyg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhZmJ0d2JzeGRsZWZrc29ucHlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyOTEyMTYsImV4cCI6MjA4OTg2NzIxNn0.56cOAQq5jAAorhi5UYSN3RKNpjmd0j62fvGlTlSWcmY';

if (!TOKEN) { console.error('Missing PRISMIC_WRITE_TOKEN'); process.exit(1); }

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function slugify(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}

const VALID_CATEGORIES = [
  'Accompagnement/Insertion',
  'Acces aux droits',
  'Emploi/Formation',
  'Logement/Mobilite',
  'Sante',
];

function fixCategory(cat) {
  if (!cat) return 'Accompagnement/Insertion';
  if (VALID_CATEGORIES.includes(cat)) return cat;
  // Map known invalid values
  if (cat === 'Ressources') return 'Accompagnement/Insertion';
  return 'Accompagnement/Insertion';
}

async function fetchAllDocs(client, type) {
  const docs = [];
  let page = 1;
  while (true) {
    const res = await client.get({ filters: [prismic.filter.at('document.type', type)], pageSize: 100, page });
    docs.push(...res.results);
    if (page >= res.total_pages) break;
    page++;
  }
  return docs;
}

async function updateDocument(docId, uid, data) {
  const res = await fetch(`https://migration.prismic.io/documents/${docId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'x-api-key': TOKEN,
      'repository': PRISMIC_REPO,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: data.title || `Ressource ${data.original_id}`,
      uid,
      type: 'ressource',
      lang: 'en-us',
      data,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${text}`);
  }
  return res.json();
}

async function main() {
  console.log('=== Fix Ghost Ressources (v3) ===\n');

  const readClient = prismic.createClient(PRISMIC_REPO);
  const allDocs = await fetchAllDocs(readClient, 'ressource');
  const ghosts = allDocs.filter(d => !d.data.original_id);
  const validDocs = allDocs.filter(d => d.data.original_id);
  const existingIds = new Set(validDocs.map(d => d.data.original_id));

  console.log(`Prismic: ${allDocs.length} total, ${ghosts.length} ghosts, ${validDocs.length} valid`);

  // Get Supabase data
  const supabase = createSupabaseClient(SUPABASE_URL, SUPABASE_KEY);
  const { data: supaRes } = await supabase.from('ressources').select('*').eq('is_published', true).order('id');
  const missing = (supaRes ?? []).filter(r => !existingIds.has(r.id));

  console.log(`Supabase: ${supaRes?.length ?? 0} published, ${missing.length} missing`);

  // Validate
  const validated = missing.filter(r => {
    if (!r.title?.trim()) { console.log(`  SKIP ID ${r.id}: no title`); return false; }
    return true;
  });
  console.log(`Validated: ${validated.length}`);

  // Try to match ghosts to supabase data by UID similarity
  // Build a map: slugified supabase title -> supabase record
  const supaBySlug = new Map();
  for (const r of validated) {
    supaBySlug.set(slugify(r.title), r);
  }

  // Match ghosts to supabase records by UID
  const matched = [];
  const unmatchedGhosts = [];
  const usedSupaIds = new Set();

  for (const ghost of ghosts) {
    const supaRecord = supaBySlug.get(ghost.uid);
    if (supaRecord && !usedSupaIds.has(supaRecord.id)) {
      matched.push({ ghost, supa: supaRecord });
      usedSupaIds.add(supaRecord.id);
    } else {
      unmatchedGhosts.push(ghost);
    }
  }

  // For remaining unmatched ghosts, assign remaining supabase records in order
  const remainingSupa = validated.filter(r => !usedSupaIds.has(r.id));
  for (let i = 0; i < Math.min(unmatchedGhosts.length, remainingSupa.length); i++) {
    matched.push({ ghost: unmatchedGhosts[i], supa: remainingSupa[i] });
  }

  console.log(`\nMatched: ${matched.length} ghost→supabase pairs`);
  console.log(`Leftover ghosts: ${ghosts.length - matched.length}`);
  console.log(`Leftover supabase: ${validated.length - matched.length}\n`);

  // Update matched pairs
  let updated = 0;
  let errors = 0;

  for (const { ghost, supa } of matched) {
    const data = {
      title: supa.title,
      category: fixCategory(supa.category),
      description: [{ type: 'paragraph', text: supa.description ?? '', spans: [] }],
      url: supa.url ? { link_type: 'Web', url: supa.url } : undefined,
      original_id: supa.id,
    };

    // Keep existing UID to avoid conflicts
    const uid = ghost.uid;

    try {
      await updateDocument(ghost.id, uid, data);
      updated++;
      if (updated % 10 === 0) console.log(`  ${updated}/${matched.length}`);
      await sleep(400);
    } catch (err) {
      errors++;
      console.log(`  ERROR ghost ${ghost.id} (${uid}): ${err.message}`);
      await sleep(1000);
    }
  }

  console.log(`\nUpdated: ${updated}, Errors: ${errors}`);

  // Final
  console.log('\nWaiting 5s...');
  await sleep(5000);
  const final = await fetchAllDocs(readClient, 'ressource');
  const withTitle = final.filter(d => (d.data.title || '').trim());
  const withId = final.filter(d => d.data.original_id);
  console.log(`Final: ${final.length} total, ${withTitle.length} with title, ${withId.length} with ID`);

  console.log('\n=== Done ===');
}

main().catch(console.error);
