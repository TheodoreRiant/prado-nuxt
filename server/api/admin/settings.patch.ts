import { serverSupabaseUser } from '#supabase/server'
import { requireAdmin } from '~/server/utils/admin'
import { updateSettings } from '~/server/utils/settings'
import { validateBody, settingsPatchSchema } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const user = await serverSupabaseUser(event)
  const { key, value } = await validateBody(event, settingsPatchSchema)

  await updateSettings(key, value as Record<string, unknown>, user?.id)
  return { success: true }
})
