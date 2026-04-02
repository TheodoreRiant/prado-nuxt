import { requireAdmin } from '~/server/utils/admin'

export default defineEventHandler(async (event) => {
  const adminClient = await requireAdmin(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'id requis' })
  }

  // Fetch the action
  const { data: action, error: actionError } = await adminClient
    .from('actions')
    .select('*')
    .eq('id', id)
    .single()

  if (actionError || !action) {
    throw createError({ statusCode: 404, message: 'Action introuvable' })
  }

  // Fetch action dates
  const { data: actionDates } = await adminClient
    .from('action_dates')
    .select('id, date, time, places_max')
    .eq('action_id', id)
    .order('date', { ascending: true })

  // Fetch inscriptions with jeune + prescripteur info
  const { data: inscriptions, error: inscError } = await adminClient
    .from('inscriptions')
    .select('id, jeune_id, action_date_id, presence, accompagnateur_present, noms_accompagnateurs, personne_urgence_nom, personne_urgence_tel, attestation_responsabilite, created_at, jeunes(first_name, last_name, sex, situation), prescripteurs(name)')
    .eq('action_id', id)
    .is('canceled_at', null)
    .order('created_at', { ascending: true })

  if (inscError) {
    throw createError({ statusCode: 500, message: inscError.message })
  }

  const inscList = inscriptions ?? []

  // Presence stats
  const totalInscrits = inscList.length
  const totalPresents = inscList.filter(i => i.presence === 'present').length
  const totalAbsents = inscList.filter(i => i.presence === 'absent').length
  const totalEnAttente = inscList.filter(i => i.presence === 'inscrit').length

  // Etablissement info
  let etablissement = null
  if (action.etablissement_id) {
    const { data: etab } = await adminClient
      .from('etablissements')
      .select('id, name, address, postal_code, city')
      .eq('id', action.etablissement_id)
      .single()

    if (etab) {
      etablissement = {
        id: etab.id,
        name: etab.name,
        address: etab.address,
        postalCode: etab.postal_code,
        city: etab.city,
      }
    }
  }

  return {
    action: {
      id: action.id,
      title: action.title,
      category: action.category,
      date: action.date,
      time: action.time,
      summary: action.summary,
      description: action.description,
      cost: action.cost,
      isRecurring: action.is_recurring ?? false,
      etablissement,
    },
    dates: (actionDates ?? []).map(d => ({
      id: d.id,
      date: d.date,
      time: d.time,
      placesMax: d.places_max,
    })),
    inscriptions: inscList.map(i => ({
      id: i.id,
      jeuneId: i.jeune_id,
      actionDateId: i.action_date_id,
      jeuneFirstName: (i.jeunes as any)?.first_name ?? '',
      jeuneLastName: (i.jeunes as any)?.last_name ?? '',
      jeuneSex: (i.jeunes as any)?.sex ?? '',
      jeuneSituation: (i.jeunes as any)?.situation ?? '',
      prescripteurName: (i.prescripteurs as any)?.name ?? '',
      presence: i.presence ?? 'inscrit',
      accompagnateurPresent: i.accompagnateur_present ?? false,
      nomsAccompagnateurs: i.noms_accompagnateurs ?? null,
      personneUrgenceNom: i.personne_urgence_nom ?? null,
      personneUrgenceTel: i.personne_urgence_tel ?? null,
      attestationResponsabilite: i.attestation_responsabilite ?? false,
      createdAt: i.created_at,
    })),
    stats: {
      totalInscrits,
      totalPresents,
      totalAbsents,
      totalEnAttente,
      tauxPresence: totalInscrits > 0
        ? Math.round((totalPresents / totalInscrits) * 100)
        : 0,
    },
  }
})
