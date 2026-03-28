/**
 * ComboUX - Main class for the Vue library
 */

import type {
  ComboUXOptions,
  ThemeData,
  DarkModeChangeCallback,
  ThemeLoadCallback,
  ButtonVariant,
  CardVariant,
  AlertVariant,
  AvatarVariant,
  BadgeVariant,
  ChipVariant,
  SpinnerVariant,
  ProgressVariant,
  ThemeSyncOptions
} from './types'

import { DarkMode } from './core/dark-mode'
import { CSSInjector } from './core/css-generator'
import { ThemeLoader } from './core/theme-loader'
import { ThemeSync } from './core/theme-sync'
import {
  loadFontsFromButtonVariants,
  loadFontsFromTypography,
  loadFontsFromForms,
  loadFontsFromAvatarVariants
} from './core/google-fonts'
import { injectBasscss } from './basscss'
import { injectBaseStyles, updateBaseStyles } from './core/base-styles'
import { generateTypographyCSS } from './core/typography-generator'
import { generateFormsCSS } from './core/forms-generator'
import { generateButtonCSS } from './core/button-generator'
import { generateCardCSS } from './core/card-generator'
import { generateAlertCSS } from './core/alert-generator'
import { generateAvatarCSS } from './core/avatar-generator'
import { generateProgressCSS } from './core/progress-generator'
import { generateSpinnerCSS } from './core/spinner-generator'
import { generateBadgeCSS } from './core/badge-generator'
import { generateChipCSS } from './core/chip-generator'

export class ComboUX {
  private options: Required<Omit<ComboUXOptions, 'theme' | 'ws'>> & { theme: ThemeData | string }
  private darkMode: DarkMode
  private cssInjector: CSSInjector
  private themeLoader: ThemeLoader
  private themeSync: ThemeSync | null = null
  private currentTheme: ThemeData | null = null

  constructor(options: ComboUXOptions) {
    this.options = {
      theme: options.theme,
      darkMode: options.darkMode ?? 'auto',
      persistDarkMode: options.persistDarkMode ?? true,
      darkModeStorageKey: options.darkModeStorageKey ?? 'cux-dark-mode'
    }

    this.darkMode = new DarkMode({
      persist: this.options.persistDarkMode,
      storageKey: this.options.darkModeStorageKey
    })

    this.cssInjector = new CSSInjector()
    this.themeLoader = new ThemeLoader()

    // Initialize WebSocket sync if configured
    if (options.ws && options.ws !== false) {
      const wsOptions: ThemeSyncOptions =
        typeof options.ws === 'string'
          ? { url: options.ws }
          : options.ws

      this.themeSync = new ThemeSync(
        (theme) => this.updateTheme(theme),
        wsOptions
      )
    }
  }

  /**
   * Initialize the library (must be called manually or via composable)
   */
  async init(): Promise<void> {
    // Inject Basscss utilities
    injectBasscss()

    // Initialize dark mode
    this.darkMode.init(this.options.darkMode)

    // Load theme
    try {
      await this.loadTheme(this.options.theme)
    } catch (error) {
      console.error('Failed to load theme:', error)
    }

    // Connect WebSocket if configured
    if (this.themeSync) {
      this.themeSync.connect()
    }
  }

  /**
   * Inject base styles with theme colors
   */
  private injectBaseStylesFromTheme(theme: ThemeData): void {
    const backgroundColor = theme.typography?.globalConfig?.backgroundColor
    const darkBackgroundColor = theme.typography?.globalConfig?.dark?.backgroundColor
    const textColor = theme.typography?.globalConfig?.color
    const darkTextColor = theme.typography?.globalConfig?.dark?.color

    if (backgroundColor || darkBackgroundColor || textColor || darkTextColor) {
      updateBaseStyles({
        backgroundColor,
        darkBackgroundColor,
        textColor,
        darkTextColor
      })
    } else {
      injectBaseStyles()
    }
  }

  /**
   * Load theme from URL or object
   */
  async loadTheme(theme: ThemeData | string): Promise<void> {
    const themeData = await this.themeLoader.load(theme)
    this.currentTheme = themeData
    this.applyTheme(themeData)
  }

