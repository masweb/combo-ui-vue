/**
 * combo-ui-vue
 * Vue 3 UI library for combo-ui themes
 *
 * Usage:
 * ```ts
 * // main.ts
 * import { createApp } from 'vue'
 * import { ComboUIPlugin } from 'combo-ui-vue'
 * import theme from './theme.json'
 *
 * const app = createApp(App)
 * app.use(ComboUIPlugin, { theme })
 * ```
 *
 * In components, use CSS classes directly:
 * ```html
 * <button class="cui-button --primary">Click</button>
 * ```
 */

// Components
export { ThemeToggler } from './components/ThemeToggler'

// Core exports
export * from './types'

// Main class
export { ComboUI } from './combo-ui'

// Composable
export {
  useComboUI,
  initComboUI,
  getComboUI,
  destroyComboUI
} from './composables/useComboUI'
export type { UseComboUIReturn } from './composables/useComboUI'

// Plugin for Vue app.use()
import type { App } from 'vue'
import { initComboUI } from './composables/useComboUI'
import type { ComboUIOptions } from './types'

export interface ComboUIPluginOptions extends ComboUIOptions {
  /** Auto initialize on install */
  autoInit?: boolean
}

export const ComboUIPlugin = {
  async install(app: App, options: ComboUIPluginOptions) {
    // Auto initialize if requested
    if (options.autoInit !== false) {
      await initComboUI(options)
    }
  }
}

// Default export for convenience
export default ComboUIPlugin
