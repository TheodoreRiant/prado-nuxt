import { d as useRoute, a as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, resolveDynamicComponent, openBlock, createBlock, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrRenderVNode, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { LayoutDashboard, Users, ClipboardList, LogOut, X, Menu } from 'lucide-vue-next';
import { Toaster } from 'vue-sonner';
import { u as useAuth } from './useAuth-BKQTxiv8.mjs';
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
import './useSupabaseClient-DN0WJ5wf.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
    const { user } = useAuth();
    const route = useRoute();
    const sidebarOpen = ref(false);
    const navItems = [
      { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
      { to: "/admin/prescripteurs", label: "Prescripteurs", icon: Users, exact: false },
      { to: "/admin/inscriptions", label: "Inscriptions", icon: ClipboardList, exact: false }
    ];
    function isNavActive(to, exact) {
      if (exact) return route.path === to;
      return route.path.startsWith(to);
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex bg-prado-bg" }, _attrs))}>`);
      _push(ssrRenderComponent(unref(Toaster), {
        position: "top-right",
        "rich-colors": ""
      }, null, _parent));
      if (unref(sidebarOpen)) {
        _push(`<div class="fixed inset-0 z-30 bg-black/40 lg:hidden"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<aside class="${ssrRenderClass([
        "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-prado-surface",
        "border-r border-prado-border flex flex-col",
        "transform transition-transform duration-200",
        unref(sidebarOpen) ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      ])}"><div class="h-16 flex items-center px-6 border-b border-prado-border"><span class="text-prado-text font-semibold tracking-wide text-sm"> Administration Prado </span></div><nav class="flex-1 py-4 px-3 space-y-1"><!--[-->`);
      ssrRenderList(navItems, (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.to,
          to: item.to,
          class: [
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
            isNavActive(item.to, item.exact) ? "bg-[#CF006C] text-white" : "text-prado-text-secondary hover:text-prado-text hover:bg-prado-surface-hover"
          ],
          onClick: ($event) => sidebarOpen.value = false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(item.icon), { size: 18 }, null), _parent2, _scopeId);
              _push2(`<span${_scopeId}>${ssrInterpolate(item.label)}</span>`);
            } else {
              return [
                (openBlock(), createBlock(resolveDynamicComponent(item.icon), { size: 18 })),
                createVNode("span", null, toDisplayString(item.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav><div class="p-4 border-t border-prado-border"><button class="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm text-prado-text-muted hover:text-red-400 hover:bg-prado-surface-hover transition-colors">`);
      _push(ssrRenderComponent(unref(LogOut), { size: 18 }, null, _parent));
      _push(`<span>Deconnexion</span></button></div></aside><div class="flex-1 flex flex-col min-w-0"><header class="h-16 flex items-center justify-between px-6 border-b border-prado-border bg-prado-surface"><button class="lg:hidden p-2 rounded-lg text-prado-text hover:bg-prado-surface-hover">`);
      if (unref(sidebarOpen)) {
        _push(ssrRenderComponent(unref(X), { size: 20 }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Menu), { size: 20 }, null, _parent));
      }
      _push(`</button><div class="hidden lg:block text-sm text-prado-text-secondary"> Administration Prado </div><div class="flex items-center gap-4"><span class="text-sm text-prado-text">${ssrInterpolate((_a = unref(user)) == null ? void 0 : _a.name)}</span><button class="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs text-prado-text-muted hover:text-red-400 border border-prado-border hover:border-red-400/30 transition-colors">`);
      _push(ssrRenderComponent(unref(LogOut), { size: 14 }, null, _parent));
      _push(` Quitter </button></div></header><main class="flex-1 p-6 overflow-auto">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=admin-sR1CGO4j.mjs.map
