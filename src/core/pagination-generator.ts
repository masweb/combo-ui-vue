import type { PaginationVariant, TypographyGlobalConfig } from '../types'
import { toKebabCase, buildBorder, buildBorderRadius, buildPadding } from './utils'
import {
  generateDarkBaseProperties,
  generateDarkBorderOverride,
  generateShadowVar,
  generateDarkShadowVar,
  generateTypographyLines
} from './css-generator-base'

const COMPONENT = 'pagination'

export function generatePaginationCSS(variants: PaginationVariant[], globalConfig?: TypographyGlobalConfig): string {
  const css: string[] = []

  css.push(generatePaginationBase())

  variants.forEach(variant => {
    const variantName = toKebabCase(variant.name)
    css.push(generatePaginationVariant(variant, variantName, globalConfig))

    if (variant.dark) {
      css.push(generatePaginationVariantDark(variant, variantName))
    }
  })

  return css.join('\n\n')
}

function generatePaginationBase(): string {
  return `/* Pagination Base Styles */
.cui-${COMPONENT} {
  --cui-${COMPONENT}-bg: #ffffff;
  --cui-${COMPONENT}-color: #0d6efd;
  --cui-${COMPONENT}-border: none;
  --cui-${COMPONENT}-radius: 0;
  --cui-${COMPONENT}-padding: 0;
  --cui-${COMPONENT}-shadow: none;
  --cui-${COMPONENT}-item-gap: 0;

  --cui-${COMPONENT}-active-bg: #0d6efd;
  --cui-${COMPONENT}-active-color: #ffffff;
  --cui-${COMPONENT}-active-border-color: #0d6efd;

  --cui-${COMPONENT}-hover-bg: #e9ecef;
  --cui-${COMPONENT}-hover-color: #0d6efd;

  --cui-${COMPONENT}-disabled-color: #6c757d;
  --cui-${COMPONENT}-disabled-opacity: 0.65;

  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.cui-${COMPONENT}-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--cui-${COMPONENT}-bg);
  color: var(--cui-${COMPONENT}-color);
  border: var(--cui-${COMPONENT}-border);
  border-radius: var(--cui-${COMPONENT}-radius);
  padding: var(--cui-${COMPONENT}-padding);
  box-shadow: var(--cui-${COMPONENT}-shadow);
  transition: background-color 0.15s, color 0.15s;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

.cui-${COMPONENT}-item + .cui-${COMPONENT}-item {
  margin-left: var(--cui-${COMPONENT}-item-gap);
}

.cui-${COMPONENT}-item:hover {
  background: var(--cui-${COMPONENT}-hover-bg);
  color: var(--cui-${COMPONENT}-hover-color);
  z-index: 2;
}

.cui-${COMPONENT}-item.--active {
  background: var(--cui-${COMPONENT}-active-bg);
  color: var(--cui-${COMPONENT}-active-color);
  border-color: var(--cui-${COMPONENT}-active-border-color);
  z-index: 3;
}

.cui-${COMPONENT}-item.--disabled {
  color: var(--cui-${COMPONENT}-disabled-color);
  opacity: var(--cui-${COMPONENT}-disabled-opacity);
  cursor: not-allowed;
  pointer-events: none;
}`
}

function generatePaginationVariant(
  variant: PaginationVariant,
  variantName: string,
  globalConfig?: TypographyGlobalConfig
): string {
  const lines: string[] = []
  lines.push(`/* Variant: ${variant.name} */`)
  lines.push(`.cui-${COMPONENT}.--${variantName} {`)

  lines.push(`  --cui-${COMPONENT}-bg: ${variant.background};`)
  lines.push(`  --cui-${COMPONENT}-color: ${variant.color};`)

  if (variant.border) lines.push(`  --cui-${COMPONENT}-border: ${buildBorder(variant.border)};`)
  if (variant.borderRadius) lines.push(`  --cui-${COMPONENT}-radius: ${buildBorderRadius(variant.borderRadius)};`)
  if (variant.padding) lines.push(`  --cui-${COMPONENT}-padding: ${buildPadding(variant.padding)};`)
  lines.push(`  --cui-${COMPONENT}-item-gap: ${variant.itemGap}px;`)

  const shadowVar = generateShadowVar(COMPONENT, variant.shadows)
  if (shadowVar) lines.push(shadowVar)

  lines.push(`  --cui-${COMPONENT}-active-bg: ${variant.activeBackground};`)
  lines.push(`  --cui-${COMPONENT}-active-color: ${variant.activeColor};`)
  lines.push(`  --cui-${COMPONENT}-active-border-color: ${variant.activeBorderColor};`)

  lines.push(`  --cui-${COMPONENT}-hover-bg: ${variant.hoverBackground};`)
  lines.push(`  --cui-${COMPONENT}-hover-color: ${variant.hoverColor};`)

  lines.push(`  --cui-${COMPONENT}-disabled-color: ${variant.disabledColor};`)
  lines.push(`  --cui-${COMPONENT}-disabled-opacity: ${variant.disabledOpacity};`)

  lines.push('}')

  const typography = generateTypographyLines(
    {
      fontFamily: variant.fontFamily,
      fontSize: variant.fontSize,
      fontWeight: variant.fontWeight,
      fontStyle: variant.fontStyle,
      letterSpacing: variant.letterSpacing
    },
    globalConfig
  )

  if (typography.length > 0) {
    lines.push('')
    lines.push(`.cui-${COMPONENT}.--${variantName} .cui-${COMPONENT}-item {`)
    lines.push(...typography)
    lines.push('}')
  }

  return lines.join('\n')
}

function generatePaginationVariantDark(variant: PaginationVariant, variantName: string): string {
  const dark = variant.dark
  if (!dark) return ''

  const lines: string[] = []
  lines.push(`/* Dark Mode Variant: ${variant.name} */`)
  lines.push(`body[color-scheme="dark"] .cui-${COMPONENT}.--${variantName} {`)

  lines.push(...generateDarkBaseProperties(COMPONENT, dark))

  const borderOverride = generateDarkBorderOverride(COMPONENT, variant.border, dark.borderColor)
  if (borderOverride) lines.push(borderOverride)

  if (dark.activeBackground) lines.push(`  --cui-${COMPONENT}-active-bg: ${dark.activeBackground};`)
  if (dark.activeColor) lines.push(`  --cui-${COMPONENT}-active-color: ${dark.activeColor};`)
  if (dark.activeBorderColor) lines.push(`  --cui-${COMPONENT}-active-border-color: ${dark.activeBorderColor};`)

  if (dark.hoverBackground) lines.push(`  --cui-${COMPONENT}-hover-bg: ${dark.hoverBackground};`)
  if (dark.hoverColor) lines.push(`  --cui-${COMPONENT}-hover-color: ${dark.hoverColor};`)

  if (dark.disabledColor) lines.push(`  --cui-${COMPONENT}-disabled-color: ${dark.disabledColor};`)

  const darkShadow = generateDarkShadowVar(COMPONENT, variant.shadows, dark)
  if (darkShadow) lines.push(darkShadow)

  lines.push('}')
  return lines.join('\n')
}
