import { a as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, withCtx, createTextVNode, createVNode, resolveDynamicComponent, unref, openBlock, createBlock, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrRenderVNode, ssrInterpolate } from 'vue/server-renderer';
import { Users, Truck, Heart, BookOpen, ArrowRight } from 'lucide-vue-next';
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
    const IMAGES = {
      hero: "https://images.unsplash.com/photo-1773270196888-0cdacb07edae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3V0aCUyMHdvcmtzaG9wJTIwZWR1Y2F0aW9uJTIwZ3JvdXB8ZW58MXx8fHwxNzc0Mjc0NTEzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      foodtruck: "https://images.unsplash.com/photo-1612208176815-e132bcf971b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwdHJ1Y2slMjBzdHJlZXQlMjB1cmJhbnxlbnwxfHx8fDE3NzQyNzQ1MTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      team: "https://images.unsplash.com/photo-1722643882339-7a6c9cb080db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwc29jaWFsJTIwd29ya2VycyUyMG1lZXRpbmd8ZW58MXx8fHwxNzc0Mjc0NTE0fDA&ixlib=rb-4.1.0&q=80&w=1080"
    };
    const mockActualites = [
      {
        id: "1",
        title: "Lancement de la nouvelle programmation printemps 2026",
        excerpt: "Decouvrez les nouvelles actions proposees pour le printemps ! Ateliers creatifs, stages pro, escape games...",
        date: "2026-03-15",
        image: IMAGES.hero
      },
      {
        id: "2",
        title: "Le Foodtruck fait sa tournee de printemps",
        excerpt: "Retrouvez notre foodtruck solidaire dans les quartiers de la metropole lyonnaise avec un nouveau menu.",
        date: "2026-03-10",
        image: IMAGES.foodtruck
      },
      {
        id: "3",
        title: "Retour sur la Fresque de la Protection de l'Enfance",
        excerpt: "Plus de 50 professionnels ont participe a la derniere session. Un succes qui confirme le besoin de sensibilisation.",
        date: "2026-03-01",
        image: IMAGES.team
      }
    ];
    const partners = [
      "Metropole de Lyon",
      "Fondation du Prado",
      "Departement du Rhone",
      "Mission Locale",
      "CAF du Rhone",
      "DDETS du Rhone"
    ];
    const pillars = [
      { icon: Users, title: "Jeunes & Autonomes", desc: "Programmation d'actions pour les 12-21 ans en parcours d'insertion", color: "#CF006C", to: "/actions" },
      { icon: Truck, title: "Foodtruck Solidaire", desc: "Creer du lien et former les jeunes aux metiers de la restauration", color: "#FB6223", to: "/foodtruck" },
      { icon: Heart, title: "Fresque PDE", desc: "Sensibiliser aux enjeux de la protection de l'enfance", color: "#C18ED8", to: "/fresque" },
      { icon: BookOpen, title: "Educolab", desc: "Renforcement des competences parentales et programmes educatifs", color: "#93C1AF", to: "/educolab" }
    ];
    const stats = [
      { n: "500+", l: "Jeunes accompagnes", c: "#CF006C" },
      { n: "80+", l: "Actions par an", c: "#FB6223" },
      { n: "50+", l: "Partenaires", c: "#C18ED8" },
      { n: "15", l: "Annees d'experience", c: "#93C1AF" }
    ];
    function formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><section class="relative overflow-hidden"><div class="max-w-7xl mx-auto px-6 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"><div><p class="text-[#FB6223] text-sm mb-4 tracking-wide">Remobilisation des jeunes en vulnerabilite -- Lyon</p><h1 class="text-4xl md:text-5xl lg:text-[3.4rem] text-prado-text mb-6 italic" style="${ssrRenderStyle({ lineHeight: 1.1, fontFamily: "Poppins" })}"> Construisons ensemble l&#39;avenir des <span class="text-[#FB6223]">jeunes</span> grace a nos actions </h1><p class="text-prado-text-muted text-lg mb-10 max-w-lg leading-relaxed"> Actions culturelles et educatives pour les 12-21 ans, portees par Prado Itineraires, association de la Fondation du Prado. </p><div class="flex flex-wrap gap-3">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/connexion",
        class: "px-7 py-3 rounded-full border border-prado-border-medium text-prado-text hover:bg-prado-surface-hover transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Se connecter `);
          } else {
            return [
              createTextVNode(" Se connecter ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/connexion?mode=register",
        class: "px-7 py-3 rounded-full bg-[#CF006C] text-white hover:bg-[#CF006C]/90 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Creer un compte `);
          } else {
            return [
              createTextVNode(" Creer un compte ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="relative hidden lg:block"><div class="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/30"><img${ssrRenderAttr("src", IMAGES.hero)} alt="Jeunes en atelier" class="w-full h-[400px] object-cover"><div class="absolute inset-0 bg-gradient-to-t from-prado-bg/40 to-transparent"></div></div><div class="absolute -bottom-4 -left-6 bg-[#CF006C] text-white px-4 py-2 rounded-full text-sm shadow-lg"> 500+ jeunes accompagnes </div><div class="absolute -top-3 -right-4 bg-[#93C1AF] text-white px-4 py-2 rounded-full text-sm shadow-lg"> 80+ actions / an </div></div></div></section><section class="py-20 bg-prado-bg-deep"><div class="max-w-7xl mx-auto px-6"><p class="text-[#FB6223] text-sm mb-2 tracking-wide text-center">Nos domaines d&#39;action</p><h2 class="text-3xl md:text-4xl text-prado-text text-center mb-12 italic" style="${ssrRenderStyle({ fontFamily: "Poppins" })}">Quatre leviers pour l&#39;insertion</h2><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"><!--[-->`);
      ssrRenderList(pillars, (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.title,
          to: item.to,
          class: "group bg-prado-surface rounded-2xl p-6 hover:brightness-110 transition-all duration-300 border border-prado-border hover:border-prado-border-light"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style="${ssrRenderStyle({ backgroundColor: item.color + "20" })}"${_scopeId}>`);
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(item.icon), {
                size: 20,
                style: { color: item.color }
              }, null), _parent2, _scopeId);
              _push2(`</div><h3 class="text-prado-text mb-2"${_scopeId}>${ssrInterpolate(item.title)}</h3><p class="text-sm text-prado-text-muted leading-relaxed"${_scopeId}>${ssrInterpolate(item.desc)}</p><span class="inline-flex items-center gap-1 text-sm mt-4 group-hover:gap-2 transition-all" style="${ssrRenderStyle({ color: item.color })}"${_scopeId}> Decouvrir `);
              _push2(ssrRenderComponent(unref(ArrowRight), { size: 13 }, null, _parent2, _scopeId));
              _push2(`</span>`);
            } else {
              return [
                createVNode("div", {
                  class: "w-11 h-11 rounded-xl flex items-center justify-center mb-4",
                  style: { backgroundColor: item.color + "20" }
                }, [
                  (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                    size: 20,
                    style: { color: item.color }
                  }, null, 8, ["style"]))
                ], 4),
                createVNode("h3", { class: "text-prado-text mb-2" }, toDisplayString(item.title), 1),
                createVNode("p", { class: "text-sm text-prado-text-muted leading-relaxed" }, toDisplayString(item.desc), 1),
                createVNode("span", {
                  class: "inline-flex items-center gap-1 text-sm mt-4 group-hover:gap-2 transition-all",
                  style: { color: item.color }
                }, [
                  createTextVNode(" Decouvrir "),
                  createVNode(unref(ArrowRight), { size: 13 })
                ], 4)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div></section><section class="py-20"><div class="max-w-7xl mx-auto px-6"><div class="flex items-end justify-between mb-10"><div><p class="text-[#FB6223] text-sm mb-2 tracking-wide">Dernieres nouvelles</p><h2 class="text-3xl text-prado-text italic" style="${ssrRenderStyle({ fontFamily: "Poppins" })}">Actualites</h2></div></div><div class="grid grid-cols-1 md:grid-cols-3 gap-5"><!--[-->`);
      ssrRenderList(mockActualites, (actu) => {
        _push(`<div class="bg-prado-surface rounded-2xl overflow-hidden border border-prado-border hover:border-prado-border-light transition-all group"><div class="relative h-44 overflow-hidden"><img${ssrRenderAttr("src", actu.image)}${ssrRenderAttr("alt", actu.title)} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"><div class="absolute inset-0 bg-gradient-to-t from-prado-surface to-transparent"></div></div><div class="p-5"><p class="text-xs text-[#FB6223] mb-2">${ssrInterpolate(formatDate(actu.date))}</p><h3 class="text-prado-text mb-2">${ssrInterpolate(actu.title)}</h3><p class="text-sm text-prado-text-muted">${ssrInterpolate(actu.excerpt)}</p></div></div>`);
      });
      _push(`<!--]--></div></div></section><section class="py-16 bg-prado-bg-deep"><div class="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"><!--[-->`);
      ssrRenderList(stats, (s) => {
        _push(`<div><div class="text-3xl md:text-4xl mb-1" style="${ssrRenderStyle({ color: s.c, fontFamily: "Poppins" })}">${ssrInterpolate(s.n)}</div><div class="text-xs text-prado-text-muted">${ssrInterpolate(s.l)}</div></div>`);
      });
      _push(`<!--]--></div></section><section class="py-16"><div class="max-w-7xl mx-auto px-6 text-center"><p class="text-[#FB6223] text-sm mb-2 tracking-wide">Ils nous font confiance</p><h2 class="text-2xl text-prado-text italic mb-10" style="${ssrRenderStyle({ fontFamily: "Poppins" })}">Nos partenaires</h2><div class="flex flex-wrap justify-center gap-4"><!--[-->`);
      ssrRenderList(partners, (p) => {
        _push(`<div class="px-6 py-3 bg-prado-surface rounded-full text-prado-text-muted text-sm border border-prado-border">${ssrInterpolate(p)}</div>`);
      });
      _push(`<!--]--></div></div></section><section class="py-16 bg-gradient-to-r from-[#CF006C] to-[#FB6223]"><div class="max-w-3xl mx-auto px-6 text-center"><h2 class="text-3xl text-white mb-4 italic" style="${ssrRenderStyle({ fontFamily: "Poppins" })}">Vous etes prescripteur ?</h2><p class="text-white/80 mb-8">Creez votre compte pour inscrire les jeunes que vous accompagnez a nos actions culturelles et educatives.</p><div class="flex justify-center gap-3">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/actions",
        class: "px-7 py-3 rounded-full bg-white text-[#1a1a2e] hover:bg-white/90 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Voir les actions `);
          } else {
            return [
              createTextVNode(" Voir les actions ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/connexion?mode=register",
        class: "px-7 py-3 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Creer un compte `);
          } else {
            return [
              createTextVNode(" Creer un compte ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DMak5mwM.mjs.map
