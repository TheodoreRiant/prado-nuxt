import { d as useRoute, a as __nuxt_component_0$1, g as useState } from './server.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderSlot, ssrRenderVNode } from 'vue/server-renderer';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { Sun, Moon, User, LogOut, X, Menu, Facebook, Instagram, Linkedin, Youtube } from 'lucide-vue-next';
import { Toaster } from 'vue-sonner';
import { u as useAuth } from './useAuth-BKQTxiv8.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'vue-router';
import '@supabase/ssr';
import '@prismicio/client';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import './useSupabaseClient-DN0WJ5wf.mjs';

const _imports_0 = publicAssetsURL("/images/logo.png");
function useTheme() {
  const theme = useState("theme", () => "dark");
  const toggleTheme = () => {
    theme.value = theme.value === "dark" ? "light" : "dark";
  };
  return { theme, toggleTheme };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const { user, isAdmin } = useAuth();
    const { theme } = useTheme();
    const route = useRoute();
    const menuOpen = ref(false);
    const navLinks = [
      { to: "/actions", label: "Programmation" },
      { to: "/foodtruck", label: "Foodtruck" },
      { to: "/fresque", label: "Fresque" }
    ];
    const socialIcons = [Facebook, Instagram, Linkedin, Youtube];
    function isActive(to) {
      return route.path.startsWith(to);
    }
    function closeMenu() {
      menuOpen.value = false;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col bg-prado-bg" }, _attrs))}>`);
      _push(ssrRenderComponent(unref(Toaster), {
        position: "top-right",
        "rich-colors": ""
      }, null, _parent));
      _push(`<header class="sticky top-0 z-50 bg-prado-header-bg backdrop-blur-md border-b border-prado-border"><div class="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 relative">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-2.5"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", _imports_0)} alt="Prado Itineraires" class="w-9 h-9 object-contain"${_scopeId}><span class="text-prado-text hidden sm:block text-sm tracking-wide"${_scopeId}>Prado Itineraires</span>`);
          } else {
            return [
              createVNode("img", {
                src: _imports_0,
                alt: "Prado Itineraires",
                class: "w-9 h-9 object-contain"
              }),
              createVNode("span", { class: "text-prado-text hidden sm:block text-sm tracking-wide" }, "Prado Itineraires")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2"><!--[-->`);
      ssrRenderList(navLinks, (l) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: l.to,
          to: l.to,
          class: [
            "px-3 py-1.5 rounded-md text-sm transition-colors",
            isActive(l.to) ? "text-prado-text" : "text-prado-text-secondary hover:text-prado-text"
          ]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(l.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(l.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav><div class="hidden lg:flex items-center gap-2"><button class="p-2 rounded-full text-prado-text-secondary hover:text-prado-text hover:bg-prado-surface-hover transition-colors" aria-label="Changer de theme">`);
      if (unref(theme) === "dark") {
        _push(ssrRenderComponent(unref(Sun), { size: 16 }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Moon), { size: 16 }, null, _parent));
      }
      _push(`</button>`);
      if (unref(user)) {
        _push(`<!--[-->`);
        if (unref(isAdmin)) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/admin",
            class: "px-3 py-1.5 rounded-full bg-[#004657] text-white text-xs hover:bg-[#003545] transition-colors"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Admin `);
              } else {
                return [
                  createTextVNode(" Admin ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/mon-compte",
          class: "flex items-center gap-2 px-4 py-1.5 rounded-full border border-prado-border-medium text-prado-text text-sm hover:bg-prado-surface-hover transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(User), { size: 14 }, null, _parent2, _scopeId));
              _push2(`<span${_scopeId}>${ssrInterpolate(unref(user).name)}</span>`);
            } else {
              return [
                createVNode(unref(User), { size: 14 }),
                createVNode("span", null, toDisplayString(unref(user).name), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<button class="p-2 rounded-full hover:bg-prado-surface-hover text-prado-text-muted hover:text-prado-text transition-colors">`);
        _push(ssrRenderComponent(unref(LogOut), { size: 15 }, null, _parent));
        _push(`</button><!--]-->`);
      } else {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/connexion",
          class: "p-2 rounded-full border border-prado-border-medium text-prado-text-secondary hover:text-prado-text hover:bg-prado-surface-hover transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(User), { size: 16 }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(User), { size: 16 })
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</div><div class="lg:hidden flex items-center gap-1"><button class="p-2 text-prado-text-secondary" aria-label="Changer de theme">`);
      if (unref(theme) === "dark") {
        _push(ssrRenderComponent(unref(Sun), { size: 20 }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Moon), { size: 20 }, null, _parent));
      }
      _push(`</button><button class="p-2 text-prado-text">`);
      if (unref(menuOpen)) {
        _push(ssrRenderComponent(unref(X), { size: 22 }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Menu), { size: 22 }, null, _parent));
      }
      _push(`</button></div></div>`);
      if (unref(menuOpen)) {
        _push(`<div class="lg:hidden border-t border-prado-border bg-prado-bg px-6 pb-6 pt-2"><!--[-->`);
        ssrRenderList(navLinks, (l) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: l.to,
            to: l.to,
            class: [
              "block px-3 py-2.5 rounded-lg text-sm",
              isActive(l.to) ? "text-prado-text bg-prado-surface-hover" : "text-prado-text-secondary"
            ],
            onClick: closeMenu
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(l.label)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(l.label), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--><div class="border-t border-prado-border mt-3 pt-3">`);
        if (unref(user)) {
          _push(`<!--[-->`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/mon-compte",
            class: "block px-3 py-2.5 text-prado-text text-sm",
            onClick: closeMenu
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Mon compte `);
              } else {
                return [
                  createTextVNode(" Mon compte ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<button class="block px-3 py-2.5 text-red-400 text-sm"> Deconnexion </button><!--]-->`);
        } else {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/connexion",
            class: "flex items-center gap-2 px-3 py-2.5 text-prado-text-secondary text-sm",
            onClick: closeMenu
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(User), { size: 16 }, null, _parent2, _scopeId));
                _push2(` Connexion `);
              } else {
                return [
                  createVNode(unref(User), { size: 16 }),
                  createTextVNode(" Connexion ")
                ];
              }
            }),
            _: 1
          }, _parent));
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header><main class="flex-1">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main><footer class="bg-prado-bg-deep border-t border-prado-border"><div class="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10"><div><div class="flex items-center gap-2.5 mb-4"><img${ssrRenderAttr("src", _imports_0)} alt="Prado Itineraires" class="w-8 h-8 object-contain"><span class="text-prado-text text-sm">Prado Itineraires</span></div><p class="text-sm text-prado-text-muted leading-relaxed"> Innovation sociale au service des jeunes et des familles en vulnerabilite. Lyon, France. </p></div><div><h4 class="text-prado-text-secondary text-xs uppercase tracking-wider mb-4">Navigation</h4><div class="flex flex-col gap-2"><!--[-->`);
      ssrRenderList(navLinks, (l) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: l.to,
          to: l.to,
          class: "text-sm text-prado-text-muted hover:text-[#FB6223] transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(l.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(l.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div><div><h4 class="text-prado-text-secondary text-xs uppercase tracking-wider mb-4">Contact</h4><div class="space-y-2 text-sm text-prado-text-muted"><p>contact@prado-itineraires.fr</p><p>04 72 XX XX XX</p><p>Lyon 7e, France</p></div></div><div><h4 class="text-prado-text-secondary text-xs uppercase tracking-wider mb-4">Suivez-nous</h4><div class="flex gap-2"><!--[-->`);
      ssrRenderList(socialIcons, (Icon, i) => {
        _push(`<a href="#" class="w-9 h-9 rounded-full bg-prado-tag-bg flex items-center justify-center text-prado-text-muted hover:bg-[#CF006C] hover:text-white transition-colors">`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(Icon), { size: 15 }, null), _parent);
        _push(`</a>`);
      });
      _push(`<!--]--></div></div></div><div class="border-t border-prado-border py-5 text-center text-xs text-prado-text-faint"> \xA9 2026 Prado Itineraires -- Fondation du Prado. Tous droits reserves. </div></footer></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-CybCiZyS.mjs.map
