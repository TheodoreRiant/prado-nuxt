import { createClient } from '@supabase/supabase-js'
import { serverSupabaseUser } from '#supabase/server'
import { sendEmail, escapeHtml, formatDateFr } from '~/server/utils/email'
import { validateBody, sendConfirmationSchema } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Non authentifie' })
  }

  const { inscriptionId } = await validateBody(event, sendConfirmationSchema)

  const config = useRuntimeConfig()
  const adminClient = createClient(
    config.public.supabase.url,
    config.supabaseServiceRoleKey,
  )

  // Fetch inscription with related data — derive everything from DB
  const { data: inscription, error: inscError } = await adminClient
    .from('inscriptions')
    .select('id, action_id, prescripteur_id, jeunes(first_name, last_name), prescripteurs(professional_email)')
    .eq('id', inscriptionId)
    .single()

  if (inscError || !inscription) {
    throw createError({ statusCode: 404, message: 'Inscription introuvable' })
  }

  // Verify the inscription belongs to the authenticated user
  if (inscription.prescripteur_id !== user.id) {
    throw createError({ statusCode: 403, message: 'Accès refusé' })
  }

  const { data: action } = await adminClient
    .from('actions')
    .select('title, date, time')
    .eq('id', inscription.action_id)
    .single()

  const prescripteurEmail = (inscription.prescripteurs as any)?.professional_email ?? user.email
  if (!prescripteurEmail) {
    throw createError({ statusCode: 500, message: 'Email prescripteur manquant' })
  }

  const actionTitle = action?.title ?? 'Action'
  const formattedDate = formatDateFr(action?.date)
  const timeSuffix = action?.time ? ` à ${action.time}` : ''
  const fullDate = formattedDate ? `${formattedDate}${timeSuffix}` : (action?.date ?? '') + timeSuffix
  const jeuneName = `${(inscription.jeunes as any)?.first_name ?? ''} ${(inscription.jeunes as any)?.last_name ?? ''}`.trim()

  const html = `
  <div style="background:#f6f5f3;padding:32px 16px;font-family:Arial,sans-serif;color:#1f1f1f;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e1d8;border-radius:12px;padding:24px;">
      <p style="margin:0 0 12px;font-size:16px;">Bonjour,</p>
      <p style="margin:0 0 12px;font-size:16px;">
        L'inscription de <strong>${escapeHtml(jeuneName)}</strong> à l'action
        <strong>${escapeHtml(actionTitle)}</strong> est confirmée.
      </p>
      <p style="margin:0 0 12px;font-size:16px;">
        Date : <strong>${escapeHtml(fullDate)}</strong>
      </p>
      <p style="margin:0;font-size:13px;color:#6b6b6b;">
        Référence : ${escapeHtml(String(inscriptionId))}
      </p>
    </div>
  </div>`

  await sendEmail(prescripteurEmail, `Confirmation d'inscription - ${actionTitle}`, html)
  return { success: true }
})
