import type { AccordionVariant, TypographyGlobalConfig } from '../types'
import { toKebabCase, buildBorder, buildBorderRadius, buildPadding, buildFontSize, buildLetterSpacing } from './utils'
import {
  generateDarkBaseProperties,
  generateDarkBorderOverride,
  generateOffsetShadowVar,
  generateDarkOffsetShadowVar,
  generateTypographyLines
} from './css-generator-base'

const COMPONENT = 'accordion'

export function generateAccordionCSS(variants: AccordionVariant[], globalConfig?: TypographyGlobalConfig): string {
  const css: string[] = []

  css.push(generateAccordionBase())

  variants.forEach(variant => {
    const variantName = toKebabCase(variant.name)
    css.push(generateAccordionVariant(variant, variantName, globalConfig))

    if (variant.dark) {
      css.push(generateAccordionVariantDark(variant, variantName))
    }
  })

  return css.join('\n\n')
}

function generateAccordionBase(): string {
  return `/* Accordion Base Styles */
.cui-${COMPONENT} {
  --cui-${COMPONENT}-bg: #ffffff;
  --cui-${COMPONENT}-color: #212529;
  --cui-${COMPONENT}-border: none;
  --cui-${COMPONENT}-radius: 0;
  --cui-${COMPONENT}-shadow: none;

  --cui-${COMPONENT}-body-padding: 12px 16px;

  --cui-${COMPONENT}-btn-bg: #ffffff;
  --cui-${COMPONENT}-btn-color: #212529;
  --cui-${COMPONENT}-btn-padding: 14px 20px;
  --cui-${COMPONENT}-btn-font-size: 16px;
  --cui-${COMPONENT}-btn-font-weight: 500;

  --cui-${COMPONENT}-btn-hover-bg: #f8f9fa;
  --cui-${COMPONENT}-btn-hover-color: #0d6efd;

  --cui-${COMPONENT}-btn-active-bg: #e7f1ff;
  --cui-${COMPONENT}-btn-active-color: #0d6efd;

  --cui-${COMPONENT}-item-border: none;

  overflow: hidden;
  border: var(--cui-${COMPONENT}-border);
  border-radius: var(--cui-${COMPONENT}-radius);
  box-shadow: var(--cui-${COMPONENT}-shadow);
}

.cui-${COMPONENT}-item {
  border-top: var(--cui-${COMPONENT}-item-border);
}

.cui-${COMPONENT}-item:first-child {
  border-top: none;
}

.cui-${COMPONENT}-button {
  width: 100%;
  padding: var(--cui-${COMPONENT}-btn-padding);
  background: var(--cui-${COMPONENT}-btn-bg);
  color: var(--cui-${COMPONENT}-btn-color);
  font-size: var(--cui-${COMPONENT}-btn-font-size);
  font-weight: var(--cui-${COMPONENT}-btn-font-weight);
  border: none;
  outline: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background-color 0.15s, color 0.15s;
  user-select: none;
}

.cui-${COMPONENT}-button:hover {
  background: var(--cui-${COMPONENT}-btn-hover-bg);
  color: var(--cui-${COMPONENT}-btn-hover-color);
}

.cui-${COMPONENT}-button.--active {
  background: var(--cui-${COMPONENT}-btn-active-bg);
  color: var(--cui-${COMPONENT}-btn-active-color);
}

.cui-${COMPONENT}-body {
  padding: var(--cui-${COMPONENT}-body-padding);
  background: var(--cui-${COMPONENT}-bg);
  color: var(--cui-${COMPONENT}-color);
}

.cui-${COMPONENT}-chevron {
  transition: transform 0.2s ease-in-out;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.cui-${COMPONENT}-button.--active .cui-${COMPONENT}-chevron {
  transform: rotate(180deg);
}`
}

