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
.cux-${COMPONENT} {
  --cux-${COMPONENT}-track-color: #e9ecef;
  --cux-${COMPONENT}-fill-color: #0d6efd;
  --cux-${COMPONENT}-stripe-color: rgba(255, 255, 255, 0.15);
  --cux-${COMPONENT}-height: 16px;
  --cux-${COMPONENT}-radius: 4px;
  --cux-${COMPONENT}-border: none;
  --cux-${COMPONENT}-shadow: none;
  --cux-${COMPONENT}-inset-shadow: none;
  --cux-${COMPONENT}-stripe-speed: 1s;

  /* Label properties */
  --cux-${COMPONENT}-label-color: #212529;
  --cux-${COMPONENT}-label-font-size: 12px;

  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--cux-${COMPONENT}-track-color);
  height: var(--cux-${COMPONENT}-height);
  border-radius: var(--cux-${COMPONENT}-radius);
  border: var(--cux-${COMPONENT}-border);
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

.cux-${COMPONENT}-fill {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  height: 100%;
  background-color: var(--cux-${COMPONENT}-fill-color);
  transition: width 0.3s ease;
}

.cux-${COMPONENT}-fill.--striped {
  background-image: linear-gradient(
    45deg,
    var(--cux-${COMPONENT}-stripe-color) 25%,
    transparent 25%,
    transparent 50%,
    var(--cux-${COMPONENT}-stripe-color) 50%,
    var(--cux-${COMPONENT}-stripe-color) 75%,
    transparent 75%,
    transparent
  );
  background-size: calc(var(--cux-${COMPONENT}-height) * 2) calc(var(--cux-${COMPONENT}-height) * 2);
  background-color: var(--cux-${COMPONENT}-fill-color);
}

.cux-${COMPONENT}-fill.--animated {
  animation: cux-${COMPONENT}-stripes var(--cux-${COMPONENT}-stripe-speed) linear infinite;
}

@keyframes cux-${COMPONENT}-stripes {
  0% { background-position: 0 0; }
  100% { background-position: calc(var(--cux-${COMPONENT}-height) * -2) 0; }
}

.cux-${COMPONENT}-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  color: var(--cux-${COMPONENT}-label-color);
  font-size: var(--cux-${COMPONENT}-label-font-size);
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
  lines.push(`.cux-${COMPONENT}.--${variantName} {`)

  // Track and fill colors
  lines.push(`  --cux-${COMPONENT}-track-color: ${variant.trackColor};`)
  lines.push(`  --cux-${COMPONENT}-fill-color: ${variant.fillColor};`)
  lines.push(`  --cux-${COMPONENT}-stripe-color: ${variant.stripeColor};`)

  // Height
  if (variant.height) {
    lines.push(`  --cux-${COMPONENT}-height: ${variant.height.value}${variant.height.unit};`)
  }

  // Border radius
  if (variant.borderRadius) {
    lines.push(`  --cux-${COMPONENT}-radius: ${buildBorderRadius(variant.borderRadius)};`)
  }

  // Border
  if (variant.border) {
    lines.push(`  --cux-${COMPONENT}-border: ${buildBorder(variant.border)};`)
  }

  // Stripe speed
  lines.push(`  --cux-${COMPONENT}-stripe-speed: ${variant.speed}s;`)

  // Shadows (offset + inset overlay pattern)
  const offsetShadow = generateOffsetShadowVar(COMPONENT, variant.shadows)
  if (offsetShadow) lines.push(offsetShadow)

  const insetShadow = generateInsetShadowVar(COMPONENT, variant.shadows)
  if (insetShadow) lines.push(insetShadow)

  lines.push('}')

  // Label styles
  lines.push('')
  lines.push(`.cux-${COMPONENT}.--${variantName} .cux-${COMPONENT}-label {`)

  const labelTypography = generateTypographyLines({
    fontFamily: variant.fontFamily,
    fontSize: variant.labelFontSize,
    fontWeight: variant.fontWeight,
    fontStyle: variant.fontStyle
  }, globalConfig)

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
  lines.push(`.dark .cux-${COMPONENT}.--${variantName} {`)

  // Track and fill colors
  if (dark.trackColor) lines.push(`  --cux-${COMPONENT}-track-color: ${dark.trackColor};`)
  if (dark.fillColor) lines.push(`  --cux-${COMPONENT}-fill-color: ${dark.fillColor};`)
  if (dark.stripeColor) lines.push(`  --cux-${COMPONENT}-stripe-color: ${dark.stripeColor};`)

  // Border override
  const borderOverride = generateDarkBorderOverride(COMPONENT, variant.border, dark.borderColor)
  if (borderOverride) lines.push(borderOverride)

  // Shadows for dark mode
  const offsetShadow = generateDarkOffsetShadowVar(COMPONENT, variant.shadows, dark.shadowColor)
  if (offsetShadow) lines.push(offsetShadow)

  const insetShadow = generateDarkInsetShadowVar(COMPONENT, variant.shadows, dark.shadowInsetColor, dark.shadowInsetHighlightColor)
  if (insetShadow) lines.push(insetShadow)

  lines.push('}')

  // Label color for dark mode
  if (dark.labelColor) {
    lines.push('')
    lines.push(`.dark .cux-${COMPONENT}.--${variantName} .cux-${COMPONENT}-label {`)
    lines.push(`  color: ${dark.labelColor};`)
    lines.push('}')
  }

  return lines.join('\n')
}
