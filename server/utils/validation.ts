import { z } from 'zod'
import type { H3Event } from 'h3'

// ─── Helpers ───

/**
 * Validate the request body against a Zod schema.
 * Returns the parsed data or throws a 400 error with details.
 */
export async function validateBody<T extends z.ZodTypeAny>(
  event: H3Event,
  schema: T,
): Promise<z.infer<T>> {
  const body = await readBody(event)
  const result = schema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; '),
    })
  }
  return result.data
}

// ─── Jeune ───

export const jeuneCreateSchema = z.object({
  firstName: z.string().min(1, 'Prenom requis').max(100),
  lastName: z.string().min(1, 'Nom requis').max(100),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format date invalide (AAAA-MM-JJ)'),
  situation: z.enum(['sans_emploi', 'scolarise_ordinaire', 'scolarise_medico_social', 'emploi_formation', 'autre']),
  notes: z.string().max(2000).optional().default(''),
  sex: z.enum(['homme', 'femme']),
  isQpv: z.boolean().optional().default(false),
  accompagnementType: z.array(z.string().max(100)).optional().default([]),
})

export const jeuneUpdateSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format date invalide').optional(),
  situation: z.enum(['sans_emploi', 'scolarise_ordinaire', 'scolarise_medico_social', 'emploi_formation', 'autre']).optional(),
  notes: z.string().max(2000).optional(),
  sex: z.enum(['homme', 'femme']).optional(),
  isQpv: z.boolean().optional(),
  accompagnementType: z.array(z.string().max(100)).optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'Au moins un champ a mettre a jour',
})

// ─── Inscription ───

export const inscriptionCreateSchema = z.object({
  actionId: z.union([z.string(), z.number()]),
  actionDateId: z.string().uuid().nullable().optional(),
  jeuneId: z.string().uuid(),
  accompagnateurPresent: z.boolean().optional().default(false),
  nomsAccompagnateurs: z.string().max(500).optional(),
  personneUrgenceNom: z.string().max(200).optional(),
  personneUrgenceTel: z.string().max(20).optional(),
  attestationResponsabilite: z.boolean().optional().default(false),
})

export const inscriptionBatchSchema = z.object({
  actionId: z.union([z.string(), z.number()]),
  jeuneIds: z.array(z.string().uuid()).min(1, 'Au moins un jeune requis').max(50),
  accompagnateurPresent: z.boolean().optional().default(false),
  nomsAccompagnateurs: z.string().max(500).optional(),
})

// ─── Presence ───

export const presenceBatchSchema = z.object({
  inscriptionIds: z.array(z.string().uuid()).min(1, 'Au moins une inscription requise').max(200),
  presence: z.enum(['present', 'absent']),
})

// ─── Action ───

export const actionPatchSchema = z.object({
  id: z.number({ required_error: 'id requis' }),
  places_max: z.number().int().min(0).nullable().optional(),
  archived_at: z.string().nullable().optional(),
  cost: z.number().min(0).nullable().optional(),
  is_recurring: z.boolean().optional(),
  etablissement_id: z.string().uuid().nullable().optional(),
  dates: z.array(z.object({
    id: z.string().optional(),
    date: z.string().optional(),
    time: z.string().optional(),
    places_max: z.number().int().min(0).nullable().optional(),
    _delete: z.boolean().optional(),
  })).optional(),
})

export const actionDuplicateSchema = z.object({
  sourceId: z.number({ required_error: 'sourceId requis' }),
})

export const actionRecurringSchema = z.object({
  baseAction: z.object({
    title: z.string().min(1, 'Titre requis').max(300),
    category: z.string().max(200).optional().default(''),
    time: z.string().max(20).optional().default(''),
    summary: z.string().max(2000).optional().default(''),
    description: z.string().max(10000).optional().default(''),
    url_detail: z.string().max(500).optional().default(''),
    url_image: z.string().max(500).optional().default(''),
    is_activite: z.boolean().optional().default(true),
    is_published: z.boolean().optional().default(false),
    places_max: z.number().int().min(0).nullable().optional(),
    cost: z.number().min(0).nullable().optional(),
    etablissement_id: z.string().uuid().nullable().optional(),
  }),
  frequency: z.enum(['weekly', 'biweekly', 'monthly']),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format date invalide'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format date invalide'),
}).refine(data => data.startDate < data.endDate, {
  message: 'La date de debut doit etre avant la date de fin',
  path: ['startDate'],
})

