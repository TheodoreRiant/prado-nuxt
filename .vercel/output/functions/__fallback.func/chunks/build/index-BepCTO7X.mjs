import { a as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, ref, unref, mergeProps, createVNode, resolveDynamicComponent, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrRenderVNode, ssrInterpolate } from 'vue/server-renderer';
import { Loader2, Users, UserCheck, ClipboardList, Clock, Eye } from 'lucide-vue-next';
import { u as useSupabaseClient } from './useSupabaseClient-DN0WJ5wf.mjs';
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
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';
import '@supabase/ssr';
import '@prismicio/client';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSupabaseClient();
    const stats = ref(null);
    const loading = ref(true);
    const statCards = [
      { key: "prescripteursCount", label: "Prescripteurs", icon: Users, color: "#CF006C" },
      { key: "jeunesCount", label: "Jeunes", icon: UserCheck, color: "#FB6223" },
      { key: "inscriptionsCount", label: "Inscriptions", icon: ClipboardList, color: "#93C1AF" },
      { key: "pendingCount", label: "En attente", icon: Clock, color: "#C18ED8" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      if (unref(loading)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center justify-center py-32" }, _attrs))}>`);
        _push(ssrRenderComponent(unref(Loader2), {
          class: "animate-spin text-prado-text-muted",
          size: 32
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-6xl mx-auto space-y-8" }, _attrs))}><h1 class="text-xl font-semibold text-prado-text italic">Tableau de bord</h1><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"><!--[-->`);
        ssrRenderList(statCards, ({ key, label, icon: Icon, color }) => {
          _push(`<div class="bg-prado-surface rounded-2xl border border-prado-border p-5 flex items-center gap-4"><div class="w-11 h-11 rounded-xl flex items-center justify-center" style="${ssrRenderStyle({ backgroundColor: `${color}20` })}">`);
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(Icon), {
            size: 20,
            style: { color }
          }, null), _parent);
          _push(`</div><div><p class="text-2xl font-semibold text-prado-text">${ssrInterpolate(unref(stats) ? unref(stats)[key] : "-")}</p><p class="text-xs text-prado-text-muted">${ssrInterpolate(label)}</p></div></div>`);
        });
        _push(`<!--]--></div><div class="flex flex-wrap gap-3">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin/prescripteurs",
          class: "inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C18ED8] text-white text-sm hover:opacity-90 transition-opacity"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Eye), { size: 16 }, null, _parent2, _scopeId));
              _push2(` Voir les comptes en attente `);
            } else {
              return [
                createVNode(unref(Eye), { size: 16 }),
                createTextVNode(" Voir les comptes en attente ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BepCTO7X.mjs.map
