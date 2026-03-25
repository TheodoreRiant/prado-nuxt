/**
 * Re-push all Supabase ressources via the SDK migrate() which auto-publishes.
 * The SDK matches existing docs by UID and updates them.
 *
 * Usage: PRISMIC_WRITE_TOKEN=xxx node scripts/publish-ressources.mjs
 */

import * as prismic from '@prismicio/client';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const TOKEN = process.env.PRISMIC_WRITE_TOKEN;
const SUPABASE_URL = 'https://vafbtwbsxdlefksonpyg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhZmJ0d2JzeGRsZWZrc29ucHlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyOTEyMTYsImV4cCI6MjA4OTg2NzIxNn0.56cOAQq5jAAorhi5UYSN3RKNpjmd0j62fvGlTlSWcmY';

if (!TOKEN) { console.error('Missing PRISMIC_WRITE_TOKEN'); process.exit(1); }

function slugify(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}

const VALID_CATEGORIES = ['Accompagnement/Insertion', 'Acces aux droits', 'Emploi/Formation', 'Logement/Mobilite', 'Sante'];

function fixCategory(cat) {
  if (VALID_CATEGORIES.includes(cat)) return cat;
  return 'Accompagnement/Insertion';
}

async function main() {
  console.log('=== Publish All Ressources ===\n');

  const supabase = createSupabaseClient(SUPABASE_URL, SUPABASE_KEY);
  const { data: supaRes } = await supabase.from('ressources').select('*').eq('is_published', true).order('id');

  // Validate before pushing
  const validated = (supaRes ?? []).filter(r => {
    if (!r.title?.trim()) { console.log(`SKIP ID ${r.id}: no title`); return false; }
    if (!r.id) { console.log(`SKIP: no ID`); return false; }
    return true;
  });

  console.log(`Supabase: ${supaRes?.length ?? 0} published, ${validated.length} validated\n`);

  const writeClient = prismic.createWriteClient('prado-nuxt', { writeToken: TOKEN });
  const migration = prismic.createMigration();
  const usedUids = new Set();

  for (const r of validated) {
    let uid = slugify(r.title);
    if (!uid) uid = `ressource-${r.id}`;
    if (usedUids.has(uid)) uid = `${uid}-${r.id}`;
    usedUids.add(uid);

    const data = {
      title: r.title,
      category: fixCategory(r.category ?? ''),
      description: [{ type: 'paragraph', text: r.description ?? '', spans: [] }],
      url: r.url ? { link_type: 'Web', url: r.url } : undefined,
      original_id: r.id,
    };

    migration.createDocument(
      { type: 'ressource', uid, lang: 'en-us', data },
      `Ressource: ${r.title}`
    );
  }

  console.log(`Pushing ${validated.length} ressources via SDK migrate()...`);
  console.log('(SDK will match existing docs by UID and update+publish them)\n');

  await writeClient.migrate(migration, {
    reporter: (event) => {
      if (event.type === 'documents:creating' || event.type === 'documents:updated') {
        process.stdout.write(`  ${event.data.current}/${event.data.total}\r`);
      }
      if (event.type === 'end') {
        console.log('\n' + JSON.stringify(event.data));
      }
    },
  });

  console.log('\n=== Done ===');
}

main().catch(console.error);
