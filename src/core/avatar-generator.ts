/**
 * Avatar CSS Generator
 * Generates CSS for avatar variants with custom properties
 *
 * Structure: wrapper > avatar + online-indicator (siblings)
 * The avatar has overflow:hidden, so the online indicator MUST be outside.
 */

import type { AvatarVariant, TypographyGlobalConfig } from '../types'
import { toKebabCase } from './utils'
import {
  generateBaseProperties,
  generateDarkBaseProperties,
  generateDarkBorderOverride,
  generateShadowVar,
  generateDarkShadowVar,
  generateTypographyLines
} from './css-generator-base'

const COMPONENT = 'avatar'

/**
 * Generate complete CSS for avatar component
 */
export function generateAvatarCSS(variants: AvatarVariant[], globalConfig?: TypographyGlobalConfig): string {
  const css: string[] = []

  css.push(generateAvatarBase())

  variants.forEach(variant => {
    const variantName = toKebabCase(variant.name)
    css.push(generateAvatarVariant(variant, variantName, globalConfig))
    css.push(generateAvatarVariantDark(variant, variantName))
  })

  return css.join('\n\n')
}

/**
 * Generate base avatar styles
 */
function generateAvatarBase(): string {
  return `/* Avatar Base Styles */
.cui-${COMPONENT}-wrapper {
  position: relative;
  display: inline-block;
}

.cui-${COMPONENT} {
  --cui-${COMPONENT}-bg: transparent;
  --cui-${COMPONENT}-color: inherit;
  --cui-${COMPONENT}-border: none;
  --cui-${COMPONENT}-radius: 50%;
  --cui-${COMPONENT}-padding: 0;
  --cui-${COMPONENT}-shadow: none;

  background: var(--cui-${COMPONENT}-bg);
  color: var(--cui-${COMPONENT}-color);
  border: var(--cui-${COMPONENT}-border);
  border-radius: var(--cui-${COMPONENT}-radius);
  padding: var(--cui-${COMPONENT}-padding);
  box-shadow: var(--cui-${COMPONENT}-shadow);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  vertical-align: middle;
}

.cui-${COMPONENT} img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cui-${COMPONENT}-initials {
  text-transform: uppercase;
  user-select: none;
}`
}

/**
 * Generate CSS for a specific avatar variant
 */
function generateAvatarVariant(
  variant: AvatarVariant,
  variantName: string,
  globalConfig?: TypographyGlobalConfig
): string {
  const lines: string[] = []
  lines.push(`/* Variant: ${variant.name} */`)
  lines.push(`.cui-${COMPONENT}.--${variantName} {`)

  // Base properties (bg, color, border, radius, padding via custom properties)
  lines.push(...generateBaseProperties(COMPONENT, variant))

  // Size — direct values like the editor does
  if (variant.size) {
    const size = `${variant.size.value ?? 64}${variant.size.unit ?? 'px'}`
    lines.push(`  width: ${size};`)
    lines.push(`  height: ${size};`)
  }

  // Shadow
  const shadowVar = generateShadowVar(COMPONENT, variant.shadows)
  if (shadowVar) lines.push(shadowVar)

  lines.push('}')

  // Typography for initials
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
    lines.push(`.cui-${COMPONENT}.--${variantName} .cui-${COMPONENT}-initials {`)
    lines.push(...typographyLines)
    lines.push('}')
  }

  // Online indicator — sibling of avatar, scoped via ~ selector
  if (variant.online?.show) {
    const pos = variant.online.position ?? 'bottom-right'
    const vProp = pos.startsWith('top') ? 'top' : 'bottom'
    const hProp = pos.endsWith('right') ? 'right' : 'left'

    lines.push('')
    lines.push(`.cui-${COMPONENT}.--${variantName} ~ .cui-${COMPONENT}-online {`)
    lines.push(`  position: absolute;`)
    lines.push(`  ${vProp}: ${variant.online.offsetY ?? 0}px;`)
    lines.push(`  ${hProp}: ${variant.online.offsetX ?? 0}px;`)
    lines.push(`  width: ${variant.online.size ?? 14}px;`)
    lines.push(`  height: ${variant.online.size ?? 14}px;`)
    lines.push(`  border-radius: 50%;`)
    lines.push(`  background: ${variant.online.color ?? '#28a745'};`)
    lines.push(`  border: 2px solid #fff;`)
    lines.push('}')
  }

  return lines.join('\n')
}

/**
 * Generate dark mode CSS for an avatar variant
 */
function generateAvatarVariantDark(variant: AvatarVariant, variantName: string): string {
  const dark = variant.dark
  if (!dark?.background && !dark?.color && !dark?.borderColor && !dark?.onlineColor) return ''

  const lines: string[] = []
  lines.push(`/* Dark Mode Variant: ${variant.name} */`)
  lines.push(`body[color-scheme="dark"] .cui-${COMPONENT}.--${variantName} {`)

  // Base dark properties
  lines.push(...generateDarkBaseProperties(COMPONENT, dark))

  // Border override
  const borderOverride = generateDarkBorderOverride(COMPONENT, variant.border, dark.borderColor)
  if (borderOverride) lines.push(borderOverride)

  // Shadow
  const shadowVar = generateDarkShadowVar(COMPONENT, variant.shadows, dark)
  if (shadowVar) lines.push(shadowVar)

  lines.push('}')

  // Dark online color
  if (dark.onlineColor && variant.online?.show) {
    lines.push('')
    lines.push(`body[color-scheme="dark"] .cui-${COMPONENT}.--${variantName} ~ .cui-${COMPONENT}-online {`)
    lines.push(`  background: ${dark.onlineColor};`)
    lines.push('}')
  }

  return lines.join('\n')
}
