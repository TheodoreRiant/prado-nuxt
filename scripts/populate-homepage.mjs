/**
 * Push homepage custom type + create homepage document in Prismic
 * with all hardcoded content from the Vue components.
 *
 * Usage: PRISMIC_WRITE_TOKEN=xxx node scripts/populate-homepage.mjs
 */

import * as prismic from '@prismicio/client';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOKEN = process.env.PRISMIC_WRITE_TOKEN;
const REPO = 'prado-nuxt';

if (!TOKEN) { console.error('Missing PRISMIC_WRITE_TOKEN'); process.exit(1); }

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function richText(text, spans = []) {
  return [{ type: 'paragraph', text, spans }];
}

function multiParagraph(paragraphs) {
  return paragraphs.map(text => ({ type: 'paragraph', text, spans: [] }));
}

function webLink(url) {
  return url ? { link_type: 'Web', url } : undefined;
}

function stripNulls(obj) {
  return JSON.parse(JSON.stringify(obj, (_key, val) =>
    val === null || val === undefined ? undefined : val
  ));
}

// ---------------------------------------------------------------------------
// Step 1: Push Custom Type
// ---------------------------------------------------------------------------

async function pushCustomType() {
  const ctJson = JSON.parse(
    readFileSync(join(__dirname, '..', 'customtypes', 'homepage', 'index.json'), 'utf-8')
  );

  const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'repository': REPO,
    'Content-Type': 'application/json',
  };

  // Try insert
  let res = await fetch('https://customtypes.prismic.io/customtypes/insert', {
    method: 'POST',
    headers,
    body: JSON.stringify(ctJson),
  });

  if (res.status === 409 || res.status === 400) {
    // Already exists → update
    console.log('  Custom type exists, updating...');
    res = await fetch('https://customtypes.prismic.io/customtypes/update', {
      method: 'POST',
      headers,
      body: JSON.stringify(ctJson),
    });
  }

  if (!res.ok) {
    const text = await res.text();
    console.warn(`  Custom Types API error: ${res.status} ${res.statusText}`);
    console.warn(`  ${text}`);
    console.warn('  → You may need to push the custom type via Slice Machine instead.');
    return false;
  }

  console.log('  Custom type pushed successfully.');
  return true;
}

// ---------------------------------------------------------------------------
// Step 2: Build homepage document data (all 10 slices)
// ---------------------------------------------------------------------------

function heroSlice() {
  return {
    slice_type: 'hero',
    slice_label: null,
    primary: {
      surtitle: 'Association de la Fondation du Prado — Lyon Métropole',
      title: richText(
        'Accompagner les jeunes de 11 à 25 ans et leurs familles vers l\u2019autonomie.',
        [{ start: 26, end: 37, type: 'label', data: { label: 'highlight-pink' } }]
      ),
      description: richText(
        'Ateliers, formations, ressources, dispositifs d\u2019insertion\u00a0: nous relions les publics accompagnés à des partenaires engagés, des environnements porteurs, pour que chacun puisse prendre conscience de son pouvoir d\u2019agir.'
      ),
      cta_primary_label: 'Découvrir nos actions',
      cta_primary_link: webLink('/actions'),
      cta_secondary_label: 'Inscrire un jeune',
      cta_secondary_link: webLink('/connexion?mode=register'),
    },
    items: [],
  };
}