function generateAccordionVariant(
  variant: AccordionVariant,
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

  lines.push(`  --cui-${COMPONENT}-body-padding: ${buildPadding(variant.bodyPadding)};`)

  lines.push(`  --cui-${COMPONENT}-btn-bg: ${variant.buttonBackground};`)
  lines.push(`  --cui-${COMPONENT}-btn-color: ${variant.buttonColor};`)
  lines.push(`  --cui-${COMPONENT}-btn-padding: ${buildPadding(variant.buttonPadding)};`)
  lines.push(`  --cui-${COMPONENT}-btn-font-size: ${buildFontSize(variant.buttonFontSize)};`)
  lines.push(`  --cui-${COMPONENT}-btn-font-weight: ${variant.buttonFontWeight};`)

  lines.push(`  --cui-${COMPONENT}-btn-hover-bg: ${variant.buttonHoverBackground};`)
  lines.push(`  --cui-${COMPONENT}-btn-hover-color: ${variant.buttonHoverColor};`)

  lines.push(`  --cui-${COMPONENT}-btn-active-bg: ${variant.activeButtonBackground};`)
  lines.push(`  --cui-${COMPONENT}-btn-active-color: ${variant.activeButtonColor};`)

  if (variant.border) {
    lines.push(
      `  --cui-${COMPONENT}-item-border: ${variant.border.width}${variant.border.unit} ${variant.border.style} ${variant.border.color};`
    )
  }

  const offsetShadow = generateOffsetShadowVar(COMPONENT, variant.shadow ? { offset: variant.shadow } : undefined)
  if (offsetShadow) lines.push(offsetShadow)

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
    lines.push(`.cui-${COMPONENT}.--${variantName} .cui-${COMPONENT}-body {`)
    lines.push(...bodyTypography)
    lines.push('}')
  }

  const buttonTypography: string[] = []
  const effectiveFontFamily = variant.fontFamily ?? globalConfig?.fontFamily
  if (effectiveFontFamily) buttonTypography.push(`  font-family: ${effectiveFontFamily};`)
  if (variant.letterSpacing) {
    buttonTypography.push(`  letter-spacing: ${buildLetterSpacing(variant.letterSpacing)};`)
  }

  if (buttonTypography.length > 0) {
    lines.push('')
    lines.push(`.cui-${COMPONENT}.--${variantName} .cui-${COMPONENT}-button {`)
    lines.push(...buttonTypography)
    lines.push('}')
  }

  return lines.join('\n')
}

function generateAccordionVariantDark(variant: AccordionVariant, variantName: string): string {
  const dark = variant.dark
  if (!dark) return ''

  const lines: string[] = []
  lines.push(`/* Dark Mode Variant: ${variant.name} */`)
  lines.push(`body[color-scheme="dark"] .cui-${COMPONENT}.--${variantName} {`)

  lines.push(...generateDarkBaseProperties(COMPONENT, dark))

  const borderOverride = generateDarkBorderOverride(COMPONENT, variant.border, dark.borderColor)
  if (borderOverride) lines.push(borderOverride)

  if (dark.borderColor && variant.border) {
    lines.push(
      `  --cui-${COMPONENT}-item-border: ${variant.border.width}${variant.border.unit} ${variant.border.style} ${dark.borderColor};`
    )
  }

  if (dark.background) lines.push(`  --cui-${COMPONENT}-btn-active-bg: ${dark.activeButtonBackground};`)
  if (dark.activeButtonColor) lines.push(`  --cui-${COMPONENT}-btn-active-color: ${dark.activeButtonColor};`)
  if (dark.buttonBackground) lines.push(`  --cui-${COMPONENT}-btn-bg: ${dark.buttonBackground};`)
  if (dark.buttonColor) lines.push(`  --cui-${COMPONENT}-btn-color: ${dark.buttonColor};`)
  if (dark.buttonHoverBackground) lines.push(`  --cui-${COMPONENT}-btn-hover-bg: ${dark.buttonHoverBackground};`)
  if (dark.buttonHoverColor) lines.push(`  --cui-${COMPONENT}-btn-hover-color: ${dark.buttonHoverColor};`)

  const offsetShadow = generateDarkOffsetShadowVar(
    COMPONENT,
    variant.shadow ? { offset: variant.shadow } : undefined,
    dark.shadowColor
  )
  if (offsetShadow) lines.push(offsetShadow)

  lines.push('}')
  return lines.join('\n')
}
