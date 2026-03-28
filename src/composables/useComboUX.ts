/**
 * Vue composable for ComboUX
 */
import { ref, onMounted, onUnmounted, readonly } from 'vue'
import type { Ref, DeepReadonly } from 'vue'
import { ComboUX } from '../combo-ux'
import type { ComboUXOptions, ThemeData } from '../types'

// Global instance
let comboUXInstance: ComboUX | null = null
const isInitialized = ref(false)
const isDark = ref(false)

// Reactive state shared across all components
const subscribers = new Set<(isDark: boolean) => void>()

function notifySubscribers() {
  subscribers.forEach(cb => cb(isDark.value))
}

export interface UseComboUXReturn {
  isInitialized: DeepReadonly<Ref<boolean>>
  isDark: DeepReadonly<Ref<boolean>>
  instance: ComboUX | null
  toggleDarkMode: () => void
  setDarkMode: (value: boolean | 'auto') => void
  updateTheme: (theme: ThemeData) => void
}

/**
 * Initialize ComboUX with options
 * Should be called once in your app entry point
 */
export async function initComboUX(options: ComboUXOptions): Promise<ComboUX> {
  if (comboUXInstance) {
    console.warn('[ComboUX] Already initialized, returning existing instance')
    return comboUXInstance
  }

  comboUXInstance = new ComboUX(options)
  await comboUXInstance.init()

  isInitialized.value = true
  isDark.value = comboUXInstance.isDark

  // Subscribe to dark mode changes
  comboUXInstance.onDarkModeChange(dark => {
    isDark.value = dark
    notifySubscribers()
  })

  return comboUXInstance
}

/**
 * Get the current ComboUX instance
 */
export function getComboUX(): ComboUX | null {
  return comboUXInstance
}

/**
 * Vue composable to use ComboUX in components
 */
export function useComboUX(): UseComboUXReturn {
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
    instance: comboUXInstance,
    toggleDarkMode: () => comboUXInstance?.toggleDarkMode(),
    setDarkMode: (value: boolean | 'auto') => comboUXInstance?.setDarkMode(value),
    updateTheme: (theme: ThemeData) => comboUXInstance?.updateTheme(theme)
  }
}

/**
 * Destroy the ComboUX instance
 */
export function destroyComboUX(): void {
  if (comboUXInstance) {
    comboUXInstance.destroy()
    comboUXInstance = null
    isInitialized.value = false
  }
}

// Re-export types
export type { ComboUXOptions, ThemeData }
