import { defineComponent, ref, mergeProps, unref, createVNode, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderVNode } from 'vue/server-renderer';
import { Send, Mail, Heart, Facebook, Instagram, Linkedin, Youtube } from 'lucide-vue-next';

const inputClass = "w-full px-4 py-2.5 rounded-xl bg-prado-surface border border-prado-border text-prado-text placeholder:text-prado-text-faint focus:outline-none focus:border-prado-border-medium";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "contact",
  __ssrInlineRender: true,
  setup(__props) {
    const form = ref({ name: "", email: "", subject: "", message: "" });
    const newsletter = ref("");
    const socialIcons = [Facebook, Instagram, Linkedin, Youtube];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-7xl mx-auto px-6 py-14" }, _attrs))}><div class="mb-12"><p class="text-[#FB6223] text-sm mb-2 tracking-wide">Nous ecrire</p><h1 class="text-4xl text-prado-text italic mb-3" style="${ssrRenderStyle({ fontFamily: "Poppins" })}">Contact</h1><p class="text-prado-text-muted max-w-lg">Une question, une demande de partenariat ? N&#39;hesitez pas.</p></div><div class="grid grid-cols-1 lg:grid-cols-3 gap-10"><div class="lg:col-span-2"><form class="space-y-4"><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label class="text-sm text-prado-text-secondary mb-1.5 block">Nom complet</label><input${ssrRenderAttr("value", unref(form).name)} required class="${ssrRenderClass(inputClass)}" placeholder="Votre nom"></div><div><label class="text-sm text-prado-text-secondary mb-1.5 block">Email</label><input${ssrRenderAttr("value", unref(form).email)} type="email" required class="${ssrRenderClass(inputClass)}" placeholder="votre@email.fr"></div></div><div><label class="text-sm text-prado-text-secondary mb-1.5 block">Sujet</label><input${ssrRenderAttr("value", unref(form).subject)} required class="${ssrRenderClass(inputClass)}" placeholder="Objet"></div><div><label class="text-sm text-prado-text-secondary mb-1.5 block">Message</label><textarea required${ssrRenderAttr("rows", 5)} class="w-full px-4 py-2.5 rounded-xl bg-prado-surface border border-prado-border text-prado-text placeholder:text-prado-text-faint resize-none focus:outline-none focus:border-prado-border-medium" placeholder="Votre message...">${ssrInterpolate(unref(form).message)}</textarea></div><button type="submit" class="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#CF006C] text-white hover:bg-[#a80057] transition-colors">`);
      _push(ssrRenderComponent(unref(Send), { size: 15 }, null, _parent));
      _push(` Envoyer </button></form></div><div class="space-y-5"><div class="bg-prado-surface rounded-2xl p-6 border border-prado-border"><h3 class="text-prado-text mb-3 flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(Mail), {
        size: 16,
        class: "text-[#FB6223]"
      }, null, _parent));
      _push(` Newsletter</h3><p class="text-sm text-prado-text-muted mb-3">Recevez nos actualites.</p><form class="flex gap-2"><input${ssrRenderAttr("value", unref(newsletter))} type="email" required class="flex-1 px-3 py-2 rounded-full bg-prado-input-bg border border-prado-border text-prado-text text-sm placeholder:text-prado-text-faint focus:outline-none" placeholder="votre@email.fr"><button type="submit" class="px-4 py-2 rounded-full bg-[#FB6223] text-white text-sm hover:bg-[#e5571f]">OK</button></form></div><div class="bg-prado-surface rounded-2xl p-6 border border-prado-border"><h3 class="text-prado-text mb-3">S&#39;engager</h3><div class="space-y-2"><a href="#" class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#93C1AF] text-white text-sm hover:bg-[#7dab98] transition-colors w-full">`);
      _push(ssrRenderComponent(unref(Heart), { size: 14 }, null, _parent));
      _push(` Devenir benevole </a><a href="#" class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#FB6223] text-white text-sm hover:bg-[#e5571f] transition-colors w-full">`);
      _push(ssrRenderComponent(unref(Heart), { size: 14 }, null, _parent));
      _push(` Faire un don </a></div></div><div class="bg-prado-surface rounded-2xl p-6 border border-prado-border"><h3 class="text-prado-text mb-3">Reseaux sociaux</h3><div class="flex gap-2"><!--[-->`);
      ssrRenderList(socialIcons, (Icon, i) => {
        _push(`<a href="#" class="w-10 h-10 rounded-full bg-prado-tag-bg text-prado-text-muted flex items-center justify-center hover:bg-[#CF006C] hover:text-white transition-colors">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(Icon), { size: 16 }, null), _parent);
        _push(`</a>`);
      });
      _push(`<!--]--></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contact.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=contact-CGnv1shO.mjs.map