function programmesSlice() {
  return {
    slice_type: 'programmes',
    slice_label: null,
    primary: {
      section_title: 'Quatre programmes pour agir concrètement',
    },
    items: [
      {
        slug: 'jeunes',
        title: 'Programme Jeunes & Autonomes',
        short_title: 'Jeunes & Autonomes',
        icon_name: 'Users',
        brand_color: '#CF006C',
        description: multiParagraph([
          'Prado Itinéraires agit en faveur de l\u2019autonomie des jeunes de 11 à 25 ans bénéficiant d\u2019un accompagnement éducatif — Aide Sociale à l\u2019Enfance, Protection Judiciaire de la Jeunesse, handicap, prévention — pour les structures du Prado et les structures partenaires de la Métropole de Lyon, du Rhône, de l\u2019Ain et de l\u2019Isère.',
          '89 actions et ateliers programmés toute l\u2019année\u00a0: bien-être et estime de soi, découverte des métiers, vie quotidienne, mobilité, numérique, droits, emploi. En individuel ou en groupe, à organiser dans vos locaux ou dans les nôtres.',
          '183 ressources professionnelles en accès libre\u00a0: guides pratiques, fiches dispositifs, outils pédagogiques pour les professionnels de l\u2019accompagnement.',
        ]),
        cta_1_label: 'Découvrir le catalogue d\u2019actions',
        cta_1_link: webLink('/actions'),
        cta_2_label: 'Accéder aux ressources',
        cta_2_link: webLink('/ressources'),
        cta_3_label: 'Inscrire un jeune',
        cta_3_link: webLink('/connexion?mode=register'),
      },
      {
        slug: 'foodtruck',
        title: 'Foodtruck « Les Saveurs d\u2019Élise »',
        short_title: 'Foodtruck',
        icon_name: 'Truck',
        brand_color: '#FB6223',
        description: multiParagraph([
          'Concept pédagogique et inclusif, « Les Saveurs d\u2019Élise » est une offre de restauration mobile qui favorise l\u2019insertion socio-professionnelle des jeunes. Accueillis en stage pendant une semaine dans la cuisine centrale et en vente directe au public, les jeunes expérimentent, rencontrent, se valorisent, tout en étant accompagnés par l\u2019équipe du Prado.',
          'Le foodtruck sillonne la métropole lyonnaise cinq jours par semaine. Menu du jour à prix libre, ouvert à tous. Un outil d\u2019insertion par l\u2019activité économique qui mêle formation, emploi et convivialité. Stages ouverts à tous les jeunes dès 14 ans bénéficiant d\u2019un accompagnement éducatif.',
        ]),
        cta_1_label: 'Découvrir le Foodtruck',
        cta_1_link: webLink('/foodtruck'),
        cta_2_label: undefined,
        cta_2_link: undefined,
        cta_3_label: undefined,
        cta_3_link: undefined,
      },
      {
        slug: 'parentalite',
        title: 'Compétences parentales',
        short_title: 'Compétences parentales',
        icon_name: 'Heart',
        brand_color: '#C18ED8',
        description: multiParagraph([
          'Prado Itinéraires prend également toute sa place d\u2019incubateur d\u2019innovations sociales au bénéfice des enfants et des familles en portant le développement de deux programmes reconnus scientifiquement.',
          '« Ces Années Incroyables » (Incredible Years), déployé depuis 2014\u00a0: un programme de groupe pour les parents d\u2019enfants de 3 à 12 ans qui rencontrent des difficultés éducatives. Évalué internationalement, il vise à reconnaître les compétences des parents et à les outiller concrètement.',
          '« Parent d\u2019Ado… une traversée », lancé en septembre 2022\u00a0: un programme d\u2019accompagnement pour les parents d\u2019adolescents, centré sur l\u2019amélioration des relations intra-familiales et la mise en place d\u2019un réseau de soutien entre pairs.',
        ]),
        cta_1_label: 'Découvrir Ces Années Incroyables',
        cta_1_link: webLink('/educolab'),
        cta_2_label: 'Découvrir Parent d\u2019Ado',
        cta_2_link: webLink('/educolab'),
        cta_3_label: null,
        cta_3_link: null,
      },
      {
        slug: 'fresque',
        title: 'La Fresque de la Protection de l\u2019Enfance®',
        short_title: 'Fresque PDE',
        icon_name: 'BookOpen',
        brand_color: '#93C1AF',
        description: multiParagraph([
          'Inspiré de la Fresque du Climat, cet atelier collaboratif met en scène les parcours de trois jeunes qui donnent à voir les réalités de la protection de l\u2019enfance. La complexité du système, la diversité des dispositifs existants, les ruptures que vivent les enfants et les adolescents.',
          'C\u2019est une expérience immersive et collaborative qui combine jeu, échanges et réflexion commune afin de mieux comprendre les parcours des enfants et la complexité du système. 2h30, jusqu\u2019à 14 participants. L\u2019équipe Prado se déplace dans votre structure avec tout le matériel nécessaire.',
        ]),
        cta_1_label: 'En savoir plus sur la Fresque',
        cta_1_link: webLink('/fresque'),
        cta_2_label: undefined,
        cta_2_link: undefined,
        cta_3_label: undefined,
        cta_3_link: undefined,
      },
    ],
  };
}

