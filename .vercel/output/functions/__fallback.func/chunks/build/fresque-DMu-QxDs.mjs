import { _ as _sfc_main$1 } from './ImageWithFallback-Bk7PjeIe.mjs';
import { a as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, createVNode, resolveDynamicComponent, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrRenderVNode, ssrInterpolate } from 'vue/server-renderer';
import { BookOpen, Lightbulb, Shield, Users, Clock, Calendar, Mail, Phone } from 'lucide-vue-next';
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
  __name: "fresque",
  __ssrInlineRender: true,
  setup(__props) {
    const sessions = [
      { date: "15 avril 2026", version: "Pro & etudiants", lieu: "Locaux Prado, Lyon 7e", duree: "3h00", places: "8/32" },
      { date: "22 mai 2026", version: "Grand public", lieu: "Mairie du 3e, Lyon", duree: "2h30", places: "4/8" },
      { date: "10 juin 2026", version: "Pro & etudiants", lieu: "Espace Confluence, Lyon 2e", duree: "3h00", places: "3/32" }
    ];
    const parcours = [
      { nom: "Adele, 4 ans", desc: "Situe le champ de la petite enfance", color: "#C18ED8" },
      { nom: "Lucas, 13 ans", desc: "Plonge dans les enjeux de la protection judiciaire de la jeunesse", color: "#FB6223" },
      { nom: "Maelys, 17 ans", desc: "Situe les problematiques du passage a l'age adulte et des troubles psychosociaux", color: "#93C1AF" }
    ];
    const objectives = [
      { icon: BookOpen, label: "Culture commune", desc: "Entre professionnels et partenaires" },
      { icon: Lightbulb, label: "Pouvoir d'agir", desc: "Reveler les vocations" },
      { icon: Shield, label: "Un seul parti pris", desc: "Les enfants sont vulnerables" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ImageWithFallback = _sfc_main$1;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="relative h-[45vh] min-h-[340px] flex items-end"><div class="absolute inset-0">`);
      _push(ssrRenderComponent(_component_ImageWithFallback, {
        src: "/images/fresque.png",
        alt: "Atelier Fresque de la Protection de l'Enfance",
        class: "w-full h-full object-cover"
      }, null, _parent));
      _push(`<div class="absolute inset-0 bg-gradient-to-t from-prado-bg via-prado-bg/70 to-transparent"></div></div><div class="relative z-10 max-w-7xl mx-auto px-6 pb-12 w-full"><p class="text-[#C18ED8] text-sm mb-3 tracking-widest uppercase">Atelier pedagogique et collaboratif</p><h1 class="text-3xl md:text-4xl lg:text-5xl text-prado-text mb-3" style="${ssrRenderStyle({ fontFamily: "Poppins", lineHeight: 1.1 })}"> La Fresque de la Protection de l&#39;Enfance </h1><p class="text-prado-text-muted text-lg max-w-2xl"> Decouvrir les acteurs, les parcours et les enjeux de la protection de l&#39;enfance </p></div></div><div class="max-w-7xl mx-auto px-6 py-16"><div class="grid grid-cols-1 lg:grid-cols-5 gap-12"><div class="lg:col-span-3 space-y-6"><h2 class="text-2xl md:text-3xl text-prado-text" style="${ssrRenderStyle({ fontFamily: "Poppins" })}"> Une experience immersive et collaborative </h2><p class="text-prado-text-muted leading-relaxed"> Inspiree de la Fresque du climat, la Fresque de la Protection de l&#39;Enfance met en scene les parcours de trois jeunes qui donnent a voir la complexite du systeme de protection de l&#39;enfance et la diversite des dispositifs et metiers existants. </p><p class="text-prado-text-muted leading-relaxed"> Combinant jeu, echanges et reflexion commune, elle permet de mieux comprendre les parcours des enfants et la complexite du systeme qui les entoure. Pas a pas, la reconstitution esquisse une vision globale du systeme, que les participants s&#39;approprient en relevant les liens entre les acteurs et les institutions. </p><p class="text-prado-text-muted text-sm italic border-l-2 border-[#C18ED8] pl-4"> &quot;C&#39;est un outil pedagogique interessant pour eclairer les parcours de jeunes et rendre lisible la complexite du systeme de protection. Les scenarios sont bien construits et pertinents.&quot; <span class="block mt-1 not-italic text-prado-text-faint">-- Remi P., Chef de service en prevention specialisee</span></p><div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4"><!--[-->`);
      ssrRenderList(objectives, (item) => {
        _push(`<div class="bg-prado-surface rounded-2xl p-5 border border-prado-border">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.icon), {
          size: 22,
          class: "text-[#C18ED8] mb-3"
        }, null), _parent);
        _push(`<div class="text-prado-text text-sm mb-1">${ssrInterpolate(item.label)}</div><div class="text-prado-text-muted text-xs">${ssrInterpolate(item.desc)}</div></div>`);
      });
      _push(`<!--]--></div></div><div class="lg:col-span-2 space-y-4"><h3 class="text-lg text-prado-text mb-2" style="${ssrRenderStyle({ fontFamily: "Poppins" })}"> 3 parcours de vie </h3><p class="text-prado-text-muted text-sm mb-4"> Des premieres annees jusqu&#39;au passage a l&#39;age adulte, ces parcours, nourris de temoignages reels, nous plongent au coeur des besoins concrets du terrain. </p><!--[-->`);
      ssrRenderList(parcours, (p) => {
        _push(`<div class="bg-prado-surface rounded-2xl p-5 border border-prado-border"><div class="flex items-center gap-3 mb-2"><span class="w-2.5 h-2.5 rounded-full" style="${ssrRenderStyle({ backgroundColor: p.color })}"></span><span class="text-prado-text font-medium text-sm">${ssrInterpolate(p.nom)}</span></div><p class="text-prado-text-muted text-sm pl-5.5">${ssrInterpolate(p.desc)}</p></div>`);
      });
      _push(`<!--]--><div class="bg-[#C18ED8]/10 rounded-2xl p-5 border border-prado-border mt-4"><p class="text-prado-text-muted text-sm leading-relaxed"> Des cartes &quot;mots-cles&quot; et &quot;complements d&#39;info&quot; enrichissent les echanges. Une riche bibliographie (rapports publics, referentiels, videos, emissions radio) est mise a disposition. </p></div></div></div></div><div class="h-px bg-prado-border max-w-7xl mx-auto"></div><div class="max-w-7xl mx-auto px-6 py-16"><h2 class="text-2xl text-prado-text mb-8 text-center" style="${ssrRenderStyle({ fontFamily: "Poppins" })}"> Deux formats d&#39;animation </h2><div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16"><div class="bg-prado-surface rounded-2xl p-6 border border-[#C18ED8]/20"><div class="flex items-center gap-3 mb-4"><div class="w-10 h-10 rounded-full bg-[#C18ED8]/15 flex items-center justify-center">`);
      _push(ssrRenderComponent(unref(Users), {
        size: 18,
        class: "text-[#C18ED8]"
      }, null, _parent));
      _push(`</div><h3 class="text-prado-text text-lg">Pro &amp; etudiants</h3></div><div class="space-y-2 text-sm mb-4"><div class="flex items-center gap-2 text-prado-text-muted">`);
      _push(ssrRenderComponent(unref(Clock), {
        size: 14,
        class: "text-[#C18ED8]"
      }, null, _parent));
      _push(` <span>3h00</span></div><div class="flex items-center gap-2 text-prado-text-muted">`);
      _push(ssrRenderComponent(unref(Users), {
        size: 14,
        class: "text-[#C18ED8]"
      }, null, _parent));
      _push(` <span>Jusqu&#39;a 32 participants</span></div></div><p class="text-prado-text-muted text-sm"> Organisee au sein des structures, la fresque devient un puissant outil de teambuilding et d&#39;interconnaissance, adaptee aux professionnels de l&#39;ASE, de l&#39;Education nationale, du secteur associatif, sportif ou culturel. </p></div><div class="bg-prado-surface rounded-2xl p-6 border border-[#FB6223]/20"><div class="flex items-center gap-3 mb-4"><div class="w-10 h-10 rounded-full bg-[#FB6223]/15 flex items-center justify-center">`);
      _push(ssrRenderComponent(unref(Users), {
        size: 18,
        class: "text-[#FB6223]"
      }, null, _parent));
      _push(`</div><h3 class="text-prado-text text-lg">Grand public</h3></div><div class="space-y-2 text-sm mb-4"><div class="flex items-center gap-2 text-prado-text-muted">`);
      _push(ssrRenderComponent(unref(Clock), {
        size: 14,
        class: "text-[#FB6223]"
      }, null, _parent));
      _push(` <span>2h30</span></div><div class="flex items-center gap-2 text-prado-text-muted">`);
      _push(ssrRenderComponent(unref(Users), {
        size: 14,
        class: "text-[#FB6223]"
      }, null, _parent));
      _push(` <span>4 a 8 participants par groupe</span></div></div><p class="text-prado-text-muted text-sm"> Ouverte a toutes et tous lors de sessions grand public. Un moment pour apprendre, partager et imaginer ensemble de nouvelles pistes d&#39;action, au service de la protection des enfants. </p></div></div><div class="h-px bg-prado-border max-w-5xl mx-auto mb-16"></div><h2 class="text-2xl text-prado-text mb-6 flex items-center gap-2.5" style="${ssrRenderStyle({ fontFamily: "Poppins" })}">`);
      _push(ssrRenderComponent(unref(Calendar), {
        size: 20,
        class: "text-[#C18ED8]"
      }, null, _parent));
      _push(` Prochaines sessions </h2><div class="space-y-3 mb-16"><!--[-->`);
      ssrRenderList(sessions, (s) => {
        _push(`<div class="flex flex-col sm:flex-row sm:items-center justify-between bg-prado-surface rounded-2xl p-5 border border-prado-border gap-3"><div><div class="text-prado-text">${ssrInterpolate(s.date)} -- <span class="text-[#C18ED8]">${ssrInterpolate(s.version)}</span></div><div class="text-sm text-prado-text-muted">${ssrInterpolate(s.lieu)}</div></div><div class="flex items-center gap-4"><span class="text-xs text-prado-text-faint flex items-center gap-1">`);
        _push(ssrRenderComponent(unref(Clock), { size: 12 }, null, _parent));
        _push(` ${ssrInterpolate(s.duree)}</span><span class="text-xs text-prado-text-faint flex items-center gap-1">`);
        _push(ssrRenderComponent(unref(Users), { size: 12 }, null, _parent));
        _push(` ${ssrInterpolate(s.places)}</span>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/contact",
          class: "px-5 py-2 rounded-full bg-[#C18ED8] text-white text-sm hover:bg-[#a870c0] transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` S&#39;inscrire `);
            } else {
              return [
                createTextVNode(" S'inscrire ")
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div></div>`);
      });
      _push(`<!--]--></div><div class="h-px bg-prado-border max-w-5xl mx-auto mb-16"></div><div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto"><div class="bg-[#C18ED8]/10 rounded-2xl p-6 border border-prado-border"><h3 class="text-prado-text mb-3">Organiser une session sur devis</h3><p class="text-sm text-prado-text-muted mb-4"> Contactez notre equipe pour organiser une Fresque dans votre structure, association ou collectivite. </p><div class="space-y-2"><div class="flex items-center gap-2 text-sm text-[#C18ED8]">`);
      _push(ssrRenderComponent(unref(Mail), { size: 14 }, null, _parent));
      _push(` <span>itineraires@le-prado.fr</span></div><div class="flex items-center gap-2 text-sm text-[#C18ED8]">`);
      _push(ssrRenderComponent(unref(Phone), { size: 14 }, null, _parent));
      _push(` <span>06 15 50 80 21</span></div></div></div><div class="bg-prado-surface rounded-2xl p-6 border border-prado-border flex flex-col justify-between"><div><h3 class="text-prado-text mb-2">Prado Itineraires</h3><p class="text-sm text-prado-text-muted mb-4"> 11 rue du Pere Chevrier<br>69007 Lyon </p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/contact",
        class: "inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#C18ED8] text-white text-sm hover:bg-[#a870c0] transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Nous contacter `);
          } else {
            return [
              createTextVNode(" Nous contacter ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/fresque.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=fresque-DMu-QxDs.mjs.map
