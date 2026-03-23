import { e as defineNuxtRouteMiddleware, f as useSupabaseUser, n as navigateTo } from './server.mjs';
import 'vue';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import '@supabase/ssr';
import '@prismicio/client';

const auth = defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser();
  if (!user.value) {
    return navigateTo("/connexion");
  }
});

export { auth as default };
//# sourceMappingURL=auth-CE65BOSf.mjs.map