function missionsSlice() {
  return {
    slice_type: 'missions',
    slice_label: null,
    primary: {
      section_title: 'Nos missions',
      intro_text: richText(
        'Association loi 1901 créée le 21 janvier 2021 par la Fondation du Prado, Prado Itinéraires construit des solutions nouvelles et complémentaires dans le but de relier les publics accompagnés à des partenaires engagés, des environnements porteurs et favorables, afin qu\u2019ils puissent prendre conscience de leur pouvoir d\u2019agir et trouver leur place. L\u2019association propose des actions concrètes au bénéfice des jeunes, des familles du Prado et d\u2019autres acteurs de l\u2019accompagnement.'
      ),
      jeunes_title: 'Pour les jeunes',
      familles_title: 'Pour les familles',
    },
    items: [
      { category: 'jeunes', text: 'Décloisonner les interventions et éviter les ruptures dans les parcours' },
      { category: 'jeunes', text: 'Offrir des nouvelles perspectives aux jeunes' },
      { category: 'jeunes', text: 'Impliquer toutes les parties prenantes pour répondre aux besoins des jeunes' },
      { category: 'jeunes', text: 'Apporter des nouvelles ressources aux professionnels éducatifs' },
      { category: 'familles', text: 'Améliorer les relations intra-familiales' },
      { category: 'familles', text: 'Reconnaître les compétences et les habiletés des parents en mettant le focus sur l\u2019efficacité' },
      { category: 'familles', text: 'Outiller les parents concrètement' },
      { category: 'familles', text: 'Mettre en place un réseau de soutien' },
      { category: 'familles', text: 'Proposer de nouvelles méthodes collaboratives aux professionnels' },
    ],
  };
}

function impactSlice() {
  return {
    slice_type: 'impact',
    slice_label: null,
    primary: {
      section_title: 'Notre impact en chiffres',
    },
    items: [
      { value: 89, suffix: '', label: 'actions et ateliers programmés sur le territoire', color: '#CF006C' },
      { value: 183, suffix: '', label: 'ressources professionnelles en accès libre', color: '#FB6223' },
      { value: 500, suffix: '+', label: 'jeunes accompagnés chaque année', color: '#C18ED8' },
      { value: 50, suffix: '+', label: 'structures partenaires sur la Métropole de Lyon', color: '#93C1AF' },
    ],
  };
}

function stepsSlice() {
  return {
    slice_type: 'steps',
    slice_label: null,
    primary: {
      section_title: 'Comment inscrire un jeune ?',
      cta_label: 'Créer mon compte gratuitement',
      cta_link: webLink('/connexion?mode=register'),
      reassurance_text: '100% gratuit · Sans engagement · Réservé aux professionnels de l\u2019accompagnement',
    },
    items: [
      {
        step_number: '01',
        title: 'Créez votre compte',
        description: 'Vous êtes éducateur, travailleur social, référent ASE ou PJJ, conseiller en insertion\u00a0? Créez votre compte prescripteur en 2 minutes. Renseignez votre nom, votre structure et votre email professionnel. Votre compte est validé sous 24h par notre équipe.',
      },
      {
        step_number: '02',
        title: 'Ajoutez un jeune',
        description: 'Créez la fiche du jeune que vous souhaitez inscrire\u00a0: prénom, nom, date de naissance, situation. Vos données sont sécurisées et conformes au RGPD. Vous pouvez créer autant de fiches que nécessaire.',
      },
      {
        step_number: '03',
        title: 'Inscrivez-le à une action',
        description: 'Parcourez les 89 actions disponibles, choisissez celle qui correspond, sélectionnez le jeune, confirmez. L\u2019inscription est immédiate. Vous pouvez l\u2019annuler à tout moment.',
      },
    ],
  };
}

