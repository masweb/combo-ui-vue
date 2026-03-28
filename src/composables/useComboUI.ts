/**
 * Vue composable for ComboUI
 */
import { ref, onMounted, onUnmounted, readonly } from 'vue'
import type { Ref, DeepReadonly } from 'vue'
import { ComboUI } from '../combo-ui'
import type { ComboUIOptions, ThemeData } from '../types'

// Global instance
let comboUIInstance: ComboUI | null = null
const isInitialized = ref(false)
const isDark = ref(false)

// Reactive state shared across all components
const subscribers = new Set<(isDark: boolean) => void>()

function notifySubscribers() {
  subscribers.forEach(cb => cb(isDark.value))
}

export interface UseComboUIReturn {
  isInitialized: DeepReadonly<Ref<boolean>>
  isDark: DeepReadonly<Ref<boolean>>
  instance: ComboUI | null
  toggleDarkMode: () => void
  setDarkMode: (value: boolean | 'auto') => void
  updateTheme: (theme: ThemeData) => void
}

/**
 * Initialize ComboUI with options
 * Should be called once in your app entry point
 */
export async function initComboUI(options: ComboUIOptions): Promise<ComboUI> {
  if (comboUIInstance) {
    console.warn('[ComboUI] Already initialized, returning existing instance')
    return comboUIInstance
  }

  comboUIInstance = new ComboUI(options)
  await comboUIInstance.init()

  isInitialized.value = true
  isDark.value = comboUIInstance.isDark

  // Subscribe to dark mode changes
  comboUIInstance.onDarkModeChange(dark => {
    isDark.value = dark
    notifySubscribers()
  })

  return comboUIInstance
}

/**
 * Get the current ComboUI instance
 */
export function getComboUI(): ComboUI | null {
  return comboUIInstance
}

/**
 * Vue composable to use ComboUI in components
 */
export function useComboUI(): UseComboUIReturn {
  // Subscribe to dark mode changes
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
    toggleDarkMode: () => comboUIInstance?.toggleDarkMode(),
    setDarkMode: (value: boolean | 'auto') => comboUIInstance?.setDarkMode(value),
    updateTheme: (theme: ThemeData) => comboUIInstance?.updateTheme(theme)
  }
}

/**
 * Destroy the ComboUI instance
 */
export function destroyComboUI(): void {
  if (comboUIInstance) {
    comboUIInstance.destroy()
    comboUIInstance = null
    isInitialized.value = false
  }
}

// Re-export types
export type { ComboUIOptions, ThemeData }
