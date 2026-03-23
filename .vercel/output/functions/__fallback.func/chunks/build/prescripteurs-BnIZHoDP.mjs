import { defineComponent, ref, computed, unref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { Loader2, Download, CheckCircle, XCircle } from 'lucide-vue-next';
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
  __name: "prescripteurs",
  __ssrInlineRender: true,
  setup(__props) {
    useSupabaseClient();
    const prescripteurs = ref([]);
    const loading = ref(true);
    const filter = ref("all");
    const tabs = [
      { key: "all", label: "Tous" },
      { key: "pending", label: "En attente" },
      { key: "approved", label: "Approuves" },
      { key: "rejected", label: "Rejetes" }
    ];
    const statusConfig = {
      approved: { label: "Approuve", className: "bg-[#93C1AF]/20 text-[#93C1AF]" },
      pending: { label: "En attente", className: "bg-[#FB6223]/20 text-[#FB6223]" },
      rejected: { label: "Rejete", className: "bg-red-500/20 text-red-400" }
    };
    const filtered = computed(
      () => filter.value === "all" ? prescripteurs.value : prescripteurs.value.filter((p) => p.status === filter.value)
    );
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(loading)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center justify-center py-32" }, _attrs))}>`);
        _push(ssrRenderComponent(unref(Loader2), {
          class: "animate-spin text-prado-text-muted",
          size: 32
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-6xl mx-auto space-y-6" }, _attrs))}><div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><h1 class="text-xl font-semibold text-prado-text italic">Prescripteurs</h1><button class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#004657] text-white text-sm hover:opacity-90 transition-opacity">`);
        _push(ssrRenderComponent(unref(Download), { size: 16 }, null, _parent));
        _push(` Exporter CSV </button></div><div class="flex gap-2 flex-wrap"><!--[-->`);
        ssrRenderList(tabs, ({ key, label }) => {
          _push(`<button class="${ssrRenderClass([
            "px-4 py-1.5 rounded-full text-sm transition-colors",
            unref(filter) === key ? "bg-[#CF006C] text-white" : "bg-prado-tag-bg text-prado-text-secondary hover:text-prado-text"
          ])}">${ssrInterpolate(label)}</button>`);
        });
        _push(`<!--]--></div><div class="bg-prado-surface rounded-2xl border border-prado-border overflow-hidden"><div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="border-b border-prado-border"><th class="text-left px-4 py-3 text-prado-text-secondary font-medium">Nom</th><th class="text-left px-4 py-3 text-prado-text-secondary font-medium hidden md:table-cell">Email</th><th class="text-left px-4 py-3 text-prado-text-secondary font-medium hidden lg:table-cell">Structure</th><th class="text-left px-4 py-3 text-prado-text-secondary font-medium">Statut</th><th class="text-left px-4 py-3 text-prado-text-secondary font-medium hidden lg:table-cell">Role</th><th class="text-left px-4 py-3 text-prado-text-secondary font-medium hidden xl:table-cell">Date</th><th class="text-right px-4 py-3 text-prado-text-secondary font-medium">Actions</th></tr></thead><tbody><!--[-->`);
        ssrRenderList(unref(filtered), (p) => {
          var _a, _b;
          _push(`<tr class="border-b border-prado-border last:border-0 hover:bg-prado-surface-hover"><td class="px-4 py-3 text-prado-text">${ssrInterpolate(p.name)}</td><td class="px-4 py-3 text-prado-text-secondary hidden md:table-cell">${ssrInterpolate(p.professional_email)}</td><td class="px-4 py-3 text-prado-text-secondary hidden lg:table-cell">${ssrInterpolate(p.structure)}</td><td class="px-4 py-3"><span class="${ssrRenderClass(["inline-block px-2.5 py-0.5 rounded-full text-xs", ((_a = statusConfig[p.status]) != null ? _a : statusConfig.pending).className])}">${ssrInterpolate(((_b = statusConfig[p.status]) != null ? _b : statusConfig.pending).label)}</span></td><td class="px-4 py-3 text-prado-text-secondary hidden lg:table-cell">${ssrInterpolate(p.role)}</td><td class="px-4 py-3 text-prado-text-muted hidden xl:table-cell">${ssrInterpolate(new Date(p.created_at).toLocaleDateString("fr-FR"))}</td><td class="px-4 py-3"><div class="flex items-center justify-end gap-2">`);
          if (p.status !== "approved") {
            _push(`<button class="p-1.5 rounded-lg text-[#93C1AF] hover:bg-[#93C1AF]/10 transition-colors" title="Approuver">`);
            _push(ssrRenderComponent(unref(CheckCircle), { size: 16 }, null, _parent));
            _push(`</button>`);
          } else {
            _push(`<!---->`);
          }
          if (p.status !== "rejected") {
            _push(`<button class="p-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors" title="Rejeter">`);
            _push(ssrRenderComponent(unref(XCircle), { size: 16 }, null, _parent));
            _push(`</button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></td></tr>`);
        });
        _push(`<!--]-->`);
        if (unref(filtered).length === 0) {
          _push(`<tr><td colspan="7" class="px-4 py-8 text-center text-prado-text-muted"> Aucun prescripteur trouve </td></tr>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/prescripteurs.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=prescripteurs-BnIZHoDP.mjs.map
