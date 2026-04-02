export default defineNuxtConfig({
  modules: ['../src/module'],

  devtools: { enabled: true },

  css: ['../src/runtime/theme/tokens.css'],

  compatibilityDate: '2025-07-15',

  pradoUI: {
    prefix: 'Pr',
    theme: false, // We manually include tokens.css above to avoid duplication
  },
})