// ─── Etablissement ───

export const etablissementCreateSchema = z.object({
  name: z.string().min(1, 'Nom requis').max(200),
  address: z.string().max(500).optional(),
  postalCode: z.string().max(10).optional(),
  city: z.string().max(200).optional(),
})

export const etablissementUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  address: z.string().max(500).optional(),
  postalCode: z.string().max(10).optional(),
  city: z.string().max(200).optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'Au moins un champ a mettre a jour',
})

// ─── Contact ───

export const contactSchema = z.object({
  name: z.string().min(1, 'Nom requis').max(200),
  email: z.string().email('Email invalide').max(254),
  subject: z.string().max(300).optional().default(''),
  message: z.string().min(1, 'Message requis').max(5000),
})

// ─── Newsletter ───

export const newsletterSchema = z.object({
  email: z.string().email('Email invalide').max(254),
  structure: z.string().max(200).optional(),
  source: z.string().max(100).optional(),
})

// ─── Check email ───

export const checkEmailSchema = z.object({
  email: z.string().email('Email invalide').max(254),
})

// ─── Send confirmation ───

export const sendConfirmationSchema = z.object({
  inscriptionId: z.union([z.string(), z.number()]),
})

// ─── Complete profile ───

export const completeProfileSchema = z.object({
  name: z.string().min(1, 'Nom requis').max(200),
  structure_id: z.string().uuid('Structure invalide'),
  fonction: z.string().max(200).optional(),
  phone: z.string().max(30).optional(),
})

// ─── Update profile ───

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Nom requis').max(200),
  structure_id: z.string().uuid('Structure invalide'),
  fonction: z.string().max(200).optional(),
  phone: z.string().max(30).optional(),
})

// ─── Delete account ───

export const deleteAccountSchema = z.object({
  confirmEmail: z.string().email('Email invalide').max(254),
})

// ─── Stats ───

export const statsQuerySchema = z.object({
  year: z.string().regex(/^\d{4}$/, 'Annee invalide').optional(),
})

// ─── Structure (admin) ───

export const structureCreateSchema = z.object({
  name: z.string().min(1, 'Nom requis').max(200).transform(s => s.trim()),
  is_prado: z.boolean().optional(),
  type: z.string().max(200).nullable().optional(),
  postal_code: z.string().max(10).nullable().optional(),
  city: z.string().max(200).nullable().optional(),
})

export const structurePatchSchema = z.object({
  id: z.string().uuid('id invalide'),
  name: z.string().min(1, 'Nom requis').max(200).transform(s => s.trim()),
  is_prado: z.boolean().optional(),
  type: z.string().max(200).nullable().optional(),
  postal_code: z.string().max(10).nullable().optional(),
  city: z.string().max(200).nullable().optional(),
})

export const structureDeleteSchema = z.object({
  id: z.string().uuid('id invalide'),
})

// ─── Prescripteurs (admin) ───

export const prescripteurPatchSchema = z.object({
  id: z.string().uuid('id invalide'),
  status: z.enum(['approved', 'rejected']).optional(),
  role: z.enum(['prescripteur', 'admin']).optional(),
}).refine(data => data.status !== undefined || data.role !== undefined, {
  message: 'Au moins un champ a mettre a jour',
})

// ─── Contact message (admin) ───

export const contactPatchSchema = z.object({
  id: z.union([z.string(), z.number()]),
  is_read: z.boolean(),
})

// ─── Settings (admin) ───

export const settingsPatchSchema = z.object({
  key: z.enum(['email', 'newsletter', 'analytics', 'contact']),
  value: z.record(z.unknown()),
})