  /**
   * Apply theme by generating and injecting CSS
   */
  private applyTheme(theme: ThemeData): void {
    // Inject base styles with theme colors first
    this.injectBaseStylesFromTheme(theme)

    const cssParts: string[] = []

    // Load Google Fonts from typography
    if (theme.typography) {
      loadFontsFromTypography(theme.typography)
      const typographyCSS = generateTypographyCSS(theme.typography)
      if (typographyCSS) cssParts.push(typographyCSS)
    }

    // Generate forms CSS
    if (theme.forms?.globalConfig) {
      loadFontsFromForms(theme.forms)
      const formsCSS = generateFormsCSS(theme.forms, theme.typography)
      if (formsCSS) cssParts.push(formsCSS)
    }

    // Generate button CSS
    if (theme.buttons?.variants?.length) {
      loadFontsFromButtonVariants(theme.buttons.variants)
      cssParts.push(generateButtonCSS(theme.buttons.variants, theme.typography?.globalConfig))
    }

    // Generate card CSS
    if (theme.cards?.variants?.length) {
      cssParts.push(generateCardCSS(theme.cards.variants, theme.typography?.globalConfig))
    }

    // Generate alert CSS
    if (theme.alerts?.variants?.length) {
      cssParts.push(generateAlertCSS(theme.alerts.variants, theme.typography?.globalConfig))
    }

    // Generate avatar CSS
    if (theme.avatars?.variants?.length) {
      loadFontsFromAvatarVariants(theme.avatars.variants)
      cssParts.push(generateAvatarCSS(theme.avatars.variants, theme.typography?.globalConfig))
    }

    // Generate progress CSS
    if (theme.progress?.variants?.length) {
      cssParts.push(generateProgressCSS(theme.progress.variants, theme.typography?.globalConfig))
    }

    // Generate spinner CSS
    if (theme.spinners?.variants?.length) {
      cssParts.push(generateSpinnerCSS(theme.spinners.variants))
    }

    // Generate badge CSS
    if (theme.badges?.variants?.length) {
      cssParts.push(generateBadgeCSS(theme.badges.variants, theme.typography?.globalConfig))
    }

    // Generate chip CSS
    if (theme.chips?.variants?.length) {
      cssParts.push(generateChipCSS(theme.chips.variants, theme.typography?.globalConfig))
    }

    // Inject combined CSS
    if (cssParts.length > 0) {
      this.cssInjector.inject(cssParts.join('\n\n'))
    }
  }

  /**
   * Update theme (for real-time updates via websockets)
   */
  updateTheme(theme: ThemeData): void {
    this.currentTheme = theme
    this.applyTheme(theme)
  }

  /**
   * Update a specific button variant
   */
  updateButtonVariant(variantName: string, updates: Partial<ButtonVariant>): void {
    if (!this.currentTheme?.buttons?.variants) return

    const variant = this.currentTheme.buttons.variants.find(v => v.name.toLowerCase() === variantName.toLowerCase())

    if (variant) {
      Object.assign(variant, updates)
      this.applyTheme(this.currentTheme)
    }
  }

  // ==================== Dark Mode API ====================

  /** Check if dark mode is active */
  get isDark(): boolean {
    return this.darkMode.isDark
  }

  /** Set dark mode */
  setDarkMode(value: boolean | 'auto'): void {
    this.darkMode.setDarkMode(value)
  }

  /** Toggle dark mode */
  toggleDarkMode(): void {
    this.darkMode.toggle()
  }

  /** Register callback for dark mode changes */
  onDarkModeChange(callback: DarkModeChangeCallback): () => void {
    return this.darkMode.onChange(callback)
  }

  // ==================== Theme Sync API ====================

  /** Check if WebSocket is connected */
  get isSyncConnected(): boolean {
    return this.themeSync?.isConnected ?? false
  }

  /** Connect to WebSocket server */
  connectSync(): void {
    this.themeSync?.connect()
  }

  /** Disconnect from WebSocket server */
  disconnectSync(): void {
    this.themeSync?.disconnect()
  }

  /** Register callback for sync connection */
  onSyncConnect(callback: () => void): () => void {
    if (!this.themeSync) return () => {}
    return this.themeSync.onConnect(callback)
  }

  /** Register callback for sync disconnection */
  onSyncDisconnect(callback: () => void): () => void {
    if (!this.themeSync) return () => {}
    return this.themeSync.onDisconnect(callback)
  }

  /** Register callback for sync errors */
  onSyncError(callback: (error: Error) => void): () => void {
    if (!this.themeSync) return () => {}
    return this.themeSync.onError(callback)
  }

  /** Register callback for theme updates from sync */
  onSyncThemeUpdate(callback: (theme: ThemeData) => void): () => void {
    if (!this.themeSync) return () => {}
    return this.themeSync.onThemeUpdate(callback)
  }

  // ==================== Theme Events ====================

  /** Register callback for theme load events */
  onThemeLoad(callback: ThemeLoadCallback): () => void {
    return this.themeLoader.onLoad(callback)
  }

  // ==================== Lifecycle ====================

  /** Destroy instance and clean up */
  destroy(): void {
    this.darkMode.destroy()
    this.cssInjector.destroy()
    this.themeLoader.destroy()

    if (this.themeSync) {
      this.themeSync.destroy()
      this.themeSync = null
    }
  }
}
