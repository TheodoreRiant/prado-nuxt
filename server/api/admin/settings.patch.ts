import { serverSupabaseUser } from '#supabase/server'
import { requireAdmin } from '~/server/utils/admin'
import { updateSettings } from '~/server/utils/settings'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const user = await serverSupabaseUser(event)
  const body = await readBody<{ key: string; value: Record<string, unknown> }>(event)

  if (!body?.key || !body?.value) {
    throw createError({ statusCode: 400, message: 'key et value requis' })
  }

  const allowedKeys = ['email', 'newsletter', 'veriff', 'analytics', 'contact']
  if (!allowedKeys.includes(body.key)) {
    throw createError({ statusCode: 400, message: `Clé invalide : ${body.key}` })
  }

  await updateSettings(body.key, body.value, user?.id)
  return { success: true }
})
