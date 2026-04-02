import {
  defineNuxtModule,
  addComponentsDir,
  addImportsDir,
  createResolver,
} from '@nuxt/kit'

export interface PradoUIOptions {
  /** Prefix for auto-registered components (default: 'Pr') */
  prefix?: string
  /** Inject theme tokens CSS (default: true) */
  theme?: boolean
}

export default defineNuxtModule<PradoUIOptions>({
  meta: {
    name: '@prado/ui',
    configKey: 'pradoUI',
    compatibility: { nuxt: '>=3.0.0' },
  },
  defaults: {
    prefix: 'Pr',
    theme: true,
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Inject theme CSS tokens
    if (options.theme) {
      nuxt.options.css.push(resolve('./runtime/theme/tokens.css'))
    }

    // Auto-register all components with the configured prefix
    addComponentsDir({
      path: resolve('./runtime/components'),
      prefix: options.prefix,
      pathPrefix: false,
    })

    // Auto-import composables
    addImportsDir(resolve('./runtime/composables'))

    // Transpile runtime directory
    nuxt.options.build.transpile.push(resolve('./runtime'))
  },
})
