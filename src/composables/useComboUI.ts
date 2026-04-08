/**
 * Vue composable for ComboUI
 */
import { ref, shallowRef, onMounted, onUnmounted, readonly } from 'vue'
import type { Ref, ShallowRef, DeepReadonly } from 'vue'
import { ComboUI } from '../combo-ui'
import type { ComboUIOptions, ThemeData } from '../types'

// Global instance (reactive so components can track initialization)
const comboUIInstance = shallowRef<ComboUI | null>(null)
const isInitialized = ref(false)
const isDark = ref(false)
const theme = ref<ThemeData | null>(null)

// Reactive state shared across all components
const subscribers = new Set<(isDark: boolean) => void>()

function notifySubscribers() {
  subscribers.forEach(cb => cb(isDark.value))
}

export interface UseComboUIReturn {
  isInitialized: DeepReadonly<Ref<boolean>>
  isDark: DeepReadonly<Ref<boolean>>
  instance: ShallowRef<ComboUI | null>
  theme: DeepReadonly<Ref<ThemeData | null>>
  toggleDarkMode: () => void
  setDarkMode: (value: boolean | 'auto') => void
  updateTheme: (theme: ThemeData) => void
}

/**
 * Initialize ComboUI with options
 * Should be called once in your app entry point
 */
export async function initComboUI(options: ComboUIOptions): Promise<ComboUI> {
  if (comboUIInstance.value) {
    console.warn('[ComboUI] Already initialized, returning existing instance')
    return comboUIInstance.value
  }

  comboUIInstance.value = new ComboUI(options)
  await comboUIInstance.value.init()

  isInitialized.value = true
  isDark.value = comboUIInstance.value.isDark
  theme.value = comboUIInstance.value.getTheme()

  comboUIInstance.value.onDarkModeChange(dark => {
    isDark.value = dark
    notifySubscribers()
  })

  comboUIInstance.value.onThemeUpdate(newTheme => {
    theme.value = newTheme
  })

  return comboUIInstance.value
}

/**
 * Get the current ComboUI instance
 */
export function getComboUI(): ComboUI | null {
  return comboUIInstance.value
}

/**
 * Vue composable to use ComboUI in components
 */
export function useComboUI(): UseComboUIReturn {
  onMounted(() => {
    subscribers.add(() => {})
  })

  onUnmounted(() => {
    subscribers.delete(() => {})
  })

  return {
    isInitialized: readonly(isInitialized),
    isDark: readonly(isDark),
    instance: comboUIInstance,
    theme: readonly(theme),
    toggleDarkMode: () => comboUIInstance.value?.toggleDarkMode(),
    setDarkMode: (value: boolean | 'auto') => comboUIInstance.value?.setDarkMode(value),
    updateTheme: (newTheme: ThemeData) => {
      comboUIInstance.value?.updateTheme(newTheme)
      theme.value = newTheme
    }
  }
}

/**
 * Destroy the ComboUI instance
 */
export function destroyComboUI(): void {
  if (comboUIInstance.value) {
    comboUIInstance.value.destroy()
    comboUIInstance.value = null
    isInitialized.value = false
    theme.value = null
  }
}

// Re-export types
export type { ComboUIOptions, ThemeData }
