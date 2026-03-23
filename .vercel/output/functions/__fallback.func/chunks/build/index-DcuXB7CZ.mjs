import { a as __nuxt_component_0$1 } from './server.mjs';
import { _ as _sfc_main$1 } from './ImageWithFallback-Bk7PjeIe.mjs';
import { defineComponent, ref, computed, unref, withCtx, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrRenderClass, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { Loader2, Search, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { a as PROGRAMMATION_CATEGORIES, P as PROGRAMMATION_CATEGORY_COLORS, R as RESSOURCE_CATEGORIES, b as RESSOURCE_CATEGORY_COLORS } from './categories-CkRLgUIL.mjs';
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

const ITEMS_PER_PAGE = 12;
const RES_PER_PAGE = 12;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSupabaseClient();
    const panel = ref("actions");
    const search = ref("");
    const categoryFilter = ref("all");
    const filterMode = ref("activite");
    const actionsPage = ref(1);
    const searchRes = ref("");
    const catRes = ref("all");
    const resPage = ref(1);
    ref(null);
    const dbActions = ref([]);
    const dbRessources = ref([]);
    const loadingData = ref(true);
    const programmation = computed(
      () => dbActions.value.map((a) => ({
        id: a.id,
        title: a.title,
        category: a.category,
        date: a.date,
        time: a.time,
        summary: a.summary,
        description: a.description,
        urlDetail: a.url_detail,
        urlImage: a.url_image,
        isActivite: a.is_activite
      }))
    );
    const ressources = computed(
      () => dbRessources.value.map((r) => ({
        id: r.id,
        title: r.title,
        category: r.category,
        description: r.description,
        url: r.url,
        image: r.image
      }))
    );
    const filteredActions = computed(
      () => programmation.value.filter((a) => {
        if (filterMode.value === "activite" && !a.isActivite) return false;
        if (filterMode.value === "actions" && a.isActivite) return false;
        if (categoryFilter.value !== "all" && a.category !== categoryFilter.value) return false;
        if (search.value && !a.title.toLowerCase().includes(search.value.toLowerCase()) && !a.description.toLowerCase().includes(search.value.toLowerCase())) return false;
        return true;
      })
    );
    const actionsTotalPages = computed(() => Math.ceil(filteredActions.value.length / ITEMS_PER_PAGE));
    const paginatedActions = computed(
      () => filteredActions.value.slice((actionsPage.value - 1) * ITEMS_PER_PAGE, actionsPage.value * ITEMS_PER_PAGE)
    );
    const filteredRes = computed(
      () => ressources.value.filter((r) => {
        if (catRes.value !== "all" && r.category !== catRes.value) return false;
        if (searchRes.value && !r.title.toLowerCase().includes(searchRes.value.toLowerCase()) && !r.description.toLowerCase().includes(searchRes.value.toLowerCase())) return false;
        return true;
      })
    );
    const resTotalPages = computed(() => Math.ceil(filteredRes.value.length / RES_PER_PAGE));
    const paginatedRes = computed(
      () => filteredRes.value.slice((resPage.value - 1) * RES_PER_PAGE, resPage.value * RES_PER_PAGE)
    );
    const visibleCategories = computed(
      () => PROGRAMMATION_CATEGORIES.filter(
        (cat) => programmation.value.some((a) => {
          if (filterMode.value === "activite" && !a.isActivite) return false;
          if (filterMode.value === "actions" && a.isActivite) return false;
          return a.category === cat;
        })
      )
    );
    function paginationPages(currentPage, totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2).reduce((acc, p, i, arr) => {
        if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
        acc.push(p);
        return acc;
      }, []);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_ImageWithFallback = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="py-20 md:py-28"><div class="max-w-4xl mx-auto px-6 text-center"><p class="text-prado-text-muted text-sm mb-5 tracking-wide"> Programmation 2025-2026 | 11-25 ans </p><h1 class="text-4xl md:text-5xl lg:text-6xl text-prado-text mb-6" style="${ssrRenderStyle({ fontFamily: "Poppins", lineHeight: 1.15 })}"> Jeunes &amp; Autonomes </h1><p class="text-prado-text-muted max-w-2xl mx-auto mb-10 leading-relaxed"> Des actions socio-educatives pour accompagner les jeunes vers l&#39;autonomie : activites au calendrier, actions sur mesure et ressources pour les professionnels. </p><button class="px-8 py-3.5 rounded-full border border-prado-border-medium text-prado-text hover:bg-prado-surface-hover transition-colors"> Parcourir la programmation </button></div></div><div class="h-px bg-prado-border-light"></div><div class="bg-prado-bg-deep min-h-screen">`);
      if (unref(loadingData)) {
        _push(`<div class="flex items-center justify-center py-20">`);
        _push(ssrRenderComponent(unref(Loader2), {
          class: "animate-spin text-prado-text-muted",
          size: 32
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="max-w-7xl mx-auto px-6 py-14"><div class="flex border-b border-prado-border-light w-full mb-8"><button class="${ssrRenderClass([
          "px-6 py-3 text-sm transition-colors relative",
          unref(panel) === "actions" ? "text-prado-text" : "text-prado-text-muted hover:text-prado-text-secondary"
        ])}"> Actions `);
        if (unref(panel) === "actions") {
          _push(`<span class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#CF006C]"></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button><button class="${ssrRenderClass([
          "px-6 py-3 text-sm transition-colors relative",
          unref(panel) === "ressources" ? "text-prado-text" : "text-prado-text-muted hover:text-prado-text-secondary"
        ])}"> Ressources `);
        if (unref(panel) === "ressources") {
          _push(`<span class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#CF006C]"></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button></div>`);
        if (unref(panel) === "actions") {
          _push(`<div><h2 class="text-3xl md:text-4xl text-prado-text mb-6" style="${ssrRenderStyle({ fontFamily: "Poppins" })}"> Notre programmation </h2><div class="relative mb-8">`);
          _push(ssrRenderComponent(unref(Search), {
            size: 20,
            class: "absolute left-6 top-1/2 -translate-y-1/2 text-prado-text-faint"
          }, null, _parent));
          _push(`<input${ssrRenderAttr("value", unref(search))} placeholder="Rechercher une action..." class="w-full pl-14 pr-6 py-5 rounded-2xl bg-prado-surface border border-prado-border-light text-prado-text text-base placeholder:text-prado-text-faint focus:outline-none focus:border-prado-border-medium shadow-lg"></div><div class="flex flex-wrap gap-3 mb-8 items-center"><div class="flex rounded-full overflow-hidden bg-prado-surface p-1"><button class="${ssrRenderClass([
            "px-5 py-2 rounded-full text-sm transition-colors",
            unref(filterMode) === "activite" ? "bg-[#CF006C] text-white" : "text-prado-text-muted hover:text-prado-text"
          ])}"> Activite </button><button class="${ssrRenderClass([
            "px-5 py-2 rounded-full text-sm transition-colors",
            unref(filterMode) === "actions" ? "bg-[#CF006C] text-white" : "text-prado-text-muted hover:text-prado-text"
          ])}"> Actions </button></div><div class="flex flex-wrap gap-2"><!--[-->`);
          ssrRenderList(unref(visibleCategories), (cat) => {
            _push(`<button class="${ssrRenderClass([
              "px-4 py-2 rounded-full text-sm transition-colors border flex items-center gap-2",
              unref(categoryFilter) === cat ? "text-prado-text border-prado-border-medium" : "text-prado-text-muted border-prado-border hover:text-prado-text-secondary hover:border-prado-border-light"
            ])}" style="${ssrRenderStyle(unref(categoryFilter) === cat ? { backgroundColor: unref(PROGRAMMATION_CATEGORY_COLORS)[cat] + "30", borderColor: unref(PROGRAMMATION_CATEGORY_COLORS)[cat] + "50" } : {})}"><span class="w-2 h-2 rounded-full" style="${ssrRenderStyle({ backgroundColor: unref(PROGRAMMATION_CATEGORY_COLORS)[cat] })}"></span> ${ssrInterpolate(cat)}</button>`);
          });
          _push(`<!--]--></div><span class="text-sm text-prado-text-faint ml-2">${ssrInterpolate(unref(filteredActions).length)} action${ssrInterpolate(unref(filteredActions).length > 1 ? "s" : "")}</span></div>`);
          if (unref(paginatedActions).length > 0) {
            _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
            ssrRenderList(unref(paginatedActions), (a) => {
              _push(ssrRenderComponent(_component_NuxtLink, {
                key: a.id,
                to: `/actions/${a.id}`,
                class: "group block rounded-2xl overflow-hidden bg-prado-surface hover:brightness-105 transition-all duration-300"
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`<div class="relative h-48 overflow-hidden bg-prado-surface"${_scopeId}>`);
                    _push2(ssrRenderComponent(_component_ImageWithFallback, {
                      src: a.urlImage,
                      alt: a.title,
                      class: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    }, null, _parent2, _scopeId));
                    _push2(`<div class="absolute inset-0 bg-gradient-to-t from-prado-surface/60 to-transparent"${_scopeId}></div>`);
                    if (a.isActivite) {
                      _push2(`<div class="absolute top-3 right-3 px-3 py-1.5 rounded-xl text-xs text-white" style="${ssrRenderStyle({ backgroundColor: unref(PROGRAMMATION_CATEGORY_COLORS)[a.category] })}"${_scopeId}>${ssrInterpolate(a.date)}</div>`);
                    } else {
                      _push2(`<div class="absolute top-3 right-3 px-3 py-1.5 rounded-xl text-xs bg-prado-tag-bg backdrop-blur-sm text-prado-text"${_scopeId}> Toute l&#39;annee </div>`);
                    }
                    _push2(`</div><div class="p-5"${_scopeId}><span class="text-xs mb-2 inline-block" style="${ssrRenderStyle({ color: unref(PROGRAMMATION_CATEGORY_COLORS)[a.category] })}"${_scopeId}>${ssrInterpolate(a.category)}</span><h3 class="text-prado-text mb-2 line-clamp-2 group-hover:text-[#93C1AF] transition-colors"${_scopeId}>${ssrInterpolate(a.title)}</h3><p class="text-sm text-prado-text-muted line-clamp-2 mb-3"${_scopeId}>${ssrInterpolate(a.summary)}</p>`);
                    if (a.time) {
                      _push2(`<div class="text-xs text-prado-text-faint"${_scopeId}>${ssrInterpolate(a.time)}</div>`);
                    } else {
                      _push2(`<!---->`);
                    }
                    _push2(`</div>`);
                  } else {
                    return [
                      createVNode("div", { class: "relative h-48 overflow-hidden bg-prado-surface" }, [
                        createVNode(_component_ImageWithFallback, {
                          src: a.urlImage,
                          alt: a.title,
                          class: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        }, null, 8, ["src", "alt"]),
                        createVNode("div", { class: "absolute inset-0 bg-gradient-to-t from-prado-surface/60 to-transparent" }),
                        a.isActivite ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "absolute top-3 right-3 px-3 py-1.5 rounded-xl text-xs text-white",
                          style: { backgroundColor: unref(PROGRAMMATION_CATEGORY_COLORS)[a.category] }
                        }, toDisplayString(a.date), 5)) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "absolute top-3 right-3 px-3 py-1.5 rounded-xl text-xs bg-prado-tag-bg backdrop-blur-sm text-prado-text"
                        }, " Toute l'annee "))
                      ]),
                      createVNode("div", { class: "p-5" }, [
                        createVNode("span", {
                          class: "text-xs mb-2 inline-block",
                          style: { color: unref(PROGRAMMATION_CATEGORY_COLORS)[a.category] }
                        }, toDisplayString(a.category), 5),
                        createVNode("h3", { class: "text-prado-text mb-2 line-clamp-2 group-hover:text-[#93C1AF] transition-colors" }, toDisplayString(a.title), 1),
                        createVNode("p", { class: "text-sm text-prado-text-muted line-clamp-2 mb-3" }, toDisplayString(a.summary), 1),
                        a.time ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "text-xs text-prado-text-faint"
                        }, toDisplayString(a.time), 1)) : createCommentVNode("", true)
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent));
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<div class="text-center py-20 text-prado-text-faint"><p>Aucune action ne correspond a vos criteres.</p></div>`);
          }
          if (unref(actionsTotalPages) > 1) {
            _push(`<div class="flex items-center justify-center gap-2 mt-12"><button${ssrIncludeBooleanAttr(unref(actionsPage) === 1) ? " disabled" : ""} class="p-2 rounded-full text-prado-text-muted hover:text-prado-text hover:bg-prado-surface-hover disabled:opacity-20 disabled:cursor-not-allowed transition-colors">`);
            _push(ssrRenderComponent(unref(ChevronLeft), { size: 20 }, null, _parent));
            _push(`</button><!--[-->`);
            ssrRenderList(paginationPages(unref(actionsPage), unref(actionsTotalPages)), (p, i) => {
              _push(`<!--[-->`);
              if (typeof p === "string") {
                _push(`<span class="text-prado-text-faint px-1">...</span>`);
              } else {
                _push(`<button class="${ssrRenderClass([
                  "w-10 h-10 rounded-full text-sm transition-colors",
                  unref(actionsPage) === p ? "bg-prado-tag-bg text-prado-text" : "text-prado-text-muted hover:text-prado-text hover:bg-prado-surface-hover"
                ])}">${ssrInterpolate(p)}</button>`);
              }
              _push(`<!--]-->`);
            });
            _push(`<!--]--><button${ssrIncludeBooleanAttr(unref(actionsPage) === unref(actionsTotalPages)) ? " disabled" : ""} class="p-2 rounded-full text-prado-text-muted hover:text-prado-text hover:bg-prado-surface-hover disabled:opacity-20 disabled:cursor-not-allowed transition-colors">`);
            _push(ssrRenderComponent(unref(ChevronRight), { size: 20 }, null, _parent));
            _push(`</button></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(panel) === "ressources") {
          _push(`<div><h2 class="text-3xl md:text-4xl text-prado-text mb-6" style="${ssrRenderStyle({ fontFamily: "Poppins" })}"> Ressources pour les referents </h2><div class="relative mb-8">`);
          _push(ssrRenderComponent(unref(Search), {
            size: 20,
            class: "absolute left-6 top-1/2 -translate-y-1/2 text-prado-text-faint"
          }, null, _parent));
          _push(`<input${ssrRenderAttr("value", unref(searchRes))} placeholder="Rechercher une ressource..." class="w-full pl-14 pr-6 py-5 rounded-2xl bg-prado-surface border border-prado-border-light text-prado-text text-base placeholder:text-prado-text-faint focus:outline-none focus:border-prado-border-medium shadow-lg"></div><div class="flex flex-wrap gap-2 mb-8 items-center"><!--[-->`);
          ssrRenderList(unref(RESSOURCE_CATEGORIES), (c) => {
            _push(`<button class="${ssrRenderClass([
              "px-4 py-2 rounded-full text-sm transition-colors border flex items-center gap-2",
              unref(catRes) === c ? "text-prado-text border-prado-border-medium" : "text-prado-text-muted border-prado-border hover:text-prado-text-secondary hover:border-prado-border-light"
            ])}" style="${ssrRenderStyle(unref(catRes) === c ? { backgroundColor: unref(RESSOURCE_CATEGORY_COLORS)[c] + "30", borderColor: unref(RESSOURCE_CATEGORY_COLORS)[c] + "50" } : {})}"><span class="w-2 h-2 rounded-full" style="${ssrRenderStyle({ backgroundColor: unref(RESSOURCE_CATEGORY_COLORS)[c] })}"></span> ${ssrInterpolate(c)}</button>`);
          });
          _push(`<!--]--><span class="text-sm text-prado-text-faint ml-2">${ssrInterpolate(unref(filteredRes).length)} ressource${ssrInterpolate(unref(filteredRes).length > 1 ? "s" : "")}</span></div>`);
          if (unref(paginatedRes).length > 0) {
            _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`);
            ssrRenderList(unref(paginatedRes), (r) => {
              _push(ssrRenderComponent(_component_NuxtLink, {
                key: r.id,
                to: `/ressources/${r.id}`,
                class: "group block rounded-2xl overflow-hidden bg-prado-surface hover:brightness-105 transition-all duration-300"
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`<div class="relative h-44 overflow-hidden bg-prado-surface"${_scopeId}>`);
                    _push2(ssrRenderComponent(_component_ImageWithFallback, {
                      src: r.image,
                      alt: r.title,
                      class: "w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    }, null, _parent2, _scopeId));
                    _push2(`</div><div class="p-5"${_scopeId}><span class="text-xs mb-2 inline-block" style="${ssrRenderStyle({ color: unref(RESSOURCE_CATEGORY_COLORS)[r.category] })}"${_scopeId}>${ssrInterpolate(r.category)}</span><h3 class="text-prado-text mb-2 line-clamp-2 group-hover:text-[#93C1AF] transition-colors"${_scopeId}>${ssrInterpolate(r.title)}</h3><p class="text-sm text-prado-text-muted line-clamp-2"${_scopeId}>${ssrInterpolate(r.description)}</p></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "relative h-44 overflow-hidden bg-prado-surface" }, [
                        createVNode(_component_ImageWithFallback, {
                          src: r.image,
                          alt: r.title,
                          class: "w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        }, null, 8, ["src", "alt"])
                      ]),
                      createVNode("div", { class: "p-5" }, [
                        createVNode("span", {
                          class: "text-xs mb-2 inline-block",
                          style: { color: unref(RESSOURCE_CATEGORY_COLORS)[r.category] }
                        }, toDisplayString(r.category), 5),
                        createVNode("h3", { class: "text-prado-text mb-2 line-clamp-2 group-hover:text-[#93C1AF] transition-colors" }, toDisplayString(r.title), 1),
                        createVNode("p", { class: "text-sm text-prado-text-muted line-clamp-2" }, toDisplayString(r.description), 1)
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent));
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<div class="text-center py-20 text-prado-text-faint"><p>Aucune ressource ne correspond a vos criteres.</p></div>`);
          }
          if (unref(resTotalPages) > 1) {
            _push(`<div class="flex items-center justify-center gap-2 mt-12"><button${ssrIncludeBooleanAttr(unref(resPage) === 1) ? " disabled" : ""} class="p-2 rounded-full text-prado-text-muted hover:text-prado-text hover:bg-prado-surface-hover disabled:opacity-20 disabled:cursor-not-allowed transition-colors">`);
            _push(ssrRenderComponent(unref(ChevronLeft), { size: 20 }, null, _parent));
            _push(`</button><!--[-->`);
            ssrRenderList(paginationPages(unref(resPage), unref(resTotalPages)), (p, i) => {
              _push(`<!--[-->`);
              if (typeof p === "string") {
                _push(`<span class="text-prado-text-faint px-1">...</span>`);
              } else {
                _push(`<button class="${ssrRenderClass([
                  "w-10 h-10 rounded-full text-sm transition-colors",
                  unref(resPage) === p ? "bg-prado-tag-bg text-prado-text" : "text-prado-text-muted hover:text-prado-text hover:bg-prado-surface-hover"
                ])}">${ssrInterpolate(p)}</button>`);
              }
              _push(`<!--]-->`);
            });
            _push(`<!--]--><button${ssrIncludeBooleanAttr(unref(resPage) === unref(resTotalPages)) ? " disabled" : ""} class="p-2 rounded-full text-prado-text-muted hover:text-prado-text hover:bg-prado-surface-hover disabled:opacity-20 disabled:cursor-not-allowed transition-colors">`);
            _push(ssrRenderComponent(unref(ChevronRight), { size: 20 }, null, _parent));
            _push(`</button></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/actions/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DcuXB7CZ.mjs.map
