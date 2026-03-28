/**
 * Avatar CSS Generator
 * Generates CSS for avatar variants with custom properties
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

    if (variant.dark) {
      css.push(generateAvatarVariantDark(variant, variantName))
    }
  })

  return css.join('\n\n')
}

/**
 * Generate base avatar styles
 */
function generateAvatarBase(): string {
  return `/* Avatar Base Styles */
.cux-${COMPONENT} {
  --cux-${COMPONENT}-bg: transparent;
  --cux-${COMPONENT}-color: inherit;
  --cux-${COMPONENT}-border: none;
  --cux-${COMPONENT}-radius: 50%;
  --cux-${COMPONENT}-padding: 0;
  --cux-${COMPONENT}-shadow: none;

  background: var(--cux-${COMPONENT}-bg);
  color: var(--cux-${COMPONENT}-color);
  border: var(--cux-${COMPONENT}-border);
  border-radius: var(--cux-${COMPONENT}-radius);
  padding: var(--cux-${COMPONENT}-padding);
  box-shadow: var(--cux-${COMPONENT}-shadow);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  vertical-align: middle;
  position: relative;
}

.cux-${COMPONENT} img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cux-${COMPONENT}-initials {
  text-transform: uppercase;
  user-select: none;
}

/* Size modifiers */
.cux-${COMPONENT}.--xs { width: 24px; height: 24px; }
.cux-${COMPONENT}.--sm { width: 32px; height: 32px; }
.cux-${COMPONENT}.--md { width: 40px; height: 40px; }
.cux-${COMPONENT}.--lg { width: 48px; height: 48px; }
.cux-${COMPONENT}.--xl { width: 64px; height: 64px; }
.cux-${COMPONENT}.--xxl { width: 96px; height: 96px; }

/* Status indicator */
.cux-${COMPONENT}-status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 25%;
  height: 25%;
  min-width: 8px;
  min-height: 8px;
  border-radius: 50%;
  border: 2px solid white;
  background: #6c757d;
}

.cux-${COMPONENT}-status.--online { background: #28a745; }
.cux-${COMPONENT}-status.--offline { background: #6c757d; }
.cux-${COMPONENT}-status.--busy { background: #dc3545; }
.cux-${COMPONENT}-status.--away { background: #ffc107; }`
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
  lines.push(`.cux-${COMPONENT}.--${variantName} {`)

  // Base properties
  lines.push(...generateBaseProperties(COMPONENT, variant))

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
    lines.push(`.cux-${COMPONENT}.--${variantName} .cux-${COMPONENT}-initials {`)
    lines.push(...typographyLines)
    lines.push('}')
  }

  return lines.join('\n')
}

/**
 * Generate dark mode CSS for an avatar variant
 */
function generateAvatarVariantDark(variant: AvatarVariant, variantName: string): string {
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
