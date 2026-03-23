import { e as defineNuxtRouteMiddleware, n as navigateTo } from './server.mjs';
import { u as useAuth } from './useAuth-BKQTxiv8.mjs';
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
import './useSupabaseClient-DN0WJ5wf.mjs';

const admin = defineNuxtRouteMiddleware(async () => {
  const { user, isAdmin } = useAuth();
  if (!user.value || !isAdmin.value) {
    return navigateTo("/connexion");
  }
});

export { admin as default };
//# sourceMappingURL=admin-DXJ2XlhL.mjs.map
