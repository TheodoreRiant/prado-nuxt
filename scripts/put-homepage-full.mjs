/**
 * Update Prismic homepage document with FULL hardcoded texts.
 * Usage: PRISMIC_WRITE_TOKEN=xxx DOC_ID=xxx node scripts/put-homepage-full.mjs
 */

const TOKEN = process.env.PRISMIC_WRITE_TOKEN;
const DOC_ID = process.env.DOC_ID;
const REPO = 'prado-nuxt';

if (!TOKEN || !DOC_ID) { console.error('Missing PRISMIC_WRITE_TOKEN or DOC_ID'); process.exit(1); }

function rt(text, spans = []) { return [{ type: 'paragraph', text, spans }]; }
function mp(paragraphs) { return paragraphs.map(t => ({ type: 'paragraph', text: t, spans: [] })); }
function wl(url) { return url ? { link_type: 'Web', url } : undefined; }
function strip(obj) { return JSON.parse(JSON.stringify(obj, (_k, v) => v == null ? undefined : v)); }

const data = strip({
  meta_title: 'Prado Itinéraires \u2014 L\u2019innovation sociale au service des jeunes et des familles',
  meta_description: 'Actions socio-éducatives pour accompagner les jeunes de 11 à 25 ans vers l\u2019autonomie. Ateliers, formations, ressources pour les professionnels de l\u2019accompagnement.',
  body: [
    // ── 1. HERO ──
    { slice_type: 'hero', slice_label: null, items: [], primary: {
      surtitle: 'Association de la Fondation du Prado \u2014 Lyon Métropole',
      title: rt('Accompagner les jeunes de 11 à 25 ans et leurs familles vers l\u2019autonomie.', [
        { start: 26, end: 37, type: 'label', data: { label: 'highlight-pink' } },
      ]),
      description: rt('Ateliers, formations, ressources, dispositifs d\u2019insertion\u00a0: nous relions les publics accompagnés à des partenaires engagés, des environnements porteurs, pour que chacun puisse prendre conscience de son pouvoir d\u2019agir.'),
      cta_primary_label: 'Découvrir nos actions',
      cta_primary_link: wl('/actions'),
      cta_secondary_label: 'Inscrire un jeune',
      cta_secondary_link: wl('/connexion?mode=register'),
    }},

    // ── 2. PROGRAMMES ──
    { slice_type: 'programmes', slice_label: null, primary: { section_title: 'Quatre programmes pour agir concrètement' }, items: [
      {
        slug: 'jeunes', title: 'Programme Jeunes & Autonomes', short_title: 'Jeunes & Autonomes',
        icon_name: 'Users', brand_color: '#CF006C',
        description: mp([
          'Prado Itinéraires agit en faveur de l\u2019autonomie des jeunes de 11 à 25 ans bénéficiant d\u2019un accompagnement éducatif \u2014 Aide Sociale à l\u2019Enfance, Protection Judiciaire de la Jeunesse, handicap, prévention \u2014 pour les structures du Prado et les structures partenaires de la Métropole de Lyon, du Rhône, de l\u2019Ain et de l\u2019Isère.',
          '89 actions et ateliers programmés toute l\u2019année\u00a0: bien-être et estime de soi, découverte des métiers, vie quotidienne, mobilité, numérique, droits, emploi. En individuel ou en groupe, à organiser dans vos locaux ou dans les nôtres.',
          '183 ressources professionnelles en accès libre\u00a0: guides pratiques, fiches dispositifs, outils pédagogiques pour les professionnels de l\u2019accompagnement.',
        ]),
        cta_1_label: 'Découvrir le catalogue d\u2019actions', cta_1_link: wl('/actions'),
        cta_2_label: 'Accéder aux ressources', cta_2_link: wl('/ressources'),
        cta_3_label: 'Inscrire un jeune', cta_3_link: wl('/connexion?mode=register'),
      },
      {
        slug: 'foodtruck', title: 'Foodtruck \u00ab\u00a0Les Saveurs d\u2019Élise\u00a0\u00bb', short_title: 'Foodtruck',
        icon_name: 'Truck', brand_color: '#FB6223',
        description: mp([
          'Concept pédagogique et inclusif, \u00ab\u00a0Les Saveurs d\u2019Élise\u00a0\u00bb est une offre de restauration mobile qui favorise l\u2019insertion socio-professionnelle des jeunes. Accueillis en stage pendant une semaine dans la cuisine centrale et en vente directe au public, les jeunes expérimentent, rencontrent, se valorisent, tout en étant accompagnés par l\u2019équipe du Prado.',
          'Le foodtruck sillonne la métropole lyonnaise cinq jours par semaine. Menu du jour à prix libre, ouvert à tous. Un outil d\u2019insertion par l\u2019activité économique qui mêle formation, emploi et convivialité. Stages ouverts à tous les jeunes dès 14 ans bénéficiant d\u2019un accompagnement éducatif.',
        ]),
        cta_1_label: 'Découvrir le Foodtruck', cta_1_link: wl('/foodtruck'),
      },
      {
        slug: 'parentalite', title: 'Compétences parentales', short_title: 'Compétences parentales',
        icon_name: 'Heart', brand_color: '#C18ED8',
        description: mp([
          'Prado Itinéraires prend également toute sa place d\u2019incubateur d\u2019innovations sociales au bénéfice des enfants et des familles en portant le développement de deux programmes reconnus scientifiquement.',
          '\u00ab\u00a0Ces Années Incroyables\u00a0\u00bb (Incredible Years), déployé depuis 2014\u00a0: un programme de groupe pour les parents d\u2019enfants de 3 à 12 ans qui rencontrent des difficultés éducatives. Évalué internationalement, il vise à reconnaître les compétences des parents et à les outiller concrètement.',
          '\u00ab\u00a0Parent d\u2019Ado\u2026 une traversée\u00a0\u00bb, lancé en septembre 2022\u00a0: un programme d\u2019accompagnement pour les parents d\u2019adolescents, centré sur l\u2019amélioration des relations intra-familiales et la mise en place d\u2019un réseau de soutien entre pairs.',
        ]),
        cta_1_label: 'Découvrir Ces Années Incroyables', cta_1_link: wl('/educolab'),
        cta_2_label: 'Découvrir Parent d\u2019Ado', cta_2_link: wl('/educolab'),
      },
      {
        slug: 'fresque', title: 'La Fresque de la Protection de l\u2019Enfance\u00ae', short_title: 'Fresque PDE',
        icon_name: 'BookOpen', brand_color: '#93C1AF',
        description: mp([
          'Inspiré de la Fresque du Climat, cet atelier collaboratif met en scène les parcours de trois jeunes qui donnent à voir les réalités de la protection de l\u2019enfance. La complexité du système, la diversité des dispositifs existants, les ruptures que vivent les enfants et les adolescents.',
          'C\u2019est une expérience immersive et collaborative qui combine jeu, échanges et réflexion commune afin de mieux comprendre les parcours des enfants et la complexité du système. 2h30, jusqu\u2019à 14 participants. L\u2019équipe Prado se déplace dans votre structure avec tout le matériel nécessaire.',
        ]),
        cta_1_label: 'En savoir plus sur la Fresque', cta_1_link: wl('/fresque'),
      },
    ]},

    // ── 3. MISSIONS ──
    { slice_type: 'missions', slice_label: null, primary: {
      section_title: 'Nos missions',
      intro_text: rt('Association loi 1901 créée le 21 janvier 2021 par la Fondation du Prado, Prado Itinéraires construit des solutions nouvelles et complémentaires dans le but de relier les publics accompagnés à des partenaires engagés, des environnements porteurs et favorables, afin qu\u2019ils puissent prendre conscience de leur pouvoir d\u2019agir et trouver leur place. L\u2019association propose des actions concrètes au bénéfice des jeunes, des familles du Prado et d\u2019autres acteurs de l\u2019accompagnement.'),
      jeunes_title: 'Pour les jeunes',
      familles_title: 'Pour les familles',
    }, items: [
      { category: 'jeunes', text: 'Décloisonner les interventions et éviter les ruptures dans les parcours' },
      { category: 'jeunes', text: 'Offrir des nouvelles perspectives aux jeunes' },
      { category: 'jeunes', text: 'Impliquer toutes les parties prenantes pour répondre aux besoins des jeunes' },
      { category: 'jeunes', text: 'Apporter des nouvelles ressources aux professionnels éducatifs' },
      { category: 'familles', text: 'Améliorer les relations intra-familiales' },
      { category: 'familles', text: 'Reconnaître les compétences et les habiletés des parents en mettant le focus sur l\u2019efficacité' },
      { category: 'familles', text: 'Outiller les parents concrètement' },
      { category: 'familles', text: 'Mettre en place un réseau de soutien' },
      { category: 'familles', text: 'Proposer de nouvelles méthodes collaboratives aux professionnels' },
    ]},

    // ── 4. IMPACT ──
    { slice_type: 'impact', slice_label: null, primary: { section_title: 'Notre impact en chiffres' }, items: [
      { value: 89, suffix: '', label: 'actions et ateliers programmés sur le territoire', color: '#CF006C' },
      { value: 183, suffix: '', label: 'ressources professionnelles en accès libre', color: '#FB6223' },
      { value: 500, suffix: '+', label: 'jeunes accompagnés chaque année', color: '#C18ED8' },
      { value: 50, suffix: '+', label: 'structures partenaires sur la Métropole de Lyon', color: '#93C1AF' },
    ]},

    // ── 5. STEPS ──
    { slice_type: 'steps', slice_label: null, primary: {
      section_title: 'Comment inscrire un jeune\u00a0?',
      cta_label: 'Créer mon compte gratuitement',
      cta_link: wl('/connexion?mode=register'),
      reassurance_text: '100\u00a0% gratuit · Sans engagement · Réservé aux professionnels de l\u2019accompagnement',
    }, items: [
      { step_number: '01', title: 'Créez votre compte', description: 'Vous êtes éducateur, travailleur social, référent ASE ou PJJ, conseiller en insertion\u00a0? Créez votre compte prescripteur en 2 minutes. Renseignez votre nom, votre structure et votre email professionnel. Votre compte est validé sous 24h par notre équipe.' },
      { step_number: '02', title: 'Ajoutez un jeune', description: 'Créez la fiche du jeune que vous souhaitez inscrire\u00a0: prénom, nom, date de naissance, situation. Vos données sont sécurisées et conformes au RGPD. Vous pouvez créer autant de fiches que nécessaire.' },
      { step_number: '03', title: 'Inscrivez-le à une action', description: 'Parcourez les 89 actions disponibles, choisissez celle qui correspond, sélectionnez le jeune, confirmez. L\u2019inscription est immédiate. Vous pouvez l\u2019annuler à tout moment.' },
    ]},

    // ── 6. TESTIMONIALS ──
    { slice_type: 'testimonials', slice_label: null, primary: { section_title: 'Ils travaillent avec nous' }, items: [
      { quote: rt('Les actions Prado Itinéraires nous permettent de proposer des activités variées et de qualité aux jeunes que nous accompagnons. La médiation animale, les ateliers cuisine, le théâtre \u2014 ce sont des leviers de remobilisation que nous ne pourrions pas mettre en place seuls. Et la plateforme simplifie énormément les inscriptions.'), author_name: 'Marie D.', author_role: 'Éducatrice spécialisée', author_org: 'Maison d\u2019Enfants du Rhône' },
      { quote: rt('La Fresque de la Protection de l\u2019Enfance a été un moment fort pour notre équipe. En 2h30, nous avons compris des choses sur les parcours des jeunes que nous n\u2019avions jamais prises le temps d\u2019analyser ensemble. Nous recommandons cet atelier à toutes les structures du secteur.'), author_name: 'Thomas R.', author_role: 'Chef de service éducatif', author_org: 'Département du Rhône' },
      { quote: rt('Les ressources en ligne sont un outil précieux pour notre pratique quotidienne. Quand un jeune a besoin d\u2019une aide au logement, d\u2019un dispositif de santé ou d\u2019une formation, on trouve toujours la bonne fiche sur Prado Itinéraires.'), author_name: 'Sofia K.', author_role: 'Conseillère en insertion', author_org: 'Mission Locale de Lyon' },
    ]},

    // ── 7. FAQ ──
    { slice_type: 'faq', slice_label: null, primary: { section_title: 'Questions fréquentes' }, items: [
      { question: 'C\u2019est pour qui\u00a0?', answer: rt('Les actions Prado Itinéraires s\u2019adressent aux jeunes de 11 à 25 ans bénéficiant d\u2019un accompagnement éducatif (ASE, PJJ, handicap, prévention) sur le territoire de la Métropole de Lyon, du Rhône, de l\u2019Ain et de l\u2019Isère. L\u2019inscription se fait par un professionnel référent qui accompagne le jeune. Les programmes parentaux sont ouverts aux familles accompagnées par les structures partenaires.') },
      { question: 'C\u2019est gratuit\u00a0?', answer: rt('Oui, entièrement. Toutes les actions, ateliers, formations et ressources sont 100\u00a0% gratuits pour les jeunes, les familles et les professionnels. Prado Itinéraires est financé par la Fondation du Prado et ses partenaires institutionnels.') },
      { question: 'Qui est Prado Itinéraires\u00a0?', answer: rt('Une association loi 1901 créée le 21 janvier 2021 par la Fondation du Prado, acteur de la protection de l\u2019enfance depuis 1860. L\u2019équipe est composée d\u2019éducateurs spécialisés, de chargés de projet et de coordinateurs pédagogiques qui conçoivent et animent les actions.') },
      { question: 'Comment participer ou soutenir l\u2019association\u00a0?', answer: rt('Vous pouvez orienter des jeunes vers nos actions en créant un compte prescripteur. Vous pouvez aussi accueillir le foodtruck dans votre quartier, organiser une Fresque dans votre structure, ou soutenir financièrement nos programmes via la Fondation du Prado. Contactez-nous pour en savoir plus.') },
      { question: 'Comment nous contacter\u00a0?', answer: rt('Par email à itineraires@le-prado.fr, par téléphone au 04 72 XX XX XX (lundi-vendredi, 9h-17h), ou via le formulaire de contact sur notre site. L\u2019équipe répond sous 48h. Nous nous déplaçons volontiers pour présenter nos actions à votre structure.') },
    ]},

    // ── 8. PARTNERS ──
    { slice_type: 'partners', slice_label: null, primary: {
      section_title: 'Ils nous soutiennent',
      subtitle: 'Notre activité est rendue possible grâce au soutien de la Métropole de Lyon, de la Fondation du Prado et de leurs partenaires.',
    }, items: [
      { name: 'Fondation du Prado', url: wl('https://www.le-prado.fr') },
      { name: 'Métropole de Lyon', url: wl('https://www.grandlyon.com') },
      { name: 'Département du Rhône', url: wl('https://www.rhone.fr') },
      { name: 'CAF du Rhône', url: wl('https://www.caf.fr/allocataires/caf-du-rhone') },
      { name: 'DDETS du Rhône', url: wl('https://www.rhone.gouv.fr') },
      { name: 'Mission Locale de Lyon', url: wl('https://www.missionlocalelyon.fr') },
      { name: 'Région Auvergne-Rhône-Alpes', url: wl('https://www.auvergnerhonealpes.fr') },
    ]},

    // ── 9. EN SAVOIR PLUS ──
    { slice_type: 'en_savoir_plus', slice_label: null, primary: { section_title: 'En savoir plus' }, items: [
      { title: 'Connaître notre organisation', description: 'Travailler avec toutes les personnes concernées\u00a0: un conseil d\u2019administration mixte et une équipe impliquée.', cta_label: 'Découvrir', link: wl('/organisation') },
      { title: 'Rapport d\u2019activité 2024', description: 'Découvrir le détail des actions menées en 2024 ainsi que les perspectives 2025.', cta_label: 'Consulter', link: wl('/rapport-activite') },
      { title: 'Mesure d\u2019impact social', description: 'Identifier les freins et les points forts de l\u2019offre proposée dans une démarche continue d\u2019innovation et d\u2019évolution.', cta_label: 'Lire l\u2019étude', link: wl('/impact-social') },
      { title: 'Recueil des pratiques inspirantes', description: 'Une année inspirante pour le programme Ces Années Incroyables.', cta_label: 'Découvrir', link: wl('/pratiques-inspirantes') },
    ]},

    // ── 10. CTA FINAL ──
    { slice_type: 'cta_final', slice_label: null, items: [], primary: {
      title: 'Agir ensemble pour l\u2019autonomie des jeunes',
      description: rt('Que vous soyez professionnel de l\u2019accompagnement, partenaire institutionnel, ou simplement engagé pour la jeunesse, il y a une place pour vous dans le projet Prado Itinéraires. Inscrivez un jeune à une action, organisez une Fresque dans votre structure, accueillez le Foodtruck dans votre quartier, ou soutenez nos programmes.'),
      cta_primary_label: 'Créer un compte',
      cta_primary_link: wl('/connexion?mode=register'),
      cta_secondary_label: 'Nous contacter',
      cta_secondary_link: wl('/contact'),
      footer_text: 'Association loi 1901 · Fondation du Prado · Gratuit et ouvert à tous les acteurs de l\u2019accompagnement',
    }},
  ],
});

async function main() {
  console.log('PUT full texts to Prismic...');
  const res = await fetch(`https://migration.prismic.io/documents/${DOC_ID}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'x-api-key': TOKEN,
      'Content-Type': 'application/json',
      'repository': REPO,
    },
    body: JSON.stringify({ title: 'Homepage', data }),
  });
  console.log(`Status: ${res.status} ${res.statusText}`);
  if (!res.ok) {
    const err = await res.text();
    console.error('Error:', err);
    process.exit(1);
  }
  console.log('Done! Now publish the migration release in the Prismic dashboard.');
}

main().catch(console.error);
