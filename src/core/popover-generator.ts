import type { PopoverPlacement, PopoverVariant, TypographyGlobalConfig } from '../types'
import { toKebabCase } from './utils'
import {
  generateBaseProperties,
  generateDarkBaseProperties,
  generateDarkBorderOverride,
  generateOffsetShadowVar,
  generateDarkOffsetShadowVar,
  generateInsetShadowVar,
  generateDarkInsetShadowVar,
  generateTypographyLines
} from './css-generator-base'

const COMPONENT = 'popover'

const PLACEMENT_POSITION: Record<PopoverPlacement, string> = {
  top: `  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);`,
  bottom: `  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);`,
  left: `  right: calc(100% + 10px);
  top: 50%;
  transform: translateY(-50%);`,
  right: `  left: calc(100% + 10px);
  top: 50%;
  transform: translateY(-50%);`
}

type ArrowFn = (sizeVar: string, color: string) => string

const PLACEMENT_ARROW_BORDER: Record<PopoverPlacement, ArrowFn> = {
  top: (s, c) =>
    `  bottom: calc(-1 * ${s});
  left: 50%;
  transform: translateX(-50%);
  border-left: ${s} solid transparent;
  border-right: ${s} solid transparent;
  border-top: ${s} solid ${c};`,
  bottom: (s, c) =>
    `  top: calc(-1 * ${s});
  left: 50%;
  transform: translateX(-50%);
  border-left: ${s} solid transparent;
  border-right: ${s} solid transparent;
  border-bottom: ${s} solid ${c};`,
  left: (s, c) =>
    `  right: calc(-1 * ${s});
  top: 50%;
  transform: translateY(-50%);
  border-top: ${s} solid transparent;
  border-bottom: ${s} solid transparent;
  border-left: ${s} solid ${c};`,
  right: (s, c) =>
    `  left: calc(-1 * ${s});
  top: 50%;
  transform: translateY(-50%);
  border-top: ${s} solid transparent;
  border-bottom: ${s} solid transparent;
  border-right: ${s} solid ${c};`
}

const PLACEMENT_ARROW_FILL: Record<PopoverPlacement, ArrowFn> = {
  top: (s, c) =>
    `  bottom: calc(-1 * (${s} - 1px));
  left: 50%;
  transform: translateX(-50%);
  border-left: calc(${s} - 1px) solid transparent;
  border-right: calc(${s} - 1px) solid transparent;
  border-top: calc(${s} - 1px) solid ${c};`,
  bottom: (s, c) =>
    `  top: calc(-1 * (${s} - 1px));
  left: 50%;
  transform: translateX(-50%);
  border-left: calc(${s} - 1px) solid transparent;
  border-right: calc(${s} - 1px) solid transparent;
  border-bottom: calc(${s} - 1px) solid ${c};`,
  left: (s, c) =>
    `  right: calc(-1 * (${s} - 1px));
  top: 50%;
  transform: translateY(-50%);
  border-top: calc(${s} - 1px) solid transparent;
  border-bottom: calc(${s} - 1px) solid transparent;
  border-left: calc(${s} - 1px) solid ${c};`,
  right: (s, c) =>
    `  left: calc(-1 * (${s} - 1px));
  top: 50%;
  transform: translateY(-50%);
  border-top: calc(${s} - 1px) solid transparent;
  border-bottom: calc(${s} - 1px) solid transparent;
  border-right: calc(${s} - 1px) solid ${c};`
}

export function generatePopoverCSS(variants: PopoverVariant[], globalConfig?: TypographyGlobalConfig): string {
  const css: string[] = []

  css.push(generatePopoverBase())

  variants.forEach(variant => {
    const variantName = toKebabCase(variant.name)
    css.push(generatePopoverVariant(variant, variantName, globalConfig))

    if (variant.dark) {
      css.push(generatePopoverVariantDark(variant, variantName))
    }
  })

  return css.join('\n\n')
}

