/**
 * Progress CSS Generator
 * Generates CSS for progress bar variants with custom properties
 * Uses overlay pattern for inset shadows
 */

import type { ProgressVariant, TypographyGlobalConfig } from '../types'
import { toKebabCase, buildBorder, buildBorderRadius, buildFontSize } from './utils'
import {
  generateDarkBorderOverride,
  generateOffsetShadowVar,
  generateInsetShadowVar,
  generateDarkOffsetShadowVar,
  generateDarkInsetShadowVar,
  generateTypographyLines
} from './css-generator-base'

const COMPONENT = 'progress'

/**
 * Generate complete CSS for progress component
 */
export function generateProgressCSS(variants: ProgressVariant[], globalConfig?: TypographyGlobalConfig): string {
  const css: string[] = []

  css.push(generateProgressBase())

  variants.forEach(variant => {
    const variantName = toKebabCase(variant.name)
    css.push(generateProgressVariant(variant, variantName, globalConfig))

    if (variant.dark) {
      css.push(generateProgressVariantDark(variant, variantName))
    }
  })

  return css.join('\n\n')
}

/**
 * Generate base progress styles
 */
function generateProgressBase(): string {
  return `/* Progress Base Styles */
.cui-${COMPONENT} {
  --cui-${COMPONENT}-track-color: #e9ecef;
  --cui-${COMPONENT}-fill-color: #0d6efd;
  --cui-${COMPONENT}-stripe-color: rgba(255, 255, 255, 0.15);
  --cui-${COMPONENT}-height: 16px;
  --cui-${COMPONENT}-radius: 4px;
  --cui-${COMPONENT}-border: none;
  --cui-${COMPONENT}-shadow: none;
  --cui-${COMPONENT}-inset-shadow: none;
  --cui-${COMPONENT}-stripe-speed: 1s;

  /* Label properties */
  --cui-${COMPONENT}-label-color: #212529;
  --cui-${COMPONENT}-label-font-size: 12px;

  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--cui-${COMPONENT}-track-color);
  height: var(--cui-${COMPONENT}-height);
  border-radius: var(--cui-${COMPONENT}-radius);
  border: var(--cui-${COMPONENT}-border);
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

.cui-${COMPONENT}-fill {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  height: 100%;
  background-color: var(--cui-${COMPONENT}-fill-color);
  transition: width 0.3s ease;
}

.cui-${COMPONENT}-fill.--striped {
  background-image: linear-gradient(
    45deg,
    var(--cui-${COMPONENT}-stripe-color) 25%,
    transparent 25%,
    transparent 50%,
    var(--cui-${COMPONENT}-stripe-color) 50%,
    var(--cui-${COMPONENT}-stripe-color) 75%,
    transparent 75%,
    transparent
  );
  background-size: calc(var(--cui-${COMPONENT}-height) * 2) calc(var(--cui-${COMPONENT}-height) * 2);
  background-color: var(--cui-${COMPONENT}-fill-color);
}

.cui-${COMPONENT}-fill.--animated {
  animation: cui-${COMPONENT}-stripes var(--cui-${COMPONENT}-stripe-speed) linear infinite;
}

@keyframes cui-${COMPONENT}-stripes {
  0% { background-position: 0 0; }
  100% { background-position: calc(var(--cui-${COMPONENT}-height) * -2) 0; }
}

.cui-${COMPONENT}-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  color: var(--cui-${COMPONENT}-label-color);
  font-size: var(--cui-${COMPONENT}-label-font-size);
  pointer-events: none;
}`
}

/**
 * Generate CSS for a specific progress variant
 */
function generateProgressVariant(
  variant: ProgressVariant,
  variantName: string,
  globalConfig?: TypographyGlobalConfig
): string {
  const lines: string[] = []
  lines.push(`/* Variant: ${variant.name} */`)
  lines.push(`.cui-${COMPONENT}.--${variantName} {`)

  // Track and fill colors
  lines.push(`  --cui-${COMPONENT}-track-color: ${variant.trackColor};`)
  lines.push(`  --cui-${COMPONENT}-fill-color: ${variant.fillColor};`)
  lines.push(`  --cui-${COMPONENT}-stripe-color: ${variant.stripeColor};`)

  // Height
  if (variant.height) {
    lines.push(`  --cui-${COMPONENT}-height: ${variant.height.value}${variant.height.unit};`)
  }

  // Border radius
  if (variant.borderRadius) {
    lines.push(`  --cui-${COMPONENT}-radius: ${buildBorderRadius(variant.borderRadius)};`)
  }

  // Border
  if (variant.border) {
    lines.push(`  --cui-${COMPONENT}-border: ${buildBorder(variant.border)};`)
  }

  // Stripe speed
  lines.push(`  --cui-${COMPONENT}-stripe-speed: ${variant.speed}s;`)

  // Shadows (offset + inset overlay pattern)
  const offsetShadow = generateOffsetShadowVar(COMPONENT, variant.shadows)
  if (offsetShadow) lines.push(offsetShadow)

  const insetShadow = generateInsetShadowVar(COMPONENT, variant.shadows)
  if (insetShadow) lines.push(insetShadow)

  lines.push('}')

  // Label styles
  lines.push('')
  lines.push(`.cui-${COMPONENT}.--${variantName} .cui-${COMPONENT}-label {`)

  const labelTypography = generateTypographyLines(
    {
      fontFamily: variant.fontFamily,
      fontSize: variant.labelFontSize,
      fontWeight: variant.fontWeight,
      fontStyle: variant.fontStyle
    },
    globalConfig
  )

  lines.push(`  color: ${variant.labelColor};`)
  lines.push(`  font-size: ${buildFontSize(variant.labelFontSize)};`)
  lines.push(...labelTypography.filter(l => !l.includes('font-size')))
  lines.push(`  display: ${variant.showLabel ? 'block' : 'none'};`)
  lines.push('}')

  return lines.join('\n')
}

/**
 * Generate dark mode CSS for a progress variant
 */
function generateProgressVariantDark(variant: ProgressVariant, variantName: string): string {
  const dark = variant.dark
  if (!dark) return ''

  const lines: string[] = []
  lines.push(`/* Dark Mode Variant: ${variant.name} */`)
  lines.push(`body[color-scheme="dark"] .cui-${COMPONENT}.--${variantName} {`)

  // Track and fill colors
  if (dark.trackColor) lines.push(`  --cui-${COMPONENT}-track-color: ${dark.trackColor};`)
  if (dark.fillColor) lines.push(`  --cui-${COMPONENT}-fill-color: ${dark.fillColor};`)
  if (dark.stripeColor) lines.push(`  --cui-${COMPONENT}-stripe-color: ${dark.stripeColor};`)

  // Border override
  const borderOverride = generateDarkBorderOverride(COMPONENT, variant.border, dark.borderColor)
  if (borderOverride) lines.push(borderOverride)

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

  // Label color for dark mode
  if (dark.labelColor) {
    lines.push('')
    lines.push(`body[color-scheme="dark"] .cui-${COMPONENT}.--${variantName} .cui-${COMPONENT}-label {`)
    lines.push(`  color: ${dark.labelColor};`)
    lines.push('}')
  }

  return lines.join('\n')
}
