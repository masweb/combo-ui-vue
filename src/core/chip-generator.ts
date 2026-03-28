/**
 * Chip CSS Generator
 * Generates CSS for chip variants with custom properties
 */

import type { ChipVariant, TypographyGlobalConfig } from '../types'
import { toKebabCase } from './utils'
import {
  generateBaseProperties,
  generateDarkBaseProperties,
  generateDarkBorderOverride,
  generateShadowVar,
  generateDarkShadowVar,
  generateTypographyLines
} from './css-generator-base'

const COMPONENT = 'chip'

/**
 * Generate complete CSS for chip component
 */
export function generateChipCSS(variants: ChipVariant[], globalConfig?: TypographyGlobalConfig): string {
  const css: string[] = []

  css.push(generateChipBase())

  variants.forEach(variant => {
    const variantName = toKebabCase(variant.name)
    css.push(generateChipVariant(variant, variantName, globalConfig))

    if (variant.dark) {
      css.push(generateChipVariantDark(variant, variantName))
    }
  })

  return css.join('\n\n')
}

/**
 * Generate base chip styles
 */
function generateChipBase(): string {
  return `/* Chip Base Styles */
.cux-${COMPONENT} {
  --cux-${COMPONENT}-bg: #e9ecef;
  --cux-${COMPONENT}-color: #212529;
  --cux-${COMPONENT}-border: none;
  --cux-${COMPONENT}-radius: 16px;
  --cux-${COMPONENT}-padding: 4px 12px;
  --cux-${COMPONENT}-shadow: none;

  /* Close button properties */
  --cux-${COMPONENT}-close-size: 16px;
  --cux-${COMPONENT}-close-color: #495057;
  --cux-${COMPONENT}-close-hover-color: #212529;
  --cux-${COMPONENT}-close-active-color: #000000;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: var(--cux-${COMPONENT}-bg);
  color: var(--cux-${COMPONENT}-color);
  border: var(--cux-${COMPONENT}-border);
  border-radius: var(--cux-${COMPONENT}-radius);
  padding: var(--cux-${COMPONENT}-padding);
  box-shadow: var(--cux-${COMPONENT}-shadow);
  white-space: nowrap;
  vertical-align: middle;
}

.cux-${COMPONENT}-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--cux-${COMPONENT}-close-size);
  height: var(--cux-${COMPONENT}-close-size);
  background: transparent;
  border: none;
  color: var(--cux-${COMPONENT}-close-color);
  cursor: pointer;
  border-radius: 4px;
  transition: color 0.15s ease;
  padding: 0;
  flex-shrink: 0;
}

.cux-${COMPONENT}-close:hover {
  color: var(--cux-${COMPONENT}-close-hover-color);
}

.cux-${COMPONENT}-close:active {
  color: var(--cux-${COMPONENT}-close-active-color);
}

.cux-${COMPONENT}-close svg {
  width: 100%;
  height: 100%;
}`
}

/**
 * Generate CSS for a specific chip variant
 */
function generateChipVariant(variant: ChipVariant, variantName: string, globalConfig?: TypographyGlobalConfig): string {
  const lines: string[] = []
  lines.push(`/* Variant: ${variant.name} */`)
  lines.push(`.cux-${COMPONENT}.--${variantName} {`)

  // Base properties
  lines.push(...generateBaseProperties(COMPONENT, variant))

  // Shadow
  const shadowVar = generateShadowVar(COMPONENT, variant.shadows)
  if (shadowVar) lines.push(shadowVar)

  // Close button properties
  if (variant.closeSize) {
    lines.push(`  --cux-${COMPONENT}-close-size: ${variant.closeSize.value}${variant.closeSize.unit};`)
  }
  lines.push(`  --cux-${COMPONENT}-close-color: ${variant.closeColor};`)
  lines.push(`  --cux-${COMPONENT}-close-hover-color: ${variant.closeHoverColor};`)
  lines.push(`  --cux-${COMPONENT}-close-active-color: ${variant.closeActiveColor};`)

  lines.push('}')

  // Typography
  const typographyLines = generateTypographyLines(
    {
      fontFamily: variant.fontFamily,
      fontSize: variant.fontSize,
      fontWeight: variant.fontWeight,
      fontStyle: variant.fontStyle,
      letterSpacing: variant.letterSpacing
    },
    globalConfig
  )

  if (typographyLines.length > 0) {
    lines.push('')
    lines.push(`.cux-${COMPONENT}.--${variantName} {`)
    lines.push(...typographyLines)
    lines.push('}')
  }

  return lines.join('\n')
}

/**
 * Generate dark mode CSS for a chip variant
 */
function generateChipVariantDark(variant: ChipVariant, variantName: string): string {
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

  // Close button colors
  if (dark.closeColor) lines.push(`  --cux-${COMPONENT}-close-color: ${dark.closeColor};`)
  if (dark.closeHoverColor) lines.push(`  --cux-${COMPONENT}-close-hover-color: ${dark.closeHoverColor};`)
  if (dark.closeActiveColor) lines.push(`  --cux-${COMPONENT}-close-active-color: ${dark.closeActiveColor};`)

  // Shadow
  const shadowVar = generateDarkShadowVar(COMPONENT, variant.shadows, dark)
  if (shadowVar) lines.push(shadowVar)

  lines.push('}')
  return lines.join('\n')
}
