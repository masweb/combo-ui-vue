/**
 * CSS Generator Base - Shared utilities for all component generators
 * Reduces code duplication across button, card, alert, avatar, badge, chip, progress generators
 */

import type { BorderValue, ComponentShadows, TypographyGlobalConfig, UnitNumber } from '../types'
import {
  buildBorder,
  buildBorderRadius,
  buildPadding,
  buildFontSize,
  buildLetterSpacing,
  getEffectiveFontFamily
} from './utils'

// ==================== Types ====================

export interface ComponentVariant {
  name: string
  background: string
  color: string
  border: BorderValue
  borderRadius?: BorderRadiusValue
  padding?: PaddingValue
  fontFamily?: string | null
  fontSize?: UnitNumber
  fontWeight?: string
  fontStyle?: string
  letterSpacing?: UnitNumber | string
  shadows?: ComponentShadows
  dark?: Record<string, unknown>
}

export interface PaddingValue {
  linkedV: boolean
  linkedH: boolean
  unit: string
  top: number
  right: number
  bottom: number
  left: number
}

export interface BorderRadiusValue {
  linked: boolean
  unit: string
  tl: number
  tr: number
  br: number
  bl: number
}

export interface DarkModeColors {
  borderColor?: string
  shadowColor?: string
  shadowInsetColor?: string
  shadowInsetHighlightColor?: string
}

export interface TypographyOptions {
  fontFamily?: string | null
  fontSize?: UnitNumber
  fontWeight?: string
  fontStyle?: string
  letterSpacing?: UnitNumber | string
  textAlign?: string
}

// ==================== Dark Mode Border Override ====================

/**
 * Generate dark mode border override CSS
 * Used by: badge, avatar, card, alert, chip, progress generators
 */
export function generateDarkBorderOverride(
  componentName: string,
  border: BorderValue | undefined,
  darkBorderColor: string | undefined
): string {
  if (!darkBorderColor || !border) return ''
  return `  --cux-${componentName}-border: ${border.width}${border.unit} ${border.style} ${darkBorderColor};`
}

// ==================== Shadow Generation ====================

/**
 * Generate shadow CSS variable for a component
 * Returns empty string if no shadow
 */
export function generateShadowVar(
  componentName: string,
  shadows: ComponentShadows | undefined
): string {
  if (!shadows) return ''

  const parts: string[] = []

  if (shadows.offset?.enabled) {
    const { offsetX, offsetY, blur, spread, color } = shadows.offset
    parts.push(`${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}`)
  }

  if (shadows.inset?.enabled) {
    const { offsetX, offsetY, blur, spread, color } = shadows.inset
    parts.push(`inset ${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}`)
  }

  if (shadows.insetHighlight?.enabled) {
    const { offsetX, offsetY, blur, spread, color } = shadows.insetHighlight
    parts.push(`inset ${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}`)
  }

  return parts.length > 0 ? `  --cux-${componentName}-shadow: ${parts.join(', ')};` : ''
}

/**
 * Generate dark mode shadow CSS variable
 */
export function generateDarkShadowVar(
  componentName: string,
  shadows: ComponentShadows | undefined,
  darkColors: DarkModeColors | undefined
): string {
  if (!shadows) return ''

  const parts: string[] = []

  if (shadows.offset?.enabled) {
    const { offsetX, offsetY, blur, spread, color } = shadows.offset
    const darkColor = darkColors?.shadowColor || color
    parts.push(`${offsetX}px ${offsetY}px ${blur}px ${spread}px ${darkColor}`)
  }

  if (shadows.inset?.enabled) {
    const { offsetX, offsetY, blur, spread, color } = shadows.inset
    const darkColor = darkColors?.shadowInsetColor || color
    parts.push(`inset ${offsetX}px ${offsetY}px ${blur}px ${spread}px ${darkColor}`)
  }

  if (shadows.insetHighlight?.enabled) {
    const { offsetX, offsetY, blur, spread, color } = shadows.insetHighlight
    const darkColor = darkColors?.shadowInsetHighlightColor || color
    parts.push(`inset ${offsetX}px ${offsetY}px ${blur}px ${spread}px ${darkColor}`)
  }

  return parts.length > 0 ? `  --cux-${componentName}-shadow: ${parts.join(', ')};` : ''
}

// ==================== Offset/Inset Shadow (for overlay pattern) ====================

/**
 * Generate offset shadow for components that separate offset from inset shadows
 * Used by: card, alert, progress (overlay pattern)
 */
export function generateOffsetShadowVar(
  componentName: string,
  shadows: ComponentShadows | undefined
): string {
  if (!shadows?.offset?.enabled) return ''

  const { offsetX, offsetY, blur, spread, color } = shadows.offset
  return `  --cux-${componentName}-shadow: ${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color};`
}

/**
 * Generate inset shadow variable for overlay pattern
 */
export function generateInsetShadowVar(
  componentName: string,
  shadows: ComponentShadows | undefined
): string {
  if (!shadows) return ''

  const parts: string[] = []

  if (shadows.inset?.enabled) {
    const { offsetX, offsetY, blur, spread, color } = shadows.inset
    parts.push(`inset ${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}`)
  }

  if (shadows.insetHighlight?.enabled) {
    const { offsetX, offsetY, blur, spread, color } = shadows.insetHighlight
    parts.push(`inset ${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}`)
  }

  return parts.length > 0
    ? `  --cux-${componentName}-inset-shadow: ${parts.join(', ')};`
    : ''
}

