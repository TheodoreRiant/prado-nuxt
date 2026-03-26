import pg from 'pg'

let pool: pg.Pool | null = null

/**
 * Returns a PostgreSQL connection pool to the HDS-certified database (Scalingo).
 * Used exclusively for sensitive health & family data.
 * The client NEVER connects directly — only server-side API routes use this.
 */
export function getHdsClient(): pg.Pool {
  if (!pool) {
    const config = useRuntimeConfig()

    if (!config.hdsDatabaseUrl) {
      throw createError({
        statusCode: 500,
        message: 'HDS database not configured (HDS_DATABASE_URL missing)',
      })
    }

    pool = new pg.Pool({
      connectionString: config.hdsDatabaseUrl,
      ssl: { rejectUnauthorized: true },
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    })
  }

  return pool
}

/**
 * Log an access or modification to the audit trail on the HDS database.
 */
export async function logAuditSante(
  jeuneId: string,
  action: 'read' | 'create' | 'update' | 'delete' | 'export',
  userId: string,
  details?: Record<string, unknown>,
  ipAddress?: string,
  userAgent?: string,
) {
  const client = getHdsClient()
  await client.query(
    `INSERT INTO audit_sante (jeune_id, action, user_id, ip_address, user_agent, details)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [jeuneId, action, userId, ipAddress ?? null, userAgent ?? null, details ? JSON.stringify(details) : null],
  )
}
