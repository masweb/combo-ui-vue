/**
 * Typography CSS Generator
 */

import type { TypographyData, TypographyVariant, TypographyGlobalConfig, UnitNumber } from '../types'
import { buildFontSize } from './utils'

/**
 * Build CSS value from UnitNumber or string
 */
function buildUnitValue(value: UnitNumber | string | undefined, defaultUnit: string = 'px'): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  return `${value.value}${value.unit || defaultUnit}`
}

/**
 * Get effective font family (fallback to global)
 */
function getEffectiveFontFamily(variant: TypographyVariant, globalConfig?: TypographyGlobalConfig): string {
  return variant.fontFamily || globalConfig?.fontFamily || 'system-ui, sans-serif'
}

/**
 * Get effective color (fallback to global)
 */
function getEffectiveColor(
  variant: TypographyVariant,
  globalConfig?: TypographyGlobalConfig,
  isDark: boolean = false
): string {
  const darkOverride = isDark ? variant.dark?.color : null
  const globalDarkOverride = isDark ? globalConfig?.dark?.color : null

  if (darkOverride) return darkOverride
  if (variant.color) return variant.color
  if (globalDarkOverride) return globalDarkOverride
  if (globalConfig?.color) return globalConfig.color

  return isDark ? '#f8f9fa' : '#212529'
}

/**
 * Get line height as CSS value
 */
function buildLineHeight(value: UnitNumber | undefined): string {
  if (!value) return '1.5'
  return `${value.value}${value.unit || ''}`
}

/**
 * Generate CSS for a single typography variant
 */
function generateTypographyVariantCSS(variant: TypographyVariant, globalConfig?: TypographyGlobalConfig): string {
  const fontFamily = getEffectiveFontFamily(variant, globalConfig)
  const color = getEffectiveColor(variant, globalConfig, false)

  const css: string[] = []

  // Base styles
  css.push(`  font-family: '${fontFamily}', sans-serif;`)
  css.push(`  font-style: ${variant.fontStyle || 'normal'};`)
  css.push(`  font-weight: ${variant.fontWeight || '400'};`)

  if (variant.fontSize) {
    css.push(`  font-size: ${buildFontSize(variant.fontSize)};`)
  }

  if (variant.letterSpacing) {
    css.push(`  letter-spacing: ${buildUnitValue(variant.letterSpacing)};`)
  }

  if (variant.lineHeight) {
    css.push(`  line-height: ${buildLineHeight(variant.lineHeight)};`)
  }

  if (variant.textTransform) {
    css.push(`  text-transform: ${variant.textTransform};`)
  }

  if (variant.textDecoration) {
    css.push(`  text-decoration: ${variant.textDecoration};`)
  }

  css.push(`  color: ${color};`)

  return css.join('\n')
}

/**
 * Generate complete typography CSS
 */
export function generateTypographyCSS(typography: TypographyData): string {
  const css: string[] = []
  const globalConfig = typography.globalConfig
  const variants = typography.variants || []

  // Typography base class
  css.push(`/* Typography Base */`)
  css.push(`.cux-typography {`)
  if (globalConfig?.fontFamily) {
    css.push(`  font-family: '${globalConfig.fontFamily}', sans-serif;`)
  }
  if (globalConfig?.color) {
    css.push(`  color: ${globalConfig.color};`)
  }
  css.push(`}`)
  css.push('')

  // Generate CSS for each variant
  const headingVariants = variants.filter(v => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(v.id))
  const displayVariants = variants.filter(v => v.id?.startsWith('display'))
  const bodyVariants = variants.filter(v => ['body', 'small', 'caption', 'link'].includes(v.id))

  // Headings
  if (headingVariants.length > 0) {
    css.push(`/* Headings */`)
    headingVariants.forEach(variant => {
      css.push(`.cux-${variant.id} {`)
      css.push(generateTypographyVariantCSS(variant, globalConfig))
      css.push(`}`)

      // Dark mode
      css.push(`.dark .cux-${variant.id} {`)
      css.push(`  color: ${getEffectiveColor(variant, globalConfig, true)};`)
      css.push(`}`)
    })
    css.push('')
  }

  // Display
  if (displayVariants.length > 0) {
    css.push(`/* Display */`)
    displayVariants.forEach(variant => {
      css.push(`.cux-${variant.id} {`)
      css.push(generateTypographyVariantCSS(variant, globalConfig))
      css.push(`}`)

      // Dark mode
      css.push(`.dark .cux-${variant.id} {`)
      css.push(`  color: ${getEffectiveColor(variant, globalConfig, true)};`)
      css.push(`}`)
    })
    css.push('')
  }

  // Body text
  if (bodyVariants.length > 0) {
    css.push(`/* Body Text */`)
    bodyVariants.forEach(variant => {
      css.push(`.cux-${variant.id} {`)
      css.push(generateTypographyVariantCSS(variant, globalConfig))
      css.push(`}`)

      // Dark mode
      css.push(`.dark .cux-${variant.id} {`)
      css.push(`  color: ${getEffectiveColor(variant, globalConfig, true)};`)
      css.push(`}`)
    })
  }

  return css.join('\n')
}
