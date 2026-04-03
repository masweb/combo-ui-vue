import type { TooltipPlacement, TooltipVariant, TypographyGlobalConfig } from '../types'
import { toKebabCase } from './utils'
import {
  generateBaseProperties,
  generateDarkBaseProperties,
  generateDarkBorderOverride,
  generateShadowVar,
  generateDarkShadowVar,
  generateTypographyLines
} from './css-generator-base'

const COMPONENT = 'tooltip'

const PLACEMENT_POSITION: Record<TooltipPlacement, string> = {
  top: `  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);`,
  bottom: `  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);`,
  left: `  right: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);`,
  right: `  left: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);`
}

const PLACEMENT_ARROW: Record<TooltipPlacement, (sizeVar: string, bgVar: string) => string> = {
  top: (s, bg) =>
    `  bottom: calc(-1 * ${s});
  left: 50%;
  transform: translateX(-50%);
  border-left: ${s} solid transparent;
  border-right: ${s} solid transparent;
  border-top: ${s} solid ${bg};`,
  bottom: (s, bg) =>
    `  top: calc(-1 * ${s});
  left: 50%;
  transform: translateX(-50%);
  border-left: ${s} solid transparent;
  border-right: ${s} solid transparent;
  border-bottom: ${s} solid ${bg};`,
  left: (s, bg) =>
    `  right: calc(-1 * ${s});
  top: 50%;
  transform: translateY(-50%);
  border-top: ${s} solid transparent;
  border-bottom: ${s} solid transparent;
  border-left: ${s} solid ${bg};`,
  right: (s, bg) =>
    `  left: calc(-1 * ${s});
  top: 50%;
  transform: translateY(-50%);
  border-top: ${s} solid transparent;
  border-bottom: ${s} solid transparent;
  border-right: ${s} solid ${bg};`
}

export function generateTooltipCSS(variants: TooltipVariant[], globalConfig?: TypographyGlobalConfig): string {
  const css: string[] = []

  css.push(generateTooltipBase())

  variants.forEach(variant => {
    const variantName = toKebabCase(variant.name)
    css.push(generateTooltipVariant(variant, variantName, globalConfig))

    if (variant.dark) {
      css.push(generateTooltipVariantDark(variant, variantName))
    }
  })

  return css.join('\n\n')
}

function generateTooltipBase(): string {
  return `/* Tooltip Base Styles */
.cui-${COMPONENT}-wrapper {
  position: relative;
  display: inline-block;
}

.cui-${COMPONENT}-wrapper > .cui-${COMPONENT} {
  position: absolute;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  z-index: 1070;
  transition: opacity 0.15s ease;
  white-space: nowrap;
  text-align: center;
}

.cui-${COMPONENT}-wrapper:hover > .cui-${COMPONENT},
.cui-${COMPONENT}-wrapper:focus-within > .cui-${COMPONENT} {
  visibility: visible;
  opacity: 1;
}

.cui-${COMPONENT} {
  --cui-${COMPONENT}-bg: #333333;
  --cui-${COMPONENT}-color: #ffffff;
  --cui-${COMPONENT}-border: 1px solid #555555;
  --cui-${COMPONENT}-radius: 6px;
  --cui-${COMPONENT}-padding: 6px 10px;
  --cui-${COMPONENT}-shadow: none;
  --cui-${COMPONENT}-arrow-size: 6px;
  --cui-${COMPONENT}-max-width: 200px;

  display: inline-block;
  max-width: var(--cui-${COMPONENT}-max-width);
  background: var(--cui-${COMPONENT}-bg);
  color: var(--cui-${COMPONENT}-color);
  border: var(--cui-${COMPONENT}-border);
  border-radius: var(--cui-${COMPONENT}-radius);
  padding: var(--cui-${COMPONENT}-padding);
  box-shadow: var(--cui-${COMPONENT}-shadow);
}

.cui-${COMPONENT}::after {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
}`
}

function generateTooltipVariant(
  variant: TooltipVariant,
  variantName: string,
  globalConfig?: TypographyGlobalConfig
): string {
  const lines: string[] = []
  lines.push(`/* Variant: ${variant.name} */`)
  lines.push(`.cui-${COMPONENT}.--${variantName} {`)

  lines.push(...generateBaseProperties(COMPONENT, variant))

  const shadowVar = generateShadowVar(COMPONENT, variant.shadows)
  if (shadowVar) lines.push(shadowVar)

  if (variant.arrowSize) {
    lines.push(`  --cui-${COMPONENT}-arrow-size: ${variant.arrowSize.value}${variant.arrowSize.unit};`)
  }
  if (variant.maxWidth) {
    lines.push(`  --cui-${COMPONENT}-max-width: ${variant.maxWidth.value}${variant.maxWidth.unit};`)
  }

  lines.push('}')

  const placement = variant.placement || 'top'
  const sizeVar = `var(--cui-${COMPONENT}-arrow-size)`
  const bgVar = `var(--cui-${COMPONENT}-bg)`

  lines.push('')
  lines.push(`.cui-${COMPONENT}-wrapper > .cui-${COMPONENT}.--${variantName} {`)
  lines.push(PLACEMENT_POSITION[placement])
  lines.push('}')

  lines.push('')
  lines.push(`.cui-${COMPONENT}.--${variantName}::after {`)
  lines.push(PLACEMENT_ARROW[placement](sizeVar, bgVar))
  lines.push('}')

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
    lines.push(`.cui-${COMPONENT}.--${variantName} {`)
    lines.push(...typographyLines)
    lines.push('}')
  }

  return lines.join('\n')
}

function generateTooltipVariantDark(variant: TooltipVariant, variantName: string): string {
  const dark = variant.dark
  if (!dark) return ''

  const lines: string[] = []
  lines.push(`/* Dark Mode Variant: ${variant.name} */`)
  lines.push(`body[color-scheme="dark"] .cui-${COMPONENT}.--${variantName} {`)

  lines.push(...generateDarkBaseProperties(COMPONENT, dark))

  const borderOverride = generateDarkBorderOverride(COMPONENT, variant.border, dark.borderColor)
  if (borderOverride) lines.push(borderOverride)

  const shadowVar = generateDarkShadowVar(COMPONENT, variant.shadows, dark)
  if (shadowVar) lines.push(shadowVar)

  lines.push('}')

  if (dark.background) {
    lines.push('')
    lines.push(`body[color-scheme="dark"] .cui-${COMPONENT}.--${variantName}::after {`)
    const placement = variant.placement || 'top'
    const arrowColor = dark.background
    const sizeVar = `var(--cui-${COMPONENT}-arrow-size)`
    lines.push(PLACEMENT_ARROW[placement](sizeVar, arrowColor))
    lines.push('}')
  }

  return lines.join('\n')
}
