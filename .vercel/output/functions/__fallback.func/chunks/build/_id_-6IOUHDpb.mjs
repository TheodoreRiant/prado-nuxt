import { d as useRoute, a as __nuxt_component_0$1 } from './server.mjs';
import { _ as _sfc_main$1 } from './ImageWithFallback-Bk7PjeIe.mjs';
import { defineComponent, ref, computed, unref, mergeProps, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { Loader2, ArrowLeft, ExternalLink } from 'lucide-vue-next';
import { b as RESSOURCE_CATEGORY_COLORS } from './categories-CkRLgUIL.mjs';
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
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    useSupabaseClient();
    const ressource = ref(null);
    const loading = ref(true);
    const color = computed(
      () => ressource.value ? RESSOURCE_CATEGORY_COLORS[ressource.value.category] : "#CF006C"
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_ImageWithFallback = _sfc_main$1;
      if (unref(loading)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center justify-center py-32" }, _attrs))}>`);
        _push(ssrRenderComponent(unref(Loader2), {
          class: "animate-spin text-prado-text-muted",
          size: 32
        }, null, _parent));
        _push(`</div>`);
      } else if (!unref(ressource)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-7xl mx-auto px-6 py-20 text-center" }, _attrs))}><h1 class="text-2xl text-prado-text">Ressource non trouvee</h1>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/actions",
          class: "text-[#FB6223] mt-4 inline-block"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Retour a la programmation`);
            } else {
              return [
                createTextVNode("Retour a la programmation")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-4xl mx-auto px-6 py-10" }, _attrs))}>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/actions",
          class: "inline-flex items-center gap-2 text-prado-text-muted hover:text-[#FB6223] mb-8 transition-colors text-sm"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ArrowLeft), { size: 15 }, null, _parent2, _scopeId));
              _push2(` Retour aux ressources `);
            } else {
              return [
                createVNode(unref(ArrowLeft), { size: 15 }),
                createTextVNode(" Retour aux ressources ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="rounded-2xl overflow-hidden mb-8 bg-prado-surface flex items-center justify-center p-8">`);
        _push(ssrRenderComponent(_component_ImageWithFallback, {
          src: unref(ressource).image,
          alt: unref(ressource).title,
          class: "max-h-72 object-contain"
        }, null, _parent));
        _push(`</div><div class="flex flex-wrap gap-2 mb-4"><span class="px-3 py-1 rounded-full text-xs text-white" style="${ssrRenderStyle({ backgroundColor: unref(color) })}">${ssrInterpolate(unref(ressource).category)}</span></div><h1 class="text-3xl text-prado-text mb-4" style="${ssrRenderStyle({ fontFamily: "Poppins" })}">${ssrInterpolate(unref(ressource).title)}</h1><p class="text-prado-text-muted mb-8 leading-relaxed text-lg">${ssrInterpolate(unref(ressource).description)}</p><a${ssrRenderAttr("href", unref(ressource).url)} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#CF006C] text-white hover:bg-[#a80057] transition-colors">`);
        _push(ssrRenderComponent(unref(ExternalLink), { size: 16 }, null, _parent));
        _push(` Acceder a la ressource </a></div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/ressources/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-6IOUHDpb.mjs.map
