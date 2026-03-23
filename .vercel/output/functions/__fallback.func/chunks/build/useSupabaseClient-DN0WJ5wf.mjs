import { h as useNuxtApp } from './server.mjs';

const useSupabaseClient = () => {
  return useNuxtApp().$supabase.client;
};

export { useSupabaseClient as u };
//# sourceMappingURL=useSupabaseClient-DN0WJ5wf.mjs.map
