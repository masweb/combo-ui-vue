/**
 * Dark mode management
 */

import type { DarkModeSetting, DarkModeChangeCallback } from '../types'

export class DarkMode {
  private mode: DarkModeSetting = 'auto'
  private mediaQuery: MediaQueryList | null = null
  private callbacks: Set<DarkModeChangeCallback> = new Set()
  private storageKey: string = 'cux-dark-mode'
  private persist: boolean = true

  constructor(options?: { persist?: boolean; storageKey?: string }) {
    if (options?.persist !== undefined) {
      this.persist = options.persist
    }
    if (options?.storageKey) {
      this.storageKey = options.storageKey
    }
  }

  /**
   * Initialize dark mode system
   */
  init(mode: DarkModeSetting = 'auto'): void {
    this.mode = mode
    this.setupMediaQuery()

    // Apply initial state
    if (mode === 'auto') {
      // Check localStorage first, then system preference
      const stored = this.getStoredPreference()
      if (stored !== null) {
        this.applyDarkMode(stored)
      } else {
        this.applyDarkMode(this.getSystemPreference())
      }
    } else {
      this.applyDarkMode(mode === 'dark')
    }
  }

  /**
   * Set up media query listener for system preference changes
   */
  private setupMediaQuery(): void {
    if (typeof window === 'undefined') return

    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    this.mediaQuery.addEventListener('change', this.handleMediaQueryChange)
  }

  /**
   * Handle system preference changes
   */
  private handleMediaQueryChange = (e: MediaQueryListEvent): void => {
    if (this.mode === 'auto') {
      this.applyDarkMode(e.matches)
    }
  }

  /**
   * Get system preference for dark mode
   */
  private getSystemPreference(): boolean {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  /**
   * Get stored preference from localStorage
   */
  private getStoredPreference(): boolean | null {
    if (!this.persist || typeof localStorage === 'undefined') return null

    const stored = localStorage.getItem(this.storageKey)
    if (stored === 'dark') return true
    if (stored === 'light') return false
    return null
  }

  /**
   * Store preference in localStorage
   */
  private storePreference(isDark: boolean): void {
    if (!this.persist || typeof localStorage === 'undefined') return
    localStorage.setItem(this.storageKey, isDark ? 'dark' : 'light')
  }

  /**
   * Apply dark mode by toggling class on document element
   */
  private applyDarkMode(isDark: boolean): void {
    if (typeof document === 'undefined') return

    document.documentElement.classList.toggle('dark', isDark)
    this.storePreference(isDark)
    this.notifyCallbacks(isDark)
  }

  /**
   * Notify all registered callbacks
   */
  private notifyCallbacks(isDark: boolean): void {
    this.callbacks.forEach(callback => callback(isDark))
  }

  /**
   * Get current dark mode state
   */
  get isDark(): boolean {
    if (typeof document === 'undefined') return false
    return document.documentElement.classList.contains('dark')
  }

  /**
   * Get current mode setting
   */
  get currentMode(): DarkModeSetting {
    return this.mode
  }

  /**
   * Set dark mode
   */
  setDarkMode(value: boolean | 'auto'): void {
    if (value === 'auto') {
      this.mode = 'auto'
      this.applyDarkMode(this.getSystemPreference())
      // Clear stored preference when switching to auto
      if (this.persist && typeof localStorage !== 'undefined') {
        localStorage.removeItem(this.storageKey)
      }
    } else {
      this.mode = 'light' // Will be overridden below if needed
      this.applyDarkMode(value)
    }
  }

  /**
   * Toggle dark mode
   */
  toggle(): void {
    this.setDarkMode(!this.isDark)
  }

  /**
   * Register a callback for dark mode changes
   */
  onChange(callback: DarkModeChangeCallback): () => void {
    this.callbacks.add(callback)
    return () => this.callbacks.delete(callback)
  }

  /**
   * Clean up event listeners
   */
  destroy(): void {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.handleMediaQueryChange)
    }
    this.callbacks.clear()
  }
}