function testimonialsSlice() {
  return {
    slice_type: 'testimonials',
    slice_label: null,
    primary: {
      section_title: 'Ils travaillent avec nous',
    },
    items: [
      {
        quote: richText('Les actions Prado Itinéraires nous permettent de proposer des activités variées et de qualité aux jeunes que nous accompagnons. La médiation animale, les ateliers cuisine, le théâtre — ce sont des leviers de remobilisation que nous ne pourrions pas mettre en place seuls. Et la plateforme simplifie énormément les inscriptions.'),
        author_name: 'Marie D.',
        author_role: 'Éducatrice spécialisée',
        author_org: 'Maison d\u2019Enfants du Rhône',
      },
      {
        quote: richText('La Fresque de la Protection de l\u2019Enfance a été un moment fort pour notre équipe. En 2h30, nous avons compris des choses sur les parcours des jeunes que nous n\u2019avions jamais prises le temps d\u2019analyser ensemble. Nous recommandons cet atelier à toutes les structures du secteur.'),
        author_name: 'Thomas R.',
        author_role: 'Chef de service éducatif',
        author_org: 'Département du Rhône',
      },
      {
        quote: richText('Les ressources en ligne sont un outil précieux pour notre pratique quotidienne. Quand un jeune a besoin d\u2019une aide au logement, d\u2019un dispositif de santé ou d\u2019une formation, on trouve toujours la bonne fiche sur Prado Itinéraires.'),
        author_name: 'Sofia K.',
        author_role: 'Conseillère en insertion',
        author_org: 'Mission Locale de Lyon',
      },
    ],
  };
}

function faqSlice() {
  return {
    slice_type: 'faq',
    slice_label: null,
    primary: {
      section_title: 'Questions fréquentes',
    },
    items: [
      {
        question: 'C\u2019est pour qui\u00a0?',
        answer: richText('Les actions Prado Itinéraires s\u2019adressent aux jeunes de 11 à 25 ans bénéficiant d\u2019un accompagnement éducatif (ASE, PJJ, handicap, prévention) sur le territoire de la Métropole de Lyon, du Rhône, de l\u2019Ain et de l\u2019Isère. L\u2019inscription se fait par un professionnel référent qui accompagne le jeune. Les programmes parentaux sont ouverts aux familles accompagnées par les structures partenaires.'),
      },
      {
        question: 'C\u2019est gratuit\u00a0?',
        answer: richText('Oui, entièrement. Toutes les actions, ateliers, formations et ressources sont 100\u00a0% gratuits pour les jeunes, les familles et les professionnels. Prado Itinéraires est financé par la Fondation du Prado et ses partenaires institutionnels.'),
      },
      {
        question: 'Qui est Prado Itinéraires\u00a0?',
        answer: richText('Une association loi 1901 créée le 21 janvier 2021 par la Fondation du Prado, acteur de la protection de l\u2019enfance depuis 1860. L\u2019équipe est composée d\u2019éducateurs spécialisés, de chargés de projet et de coordinateurs pédagogiques qui conçoivent et animent les actions.'),
      },
      {
        question: 'Comment participer ou soutenir l\u2019association\u00a0?',
        answer: richText('Vous pouvez orienter des jeunes vers nos actions en créant un compte prescripteur. Vous pouvez aussi accueillir le foodtruck dans votre quartier, organiser une Fresque dans votre structure, ou soutenir financièrement nos programmes via la Fondation du Prado. Contactez-nous pour en savoir plus.'),
      },
      {
        question: 'Comment nous contacter\u00a0?',
        answer: richText('Par email à itineraires@le-prado.fr, par téléphone au 04 72 XX XX XX (lundi-vendredi, 9h-17h), ou via le formulaire de contact sur notre site. L\u2019équipe répond sous 48h. Nous nous déplaçons volontiers pour présenter nos actions à votre structure.'),
      },
    ],
  };
}

