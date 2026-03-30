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
.cui-${COMPONENT} {
  --cui-${COMPONENT}-bg: transparent;
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

  /* Close button properties */
  --cui-${COMPONENT}-close-size: 20px;
  --cui-${COMPONENT}-close-color: #6c757d;
  --cui-${COMPONENT}-close-hover-color: #495057;
  --cui-${COMPONENT}-close-active-color: #212529;

  /* Layout */
  --cui-${COMPONENT}-max-width: 500px;
  --cui-${COMPONENT}-offset: 16px;

  position: relative;
  background: var(--cui-${COMPONENT}-bg);
  color: var(--cui-${COMPONENT}-color);
  border: var(--cui-${COMPONENT}-border);
  border-radius: var(--cui-${COMPONENT}-radius);
  box-shadow: var(--cui-${COMPONENT}-shadow);
  max-width: var(--cui-${COMPONENT}-max-width);
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
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

.cui-${COMPONENT}-close {
  flex-shrink: 0;
  width: var(--cui-${COMPONENT}-close-size);
  height: var(--cui-${COMPONENT}-close-size);
  background: transparent;
  border: none;
  color: var(--cui-${COMPONENT}-close-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 4px;
  transition: color 0.15s ease;
}

.cui-${COMPONENT}-close:hover { color: var(--cui-${COMPONENT}-close-hover-color); background: rgba(0, 0, 0, 0.06); }
.cui-${COMPONENT}-close:active { color: var(--cui-${COMPONENT}-close-active-color); background: rgba(0, 0, 0, 0.12); }
.cui-${COMPONENT}-close svg { width: 100%; height: 100%; }

/* Auto-dismiss animation */
@keyframes cui-${COMPONENT}-dismiss {
  0%, 85% { opacity: 1; }
  100% { opacity: 0; pointer-events: none; visibility: hidden; }
}

/* Position modifiers */
.cui-${COMPONENT}.--top-left { position: fixed; top: var(--cui-${COMPONENT}-offset); left: var(--cui-${COMPONENT}-offset); z-index: 9999; }
.cui-${COMPONENT}.--top-center { position: fixed; top: var(--cui-${COMPONENT}-offset); left: 50%; transform: translateX(-50%); z-index: 9999; }
.cui-${COMPONENT}.--top-right { position: fixed; top: var(--cui-${COMPONENT}-offset); right: var(--cui-${COMPONENT}-offset); z-index: 9999; }
.cui-${COMPONENT}.--center-left { position: fixed; top: 50%; left: var(--cui-${COMPONENT}-offset); transform: translateY(-50%); z-index: 9999; }
.cui-${COMPONENT}.--center-center { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 9999; }
.cui-${COMPONENT}.--center-right { position: fixed; top: 50%; right: var(--cui-${COMPONENT}-offset); transform: translateY(-50%); z-index: 9999; }
.cui-${COMPONENT}.--bottom-left { position: fixed; bottom: var(--cui-${COMPONENT}-offset); left: var(--cui-${COMPONENT}-offset); z-index: 9999; }
.cui-${COMPONENT}.--bottom-center { position: fixed; bottom: var(--cui-${COMPONENT}-offset); left: 50%; transform: translateX(-50%); z-index: 9999; }
.cui-${COMPONENT}.--bottom-right { position: fixed; bottom: var(--cui-${COMPONENT}-offset); right: var(--cui-${COMPONENT}-offset); z-index: 9999; }`
}

function getPositionCSS(position: string): string {
  const offset = `var(--cui-${COMPONENT}-offset)`
  const base = `position: fixed; z-index: 9999;`
  const positions: Record<string, string> = {
    'top-left': `${base} top: ${offset}; left: ${offset};`,
    'top-center': `${base} top: ${offset}; left: 50%; transform: translateX(-50%);`,
    'top-right': `${base} top: ${offset}; right: ${offset};`,
    'center-left': `${base} top: 50%; left: ${offset}; transform: translateY(-50%);`,
    'center-center': `${base} top: 50%; left: 50%; transform: translate(-50%, -50%);`,
    'center-right': `${base} top: 50%; right: ${offset}; transform: translateY(-50%);`,
    'bottom-left': `${base} bottom: ${offset}; left: ${offset};`,
    'bottom-center': `${base} bottom: ${offset}; left: 50%; transform: translateX(-50%);`,
    'bottom-right': `${base} bottom: ${offset}; right: ${offset};`
  }
  return positions[position] ?? positions['top-right']!
}

/**
 * Generate CSS for a specific alert variant
 */
function generateAlertVariant(
  variant: AlertVariant,
  variantName: string,
  globalConfig?: TypographyGlobalConfig
): string {
  const lines: string[] = []
  lines.push(`/* Variant: ${variant.name} */`)
  lines.push(`.cui-${COMPONENT}.--${variantName} {`)
  lines.push(`  ${getPositionCSS(variant.position)}`)

  // Base properties
  lines.push(`  --cui-${COMPONENT}-bg: ${variant.background};`)
  lines.push(`  --cui-${COMPONENT}-color: ${variant.color};`)

  if (variant.border) lines.push(`  --cui-${COMPONENT}-border: ${buildBorder(variant.border)};`)
  if (variant.borderRadius)
    lines.push(`  --cui-${COMPONENT}-radius: ${variant.borderRadius.tl}${variant.borderRadius.unit};`)
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
  if (variant.headerBorderBottom)
    lines.push(`  --cui-${COMPONENT}-header-border-bottom: ${buildBorder(variant.headerBorderBottom)};`)

  // Close button properties
  if (variant.closeSize)
    lines.push(`  --cui-${COMPONENT}-close-size: ${variant.closeSize.value}${variant.closeSize.unit};`)
  lines.push(`  --cui-${COMPONENT}-close-color: ${variant.closeColor};`)
  lines.push(`  --cui-${COMPONENT}-close-hover-color: ${variant.closeHoverColor};`)
  lines.push(`  --cui-${COMPONENT}-close-active-color: ${variant.closeActiveColor};`)

  // Layout
  lines.push(`  --cui-${COMPONENT}-max-width: ${variant.maxWidth.value}${variant.maxWidth.unit};`)
  lines.push(`  --cui-${COMPONENT}-offset: ${variant.offset.value}${variant.offset.unit};`)

  // Auto-dismiss animation
  if (variant.autoDismiss > 0) {
    lines.push(`  animation: cui-${COMPONENT}-dismiss ${variant.autoDismiss}ms ease-in forwards;`)
  }

  lines.push('}')

  // Hide close button when showClose is false
  if (!variant.showClose) {
    lines.push('')
    lines.push(`.cui-${COMPONENT}.--${variantName} .cui-${COMPONENT}-close { display: none; }`)
  }

  // Body typography
  const bodyTypography = generateTypographyLines(
    {
      fontFamily: variant.fontFamily,
      fontSize: variant.fontSize,
      fontWeight: variant.fontWeight,
      fontStyle: variant.fontStyle,
      letterSpacing: variant.letterSpacing,
      textAlign: variant.textAlign
    },
    globalConfig
  )

  if (bodyTypography.length > 0) {
    lines.push('')
    lines.push(`.cui-${COMPONENT}.--${variantName} .cui-${COMPONENT}-body {`)
    lines.push(...bodyTypography)
    lines.push('}')
  }

  // Header typography
  const headerTypography = generateTypographyLines(
    {
      fontFamily: variant.headerFontFamily,
      fontSize: variant.headerFontSize,
      fontWeight: variant.headerFontWeight,
      fontStyle: variant.headerFontStyle,
      letterSpacing: variant.headerLetterSpacing,
      textAlign: variant.headerTextAlign
    },
    globalConfig
  )

  if (headerTypography.length > 0) {
    lines.push('')
    lines.push(`.cui-${COMPONENT}.--${variantName} .cui-${COMPONENT}-header {`)
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
    lines.push(
      `  --cui-${COMPONENT}-header-border-bottom: ${variant.headerBorderBottom.width}${variant.headerBorderBottom.unit} ${variant.headerBorderBottom.style} ${dark.headerBorderBottomColor};`
    )
  }

  // Close button colors
  if (dark.closeColor) lines.push(`  --cui-${COMPONENT}-close-color: ${dark.closeColor};`)
  if (dark.closeHoverColor) lines.push(`  --cui-${COMPONENT}-close-hover-color: ${dark.closeHoverColor};`)
  if (dark.closeActiveColor) lines.push(`  --cui-${COMPONENT}-close-active-color: ${dark.closeActiveColor};`)

  // Shadows for dark mode
  const offsetShadow = generateDarkOffsetShadowVar(COMPONENT, variant.shadows, dark.shadowColor)
  if (offsetShadow) lines.push(offsetShadow)

  const insetShadow = generateDarkInsetShadowVar(
    COMPONENT,
    variant.shadows,
    dark.shadowInsetColor,
    dark.shadowInsetHighlightColor
  )
  if (insetShadow) lines.push(insetShadow)

  lines.push('}')
  return lines.join('\n')
}
