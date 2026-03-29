import { requireAdmin } from '~/server/utils/admin'
import { getAllSettings } from '~/server/utils/settings'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  return getAllSettings()
})