function generatePopoverBase(): string {
  return `/* Popover Base Styles */
.cui-${COMPONENT}-wrapper {
  position: relative;
  display: inline-block;
}

.cui-${COMPONENT}-wrapper > .cui-${COMPONENT} {
  position: absolute;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  z-index: 1060;
  transition: opacity 0.15s ease;
}

.cui-${COMPONENT}-wrapper:focus-within > .cui-${COMPONENT} {
  visibility: visible;
  opacity: 1;
  pointer-events: auto;
}

.cui-${COMPONENT} {
  --cui-${COMPONENT}-bg: #ffffff;
  --cui-${COMPONENT}-color: #333333;
  --cui-${COMPONENT}-border: 1px solid #dee2e6;
  --cui-${COMPONENT}-radius: 8px;
  --cui-${COMPONENT}-padding: 12px 16px;
  --cui-${COMPONENT}-shadow: none;
  --cui-${COMPONENT}-inset-shadow: none;
  --cui-${COMPONENT}-arrow-size: 8px;
  --cui-${COMPONENT}-max-width: 300px;

  --cui-${COMPONENT}-header-bg: #f8f9fa;
  --cui-${COMPONENT}-header-color: #333333;
  --cui-${COMPONENT}-header-padding: 8px 16px;
  --cui-${COMPONENT}-header-border-bottom: 1px solid #dee2e6;

  display: block;
  width: var(--cui-${COMPONENT}-max-width);
  background: var(--cui-${COMPONENT}-bg);
  color: var(--cui-${COMPONENT}-color);
  border: var(--cui-${COMPONENT}-border);
  border-radius: var(--cui-${COMPONENT}-radius);
  box-shadow: var(--cui-${COMPONENT}-shadow);
}

.cui-${COMPONENT}-inset-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  border-radius: var(--cui-${COMPONENT}-radius);
  box-shadow: var(--cui-${COMPONENT}-inset-shadow);
  pointer-events: none;
}

.cui-${COMPONENT}-inner {
  overflow: hidden;
  border-radius: var(--cui-${COMPONENT}-radius);
}

.cui-${COMPONENT}-header {
  position: relative;
  z-index: 1;
  background: var(--cui-${COMPONENT}-header-bg);
  color: var(--cui-${COMPONENT}-header-color);
  padding: var(--cui-${COMPONENT}-header-padding);
  border-bottom: var(--cui-${COMPONENT}-header-border-bottom);
  border-radius: var(--cui-${COMPONENT}-radius) var(--cui-${COMPONENT}-radius) 0 0;
}

.cui-${COMPONENT}-body {
  position: relative;
  z-index: 1;
  padding: var(--cui-${COMPONENT}-padding);
}

.cui-${COMPONENT}::before,
.cui-${COMPONENT}::after {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
}`
}

function getBorderColor(variant: PopoverVariant): string {
  if (variant.border?.style !== 'none' && variant.border?.color) {
    return variant.border.color
  }
  return '#dee2e6'
}

