import type { ListGroupVariant, TypographyGlobalConfig } from '../types'
import { toKebabCase, buildBorder, buildBorderRadius, buildPadding } from './utils'
import {
  generateDarkBaseProperties,
  generateDarkBorderOverride,
  generateOffsetShadowVar,
  generateDarkOffsetShadowVar,
  generateTypographyLines
} from './css-generator-base'

const COMPONENT = 'listgroup'

export function generateListGroupCSS(variants: ListGroupVariant[], globalConfig?: TypographyGlobalConfig): string {
  const css: string[] = []

  css.push(generateListGroupBase())

  variants.forEach(variant => {
    const variantName = toKebabCase(variant.name)
    css.push(generateListGroupVariant(variant, variantName, globalConfig))

    if (variant.dark) {
      css.push(generateListGroupVariantDark(variant, variantName))
    }
  })

  return css.join('\n\n')
}

function generateListGroupBase(): string {
  return `/* ListGroup Base Styles */
.cui-${COMPONENT} {
  --cui-${COMPONENT}-bg: #ffffff;
  --cui-${COMPONENT}-color: #212529;
  --cui-${COMPONENT}-border: none;
  --cui-${COMPONENT}-radius: 0;
  --cui-${COMPONENT}-padding: 10px 16px;
  --cui-${COMPONENT}-shadow: none;

  --cui-${COMPONENT}-item-border-bottom: none;
  --cui-${COMPONENT}-active-bg: #0d6efd;
  --cui-${COMPONENT}-active-color: #ffffff;
  --cui-${COMPONENT}-active-border-color: #0d6efd;
  --cui-${COMPONENT}-hover-bg: #f8f9fa;
  --cui-${COMPONENT}-hover-color: #212529;
  --cui-${COMPONENT}-disabled-color: #6c757d;
  --cui-${COMPONENT}-disabled-bg: #ffffff;
  --cui-${COMPONENT}-disabled-opacity: 0.65;

  background: var(--cui-${COMPONENT}-bg);
  border: var(--cui-${COMPONENT}-border);
  border-radius: var(--cui-${COMPONENT}-radius);
  box-shadow: var(--cui-${COMPONENT}-shadow);
  overflow: hidden;
}

.cui-${COMPONENT}-items {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
}

.cui-${COMPONENT}-item {
  display: flex;
  align-items: center;
  padding: var(--cui-${COMPONENT}-padding);
  color: var(--cui-${COMPONENT}-color);
  border-bottom: var(--cui-${COMPONENT}-item-border-bottom);
  transition: background-color 0.15s, color 0.15s;
}

.cui-${COMPONENT}-item:last-child {
  border-bottom: none;
}

.cui-${COMPONENT}-item.--active {
  background: var(--cui-${COMPONENT}-active-bg);
  color: var(--cui-${COMPONENT}-active-color);
  border-color: var(--cui-${COMPONENT}-active-border-color);
}

.cui-${COMPONENT}-item:not(.--active):not(.--disabled):hover {
  background: var(--cui-${COMPONENT}-hover-bg);
  color: var(--cui-${COMPONENT}-hover-color);
  cursor: pointer;
}

.cui-${COMPONENT}-item.--disabled {
  color: var(--cui-${COMPONENT}-disabled-color);
  background: var(--cui-${COMPONENT}-disabled-bg);
  opacity: var(--cui-${COMPONENT}-disabled-opacity);
  cursor: not-allowed;
}

.cui-${COMPONENT}.--flush {
  border-radius: 0;
  border: none;
}

.cui-${COMPONENT}-item-number {
  margin-right: 8px;
  font-weight: 600;
}`
}

