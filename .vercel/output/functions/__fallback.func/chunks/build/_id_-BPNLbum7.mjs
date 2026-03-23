import { d as useRoute, a as __nuxt_component_0$1 } from './server.mjs';
import { _ as _sfc_main$1 } from './ImageWithFallback-Bk7PjeIe.mjs';
import { defineComponent, ref, computed, unref, mergeProps, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
import { Loader2, ArrowLeft, Calendar, Clock, ExternalLink } from 'lucide-vue-next';
import { P as PROGRAMMATION_CATEGORY_COLORS } from './categories-CkRLgUIL.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-DN0WJ5wf.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    useSupabaseClient();
    const { user, jeunes, inscriptions } = useAuth();
    const showInscription = ref(false);
    const action = ref(null);
    const loading = ref(true);
    const color = computed(
      () => action.value ? PROGRAMMATION_CATEGORY_COLORS[action.value.category] : "#CF006C"
    );
    const actionInscriptions = computed(
      () => inscriptions.value.filter((i) => {
        var _a;
        return i.actionId === String((_a = action.value) == null ? void 0 : _a.id);
      })
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
      } else if (!unref(action)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-7xl mx-auto px-6 py-20 text-center" }, _attrs))}><h1 class="text-2xl text-prado-text">Action non trouvee</h1>`);
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
              _push2(` Retour a la programmation `);
            } else {
              return [
                createVNode(unref(ArrowLeft), { size: 15 }),
                createTextVNode(" Retour a la programmation ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="rounded-2xl overflow-hidden mb-8 bg-prado-surface">`);
        _push(ssrRenderComponent(_component_ImageWithFallback, {
          src: unref(action).url_image,
          alt: unref(action).title,
          class: "w-full h-64 md:h-80 object-cover"
        }, null, _parent));
        _push(`</div><div class="flex flex-wrap gap-2 mb-4"><span class="px-3 py-1 rounded-full text-xs text-white" style="${ssrRenderStyle({ backgroundColor: unref(color) })}">${ssrInterpolate(unref(action).category)}</span>`);
        if (!unref(action).is_activite) {
          _push(`<span class="px-3 py-1 rounded-full text-xs bg-prado-tag-bg text-prado-text">Toute l&#39;annee</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><h1 class="text-3xl text-prado-text mb-4" style="${ssrRenderStyle({ fontFamily: "Poppins" })}">${ssrInterpolate(unref(action).title)}</h1><p class="text-prado-text-muted mb-8 leading-relaxed">${ssrInterpolate(unref(action).description)}</p><div class="bg-prado-surface rounded-2xl p-6 border border-prado-border space-y-3 mb-10"><h3 class="text-prado-text mb-1">Informations pratiques</h3><div class="flex items-center gap-2.5 text-sm text-prado-text-muted">`);
        _push(ssrRenderComponent(unref(Calendar), {
          size: 15,
          class: "text-[#FB6223] shrink-0"
        }, null, _parent));
        _push(`<span>${ssrInterpolate(unref(action).is_activite ? unref(action).date : "Toute l'annee - a organiser avec le prescripteur")}</span></div>`);
        if (unref(action).time) {
          _push(`<div class="flex items-center gap-2.5 text-sm text-prado-text-muted">`);
          _push(ssrRenderComponent(unref(Clock), {
            size: 15,
            class: "text-[#93C1AF] shrink-0"
          }, null, _parent));
          _push(`<span>${ssrInterpolate(unref(action).time)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="mt-3"><a${ssrRenderAttr("href", unref(action).url_detail)} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-sm text-[#FB6223] hover:underline">`);
        _push(ssrRenderComponent(unref(ExternalLink), { size: 14 }, null, _parent));
        _push(` Voir sur le site Prado Itineraires </a></div></div>`);
        if (unref(user)) {
          _push(`<div class="bg-prado-surface border border-prado-border rounded-2xl p-6"><h2 class="text-xl text-prado-text mb-4">Inscrire un jeune</h2>`);
          if (!unref(action).is_activite) {
            _push(`<p class="text-sm text-prado-text-muted"> Action sur mesure. `);
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: "/contact",
              class: "text-[#FB6223] underline"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`Contactez-nous`);
                } else {
                  return [
                    createTextVNode("Contactez-nous")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push(` pour programmer une session. </p>`);
          } else {
            _push(`<!--[-->`);
            if (!unref(showInscription)) {
              _push(`<button class="px-6 py-2.5 rounded-full bg-[#CF006C] text-white text-sm hover:bg-[#a80057] transition-colors"> Inscrire un jeune </button>`);
            } else {
              _push(`<div class="space-y-3"><p class="text-sm text-prado-text-muted">Selectionnez un jeune :</p>`);
              if (unref(jeunes).length === 0) {
                _push(`<p class="text-sm text-prado-text-muted"> Aucune fiche jeune. `);
                _push(ssrRenderComponent(_component_NuxtLink, {
                  to: "/mon-compte",
                  class: "text-[#FB6223] underline"
                }, {
                  default: withCtx((_, _push2, _parent2, _scopeId) => {
                    if (_push2) {
                      _push2(`Creer une fiche`);
                    } else {
                      return [
                        createTextVNode("Creer une fiche")
                      ];
                    }
                  }),
                  _: 1
                }, _parent));
                _push(`</p>`);
              } else {
                _push(`<div class="space-y-2"><!--[-->`);
                ssrRenderList(unref(jeunes), (j) => {
                  _push(`<div class="flex items-center justify-between p-3 rounded-xl bg-prado-input-bg"><span class="text-sm text-prado-text">${ssrInterpolate(j.firstName)} ${ssrInterpolate(j.lastName)}</span>`);
                  if (unref(inscriptions).find((i) => i.actionId === String(unref(action).id) && i.jeuneId === j.id)) {
                    _push(`<button class="text-xs px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20"> Desinscrire </button>`);
                  } else {
                    _push(`<button class="text-xs px-3 py-1.5 rounded-full bg-[#CF006C] text-white hover:bg-[#a80057]"> Inscrire </button>`);
                  }
                  _push(`</div>`);
                });
                _push(`<!--]--></div>`);
              }
              _push(`<button class="text-sm text-prado-text-faint underline">Fermer</button></div>`);
            }
            _push(`<!--]-->`);
          }
          if (unref(actionInscriptions).length > 0) {
            _push(`<div class="mt-4 pt-4 border-t border-prado-border"><h4 class="text-sm text-prado-text-secondary mb-2">Inscrits (${ssrInterpolate(unref(actionInscriptions).length)})</h4><!--[-->`);
            ssrRenderList(unref(actionInscriptions), (insc) => {
              _push(`<!--[-->`);
              if (unref(jeunes).find((j) => j.id === insc.jeuneId)) {
                _push(`<span class="inline-block mr-2 mb-1 px-3 py-1 rounded-full text-xs bg-[#93C1AF]/15 text-[#93C1AF]">${ssrInterpolate(unref(jeunes).find((j) => j.id === insc.jeuneId).firstName)} ${ssrInterpolate(unref(jeunes).find((j) => j.id === insc.jeuneId).lastName)}</span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`<!--]-->`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<div class="bg-prado-surface border border-prado-border rounded-2xl p-8 text-center"><p class="text-prado-text-muted mb-4">Connectez-vous pour inscrire des jeunes.</p>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/connexion",
            class: "px-6 py-2.5 rounded-full bg-[#CF006C] text-white text-sm hover:bg-[#a80057] transition-colors"
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
          _push(`</div>`);
        }
        _push(`</div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/actions/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-BPNLbum7.mjs.map
