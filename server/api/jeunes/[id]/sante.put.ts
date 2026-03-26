import { createClient } from '@supabase/supabase-js'
import { serverSupabaseUser } from '#supabase/server'
import { getHdsClient, logAuditSante } from '~/server/utils/hds-client'
import { toJeuneSante } from '~/lib/types/sante'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Non authentifié' })

  const jeuneId = getRouterParam(event, 'id')
  if (!jeuneId) throw createError({ statusCode: 400, message: 'id requis' })

  const body = await readBody(event)
  if (!body) throw createError({ statusCode: 400, message: 'Corps de requête vide' })

  // Verify ownership
  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabase.url, config.supabaseServiceRoleKey)

  const { data: jeune } = await supabase
    .from('jeunes')
    .select('prescripteur_id')
    .eq('id', jeuneId)
    .single()

  if (!jeune) throw createError({ statusCode: 404, message: 'Jeune introuvable' })

  const { data: prescripteur } = await supabase
    .from('prescripteurs')
    .select('role')
    .eq('id', user.id)
    .single()

  if (jeune.prescripteur_id !== user.id && prescripteur?.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Accès refusé' })
  }

  const hds = getHdsClient()

  // Serialize contacts_urgence to JSON string
  const contactsJson = JSON.stringify(body.contactsUrgence ?? [])

  // Upsert: insert or update on conflict
  const { rows } = await hds.query(
    `INSERT INTO jeune_sante (
      jeune_id, allergies, handicap, taux_invalidite,
      suivi_psychologique, suivi_medical, traitements_en_cours,
      regime_alimentaire, contacts_urgence, medecin_traitant,
      mesure_protection, referent_ase, composition_familiale,
      lieu_hebergement, droits_parentaux, notes_confidentielles,
      derniere_mise_a_jour, mis_a_jour_par
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,NOW(),$17)
    ON CONFLICT (jeune_id) DO UPDATE SET
      allergies = EXCLUDED.allergies,
      handicap = EXCLUDED.handicap,
      taux_invalidite = EXCLUDED.taux_invalidite,
      suivi_psychologique = EXCLUDED.suivi_psychologique,
      suivi_medical = EXCLUDED.suivi_medical,
      traitements_en_cours = EXCLUDED.traitements_en_cours,
      regime_alimentaire = EXCLUDED.regime_alimentaire,
      contacts_urgence = EXCLUDED.contacts_urgence,
      medecin_traitant = EXCLUDED.medecin_traitant,
      mesure_protection = EXCLUDED.mesure_protection,
      referent_ase = EXCLUDED.referent_ase,
      composition_familiale = EXCLUDED.composition_familiale,
      lieu_hebergement = EXCLUDED.lieu_hebergement,
      droits_parentaux = EXCLUDED.droits_parentaux,
      notes_confidentielles = EXCLUDED.notes_confidentielles,
      derniere_mise_a_jour = NOW(),
      mis_a_jour_par = EXCLUDED.mis_a_jour_par
    RETURNING *`,
    [
      jeuneId,
      body.allergies ?? '',
      body.handicap ?? '',
      body.tauxInvalidite ?? '',
      body.suiviPsychologique ?? '',
      body.suiviMedical ?? '',
      body.traitementsEnCours ?? '',
      body.regimeAlimentaire ?? '',
      contactsJson,
      body.medecinTraitant ?? '',
      body.mesureProtection ?? '',
      body.referentAse ?? '',
      body.compositionFamiliale ?? '',
      body.lieuHebergement ?? '',
      body.droitsParentaux ?? '',
      body.notesConfidentielles ?? '',
      user.id,
    ],
  )

  // Audit log
  const ip = getHeader(event, 'x-forwarded-for') ?? getHeader(event, 'x-real-ip')
  const ua = getHeader(event, 'user-agent')
  const action = rows[0]?.created_at === rows[0]?.derniere_mise_a_jour ? 'create' : 'update'
  await logAuditSante(jeuneId, action, user.id, { fields: Object.keys(body) }, ip, ua)

  return toJeuneSante(rows[0])
})
