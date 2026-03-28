/**
 * Alert CSS Generator
 * Generates CSS for alert variants with custom properties
 * Uses overlay pattern for inset shadows
 */

import type { AlertVariant, TypographyGlobalConfig } from '../types'
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

const COMPONENT = 'alert'

/**
 * Generate complete CSS for alert component
 */
export function generateAlertCSS(variants: AlertVariant[], globalConfig?: TypographyGlobalConfig): string {
  const css: string[] = []

  css.push(generateAlertBase())

  variants.forEach(variant => {
    const variantName = toKebabCase(variant.name)
    css.push(generateAlertVariant(variant, variantName, globalConfig))

    if (variant.dark) {
      css.push(generateAlertVariantDark(variant, variantName))
    }
  })

  return css.join('\n\n')
}

/**
 * Generate base alert styles
 */
function generateAlertBase(): string {
  return `/* Alert Base Styles */
.cux-${COMPONENT} {
  --cux-${COMPONENT}-bg: transparent;
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

  /* Close button properties */
  --cux-${COMPONENT}-close-size: 20px;
  --cux-${COMPONENT}-close-color: #6c757d;
  --cux-${COMPONENT}-close-hover-color: #495057;
  --cux-${COMPONENT}-close-active-color: #212529;

  /* Layout */
  --cux-${COMPONENT}-max-width: 500px;
  --cux-${COMPONENT}-offset: 16px;

  position: relative;
  background: var(--cux-${COMPONENT}-bg);
  color: var(--cux-${COMPONENT}-color);
  border: var(--cux-${COMPONENT}-border);
  border-radius: var(--cux-${COMPONENT}-radius);
  box-shadow: var(--cux-${COMPONENT}-shadow);
  max-width: var(--cux-${COMPONENT}-max-width);
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
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

.cux-${COMPONENT}-close {
  flex-shrink: 0;
  width: var(--cux-${COMPONENT}-close-size);
  height: var(--cux-${COMPONENT}-close-size);
  background: transparent;
  border: none;
  color: var(--cux-${COMPONENT}-close-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 4px;
  transition: color 0.15s ease;
}

.cux-${COMPONENT}-close:hover { color: var(--cux-${COMPONENT}-close-hover-color); }
.cux-${COMPONENT}-close:active { color: var(--cux-${COMPONENT}-close-active-color); }
.cux-${COMPONENT}-close svg { width: 100%; height: 100%; }

/* Position modifiers */
.cux-${COMPONENT}.--top-left { position: fixed; top: var(--cux-${COMPONENT}-offset); left: var(--cux-${COMPONENT}-offset); z-index: 9999; }
.cux-${COMPONENT}.--top-center { position: fixed; top: var(--cux-${COMPONENT}-offset); left: 50%; transform: translateX(-50%); z-index: 9999; }
.cux-${COMPONENT}.--top-right { position: fixed; top: var(--cux-${COMPONENT}-offset); right: var(--cux-${COMPONENT}-offset); z-index: 9999; }
.cux-${COMPONENT}.--center-left { position: fixed; top: 50%; left: var(--cux-${COMPONENT}-offset); transform: translateY(-50%); z-index: 9999; }
.cux-${COMPONENT}.--center-center { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 9999; }
.cux-${COMPONENT}.--center-right { position: fixed; top: 50%; right: var(--cux-${COMPONENT}-offset); transform: translateY(-50%); z-index: 9999; }
.cux-${COMPONENT}.--bottom-left { position: fixed; bottom: var(--cux-${COMPONENT}-offset); left: var(--cux-${COMPONENT}-offset); z-index: 9999; }
.cux-${COMPONENT}.--bottom-center { position: fixed; bottom: var(--cux-${COMPONENT}-offset); left: 50%; transform: translateX(-50%); z-index: 9999; }
.cux-${COMPONENT}.--bottom-right { position: fixed; bottom: var(--cux-${COMPONENT}-offset); right: var(--cux-${COMPONENT}-offset); z-index: 9999; }`
}

/**
 * Generate CSS for a specific alert variant
 */
function generateAlertVariant(variant: AlertVariant, variantName: string, globalConfig?: TypographyGlobalConfig): string {
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

  // Close button properties
  if (variant.closeSize) lines.push(`  --cux-${COMPONENT}-close-size: ${variant.closeSize.value}${variant.closeSize.unit};`)
  lines.push(`  --cux-${COMPONENT}-close-color: ${variant.closeColor};`)
  lines.push(`  --cux-${COMPONENT}-close-hover-color: ${variant.closeHoverColor};`)
  lines.push(`  --cux-${COMPONENT}-close-active-color: ${variant.closeActiveColor};`)

  // Layout
  lines.push(`  --cux-${COMPONENT}-max-width: ${variant.maxWidth.value}${variant.maxWidth.unit};`)
  lines.push(`  --cux-${COMPONENT}-offset: ${variant.offset.value}${variant.offset.unit};`)

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
 * Generate dark mode CSS for an alert variant
 */
function generateAlertVariantDark(variant: AlertVariant, variantName: string): string {
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

  // Close button colors
  if (dark.closeColor) lines.push(`  --cux-${COMPONENT}-close-color: ${dark.closeColor};`)
  if (dark.closeHoverColor) lines.push(`  --cux-${COMPONENT}-close-hover-color: ${dark.closeHoverColor};`)
  if (dark.closeActiveColor) lines.push(`  --cux-${COMPONENT}-close-active-color: ${dark.closeActiveColor};`)

  // Shadows for dark mode
  const offsetShadow = generateDarkOffsetShadowVar(COMPONENT, variant.shadows, dark.shadowColor)
  if (offsetShadow) lines.push(offsetShadow)

  const insetShadow = generateDarkInsetShadowVar(COMPONENT, variant.shadows, dark.shadowInsetColor, dark.shadowInsetHighlightColor)
  if (insetShadow) lines.push(insetShadow)

  lines.push('}')
  return lines.join('\n')
}
