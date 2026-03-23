import { a as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, ref, computed, unref, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderList } from 'vue/server-renderer';
import { Loader2, User, Key, LogOut, UserPlus, Trash2, Calendar } from 'lucide-vue-next';
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

const inputClass = "w-full px-3 py-2 rounded-xl bg-prado-input-bg border border-prado-border text-prado-text text-sm focus:outline-none focus:border-prado-border-medium";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "mon-compte",
  __ssrInlineRender: true,
  setup(__props) {
    useSupabaseClient();
    const {
      user,
      loading,
      jeunes,
      jeunesLoading,
      inscriptions
    } = useAuth();
    const showAdd = ref(false);
    const showPassword = ref(false);
    const newJeune = ref({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      address: "",
      situation: ""
    });
    const newPassword = ref("");
    const confirmPassword = ref("");
    const submitting = ref(false);
    const actions = ref([]);
    const isPending = computed(() => {
      var _a;
      return ((_a = user.value) == null ? void 0 : _a.status) === "pending";
    });
    const isRejected = computed(() => {
      var _a;
      return ((_a = user.value) == null ? void 0 : _a.status) === "rejected";
    });
    const isRestricted = computed(() => isPending.value || isRejected.value);
    const addFormFields = [
      { label: "Prenom", key: "firstName", type: "text" },
      { label: "Nom", key: "lastName", type: "text" },
      { label: "Date de naissance", key: "dateOfBirth", type: "date" },
      { label: "Adresse", key: "address", type: "text" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      if (unref(loading)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center justify-center py-32" }, _attrs))}>`);
        _push(ssrRenderComponent(unref(Loader2), {
          class: "animate-spin text-prado-text-muted",
          size: 32
        }, null, _parent));
        _push(`</div>`);
      } else if (!unref(user)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center justify-center py-32" }, _attrs))}><p class="text-prado-text-muted">Redirection...</p></div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-5xl mx-auto px-6 py-12" }, _attrs))}><div class="bg-prado-surface rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-prado-border"><div class="w-14 h-14 rounded-full bg-gradient-to-br from-[#CF006C] to-[#FB6223] flex items-center justify-center text-white">`);
        _push(ssrRenderComponent(unref(User), { size: 24 }, null, _parent));
        _push(`</div><div class="flex-1"><h1 class="text-2xl text-prado-text italic" style="${ssrRenderStyle({ fontFamily: "Poppins" })}">${ssrInterpolate(unref(user).name)}</h1><p class="text-sm text-prado-text-muted">${ssrInterpolate(unref(user).email)} -- ${ssrInterpolate(unref(user).structure)}</p></div><div class="flex gap-2"><button class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-prado-tag-bg text-prado-text-muted text-sm hover:bg-prado-border transition-colors">`);
        _push(ssrRenderComponent(unref(Key), { size: 13 }, null, _parent));
        _push(` Mot de passe </button><button class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-prado-tag-bg text-red-400 text-sm hover:bg-red-500/10 transition-colors">`);
        _push(ssrRenderComponent(unref(LogOut), { size: 13 }, null, _parent));
        _push(` Deconnexion </button></div></div>`);
        if (unref(showPassword)) {
          _push(`<form class="bg-prado-surface border border-prado-border rounded-2xl p-5 mb-5 grid grid-cols-1 sm:grid-cols-2 gap-3"><div><label class="text-xs text-prado-text-muted mb-1 block">Nouveau mot de passe</label><input${ssrRenderAttr("value", unref(newPassword))} type="password" required class="${ssrRenderClass(inputClass)}"></div><div><label class="text-xs text-prado-text-muted mb-1 block">Confirmer</label><input${ssrRenderAttr("value", unref(confirmPassword))} type="password" required class="${ssrRenderClass(inputClass)}"></div><div class="sm:col-span-2 flex gap-2"><button type="submit"${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""} class="px-5 py-2 rounded-full bg-[#CF006C] text-white text-sm disabled:opacity-50 flex items-center gap-2">`);
          if (unref(submitting)) {
            _push(ssrRenderComponent(unref(Loader2), {
              size: 14,
              class: "animate-spin"
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(` Modifier </button><button type="button" class="px-5 py-2 rounded-full bg-prado-tag-bg text-prado-text-muted text-sm"> Annuler </button></div></form>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(isPending)) {
          _push(`<div class="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-6 text-sm text-amber-600"> Votre compte est en attente de validation par l&#39;association. Vous pourrez gerer vos fiches jeunes une fois votre compte approuve. </div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(isRejected)) {
          _push(`<div class="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-6 text-sm text-red-400"> Votre demande de compte a ete refusee. Contactez l&#39;association pour plus d&#39;informations. </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex items-center justify-between mb-6"><h2 class="text-xl text-prado-text">Mes fiches jeunes (${ssrInterpolate(unref(jeunes).length)})</h2><button${ssrIncludeBooleanAttr(unref(isRestricted)) ? " disabled" : ""} class="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#CF006C] text-white text-sm hover:bg-[#a80057] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">`);
        _push(ssrRenderComponent(unref(UserPlus), { size: 14 }, null, _parent));
        _push(` Ajouter </button></div>`);
        if (unref(showAdd)) {
          _push(`<form class="bg-prado-surface border border-prado-border rounded-2xl p-5 mb-5 grid grid-cols-1 sm:grid-cols-2 gap-3"><!--[-->`);
          ssrRenderList(addFormFields, (f) => {
            _push(`<div><label class="text-xs text-prado-text-muted mb-1 block">${ssrInterpolate(f.label)}</label><input${ssrRenderAttr("type", f.type)}${ssrRenderAttr("value", unref(newJeune)[f.key])} required class="${ssrRenderClass(inputClass)}"></div>`);
          });
          _push(`<!--]--><div class="sm:col-span-2"><label class="text-xs text-prado-text-muted mb-1 block">Situation globale</label><input${ssrRenderAttr("value", unref(newJeune).situation)} required class="${ssrRenderClass(inputClass)}" placeholder="Ex: Protection de l&#39;enfance"></div><div class="sm:col-span-2 flex gap-2"><button type="submit"${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""} class="px-5 py-2 rounded-full bg-[#93C1AF] text-white text-sm disabled:opacity-50 flex items-center gap-2">`);
          if (unref(submitting)) {
            _push(ssrRenderComponent(unref(Loader2), {
              size: 14,
              class: "animate-spin"
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(` Enregistrer </button><button type="button" class="px-5 py-2 rounded-full bg-prado-tag-bg text-prado-text-muted text-sm"> Annuler </button></div></form>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(jeunesLoading)) {
          _push(`<div class="flex items-center justify-center py-12">`);
          _push(ssrRenderComponent(unref(Loader2), {
            class: "animate-spin text-prado-text-muted",
            size: 24
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<div class="space-y-3">`);
          if (unref(jeunes).length === 0) {
            _push(`<p class="text-sm text-prado-text-faint text-center py-8"> Aucune fiche jeune. Cliquez sur &quot;Ajouter&quot; pour creer votre premiere fiche. </p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--[-->`);
          ssrRenderList(unref(jeunes), (j) => {
            _push(`<div class="bg-prado-surface border border-prado-border rounded-2xl p-5"><div class="flex items-start justify-between"><div><h3 class="text-prado-text">${ssrInterpolate(j.firstName)} ${ssrInterpolate(j.lastName)}</h3><p class="text-xs text-prado-text-faint mt-0.5"> Ne(e) le ${ssrInterpolate(new Date(j.dateOfBirth).toLocaleDateString("fr-FR"))} -- ${ssrInterpolate(j.situation)}</p><p class="text-xs text-prado-text-faint">${ssrInterpolate(j.address)}</p></div><button class="p-2 rounded-xl hover:bg-red-500/10 text-red-400/50 hover:text-red-400 transition-colors">`);
            _push(ssrRenderComponent(unref(Trash2), { size: 15 }, null, _parent));
            _push(`</button></div>`);
            if (unref(inscriptions).filter((i) => i.jeuneId === j.id).length > 0) {
              _push(`<div class="mt-4 pt-3 border-t border-prado-border"><p class="text-xs text-prado-text-faint mb-2 flex items-center gap-1">`);
              _push(ssrRenderComponent(unref(Calendar), { size: 11 }, null, _parent));
              _push(` Inscriptions : </p><div class="flex flex-wrap gap-2"><!--[-->`);
              ssrRenderList(unref(inscriptions).filter((i) => i.jeuneId === j.id), (insc) => {
                _push(`<!--[-->`);
                if (unref(actions).find((a) => String(a.id) === insc.actionId)) {
                  _push(`<div class="flex items-center gap-2 bg-prado-input-bg rounded-full px-3 py-1.5">`);
                  _push(ssrRenderComponent(_component_NuxtLink, {
                    to: `/actions/${unref(actions).find((a) => String(a.id) === insc.actionId).id}`,
                    class: "text-xs text-prado-text-secondary hover:text-[#FB6223]"
                  }, {
                    default: withCtx((_, _push2, _parent2, _scopeId) => {
                      if (_push2) {
                        _push2(`${ssrInterpolate(unref(actions).find((a) => String(a.id) === insc.actionId).title)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(unref(actions).find((a) => String(a.id) === insc.actionId).title), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent));
                  _push(`<button class="text-xs text-red-400/50 hover:text-red-400"> x </button></div>`);
                } else {
                  _push(`<!---->`);
                }
                _push(`<!--]-->`);
              });
              _push(`<!--]--></div></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/mon-compte.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=mon-compte-QRhFuIux.mjs.map
