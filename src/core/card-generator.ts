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
.cui-${COMPONENT} {
  --cui-${COMPONENT}-bg: #ffffff;
  --cui-${COMPONENT}-color: inherit;
  --cui-${COMPONENT}-border: none;
  --cui-${COMPONENT}-radius: 0;
  --cui-${COMPONENT}-padding: 0;
  --cui-${COMPONENT}-shadow: none;
  --cui-${COMPONENT}-inset-shadow: none;

  /* Header properties */
  --cui-${COMPONENT}-header-bg: transparent;
  --cui-${COMPONENT}-header-color: inherit;
  --cui-${COMPONENT}-header-padding: 0;
  --cui-${COMPONENT}-header-border-bottom: none;

  position: relative;
  background: var(--cui-${COMPONENT}-bg);
  color: var(--cui-${COMPONENT}-color);
  border: var(--cui-${COMPONENT}-border);
  border-radius: var(--cui-${COMPONENT}-radius);
  box-shadow: var(--cui-${COMPONENT}-shadow);
  overflow: hidden;
}

.cui-${COMPONENT}-inset-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  border-radius: var(--cui-${COMPONENT}-radius);
  box-shadow: var(--cui-${COMPONENT}-inset-shadow);
  pointer-events: none;
}

.cui-${COMPONENT}-header {
  position: relative;
  z-index: 1;
  background: var(--cui-${COMPONENT}-header-bg);
  color: var(--cui-${COMPONENT}-header-color);
  padding: var(--cui-${COMPONENT}-header-padding);
  border-bottom: var(--cui-${COMPONENT}-header-border-bottom);
}

.cui-${COMPONENT}-body {
  position: relative;
  z-index: 1;
  padding: var(--cui-${COMPONENT}-padding);
}

.cui-${COMPONENT}-footer {
  position: relative;
  z-index: 1;
  padding: var(--cui-${COMPONENT}-padding);
  border-top: var(--cui-${COMPONENT}-header-border-bottom);
}`
}

/**
 * Generate CSS for a specific card variant
 */
function generateCardVariant(variant: CardVariant, variantName: string, globalConfig?: TypographyGlobalConfig): string {
  const lines: string[] = []
  lines.push(`/* Variant: ${variant.name} */`)
  lines.push(`.cui-${COMPONENT}.--${variantName} {`)

  // Base properties
  lines.push(`  --cui-${COMPONENT}-bg: ${variant.background};`)
  lines.push(`  --cui-${COMPONENT}-color: ${variant.color};`)

  if (variant.border) lines.push(`  --cui-${COMPONENT}-border: ${buildBorder(variant.border)};`)
  if (variant.borderRadius) lines.push(`  --cui-${COMPONENT}-radius: ${variant.borderRadius.tl}${variant.borderRadius.unit};`)
  if (variant.padding) lines.push(`  --cui-${COMPONENT}-padding: ${buildPadding(variant.padding)};`)

  // Shadows (offset + inset overlay pattern)
  const offsetShadow = generateOffsetShadowVar(COMPONENT, variant.shadows)
  if (offsetShadow) lines.push(offsetShadow)

  const insetShadow = generateInsetShadowVar(COMPONENT, variant.shadows)
  if (insetShadow) lines.push(insetShadow)

  // Header properties
  lines.push(`  --cui-${COMPONENT}-header-bg: ${variant.headerBackground};`)
  lines.push(`  --cui-${COMPONENT}-header-color: ${variant.headerColor};`)

  if (variant.headerPadding) lines.push(`  --cui-${COMPONENT}-header-padding: ${buildPadding(variant.headerPadding)};`)
  if (variant.headerBorderBottom) lines.push(`  --cui-${COMPONENT}-header-border-bottom: ${buildBorder(variant.headerBorderBottom)};`)

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
    lines.push(`.cui-${COMPONENT}.--${variantName} .cui-${COMPONENT}-body {`)
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
    lines.push(`.cui-${COMPONENT}.--${variantName} .cui-${COMPONENT}-header {`)
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
  lines.push(`body[color-scheme="dark"] .cui-${COMPONENT}.--${variantName} {`)

  // Base dark properties
  lines.push(...generateDarkBaseProperties(COMPONENT, dark))

  // Border override
  const borderOverride = generateDarkBorderOverride(COMPONENT, variant.border, dark.borderColor)
  if (borderOverride) lines.push(borderOverride)

  // Header properties
  if (dark.headerBackground) lines.push(`  --cui-${COMPONENT}-header-bg: ${dark.headerBackground};`)
  if (dark.headerColor) lines.push(`  --cui-${COMPONENT}-header-color: ${dark.headerColor};`)

  // Header border override
  if (dark.headerBorderBottomColor && variant.headerBorderBottom) {
    lines.push(`  --cui-${COMPONENT}-header-border-bottom: ${variant.headerBorderBottom.width}${variant.headerBorderBottom.unit} ${variant.headerBorderBottom.style} ${dark.headerBorderBottomColor};`)
  }

  // Shadows for dark mode
  const offsetShadow = generateDarkOffsetShadowVar(COMPONENT, variant.shadows, dark.shadowColor)
  if (offsetShadow) lines.push(offsetShadow)

  const insetShadow = generateDarkInsetShadowVar(COMPONENT, variant.shadows, dark.shadowInsetColor, dark.shadowInsetHighlightColor)
  if (insetShadow) lines.push(insetShadow)

  lines.push('}')
  return lines.join('\n')
}
