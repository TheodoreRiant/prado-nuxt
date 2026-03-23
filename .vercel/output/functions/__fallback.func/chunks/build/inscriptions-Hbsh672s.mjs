import { defineComponent, ref, unref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { Loader2, Download } from 'lucide-vue-next';
import { u as useSupabaseClient } from './useSupabaseClient-DN0WJ5wf.mjs';
import './server.mjs';
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
  __name: "inscriptions",
  __ssrInlineRender: true,
  setup(__props) {
    useSupabaseClient();
    const inscriptions = ref([]);
    const actionsMap = ref({});
    const loading = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(loading)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center justify-center py-32" }, _attrs))}>`);
        _push(ssrRenderComponent(unref(Loader2), {
          class: "animate-spin text-prado-text-muted",
          size: 32
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-6xl mx-auto space-y-6" }, _attrs))}><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><h1 class="text-xl font-semibold text-prado-text italic">Inscriptions</h1><button class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#004657] text-white text-sm hover:opacity-90 transition-opacity">`);
        _push(ssrRenderComponent(unref(Download), { size: 16 }, null, _parent));
        _push(` Exporter CSV </button></div><div class="bg-prado-surface rounded-2xl border border-prado-border overflow-hidden"><div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="border-b border-prado-border"><th class="text-left px-4 py-3 text-prado-text-secondary font-medium">Jeune</th><th class="text-left px-4 py-3 text-prado-text-secondary font-medium">Action</th><th class="text-left px-4 py-3 text-prado-text-secondary font-medium hidden md:table-cell">Prescripteur</th><th class="text-left px-4 py-3 text-prado-text-secondary font-medium hidden lg:table-cell">Date</th></tr></thead><tbody><!--[-->`);
        ssrRenderList(unref(inscriptions), (i) => {
          var _a, _b, _c;
          _push(`<tr class="border-b border-prado-border last:border-0 hover:bg-prado-surface-hover"><td class="px-4 py-3 text-prado-text">${ssrInterpolate(i.jeunes ? `${i.jeunes.first_name} ${i.jeunes.last_name}` : "-")}</td><td class="px-4 py-3 text-prado-text">${ssrInterpolate((_a = unref(actionsMap)[i.action_id]) != null ? _a : i.action_id)}</td><td class="px-4 py-3 text-prado-text-secondary hidden md:table-cell">${ssrInterpolate((_c = (_b = i.prescripteurs) == null ? void 0 : _b.name) != null ? _c : "-")}</td><td class="px-4 py-3 text-prado-text-muted hidden lg:table-cell">${ssrInterpolate(new Date(i.created_at).toLocaleDateString("fr-FR"))}</td></tr>`);
        });
        _push(`<!--]-->`);
        if (unref(inscriptions).length === 0) {
          _push(`<tr><td colspan="4" class="px-4 py-8 text-center text-prado-text-muted"> Aucune inscription trouvee </td></tr>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</tbody></table></div></div></div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/inscriptions.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=inscriptions-Hbsh672s.mjs.map