function generatePopoverVariant(
  variant: PopoverVariant,
  variantName: string,
  globalConfig?: TypographyGlobalConfig
): string {
  const lines: string[] = []
  lines.push(`/* Variant: ${variant.name} */`)
  lines.push(`.cui-${COMPONENT}.--${variantName} {`)

  lines.push(...generateBaseProperties(COMPONENT, variant))

  const offsetShadow = generateOffsetShadowVar(COMPONENT, variant.shadows)
  if (offsetShadow) lines.push(offsetShadow)

  const insetShadow = generateInsetShadowVar(COMPONENT, variant.shadows)
  if (insetShadow) lines.push(insetShadow)

  if (variant.arrowSize) {
    lines.push(`  --cui-${COMPONENT}-arrow-size: ${variant.arrowSize.value}${variant.arrowSize.unit};`)
  }
  if (variant.maxWidth) {
    lines.push(`  --cui-${COMPONENT}-max-width: ${variant.maxWidth.value}${variant.maxWidth.unit};`)
  }

  if (variant.headerBackground) {
    lines.push(`  --cui-${COMPONENT}-header-bg: ${variant.headerBackground};`)
  }
  if (variant.headerColor) {
    lines.push(`  --cui-${COMPONENT}-header-color: ${variant.headerColor};`)
  }
  if (variant.headerPadding) {
    const p = variant.headerPadding
    lines.push(
      `  --cui-${COMPONENT}-header-padding: ${p.top}${p.unit} ${p.right}${p.unit} ${p.bottom}${p.unit} ${p.left}${p.unit};`
    )
  }
  if (variant.headerBorderBottom) {
    const b = variant.headerBorderBottom
    lines.push(`  --cui-${COMPONENT}-header-border-bottom: ${b.width}${b.unit} ${b.style} ${b.color};`)
  }

  lines.push('}')

  const placement = variant.placement || 'top'
  const sizeVar = `var(--cui-${COMPONENT}-arrow-size)`
  const borderColor = getBorderColor(variant)
  const bgColor = `var(--cui-${COMPONENT}-bg)`

  lines.push('')
  lines.push(`.cui-${COMPONENT}-wrapper > .cui-${COMPONENT}.--${variantName} {`)
  lines.push(PLACEMENT_POSITION[placement])
  lines.push('}')

  lines.push('')
  lines.push(`.cui-${COMPONENT}.--${variantName}::before {`)
  lines.push(PLACEMENT_ARROW_BORDER[placement](sizeVar, borderColor))
  lines.push('}')

  lines.push('')
  lines.push(`.cui-${COMPONENT}.--${variantName}::after {`)
  lines.push(PLACEMENT_ARROW_FILL[placement](sizeVar, bgColor))
  lines.push('}')

  const bodyTypography = generateTypographyLines(
    {
      fontFamily: variant.fontFamily,
      fontSize: variant.fontSize,
      fontWeight: variant.fontWeight,
      fontStyle: variant.fontStyle,
      letterSpacing: variant.letterSpacing
    },
    globalConfig
  )

  if (bodyTypography.length > 0) {
    lines.push('')
    lines.push(`.cui-${COMPONENT}-body.cui-${COMPONENT}.--${variantName} {`)
    lines.push(...bodyTypography)
    lines.push('}')
  }

  const headerTypography = generateTypographyLines(
    {
      fontFamily: variant.headerFontFamily,
      fontSize: variant.headerFontSize,
      fontWeight: variant.headerFontWeight,
      fontStyle: variant.headerFontStyle,
      letterSpacing: variant.headerLetterSpacing
    },
    globalConfig
  )

  if (headerTypography.length > 0) {
    lines.push('')
    lines.push(`.cui-${COMPONENT}-header.cui-${COMPONENT}.--${variantName} {`)
    lines.push(...headerTypography)
    lines.push('}')
  }

  return lines.join('\n')
}

function generatePopoverVariantDark(variant: PopoverVariant, variantName: string): string {
  const dark = variant.dark
  if (!dark) return ''

  const lines: string[] = []
  lines.push(`/* Dark Mode Variant: ${variant.name} */`)
  lines.push(`body[color-scheme="dark"] .cui-${COMPONENT}.--${variantName} {`)

  lines.push(...generateDarkBaseProperties(COMPONENT, dark))

  const borderOverride = generateDarkBorderOverride(COMPONENT, variant.border, dark.borderColor)
  if (borderOverride) lines.push(borderOverride)

  if (dark.headerBackground) {
    lines.push(`  --cui-${COMPONENT}-header-bg: ${dark.headerBackground};`)
  }
  if (dark.headerColor) {
    lines.push(`  --cui-${COMPONENT}-header-color: ${dark.headerColor};`)
  }
  if (dark.headerBorderBottomColor && variant.headerBorderBottom) {
    const b = variant.headerBorderBottom
    lines.push(
      `  --cui-${COMPONENT}-header-border-bottom: ${b.width}${b.unit} ${b.style} ${dark.headerBorderBottomColor};`
    )
  }

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

  const placement = variant.placement || 'top'
  const sizeVar = `var(--cui-${COMPONENT}-arrow-size)`
  const darkBorderColor = dark.borderColor || getBorderColor(variant)

  lines.push('')
  lines.push(`body[color-scheme="dark"] .cui-${COMPONENT}.--${variantName}::before {`)
  lines.push(PLACEMENT_ARROW_BORDER[placement](sizeVar, darkBorderColor))
  lines.push('}')

  if (dark.background) {
    lines.push('')
    lines.push(`body[color-scheme="dark"] .cui-${COMPONENT}.--${variantName}::after {`)
    lines.push(PLACEMENT_ARROW_FILL[placement](sizeVar, dark.background))
    lines.push('}')
  }

  return lines.join('\n')
}
