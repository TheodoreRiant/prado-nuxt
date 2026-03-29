import { serverSupabaseUser } from '#supabase/server'
import { requireAdmin } from '~/server/utils/admin'
import { sendEmail } from '~/server/utils/email'

export default defineEventHandler(async (event) => {
  const adminClient = await requireAdmin(event)
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401 })

  // Get admin's email from prescripteurs table
  const { data: prescripteur } = await adminClient
    .from('prescripteurs')
    .select('professional_email')
    .eq('id', user.id)
    .single()

  const email = prescripteur?.professional_email
  if (!email) {
    throw createError({ statusCode: 400, message: 'Aucune adresse email trouvée pour votre compte' })
  }

  await sendEmail(
    email,
    'Test email — Prado Itinéraires',
    `<div style="background:#f6f5f3;padding:32px 16px;font-family:Arial,sans-serif;color:#1f1f1f;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e1d8;border-radius:12px;padding:24px;">
        <p style="margin:0 0 12px;font-size:16px;">Cet email est un test.</p>
        <p style="margin:0;font-size:14px;color:#666;">Si vous recevez ce message, la configuration email fonctionne correctement.</p>
      </div>
    </div>`,
  )

  return { success: true, sentTo: email }
})
