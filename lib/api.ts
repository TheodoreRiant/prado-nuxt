import type { SupabaseClient } from '@supabase/supabase-js';

// ─── Types ───

export interface Prescripteur {
  id: string;
  name: string;
  professionalEmail: string;
  structure: string;
  structureId: string | null;
  phone: string | null;
  role: 'prescripteur' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
}

export interface Jeune {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  postalCode: string;
  city: string;
  situation: string;
  notes: string;
  identityVerified: boolean;
}

export interface Inscription {
  id: string;
  actionId: string;
  actionDateId: string | null;
  jeuneId: string;
  date: string;
}

export interface ActionDate {
  id: string;
  actionId: number;
  date: string;
  time: string;
  placesMax: number | null;
  inscriptionsCount: number;
  placesRemaining: number | null;
}

// ─── Mappers ───

const toJeune = (row: any): Jeune => ({
  id: row.id,
  firstName: row.first_name,
  lastName: row.last_name,
  dateOfBirth: row.date_of_birth,
  address: row.address,
  postalCode: row.postal_code ?? '',
  city: row.city ?? '',
  situation: row.situation,
  notes: row.notes ?? '',
  identityVerified: row.identity_verified ?? false,
});

const toInscription = (row: any): Inscription => ({
  id: row.id,
  actionId: row.action_id,
  actionDateId: row.action_date_id ?? null,
  jeuneId: row.jeune_id,
  date: row.date,
});

// ─── Prescripteur ───

export async function fetchPrescripteur(client: SupabaseClient, userId: string): Promise<Prescripteur | null> {
  const { data, error } = await client.from('prescripteurs').select('*').eq('id', userId).single();
  if (error || !data) return null;
  return {
    id: data.id, name: data.name, professionalEmail: data.professional_email,
    structure: data.structure, structureId: data.structure_id ?? null,
    phone: data.phone, role: data.role, status: data.status,
  };
}

// ─── Jeunes ───

export async function fetchJeunes(client: SupabaseClient): Promise<Jeune[]> {
  const { data, error } = await client.from('jeunes').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(toJeune);
}

export async function createJeune(client: SupabaseClient, prescripteurId: string, jeune: Omit<Jeune, 'id'>, structureId: string | null): Promise<Jeune> {
  const { data, error } = await client.from('jeunes').insert({
    prescripteur_id: prescripteurId, structure_id: structureId,
    first_name: jeune.firstName, last_name: jeune.lastName,
    date_of_birth: jeune.dateOfBirth, address: jeune.address, postal_code: jeune.postalCode ?? '', city: jeune.city ?? '', situation: jeune.situation,
  }).select().single();
  if (error) throw new Error(error.message);
  return toJeune(data);
}

export async function deleteJeune(client: SupabaseClient, id: string): Promise<void> {
  const { error } = await client.from('jeunes').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function updateJeune(_client: SupabaseClient, id: string, data: Partial<Omit<Jeune, 'id'>>): Promise<Jeune> {
  try {
    const row = await $fetch(`/api/jeunes/${id}`, {
      method: 'PUT',
      body: data,
    });
    return toJeune(row);
  } catch (err: any) {
    throw new Error(err.data?.message ?? 'Erreur lors de la mise à jour');
  }
}

// ─── Inscriptions ───

export async function fetchInscriptions(client: SupabaseClient): Promise<Inscription[]> {
  const { data, error } = await client.from('inscriptions').select('*').is('canceled_at', null).order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(toInscription);
}

export async function createInscription(client: SupabaseClient, prescripteurId: string, actionId: string, actionDateId: string | null, jeuneId: string): Promise<Inscription> {
  // Check capacity on the specific action_date (if provided)
  if (actionDateId) {
    const { data: actionDate, error: adError } = await client
      .from('action_dates')
      .select('places_max')
      .eq('id', actionDateId)
      .single();
    if (adError || !actionDate) {
      throw new Error('Date introuvable');
    }

    const placesMax = typeof actionDate.places_max === 'number' ? actionDate.places_max : null;
    if (placesMax !== null) {
      const { count, error: countError } = await client
        .from('inscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('action_date_id', actionDateId)
        .is('canceled_at', null);
      if (countError) throw new Error(countError.message);
      if ((count ?? 0) >= placesMax) {
        throw new Error('Cette date est complète');
      }
    }
  }

  const insertData: Record<string, unknown> = {
    prescripteur_id: prescripteurId, jeune_id: jeuneId, action_id: actionId,
  };
  if (actionDateId) insertData.action_date_id = actionDateId;

  const { data, error } = await client.from('inscriptions').insert(insertData).select().single();
  if (error) throw new Error(error.message);
  return toInscription(data);
}

export async function cancelInscription(client: SupabaseClient, id: string): Promise<void> {
  const { error } = await client.from('inscriptions').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ─── Actions (from Supabase, still used for inscriptions) ───

export interface DbAction {
  id: number;
  title: string;
  category: string;
  date: string;
  time: string;
  summary: string;
  description: string;
  url_detail: string;
  url_image: string;
  is_activite: boolean;
  is_published: boolean;
}

export interface DbActionWithPlaces extends DbAction {
  places_max: number | null;
  archived_at: string | null;
  inscriptionsCount: number;
  placesRemaining: number | null;
  dates: ActionDate[];
  isTermine: boolean;
  nextDate: string | null;
}

export async function fetchPublicActions(client: SupabaseClient): Promise<DbAction[]> {
  const { data, error } = await client.from('actions').select('*').eq('is_published', true).order('id', { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export interface DbRessource {
  id: number;
  title: string;
  category: string;
  description: string;
  url: string;
  image: string;
  is_published: boolean;
}

export async function fetchPublicRessources(client: SupabaseClient): Promise<DbRessource[]> {
  const { data, error } = await client.from('ressources').select('*').eq('is_published', true).order('id', { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}