function generateListGroupVariant(variant: ListGroupVariant, variantName: string, globalConfig?: TypographyGlobalConfig): string {
  const lines: string[] = []
  lines.push(`/* Variant: ${variant.name} */`)
  lines.push(`.cui-${COMPONENT}.--${variantName} {`)

  lines.push(`  --cui-${COMPONENT}-bg: ${variant.background};`)
  lines.push(`  --cui-${COMPONENT}-color: ${variant.color};`)

  if (variant.border) lines.push(`  --cui-${COMPONENT}-border: ${buildBorder(variant.border)};`)
  if (variant.borderRadius) lines.push(`  --cui-${COMPONENT}-radius: ${buildBorderRadius(variant.borderRadius)};`)
  if (variant.padding) lines.push(`  --cui-${COMPONENT}-padding: ${buildPadding(variant.padding)};`)

  if (variant.border) {
    lines.push(`  --cui-${COMPONENT}-item-border-bottom: ${variant.border.width}${variant.border.unit} ${variant.border.style} ${variant.border.color};`)
  }

  lines.push(`  --cui-${COMPONENT}-active-bg: ${variant.activeBackground};`)
  lines.push(`  --cui-${COMPONENT}-active-color: ${variant.activeColor};`)
  lines.push(`  --cui-${COMPONENT}-active-border-color: ${variant.activeBorderColor};`)
  lines.push(`  --cui-${COMPONENT}-hover-bg: ${variant.hoverBackground};`)
  lines.push(`  --cui-${COMPONENT}-hover-color: ${variant.hoverColor};`)
  lines.push(`  --cui-${COMPONENT}-disabled-color: ${variant.disabledColor};`)
  lines.push(`  --cui-${COMPONENT}-disabled-bg: ${variant.disabledBackground};`)
  lines.push(`  --cui-${COMPONENT}-disabled-opacity: ${variant.disabledOpacity};`)

  const offsetShadow = generateOffsetShadowVar(COMPONENT, variant.shadow ? { offset: variant.shadow } : undefined)
  if (offsetShadow) lines.push(offsetShadow)

  lines.push('}')

  const typography = generateTypographyLines({
    fontFamily: variant.fontFamily,
    fontSize: variant.fontSize,
    fontWeight: variant.fontWeight,
    fontStyle: variant.fontStyle,
    letterSpacing: variant.letterSpacing
  }, globalConfig)

  if (typography.length > 0) {
    lines.push('')
    lines.push(`.cui-${COMPONENT}.--${variantName} .cui-${COMPONENT}-item {`)
    lines.push(...typography)
    lines.push('}')
  }

  return lines.join('\n')
}

function generateListGroupVariantDark(variant: ListGroupVariant, variantName: string): string {
  const dark = variant.dark
  if (!dark) return ''

  const lines: string[] = []
  lines.push(`/* Dark Mode Variant: ${variant.name} */`)
  lines.push(`body[color-scheme="dark"] .cui-${COMPONENT}.--${variantName} {`)

  lines.push(...generateDarkBaseProperties(COMPONENT, dark))

  const borderOverride = generateDarkBorderOverride(COMPONENT, variant.border, dark.borderColor)
  if (borderOverride) lines.push(borderOverride)

  if (dark.borderColor && variant.border) {
    lines.push(`  --cui-${COMPONENT}-item-border-bottom: ${variant.border.width}${variant.border.unit} ${variant.border.style} ${dark.borderColor};`)
  }

  if (dark.activeBackground) lines.push(`  --cui-${COMPONENT}-active-bg: ${dark.activeBackground};`)
  if (dark.activeColor) lines.push(`  --cui-${COMPONENT}-active-color: ${dark.activeColor};`)
  if (dark.activeBorderColor) lines.push(`  --cui-${COMPONENT}-active-border-color: ${dark.activeBorderColor};`)
  if (dark.hoverBackground) lines.push(`  --cui-${COMPONENT}-hover-bg: ${dark.hoverBackground};`)
  if (dark.hoverColor) lines.push(`  --cui-${COMPONENT}-hover-color: ${dark.hoverColor};`)
  if (dark.disabledColor) lines.push(`  --cui-${COMPONENT}-disabled-color: ${dark.disabledColor};`)
  if (dark.disabledBackground) lines.push(`  --cui-${COMPONENT}-disabled-bg: ${dark.disabledBackground};`)

  const offsetShadow = generateDarkOffsetShadowVar(COMPONENT, variant.shadow ? { offset: variant.shadow } : undefined, dark.shadowColor)
  if (offsetShadow) lines.push(offsetShadow)

  lines.push('}')
  return lines.join('\n')
}
