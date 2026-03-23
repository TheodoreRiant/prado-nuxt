/**
 * Migrate content from Supabase to Prismic
 *
 * Usage:
 *   PRISMIC_WRITE_TOKEN=xxx node scripts/migrate-to-prismic.mjs
 *
 * Prerequisites:
 *   1. Prismic repo "prado-itineraires" must exist
 *   2. Custom Types (action, ressource, actualite) must be pushed via Slice Machine
 *   3. Generate a write token in Prismic Settings > API & Security > Content API
 */

import { createClient } from '@supabase/supabase-js';
import * as prismic from '@prismicio/client';

const SUPABASE_URL = 'https://vafbtwbsxdlefksonpyg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhZmJ0d2JzeGRsZWZrc29ucHlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyOTEyMTYsImV4cCI6MjA4OTg2NzIxNn0.56cOAQq5jAAorhi5UYSN3RKNpjmd0j62fvGlTlSWcmY';
const PRISMIC_REPO = 'prado-itineraires';
const PRISMIC_WRITE_TOKEN = process.env.PRISMIC_WRITE_TOKEN;

if (!PRISMIC_WRITE_TOKEN) {
  console.error('Missing PRISMIC_WRITE_TOKEN env var');
  console.error('Generate one at: https://prado-itineraires.prismic.io/settings/api/');
  process.exit(1);
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Fetch data from Supabase
  console.log('Fetching data from Supabase...');
  const { data: actions } = await supabase.from('actions').select('*').order('id');
  const { data: ressources } = await supabase.from('ressources').select('*').order('id');

  console.log(`Found ${actions?.length ?? 0} actions, ${ressources?.length ?? 0} ressources`);

  // Create Prismic Migration API client
  const writeClient = prismic.createWriteClient(PRISMIC_REPO, {
    writeToken: PRISMIC_WRITE_TOKEN,
  });

  const migration = prismic.createMigration();

  // Migrate actions
  console.log('\\nPreparing actions for Prismic...');
  for (const action of actions ?? []) {
    const uid = slugify(action.title);
    migration.createDocument(
      {
        type: 'action',
        uid,
        lang: 'fr-fr',
        data: {
          title: action.title,
          category: action.category,
          date_text: action.date ?? '',
          time_text: action.time ?? '',
          summary: action.summary ?? '',
          description: [{ type: 'paragraph', text: action.description ?? '', spans: [] }],
          url_detail: { link_type: 'Web', url: action.url_detail || '#' },
          image: action.url_image ? { url: action.url_image, alt: action.title } : undefined,
          is_activite: action.is_activite ?? false,
          original_id: action.id,
        },
      },
      `Action: ${action.title}`
    );
    console.log(`  + ${uid} (id: ${action.id})`);
  }

  // Migrate ressources
  console.log('\\nPreparing ressources for Prismic...');
  for (const res of ressources ?? []) {
    const uid = slugify(res.title);
    migration.createDocument(
      {
        type: 'ressource',
        uid,
        lang: 'fr-fr',
        data: {
          title: res.title,
          category: res.category,
          description: [{ type: 'paragraph', text: res.description ?? '', spans: [] }],
          url: { link_type: 'Web', url: res.url || '#' },
          image: res.image ? { url: res.image, alt: res.title } : undefined,
          original_id: res.id,
        },
      },
      `Ressource: ${res.title}`
    );
    console.log(`  + ${uid} (id: ${res.id})`);
  }

  // Execute migration
  console.log('\\nPushing to Prismic (this may take a few minutes)...');
  try {
    await writeClient.migrate(migration, {
      reporter: (event) => {
        if (event.type === 'documents:created') {
          console.log(`  Created: ${event.data.current}/${event.data.total} documents`);
        }
      },
    });
    console.log('\\n✅ Migration complete!');
  } catch (err) {
    console.error('\\n❌ Migration failed:', err.message);
    if (err.response) {
      console.error('Response:', await err.response.text?.());
    }
  }
}

main().catch(console.error);
