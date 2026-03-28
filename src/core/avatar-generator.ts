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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  vertical-align: middle;
  position: relative;
}

.cui-${COMPONENT} img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cui-${COMPONENT}-initials {
  text-transform: uppercase;
  user-select: none;
}

/* Size modifiers */
.cui-${COMPONENT}.--xs { width: 24px; height: 24px; }
.cui-${COMPONENT}.--sm { width: 32px; height: 32px; }
.cui-${COMPONENT}.--md { width: 40px; height: 40px; }
.cui-${COMPONENT}.--lg { width: 48px; height: 48px; }
.cui-${COMPONENT}.--xl { width: 64px; height: 64px; }
.cui-${COMPONENT}.--xxl { width: 96px; height: 96px; }

/* Status indicator */
.cui-${COMPONENT}-status {
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

.cui-${COMPONENT}-status.--online { background: #28a745; }
.cui-${COMPONENT}-status.--offline { background: #6c757d; }
.cui-${COMPONENT}-status.--busy { background: #dc3545; }
.cui-${COMPONENT}-status.--away { background: #ffc107; }`
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
    lines.push(`.cui-${COMPONENT}.--${variantName} .cui-${COMPONENT}-initials {`)
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
  return lines.join('\n')
}