/**
 * Generate dark mode offset shadow
 */
export function generateDarkOffsetShadowVar(
  componentName: string,
  shadows: ComponentShadows | undefined,
  shadowColor: string | undefined
): string {
  if (!shadows?.offset?.enabled) return ''

  const { offsetX, offsetY, blur, spread, color } = shadows.offset
  return `  --cux-${componentName}-shadow: ${offsetX}px ${offsetY}px ${blur}px ${spread}px ${shadowColor || color};`
}

/**
 * Generate dark mode inset shadow
 */
export function generateDarkInsetShadowVar(
  componentName: string,
  shadows: ComponentShadows | undefined,
  shadowInsetColor: string | undefined,
  shadowInsetHighlightColor: string | undefined
): string {
  if (!shadows) return ''

  const parts: string[] = []

  if (shadows.inset?.enabled) {
    const { offsetX, offsetY, blur, spread, color } = shadows.inset
    parts.push(`inset ${offsetX}px ${offsetY}px ${blur}px ${spread}px ${shadowInsetColor || color}`)
  }

  if (shadows.insetHighlight?.enabled) {
    const { offsetX, offsetY, blur, spread, color } = shadows.insetHighlight
    parts.push(`inset ${offsetX}px ${offsetY}px ${blur}px ${spread}px ${shadowInsetHighlightColor || color}`)
  }

  return parts.length > 0
    ? `  --cux-${componentName}-inset-shadow: ${parts.join(', ')};`
    : ''
}

// ==================== Typography Generation ====================

/**
 * Generate typography CSS lines for a component
 * Returns array of CSS lines (without selector)
 */
export function generateTypographyLines(
  options: TypographyOptions,
  globalConfig?: TypographyGlobalConfig
): string[] {
  const lines: string[] = []

  const effectiveFontFamily = getEffectiveFontFamily(options.fontFamily, globalConfig?.fontFamily)

  if (effectiveFontFamily) {
    lines.push(`  font-family: '${effectiveFontFamily}', sans-serif;`)
  }
  if (options.fontSize) {
    lines.push(`  font-size: ${buildFontSize(options.fontSize)};`)
  }
  if (options.fontWeight) {
    lines.push(`  font-weight: ${options.fontWeight};`)
  }
  if (options.fontStyle) {
    lines.push(`  font-style: ${options.fontStyle};`)
  }
  if (options.letterSpacing) {
    lines.push(`  letter-spacing: ${buildLetterSpacing(options.letterSpacing)};`)
  }
  if (options.textAlign) {
    lines.push(`  text-align: ${options.textAlign};`)
  }

  return lines
}

/**
 * Generate typography CSS block with selector
 */
export function generateTypographyBlock(
  selector: string,
  options: TypographyOptions,
  globalConfig?: TypographyGlobalConfig
): string {
  const lines = generateTypographyLines(options, globalConfig)
  if (lines.length === 0) return ''

  return `${selector} {
${lines.join('\n')}
}`
}

// ==================== Base Properties Generation ====================

/**
 * Generate base variant CSS properties (background, color, border, radius, padding)
 */
export function generateBaseProperties(
  componentName: string,
  variant: {
    background: string
    color: string
    border?: BorderValue
    borderRadius?: BorderRadiusValue
    padding?: PaddingValue
  }
): string[] {
  const lines: string[] = []

  lines.push(`  --cux-${componentName}-bg: ${variant.background};`)
  lines.push(`  --cux-${componentName}-color: ${variant.color};`)

  if (variant.border) {
    lines.push(`  --cux-${componentName}-border: ${buildBorder(variant.border)};`)
  }
  if (variant.borderRadius) {
    lines.push(`  --cux-${componentName}-radius: ${buildBorderRadius(variant.borderRadius)};`)
  }
  if (variant.padding) {
    lines.push(`  --cux-${componentName}-padding: ${buildPadding(variant.padding)};`)
  }

  return lines
}

/**
 * Generate dark mode base properties
 */
export function generateDarkBaseProperties(
  componentName: string,
  dark: {
    background?: string
    color?: string
  }
): string[] {
  const lines: string[] = []

  if (dark.background) {
    lines.push(`  --cux-${componentName}-bg: ${dark.background};`)
  }
  if (dark.color) {
    lines.push(`  --cux-${componentName}-color: ${dark.color};`)
  }

  return lines
}

// ==================== Generator Pattern Helpers ====================

/**
 * Standard generator function pattern
 * Handles the common structure: base + variants + dark mode
 */
export function generateComponentCSS(
  componentName: string,
  variants: Array<{ name: string; dark?: Record<string, unknown> }>,
  generateBase: () => string,
  generateVariant: (variantName: string) => string,
  generateVariantDark: (variantName: string) => string
): string {
  const css: string[] = []

  css.push(generateBase())

  variants.forEach(variant => {
    const variantName = variant.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    css.push(generateVariant(variantName))

    if (variant.dark) {
      css.push(generateVariantDark(variantName))
    }
  })

  return css.join('\n\n')
}
