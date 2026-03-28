/**
 * Badge CSS Generator
 * Generates CSS for badge variants with custom properties
 */

import type { BadgeVariant, TypographyGlobalConfig } from '../types'
import { toKebabCase } from './utils'
import {
  generateBaseProperties,
  generateDarkBaseProperties,
  generateDarkBorderOverride,
  generateShadowVar,
  generateDarkShadowVar,
  generateTypographyBlock
} from './css-generator-base'

const COMPONENT = 'badge'

/**
 * Generate complete CSS for badge component
 */
export function generateBadgeCSS(variants: BadgeVariant[], globalConfig?: TypographyGlobalConfig): string {
  const css: string[] = []

  css.push(generateBadgeBase())

  variants.forEach(variant => {
    const variantName = toKebabCase(variant.name)
    css.push(generateBadgeVariant(variant, variantName, globalConfig))

    if (variant.dark) {
      css.push(generateBadgeVariantDark(variant, variantName))
    }
  })

  return css.join('\n\n')
}

/**
 * Generate base badge styles
 */
function generateBadgeBase(): string {
  return `/* Badge Base Styles */
.cux-${COMPONENT} {
  --cux-${COMPONENT}-bg: #6c757d;
  --cux-${COMPONENT}-color: #ffffff;
  --cux-${COMPONENT}-border: none;
  --cux-${COMPONENT}-radius: 4px;
  --cux-${COMPONENT}-padding: 4px 8px;
  --cux-${COMPONENT}-shadow: none;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--cux-${COMPONENT}-bg);
  color: var(--cux-${COMPONENT}-color);
  border: var(--cux-${COMPONENT}-border);
  border-radius: var(--cux-${COMPONENT}-radius);
  padding: var(--cux-${COMPONENT}-padding);
  box-shadow: var(--cux-${COMPONENT}-shadow);
  white-space: nowrap;
  vertical-align: middle;
}`
}

/**
 * Generate CSS for a specific badge variant
 */
function generateBadgeVariant(
  variant: BadgeVariant,
  variantName: string,
  globalConfig?: TypographyGlobalConfig
): string {
  const lines: string[] = []
  lines.push(`/* Variant: ${variant.name} */`)
  lines.push(`.cux-${COMPONENT}.--${variantName} {`)

  // Base properties
  lines.push(...generateBaseProperties(COMPONENT, variant))

  // Shadow
  const shadowVar = generateShadowVar(COMPONENT, variant.shadows)
  if (shadowVar) lines.push(shadowVar)

  lines.push('}')

  // Typography
  const typographyBlock = generateTypographyBlock(
    `.cux-${COMPONENT}.--${variantName}`,
    {
      fontFamily: variant.fontFamily,
      fontSize: variant.fontSize,
      fontWeight: variant.fontWeight,
      fontStyle: variant.fontStyle,
      letterSpacing: variant.letterSpacing
    },
    globalConfig
  )

  if (typographyBlock) {
    lines.push('')
    lines.push(typographyBlock)
  }

  return lines.join('\n')
}

/**
 * Generate dark mode CSS for a badge variant
 */
function generateBadgeVariantDark(variant: BadgeVariant, variantName: string): string {
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

  // Shadow
  const shadowVar = generateDarkShadowVar(COMPONENT, variant.shadows, dark)
  if (shadowVar) lines.push(shadowVar)

  lines.push('}')
  return lines.join('\n')
}