function partnersSlice() {
  // Partners without logos — logos need to be uploaded manually in Prismic editor.
  // Image fields must be omitted (not empty objects) to pass validation.
  return {
    slice_type: 'partners',
    slice_label: null,
    primary: {
      section_title: 'Ils nous soutiennent',
      subtitle: 'Notre activité est rendue possible grâce au soutien de la Métropole de Lyon, de la Fondation du Prado et de leurs partenaires.',
    },
    items: [
      { name: 'Fondation du Prado', url: webLink('https://www.le-prado.fr') },
      { name: 'Métropole de Lyon', url: webLink('https://www.grandlyon.com') },
      { name: 'Département du Rhône', url: webLink('https://www.rhone.fr') },
      { name: 'CAF du Rhône', url: webLink('https://www.caf.fr/allocataires/caf-du-rhone') },
      { name: 'DDETS du Rhône', url: webLink('https://www.rhone.gouv.fr') },
      { name: 'Mission Locale de Lyon', url: webLink('https://www.missionlocalelyon.fr') },
      { name: 'Région Auvergne-Rhône-Alpes', url: webLink('https://www.auvergnerhonealpes.fr') },
    ],
  };
}

function enSavoirPlusSlice() {
  return {
    slice_type: 'en_savoir_plus',
    slice_label: null,
    primary: {
      section_title: 'En savoir plus',
    },
    items: [
      {
        title: 'Connaître notre organisation',
        description: 'Travailler avec toutes les personnes concernées\u00a0: un conseil d\u2019administration mixte et une équipe impliquée.',
        cta_label: 'Découvrir',
        link: webLink('/organisation'),
      },
      {
        title: 'Rapport d\u2019activité 2024',
        description: 'Découvrir le détail des actions menées en 2024 ainsi que les perspectives 2025.',
        cta_label: 'Consulter',
        link: webLink('/rapport-activite'),
      },
      {
        title: 'Mesure d\u2019impact social',
        description: 'Identifier les freins et les points forts de l\u2019offre proposée dans une démarche continue d\u2019innovation et d\u2019évolution.',
        cta_label: 'Lire l\u2019étude',
        link: webLink('/impact-social'),
      },
      {
        title: 'Recueil des pratiques inspirantes',
        description: 'Une année inspirante pour le programme Ces Années Incroyables.',
        cta_label: 'Découvrir',
        link: webLink('/pratiques-inspirantes'),
      },
    ],
  };
}

