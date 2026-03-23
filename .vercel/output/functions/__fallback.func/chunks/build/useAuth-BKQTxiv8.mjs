import { u as useSupabaseClient } from './useSupabaseClient-DN0WJ5wf.mjs';
import { f as useSupabaseUser, g as useState } from './server.mjs';
import { computed, watch } from 'vue';

const toJeune = (row) => ({
  id: row.id,
  firstName: row.first_name,
  lastName: row.last_name,
  dateOfBirth: row.date_of_birth,
  address: row.address,
  situation: row.situation
});
const toInscription = (row) => ({
  id: row.id,
  actionId: row.action_id,
  jeuneId: row.jeune_id,
  date: row.date
});
async function fetchPrescripteur(client, userId) {
  const { data, error } = await client.from("prescripteurs").select("*").eq("id", userId).single();
  if (error || !data) return null;
  return {
    id: data.id,
    name: data.name,
    professionalEmail: data.professional_email,
    structure: data.structure,
    phone: data.phone,
    role: data.role,
    status: data.status
  };
}
async function fetchJeunes(client) {
  const { data, error } = await client.from("jeunes").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data != null ? data : []).map(toJeune);
}
async function createJeune(client, prescripteurId, jeune) {
  const { data, error } = await client.from("jeunes").insert({
    prescripteur_id: prescripteurId,
    first_name: jeune.firstName,
    last_name: jeune.lastName,
    date_of_birth: jeune.dateOfBirth,
    address: jeune.address,
    situation: jeune.situation
  }).select().single();
  if (error) throw new Error(error.message);
  return toJeune(data);
}
async function deleteJeune(client, id) {
  const { error } = await client.from("jeunes").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
async function fetchInscriptions(client) {
  const { data, error } = await client.from("inscriptions").select("*").is("canceled_at", null).order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data != null ? data : []).map(toInscription);
}
async function createInscription(client, prescripteurId, actionId, jeuneId) {
  const { data, error } = await client.from("inscriptions").insert({
    prescripteur_id: prescripteurId,
    jeune_id: jeuneId,
    action_id: actionId
  }).select().single();
  if (error) throw new Error(error.message);
  return toInscription(data);
}
async function cancelInscription(client, id) {
  const { error } = await client.from("inscriptions").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
function useAuth() {
  const client = useSupabaseClient();
  const supabaseUser = useSupabaseUser();
  const user = useState("auth-user", () => null);
  const loading = useState("auth-loading", () => true);
  const jeunes = useState("auth-jeunes", () => []);
  const jeunesLoading = useState("auth-jeunes-loading", () => false);
  const inscriptions = useState("auth-inscriptions", () => []);
  const isAdmin = computed(() => {
    var _a;
    return ((_a = user.value) == null ? void 0 : _a.role) === "admin";
  });
  const loadProfile = async (userId, email) => {
    const profile = await fetchPrescripteur(client, userId);
    if (profile) {
      user.value = { id: userId, email, name: profile.name, structure: profile.structure, role: profile.role, status: profile.status };
    }
  };
  const loadData = async () => {
    jeunesLoading.value = true;
    try {
      const [j, i] = await Promise.all([fetchJeunes(client), fetchInscriptions(client)]);
      jeunes.value = j;
      inscriptions.value = i;
    } catch {
    } finally {
      jeunesLoading.value = false;
    }
  };
  const refreshData = async () => {
    await loadData();
  };
  watch(supabaseUser, async (newUser) => {
    var _a;
    if (newUser) {
      await loadProfile(newUser.id, (_a = newUser.email) != null ? _a : "");
      await loadData();
    } else {
      user.value = null;
      jeunes.value = [];
      inscriptions.value = [];
    }
    loading.value = false;
  }, { immediate: true });
  const login = async (email, password) => {
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  };
  const logout = async () => {
    await client.auth.signOut();
    user.value = null;
    jeunes.value = [];
    inscriptions.value = [];
  };
  const register = async (data) => {
    var _a;
    const { error } = await client.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { name: data.name, structure: data.structure, phone: (_a = data.phone) != null ? _a : "" } }
    });
    if (error) return { error: error.message };
    return {};
  };
  const resetPassword = async (email) => {
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${(void 0).location.origin}/connexion?mode=reset`
    });
    if (error) return { error: error.message };
    return {};
  };
  const updatePassword = async (newPassword) => {
    const { error } = await client.auth.updateUser({ password: newPassword });
    if (error) return { error: error.message };
    return {};
  };
  const addJeune = async (j) => {
    if (!supabaseUser.value) return;
    const created = await createJeune(client, supabaseUser.value.id, j);
    jeunes.value = [created, ...jeunes.value];
  };
  const removeJeune = async (id) => {
    await deleteJeune(client, id);
    jeunes.value = jeunes.value.filter((j) => j.id !== id);
    inscriptions.value = inscriptions.value.filter((i) => i.jeuneId !== id);
  };
  const inscrire = async (actionId, jeuneId) => {
    if (!supabaseUser.value) return;
    const created = await createInscription(client, supabaseUser.value.id, actionId, jeuneId);
    inscriptions.value = [created, ...inscriptions.value];
  };
  const desinscrire = async (inscriptionId) => {
    await cancelInscription(client, inscriptionId);
    inscriptions.value = inscriptions.value.filter((i) => i.id !== inscriptionId);
  };
  return {
    user,
    isAdmin,
    loading,
    jeunes,
    jeunesLoading,
    inscriptions,
    login,
    logout,
    register,
    resetPassword,
    updatePassword,
    addJeune,
    removeJeune,
    inscrire,
    desinscrire,
    refreshData
  };
}

export { useAuth as u };
//# sourceMappingURL=useAuth-BKQTxiv8.mjs.map
