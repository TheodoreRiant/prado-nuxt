import { createClient } from '@supabase/supabase-js'
import { sendEmail, escapeHtml } from '~/server/utils/email'
import { validateBody, contactSchema } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  const { name, email, subject, message } = await validateBody(event, contactSchema)

  const config = useRuntimeConfig()
  const adminClient = createClient(config.public.supabase.url, config.supabaseServiceRoleKey)

  const { error } = await adminClient.from('contact_messages').insert({
    name, email, subject: subject || 'Nouveau message', message,
  })

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  // Notify Prado team
  const html = `
  <div style="background:#f6f5f3;padding:32px 16px;font-family:Arial,sans-serif;color:#1f1f1f;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e1d8;border-radius:12px;padding:24px;">
      <h2 style="margin:0 0 16px;font-size:18px;">Nouveau message de contact</h2>
      <p style="margin:0 0 8px;"><strong>Nom :</strong> ${escapeHtml(name)}</p>
      <p style="margin:0 0 8px;"><strong>Email :</strong> ${escapeHtml(email)}</p>
      <p style="margin:0 0 16px;"><strong>Sujet :</strong> ${escapeHtml(subject || '')}</p>
      <div style="padding:12px 14px;border:1px solid #eee7db;border-radius:10px;background:#faf8f4;white-space:pre-wrap;line-height:1.5;">${escapeHtml(message)}</div>
    </div>
  </div>`

  await sendEmail('itineraires@le-prado.fr', `Nouveau message - ${subject || 'Contact'}`, html)

  return { success: true }
})
