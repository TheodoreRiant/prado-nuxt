import { defineComponent, ref, watch, unref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { Loader2, LogIn, UserPlus } from 'lucide-vue-next';
import { d as useRoute, n as navigateTo } from './server.mjs';
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
import './useSupabaseClient-DN0WJ5wf.mjs';

const inputClass = "w-full px-4 py-2.5 rounded-xl bg-prado-surface border border-prado-border text-prado-text placeholder:text-prado-text-faint focus:outline-none focus:border-prado-border-medium";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "connexion",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { user, loading } = useAuth();
    const mode = ref(
      route.query.mode === "register" ? "register" : "login"
    );
    const loginForm = ref({ email: "", password: "" });
    const registerForm = ref({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      structure: "",
      phone: ""
    });
    const forgotPassword = ref(false);
    const forgotEmail = ref("");
    const submitting = ref(false);
    watch(user, (newUser) => {
      if (newUser) navigateTo("/mon-compte");
    }, { immediate: true });
    const registerFields = [
      { label: "Nom complet", key: "name", type: "text" },
      { label: "Email professionnel", key: "email", type: "email" },
      { label: "Structure / Etablissement", key: "structure", type: "text" },
      { label: "Telephone", key: "phone", type: "text" },
      { label: "Mot de passe", key: "password", type: "password" },
      { label: "Confirmer le mot de passe", key: "confirmPassword", type: "password" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(loading)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center justify-center py-32" }, _attrs))}>`);
        _push(ssrRenderComponent(unref(Loader2), {
          class: "animate-spin text-prado-text-muted",
          size: 32
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-md mx-auto px-6 py-20" }, _attrs))}>`);
        if (unref(forgotPassword)) {
          _push(`<div><h1 class="text-2xl text-prado-text mb-6 italic" style="${ssrRenderStyle({ fontFamily: "Poppins" })}"> Mot de passe oublie </h1><form class="space-y-4"><div><label class="text-sm text-prado-text-secondary mb-1.5 block">Email professionnel</label><input${ssrRenderAttr("value", unref(forgotEmail))} type="email" required class="${ssrRenderClass(inputClass)}"></div><button type="submit"${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""} class="w-full py-2.5 rounded-full bg-[#CF006C] text-white hover:bg-[#a80057] disabled:opacity-50 flex items-center justify-center gap-2">`);
          if (unref(submitting)) {
            _push(ssrRenderComponent(unref(Loader2), {
              size: 16,
              class: "animate-spin"
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(` Reinitialiser </button><button type="button" class="text-sm text-prado-text-faint underline"> Retour </button></form></div>`);
        } else {
          _push(`<!--[--><div class="flex rounded-full overflow-hidden bg-prado-surface p-1 mb-10"><button class="${ssrRenderClass([
            "flex-1 py-2.5 rounded-full text-sm flex items-center justify-center gap-2 transition-colors",
            unref(mode) === "login" ? "bg-[#CF006C] text-white" : "text-prado-text-muted"
          ])}">`);
          _push(ssrRenderComponent(unref(LogIn), { size: 15 }, null, _parent));
          _push(` Se connecter </button><button class="${ssrRenderClass([
            "flex-1 py-2.5 rounded-full text-sm flex items-center justify-center gap-2 transition-colors",
            unref(mode) === "register" ? "bg-[#CF006C] text-white" : "text-prado-text-muted"
          ])}">`);
          _push(ssrRenderComponent(unref(UserPlus), { size: 15 }, null, _parent));
          _push(` Creer un compte </button></div>`);
          if (unref(mode) === "login") {
            _push(`<form class="space-y-4"><h2 class="text-xl text-prado-text italic" style="${ssrRenderStyle({ fontFamily: "Poppins" })}"> Espace prescripteur </h2><p class="text-sm text-prado-text-muted mb-2"> Connectez-vous pour inscrire des jeunes. </p><div><label class="text-sm text-prado-text-secondary mb-1.5 block">Email professionnel</label><input${ssrRenderAttr("value", unref(loginForm).email)} type="email" required class="${ssrRenderClass(inputClass)}" placeholder="votre@email-pro.fr"></div><div><label class="text-sm text-prado-text-secondary mb-1.5 block">Mot de passe</label><input${ssrRenderAttr("value", unref(loginForm).password)} type="password" required class="${ssrRenderClass(inputClass)}" placeholder="--------"></div><button type="submit"${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""} class="w-full py-2.5 rounded-full bg-[#CF006C] text-white hover:bg-[#a80057] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">`);
            if (unref(submitting)) {
              _push(ssrRenderComponent(unref(Loader2), {
                size: 16,
                class: "animate-spin"
              }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(` Se connecter </button><button type="button" class="text-sm text-[#FB6223] underline"> Mot de passe oublie ? </button></form>`);
          } else {
            _push(`<form class="space-y-4"><h2 class="text-xl text-prado-text italic" style="${ssrRenderStyle({ fontFamily: "Poppins" })}"> Creer un compte </h2><p class="text-sm text-prado-text-muted mb-2"> Votre compte sera valide par l&#39;association. </p><!--[-->`);
            ssrRenderList(registerFields, (f) => {
              _push(`<div><label class="text-sm text-prado-text-secondary mb-1.5 block">${ssrInterpolate(f.label)}</label><input${ssrRenderAttr("type", f.type)}${ssrRenderAttr("value", unref(registerForm)[f.key])}${ssrIncludeBooleanAttr(f.key !== "phone") ? " required" : ""} class="${ssrRenderClass(inputClass)}"></div>`);
            });
            _push(`<!--]--><button type="submit"${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""} class="w-full py-2.5 rounded-full bg-[#CF006C] text-white hover:bg-[#a80057] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">`);
            if (unref(submitting)) {
              _push(ssrRenderComponent(unref(Loader2), {
                size: 16,
                class: "animate-spin"
              }, null, _parent));
            } else {
              _push(`<!---->`);
            }
            _push(` Creer mon compte </button></form>`);
          }
          _push(`<!--]-->`);
        }
        _push(`</div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/connexion.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=connexion-DYvhI8Is.mjs.map
