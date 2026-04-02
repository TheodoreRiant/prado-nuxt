import { createClient } from '@supabase/supabase-js'
import { serverSupabaseUser } from '#supabase/server'
import { validateBody, inscriptionBatchSchema } from '~/server/utils/validation'
import { sendEmail, escapeHtml, formatDateFr } from '~/server/utils/email'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Non authentifie' })
  }

  const body = await validateBody(event, inscriptionBatchSchema)
  const { actionId, jeuneIds, accompagnateurPresent, nomsAccompagnateurs } = body

  const config = useRuntimeConfig()
  const adminClient = createClient(config.public.supabase.url, config.supabaseServiceRoleKey)

  // Verify the prescripteur exists and get email
  const { data: prescripteur } = await adminClient
    .from('prescripteurs')
    .select('id, structure_id, professional_email')
    .eq('id', user.id)
    .single()

  if (!prescripteur) {
    throw createError({ statusCode: 403, message: 'Prescripteur introuvable' })
  }

  // Verify the action exists (include title & date for email)
  const { data: action } = await adminClient
    .from('actions')
    .select('id, title, date, time')
    .eq('id', actionId)
    .single()

  if (!action) {
    throw createError({ statusCode: 404, message: 'Action introuvable' })
  }

  // Verify all jeunes exist and belong to the same structure
  const { data: jeunes, error: jeunesError } = await adminClient
    .from('jeunes')
    .select('id, first_name, last_name, structure_id')
    .in('id', jeuneIds)

  if (jeunesError) {
    throw createError({ statusCode: 500, message: jeunesError.message })
  }

  if ((jeunes ?? []).length !== jeuneIds.length) {
    throw createError({ statusCode: 400, message: 'Un ou plusieurs jeunes introuvables' })
  }

  // Verify structure access for non-admin
  const { data: prescripteurRole } = await adminClient
    .from('prescripteurs')
    .select('role, structure_id')
    .eq('id', user.id)
    .single()

  const isAdmin = prescripteurRole?.role === 'admin'
  if (!isAdmin) {
    const unauthorized = (jeunes ?? []).some(
      j => j.structure_id !== prescripteurRole?.structure_id,
    )
    if (unauthorized) {
      throw createError({ statusCode: 403, message: 'Acces refuse a certains jeunes' })
    }
  }

  // Build insertion rows
  const rows = jeuneIds.map(jeuneId => ({
    prescripteur_id: user.id,
    jeune_id: jeuneId,
    action_id: actionId,
    accompagnateur_present: accompagnateurPresent ?? false,
    noms_accompagnateurs: nomsAccompagnateurs ?? null,
  }))

  const { data: inserted, error: insertError } = await adminClient
    .from('inscriptions')
    .insert(rows)
    .select('id, jeune_id, action_id')

  if (insertError) {
    throw createError({ statusCode: 500, message: insertError.message })
  }

  const createdCount = inserted?.length ?? 0

  // Send confirmation email to prescripteur (non-blocking)
  const prescripteurEmail = prescripteur.professional_email ?? user.email
  if (prescripteurEmail && createdCount > 0) {
    const jeuneNames = (jeunes ?? []).map(
      j => `${j.first_name ?? ''} ${j.last_name ?? ''}`.trim(),
    )
    const formattedDate = formatDateFr(action.date)
    const timeSuffix = action.time ? ` a ${action.time}` : ''

    const jeuneListHtml = jeuneNames
      .map(name => `<li style="padding:3px 0;font-size:14px;">${escapeHtml(name || 'Non renseigne')}</li>`)
      .join('')

    const html = `
    <div style="background:#f6f5f3;padding:32px 16px;font-family:Arial,sans-serif;color:#1f1f1f;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e1d8;border-radius:12px;padding:24px;">
        <p style="margin:0 0 12px;font-size:16px;">Bonjour,</p>
        <p style="margin:0 0 12px;font-size:16px;">
          <strong>${createdCount} jeune${createdCount > 1 ? 's' : ''}</strong> ${createdCount > 1 ? 'ont ete inscrits' : 'a ete inscrit'} a l'action
          <strong>${escapeHtml(action.title)}</strong>.
        </p>
        <p style="margin:0 0 16px;font-size:14px;color:#6b6b6b;">
          Date : ${escapeHtml(formattedDate)}${timeSuffix}
        </p>
        <p style="margin:0 0 8px;font-size:14px;font-weight:600;">Jeunes inscrits :</p>
        <ul style="margin:0 0 16px;padding-left:20px;">
          ${jeuneListHtml}
        </ul>
        <p style="margin:0;font-size:12px;color:#6b6b6b;">
          Cet email a ete envoye automatiquement suite a une inscription groupee.
        </p>
      </div>
    </div>`

    sendEmail(
      prescripteurEmail,
      `Inscription groupee confirmee - ${action.title}`,
      html,
    ).catch(() => {
      // Silent — email failure should not break the inscription
    })
  }

  return {
    created: createdCount,
    inscriptions: inserted ?? [],
  }
})
