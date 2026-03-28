/**
 * Card CSS Generator
 * Generates CSS for card variants with custom properties
 * Uses overlay pattern for inset shadows
 */

import type { CardVariant, TypographyGlobalConfig } from '../types'
import { toKebabCase, buildBorder, buildPadding } from './utils'
import {
  generateDarkBaseProperties,
  generateDarkBorderOverride,
  generateOffsetShadowVar,
  generateInsetShadowVar,
  generateDarkOffsetShadowVar,
  generateDarkInsetShadowVar,
  generateTypographyLines
} from './css-generator-base'

const COMPONENT = 'card'

/**
 * Generate complete CSS for card component
 */
export function generateCardCSS(variants: CardVariant[], globalConfig?: TypographyGlobalConfig): string {
  const css: string[] = []

  css.push(generateCardBase())

  variants.forEach(variant => {
    const variantName = toKebabCase(variant.name)
    css.push(generateCardVariant(variant, variantName, globalConfig))

    if (variant.dark) {
      css.push(generateCardVariantDark(variant, variantName))
    }
  })

  return css.join('\n\n')
}

/**
 * Generate base card styles
 */
function generateCardBase(): string {
  return `/* Card Base Styles */
.cux-${COMPONENT} {
  --cux-${COMPONENT}-bg: #ffffff;
  --cux-${COMPONENT}-color: inherit;
  --cux-${COMPONENT}-border: none;
  --cux-${COMPONENT}-radius: 0;
  --cux-${COMPONENT}-padding: 0;
  --cux-${COMPONENT}-shadow: none;
  --cux-${COMPONENT}-inset-shadow: none;

  /* Header properties */
  --cux-${COMPONENT}-header-bg: transparent;
  --cux-${COMPONENT}-header-color: inherit;
  --cux-${COMPONENT}-header-padding: 0;
  --cux-${COMPONENT}-header-border-bottom: none;

  position: relative;
  background: var(--cux-${COMPONENT}-bg);
  color: var(--cux-${COMPONENT}-color);
  border: var(--cux-${COMPONENT}-border);
  border-radius: var(--cux-${COMPONENT}-radius);
  box-shadow: var(--cux-${COMPONENT}-shadow);
  overflow: hidden;
}

.cux-${COMPONENT}-inset-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  border-radius: var(--cux-${COMPONENT}-radius);
  box-shadow: var(--cux-${COMPONENT}-inset-shadow);
  pointer-events: none;
}

.cux-${COMPONENT}-header {
  position: relative;
  z-index: 1;
  background: var(--cux-${COMPONENT}-header-bg);
  color: var(--cux-${COMPONENT}-header-color);
  padding: var(--cux-${COMPONENT}-header-padding);
  border-bottom: var(--cux-${COMPONENT}-header-border-bottom);
}

.cux-${COMPONENT}-body {
  position: relative;
  z-index: 1;
  padding: var(--cux-${COMPONENT}-padding);
}

.cux-${COMPONENT}-footer {
  position: relative;
  z-index: 1;
  padding: var(--cux-${COMPONENT}-padding);
  border-top: var(--cux-${COMPONENT}-header-border-bottom);
}`
}

/**
 * Generate CSS for a specific card variant
 */
