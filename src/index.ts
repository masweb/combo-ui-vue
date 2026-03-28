/**
 * combo-ui-vue
 * Vue 3 UI library for combo-ux themes
 *
 * Usage:
 * ```ts
 * // main.ts
 * import { createApp } from 'vue'
 * import { ComboUXPlugin } from 'combo-ui-vue'
 * import theme from './theme.json'
 *
 * const app = createApp(App)
 * app.use(ComboUXPlugin, { theme })
 * ```
 *
 * In components, use CSS classes directly:
 * ```html
 * <button class="cux-button --primary">Click</button>
 * ```
 */

// Core exports
export * from './types'

// Main class
export { ComboUX } from './combo-ux'

// Composable
export {
  useComboUX,
  initComboUX,
  getComboUX,
  destroyComboUX
} from './composables/useComboUX'
export type { UseComboUXReturn } from './composables/useComboUX'

// Plugin for Vue app.use()
import type { App } from 'vue'
import { initComboUX } from './composables/useComboUX'
import type { ComboUXOptions } from './types'

export interface ComboUXPluginOptions extends ComboUXOptions {
  /** Auto initialize on install */
  autoInit?: boolean
}

export const ComboUXPlugin = {
  async install(app: App, options: ComboUXPluginOptions) {
    // Auto initialize if requested
    if (options.autoInit !== false) {
      await initComboUX(options)
    }
  }
}

// Default export for convenience
export default ComboUXPlugin
