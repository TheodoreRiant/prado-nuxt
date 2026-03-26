import { createClient } from '@supabase/supabase-js'
import { serverSupabaseUser } from '#supabase/server'
import { getHdsClient, logAuditSante } from '~/server/utils/hds-client'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Non authentifié' })

  const jeuneId = getRouterParam(event, 'id')
  if (!jeuneId) throw createError({ statusCode: 400, message: 'id requis' })

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

  // Delete from HDS database
  const hds = getHdsClient()
  await hds.query('DELETE FROM jeune_sante WHERE jeune_id = $1', [jeuneId])

  // Audit log
  await logAuditSante(
    jeuneId,
    'delete',
    user.id,
    { reason: 'user_request' },
    getHeader(event, 'x-forwarded-for') ?? getHeader(event, 'x-real-ip'),
    getHeader(event, 'user-agent'),
  )

  return { success: true }
})