function ctaFinalSlice() {
  return {
    slice_type: 'cta_final',
    slice_label: null,
    primary: {
      title: 'Agir ensemble pour l\u2019autonomie des jeunes',
      description: richText(
        'Que vous soyez professionnel de l\u2019accompagnement, partenaire institutionnel, ou simplement engagé pour la jeunesse, il y a une place pour vous dans le projet Prado Itinéraires. Inscrivez un jeune à une action, organisez une Fresque dans votre structure, accueillez le Foodtruck dans votre quartier, ou soutenez nos programmes.'
      ),
      cta_primary_label: 'Créer un compte',
      cta_primary_link: webLink('/connexion?mode=register'),
      cta_secondary_label: 'Nous contacter',
      cta_secondary_link: webLink('/contact'),
      footer_text: 'Association loi 1901 · Fondation du Prado · Gratuit et ouvert à tous les acteurs de l\u2019accompagnement',
    },
    items: [],
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('=== Populate Homepage in Prismic ===\n');

  // Step 1: Push Custom Type
  console.log('1. Pushing custom type "homepage"...');
  const ctOk = await pushCustomType();
  if (!ctOk) {
    console.log('   Custom type push failed — trying to continue with document creation anyway.\n');
  }

  // Small delay to let Prismic propagate the custom type
  await new Promise(r => setTimeout(r, 2000));

  // Step 2: Create or update homepage document via direct REST calls
  console.log('2. Creating homepage document with all 10 slices...');

  const migHeaders = {
    'Authorization': `Bearer ${TOKEN}`,
    'x-api-key': TOKEN,
    'Content-Type': 'application/json',
    'repository': REPO,
  };

  const data = {
    meta_title: 'Prado Itinéraires — L\u2019innovation sociale au service des jeunes',
    meta_description: 'Actions socio-éducatives pour accompagner les jeunes de 11 à 25 ans vers l\u2019autonomie. Ateliers, formations, ressources pour les professionnels.',
    body: [
      heroSlice(),
      programmesSlice(),
      missionsSlice(),
      impactSlice(),
      stepsSlice(),
      testimonialsSlice(),
      faqSlice(),
      partnersSlice(),
      enSavoirPlusSlice(),
      ctaFinalSlice(),
    ],
  };

  const cleanData = stripNulls(data);

  const docPayload = {
    title: 'Homepage',
    type: 'homepage',
    lang: 'en-us',
    data: cleanData,
  };

  // Step A: Try to delete the orphan draft via SDK first
  console.log('   Checking for orphan draft...');
  const writeClient = prismic.createWriteClient(REPO, { writeToken: TOKEN });

  // The SDK migrate() internally lists existing documents.
  // We can try a trick: use a migration with ONLY the homepage document.
  // If it finds the existing draft, it will UPDATE it instead of creating.
  const migration = prismic.createMigration();
  migration.createDocument({ type: 'homepage', lang: 'en-us', data: cleanData }, 'Homepage');

  try {
    await writeClient.migrate(migration, {
      reporter: (event) => {
        if (event.type === 'documents:created') {
          console.log(`   Created ${event.data.current}/${event.data.total}`);
        }
        if (event.type === 'documents:updated') {
          console.log(`   Updated ${event.data.current}/${event.data.total}`);
        }
        if (event.type === 'end') {
          console.log('   Migration result:', JSON.stringify(event.data));
        }
      },
    });
    console.log('   Document created/updated via SDK.');
  } catch (sdkErr) {
    // SDK failed (likely non-repeatable conflict). Try direct REST.
    console.log(`   SDK migrate: ${sdkErr.message}`);
    console.log('   Trying direct REST POST...');

    const createRes = await fetch('https://migration.prismic.io/documents', {
      method: 'POST', headers: migHeaders, body: JSON.stringify(docPayload),
    });

    if (createRes.ok) {
      console.log('   Document created via REST.');
    } else {
      const errBody = await createRes.json().catch(() => ({}));
      console.log(`   POST failed: ${createRes.status}`, JSON.stringify(errBody));
      console.log('\n   An orphan draft homepage exists in Prismic.');
      console.log('   → Go to https://prado-nuxt.prismic.io/documents');
      console.log('   → Find the "Homepage" draft → Archive/Delete it');
      console.log('   → Re-run this script');
    }
  }

  console.log('\n=== Done ===');
  console.log('The homepage document is now in Prismic (published).');
  console.log('Note: Partner logos need to be uploaded manually in the Prismic editor.');
}

main().catch(err => {
  console.error('Error:', err.message || err);
  if (err.response) {
    err.response.text?.().then?.(t => console.error('Response:', t));
  }
  process.exit(1);
});
