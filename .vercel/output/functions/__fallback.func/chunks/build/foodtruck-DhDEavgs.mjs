import { _ as _sfc_main$1 } from './ImageWithFallback-Bk7PjeIe.mjs';
import { a as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, createVNode, resolveDynamicComponent, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrRenderVNode, ssrInterpolate } from 'vue/server-renderer';
import { ChefHat, Users, Heart, Utensils, Phone, MapPin } from 'lucide-vue-next';
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
  __name: "foodtruck",
  __ssrInlineRender: true,
  setup(__props) {
    const tournee = [
      {
        jour: "Mardi",
        details: [
          { lieu: "Siege de Lyon Metropole Habitat (Lyon 3e)", precision: "1er mardi du mois" },
          { lieu: "Green Campus Park (Venissieux)", precision: "Les autres mardis" }
        ]
      },
      {
        jour: "Mercredi",
        details: [
          { lieu: "Parc Neuville Industries", precision: "En alternance" },
          { lieu: "Les Cles de l'Atelier (La Mulatiere)", precision: "1er mercredi du mois" }
        ]
      },
      {
        jour: "Jeudi",
        details: [
          { lieu: "Centre de Formation Simon Rousseau (Fontaines-sur-Saone)", precision: "En alternance" },
          { lieu: "Centre de Formation Arfrips (Lyon Vaise)", precision: "En alternance" },
          { lieu: "Direction Generale (Fontaines-Saint-Martin)", precision: "En alternance" }
        ]
      }
    ];
    const highlights = [
      { icon: ChefHat, label: "Stage d'une semaine", desc: "Cuisine & vente" },
      { icon: Users, label: "Accompagnement", desc: "Educateur specialise" },
      { icon: Heart, label: "Solidaire", desc: "Distributions gratuites" }
    ];
    const plats = [
      { name: "Choucroute traditionnelle", desc: "Choucroute, pomme de terre, saucisse de Strasbourg, poitrine fumee, saucisse fumee et roti de porc" },
      { name: "Choucroute de la mer", desc: "Choucroute, pomme de terre, haddock, crevette, moule et filet de poisson (selon arrivage)" },
      { name: "Choucroute vegetarienne", desc: "Choucroute, pomme de terre, tofu fume, navet et courge rotis" }
    ];
    const desserts = [
      { name: "Salade de fruits de saison", desc: "Jus de citron et fruits de saison" },
      { name: "Strudel a la pomme", desc: "Pate feuilletee, pomme, raisins secs, cannelle, sucre glace, amandes" }
    ];
    const steps = [
      { step: "01", title: "Le prescripteur nous contacte", desc: "Par telephone ou via le formulaire de contact pour convenir d'une semaine de stage.", color: "#FB6223" },
      { step: "02", title: "Validation et preparation", desc: "Un entretien est organise avec le jeune et son referent pour preparer le stage.", color: "#CF006C" },
      { step: "03", title: "Semaine de stage", desc: "Le jeune integre l'equipe pendant une semaine : cuisine, vente, relation client.", color: "#93C1AF" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ImageWithFallback = _sfc_main$1;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="relative h-[50vh] min-h-[380px] flex items-end"><div class="absolute inset-0">`);
      _push(ssrRenderComponent(_component_ImageWithFallback, {
        src: "/images/foodtruck.png",
        alt: "Les Saveurs d'Elise - Foodtruck solidaire",
        class: "w-full h-full object-cover"
      }, null, _parent));
      _push(`<div class="absolute inset-0 bg-gradient-to-t from-prado-bg via-prado-bg/70 to-transparent"></div></div><div class="relative z-10 max-w-7xl mx-auto px-6 pb-12 w-full"><p class="text-[#FB6223] text-sm mb-3 tracking-widest uppercase">Foodtruck solidaire</p><h1 class="text-4xl md:text-5xl lg:text-6xl text-prado-text mb-3" style="${ssrRenderStyle({ fontFamily: "Poppins", lineHeight: 1.1 })}"> Les Saveurs d&#39;Elise </h1><p class="text-prado-text-muted text-lg md:text-xl max-w-lg">Apprendre &amp; Regaler !</p></div></div><div class="max-w-7xl mx-auto px-6 py-16"><div class="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start"><div class="lg:col-span-3 space-y-6"><h2 class="text-2xl md:text-3xl text-prado-text" style="${ssrRenderStyle({ fontFamily: "Poppins" })}">Notre projet</h2><p class="text-prado-text-muted leading-relaxed text-base"> Concept pedagogique et inclusif, &quot;Les Saveurs d&#39;Elise&quot; est une offre de restauration mobile qui favorise l&#39;insertion socio-professionnelle des jeunes : accueillis en stage pendant une semaine dans la cuisine centrale et/ou en vente directe au public, les jeunes experimentent, rencontrent, se valorisent, tout en etant accompagnes par un educateur specialise. </p><p class="text-prado-text-muted leading-relaxed text-base"> Notre menu, de saison et peu cher, est une invitation a la rencontre avec nos jeunes cuisiniers d&#39;un jour et des distributions solidaires sont organisees en marge de l&#39;activite principale. </p><p class="text-prado-text-muted text-sm italic border-l-2 border-[#FB6223] pl-4"> Ce projet inclusif et solidaire est co-porte par le territoire Rhone et Saone de Prado Education et Prado Itineraires. </p><div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4"><!--[-->`);
      ssrRenderList(highlights, (item) => {
        _push(`<div class="bg-prado-surface rounded-2xl p-5 border border-prado-border">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.icon), {
          size: 22,
          class: "text-[#FB6223] mb-3"
        }, null), _parent);
        _push(`<div class="text-prado-text text-sm mb-1">${ssrInterpolate(item.label)}</div><div class="text-prado-text-muted text-xs">${ssrInterpolate(item.desc)}</div></div>`);
      });
      _push(`<!--]--></div></div><div class="lg:col-span-2 rounded-2xl overflow-hidden">`);
      _push(ssrRenderComponent(_component_ImageWithFallback, {
        src: "/images/foodtruck-cuisine.png",
        alt: "Jeunes en stage cuisine dans le foodtruck",
        class: "w-full h-full object-cover aspect-[4/5]"
      }, null, _parent));
      _push(`</div></div></div><div class="h-px bg-prado-border max-w-7xl mx-auto"></div><div class="max-w-7xl mx-auto px-6 py-16"><div class="grid grid-cols-1 lg:grid-cols-2 gap-12"><div><h2 class="text-2xl text-prado-text mb-2 flex items-center gap-2.5" style="${ssrRenderStyle({ fontFamily: "Poppins" })}">`);
      _push(ssrRenderComponent(unref(Utensils), {
        size: 22,
        class: "text-[#FB6223]"
      }, null, _parent));
      _push(` Menu du mois </h2><p class="text-prado-text-muted text-sm mb-6">Menu de saison, a prix reduit. Mis a jour chaque mois.</p><div class="bg-prado-surface rounded-2xl border border-prado-border p-6 space-y-5"><p class="text-center text-prado-text-secondary italic text-sm mb-4">&quot;D&#39;Lieb geht durich de Maawe&quot;</p><div><h4 class="text-xs uppercase tracking-wider text-[#FB6223] mb-2">Entree</h4><div class="bg-prado-bg rounded-xl p-3"><p class="text-prado-text text-sm">Carottes rappees</p><p class="text-prado-text-faint text-xs">Carottes, jus de citron et vinaigrette</p></div></div><div><h4 class="text-xs uppercase tracking-wider text-[#FB6223] mb-2">Plats</h4><div class="space-y-2"><!--[-->`);
      ssrRenderList(plats, (p) => {
        _push(`<div class="bg-prado-bg rounded-xl p-3"><p class="text-prado-text text-sm">${ssrInterpolate(p.name)}</p><p class="text-prado-text-faint text-xs">${ssrInterpolate(p.desc)}</p></div>`);
      });
      _push(`<!--]--></div></div><div><h4 class="text-xs uppercase tracking-wider text-[#FB6223] mb-2">Desserts</h4><div class="space-y-2"><!--[-->`);
      ssrRenderList(desserts, (d) => {
        _push(`<div class="bg-prado-bg rounded-xl p-3"><p class="text-prado-text text-sm">${ssrInterpolate(d.name)}</p><p class="text-prado-text-faint text-xs">${ssrInterpolate(d.desc)}</p></div>`);
      });
      _push(`<!--]--></div></div><div class="border-t border-prado-border pt-4"><h4 class="text-xs uppercase tracking-wider text-[#93C1AF] mb-3">Tarifs</h4><div class="grid grid-cols-2 gap-3"><div class="bg-prado-bg rounded-xl p-4 text-center"><p class="text-[#93C1AF] text-xs uppercase tracking-wider mb-1">Prix solidaire</p><div class="space-y-1 text-sm"><p class="text-prado-text">Menu : <span class="text-[#FB6223]">9</span></p><p class="text-prado-text">Plat seul : <span class="text-[#FB6223]">6</span></p><p class="text-prado-text">Dessert/Entree : <span class="text-[#FB6223]">3</span></p></div></div><div class="bg-prado-bg rounded-xl p-4 text-center"><p class="text-prado-text-muted text-xs uppercase tracking-wider mb-1">Tarif normal</p><div class="space-y-1 text-sm"><p class="text-prado-text">Menu : <span class="text-[#FB6223]">13</span></p><p class="text-prado-text">Plat : <span class="text-[#FB6223]">8</span></p><p class="text-prado-text">Dessert/Entree : <span class="text-[#FB6223]">3</span></p></div></div></div><p class="text-prado-text-faint text-xs text-center mt-3">Boisson gratuite et a volonte</p></div></div><div class="bg-gradient-to-r from-[#FB6223]/10 to-[#CF006C]/5 rounded-2xl p-5 border border-prado-border mt-6 flex items-start gap-4">`);
      _push(ssrRenderComponent(unref(Phone), {
        size: 18,
        class: "text-[#FB6223] mt-0.5 shrink-0"
      }, null, _parent));
      _push(`<div><p class="text-prado-text text-sm mb-1">Renseignements menus &amp; tournees</p><p class="text-prado-text-muted text-sm">06 24 68 52 04 / 06 81 44 37 13</p></div></div></div><div><h2 class="text-2xl text-prado-text mb-2 flex items-center gap-2.5" style="${ssrRenderStyle({ fontFamily: "Poppins" })}">`);
      _push(ssrRenderComponent(unref(MapPin), {
        size: 22,
        class: "text-[#93C1AF]"
      }, null, _parent));
      _push(` Info tournee </h2><p class="text-prado-text-muted text-sm mb-6">A partir de septembre 2025</p><div class="space-y-4"><!--[-->`);
      ssrRenderList(tournee, (t) => {
        _push(`<div class="bg-prado-surface rounded-2xl border border-prado-border p-5"><div class="flex items-center gap-2 mb-3"><span class="px-3 py-1 rounded-full bg-[#93C1AF]/15 text-[#93C1AF] text-xs font-medium">${ssrInterpolate(t.jour)}</span></div><div class="space-y-2.5"><!--[-->`);
        ssrRenderList(t.details, (d, i) => {
          _push(`<div class="flex items-start gap-3 text-sm"><span class="w-1.5 h-1.5 rounded-full bg-[#FB6223] mt-1.5 shrink-0"></span><div><span class="text-prado-text">${ssrInterpolate(d.lieu)}</span><span class="text-prado-text-faint ml-2">-- ${ssrInterpolate(d.precision)}</span></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      });
      _push(`<!--]--></div></div></div></div><div class="h-px bg-prado-border max-w-7xl mx-auto"></div><div class="max-w-7xl mx-auto px-6 py-16"><h2 class="text-2xl md:text-3xl text-prado-text mb-3 text-center" style="${ssrRenderStyle({ fontFamily: "Poppins" })}"> Modalites d&#39;inscription </h2><p class="text-prado-text-muted text-center max-w-2xl mx-auto mb-10"> L&#39;inscription au stage foodtruck se fait via un prescripteur (educateur, referent, conseiller mission locale...). </p><div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"><!--[-->`);
      ssrRenderList(steps, (s) => {
        _push(`<div class="bg-prado-surface rounded-2xl p-6 border border-prado-border text-center"><div class="text-3xl mb-4" style="${ssrRenderStyle({ color: s.color, fontFamily: "Poppins" })}">${ssrInterpolate(s.step)}</div><h3 class="text-prado-text text-sm mb-2">${ssrInterpolate(s.title)}</h3><p class="text-prado-text-muted text-xs leading-relaxed">${ssrInterpolate(s.desc)}</p></div>`);
      });
      _push(`<!--]--></div><div class="text-center mt-10 flex flex-wrap justify-center gap-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/contact",
        class: "px-8 py-3.5 rounded-full bg-[#FB6223] text-white hover:bg-[#e5571f] transition-colors"
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
      _push(`<a href="tel:0624685204" class="px-8 py-3.5 rounded-full border border-prado-border-medium text-prado-text hover:bg-prado-surface-hover transition-colors flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(Phone), { size: 16 }, null, _parent));
      _push(` 06 24 68 52 04 </a></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/foodtruck.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=foodtruck-DhDEavgs.mjs.map