function generateCardVariant(variant: CardVariant, variantName: string, globalConfig?: TypographyGlobalConfig): string {
  const lines: string[] = []
  lines.push(`/* Variant: ${variant.name} */`)
  lines.push(`.cux-${COMPONENT}.--${variantName} {`)

  // Base properties
  lines.push(`  --cux-${COMPONENT}-bg: ${variant.background};`)
  lines.push(`  --cux-${COMPONENT}-color: ${variant.color};`)

  if (variant.border) lines.push(`  --cux-${COMPONENT}-border: ${buildBorder(variant.border)};`)
  if (variant.borderRadius) lines.push(`  --cux-${COMPONENT}-radius: ${variant.borderRadius.tl}${variant.borderRadius.unit};`)
  if (variant.padding) lines.push(`  --cux-${COMPONENT}-padding: ${buildPadding(variant.padding)};`)

  // Shadows (offset + inset overlay pattern)
  const offsetShadow = generateOffsetShadowVar(COMPONENT, variant.shadows)
  if (offsetShadow) lines.push(offsetShadow)

  const insetShadow = generateInsetShadowVar(COMPONENT, variant.shadows)
  if (insetShadow) lines.push(insetShadow)

  // Header properties
  lines.push(`  --cux-${COMPONENT}-header-bg: ${variant.headerBackground};`)
  lines.push(`  --cux-${COMPONENT}-header-color: ${variant.headerColor};`)

  if (variant.headerPadding) lines.push(`  --cux-${COMPONENT}-header-padding: ${buildPadding(variant.headerPadding)};`)
  if (variant.headerBorderBottom) lines.push(`  --cux-${COMPONENT}-header-border-bottom: ${buildBorder(variant.headerBorderBottom)};`)

  lines.push('}')

  // Body typography
  const bodyTypography = generateTypographyLines({
    fontFamily: variant.fontFamily,
    fontSize: variant.fontSize,
    fontWeight: variant.fontWeight,
    fontStyle: variant.fontStyle,
    letterSpacing: variant.letterSpacing,
    textAlign: variant.textAlign
  }, globalConfig)

  if (bodyTypography.length > 0) {
    lines.push('')
    lines.push(`.cux-${COMPONENT}.--${variantName} .cux-${COMPONENT}-body {`)
    lines.push(...bodyTypography)
    lines.push('}')
  }

  // Header typography
  const headerTypography = generateTypographyLines({
    fontFamily: variant.headerFontFamily,
    fontSize: variant.headerFontSize,
    fontWeight: variant.headerFontWeight,
    fontStyle: variant.headerFontStyle,
    letterSpacing: variant.headerLetterSpacing,
    textAlign: variant.headerTextAlign
  }, globalConfig)

  if (headerTypography.length > 0) {
    lines.push('')
    lines.push(`.cux-${COMPONENT}.--${variantName} .cux-${COMPONENT}-header {`)
    lines.push(...headerTypography)
    lines.push('}')
  }

  return lines.join('\n')
}

/**
 * Generate dark mode CSS for a card variant
 */
function generateCardVariantDark(variant: CardVariant, variantName: string): string {
  const dark = variant.dark
  if (!dark) return ''

  const lines: string[] = []
  lines.push(`/* Dark Mode Variant: ${variant.name} */`)
  lines.push(`.dark .cux-${COMPONENT}.--${variantName} {`)

  // Base dark properties
  lines.push(...generateDarkBaseProperties(COMPONENT, dark))

  // Border override
  const borderOverride = generateDarkBorderOverride(COMPONENT, variant.border, dark.borderColor)
  if (borderOverride) lines.push(borderOverride)

  // Header properties
  if (dark.headerBackground) lines.push(`  --cux-${COMPONENT}-header-bg: ${dark.headerBackground};`)
  if (dark.headerColor) lines.push(`  --cux-${COMPONENT}-header-color: ${dark.headerColor};`)

  // Header border override
  if (dark.headerBorderBottomColor && variant.headerBorderBottom) {
    lines.push(`  --cux-${COMPONENT}-header-border-bottom: ${variant.headerBorderBottom.width}${variant.headerBorderBottom.unit} ${variant.headerBorderBottom.style} ${dark.headerBorderBottomColor};`)
  }

  // Shadows for dark mode
  const offsetShadow = generateDarkOffsetShadowVar(COMPONENT, variant.shadows, dark.shadowColor)
  if (offsetShadow) lines.push(offsetShadow)

  const insetShadow = generateDarkInsetShadowVar(COMPONENT, variant.shadows, dark.shadowInsetColor, dark.shadowInsetHighlightColor)
  if (insetShadow) lines.push(insetShadow)

  lines.push('}')
  return lines.join('\n')
}
