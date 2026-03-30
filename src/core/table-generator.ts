import type { TableVariant, TypographyGlobalConfig } from '../types'
import { toKebabCase, buildBorder, buildBorderRadius, buildPadding, buildFontSize, buildLetterSpacing } from './utils'

const COMPONENT = 'table'

export function generateTableCSS(variants: TableVariant[], globalConfig?: TypographyGlobalConfig): string {
  const css: string[] = []

  css.push(generateTableBase())

  variants.forEach(variant => {
    const variantName = toKebabCase(variant.name)
    css.push(generateTableVariant(variant, variantName, globalConfig))

    if (variant.dark) {
      css.push(generateTableVariantDark(variant, variantName))
    }
  })

  return css.join('\n\n')
}

function generateTableBase(): string {
  return `/* Table Base Styles */
.cui-${COMPONENT} {
  --cui-${COMPONENT}-bg: #ffffff;
  --cui-${COMPONENT}-color: inherit;
  --cui-${COMPONENT}-border: none;
  --cui-${COMPONENT}-radius: 0;
  --cui-${COMPONENT}-shadow: none;

  --cui-${COMPONENT}-header-bg: transparent;
  --cui-${COMPONENT}-header-color: inherit;
  --cui-${COMPONENT}-header-padding: 0;
  --cui-${COMPONENT}-header-border-bottom: none;

  --cui-${COMPONENT}-cell-padding: 0;

  --cui-${COMPONENT}-h-border: none;
  --cui-${COMPONENT}-v-border: none;

  --cui-${COMPONENT}-footer-bg: transparent;
  --cui-${COMPONENT}-footer-color: inherit;
  --cui-${COMPONENT}-footer-border-top: none;

  --cui-${COMPONENT}-striped-row-bg: transparent;
  --cui-${COMPONENT}-striped-col-bg: transparent;

  --cui-${COMPONENT}-hover-bg: transparent;
  --cui-${COMPONENT}-hover-color: inherit;

  background: var(--cui-${COMPONENT}-bg);
  color: var(--cui-${COMPONENT}-color);
  border: var(--cui-${COMPONENT}-border);
  border-radius: var(--cui-${COMPONENT}-radius);
  box-shadow: var(--cui-${COMPONENT}-shadow);
  overflow: hidden;
}

.cui-${COMPONENT} table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}

.cui-${COMPONENT}.--borders-separate table {
  border-collapse: separate;
  border-spacing: 0;
}

.cui-${COMPONENT}-header {
  background: var(--cui-${COMPONENT}-header-bg);
  color: var(--cui-${COMPONENT}-header-color);
  padding: var(--cui-${COMPONENT}-header-padding);
  border-bottom: var(--cui-${COMPONENT}-header-border-bottom);
}

.cui-${COMPONENT}-header-row {
  border-bottom: var(--cui-${COMPONENT}-header-border-bottom);
}

.cui-${COMPONENT}-cell {
  padding: var(--cui-${COMPONENT}-cell-padding);
  border-bottom: var(--cui-${COMPONENT}-h-border);
  border-right: var(--cui-${COMPONENT}-v-border);
}

.cui-${COMPONENT}-cell:last-child {
  border-right: none;
}

.cui-${COMPONENT}-header:last-child {
  border-right: none;
}

.cui-${COMPONENT}-row:last-child .cui-${COMPONENT}-cell {
  border-bottom: none;
}

.cui-${COMPONENT}-footer-row {
  border-top: var(--cui-${COMPONENT}-footer-border-top);
}

.cui-${COMPONENT}-footer {
  background: var(--cui-${COMPONENT}-footer-bg);
  color: var(--cui-${COMPONENT}-footer-color);
  padding: var(--cui-${COMPONENT}-cell-padding);
  border-right: var(--cui-${COMPONENT}-v-border);
}

.cui-${COMPONENT}-footer:last-child {
  border-right: none;
}

.cui-${COMPONENT}.--striped-rows .cui-${COMPONENT}-row:nth-child(even) {
  background: var(--cui-${COMPONENT}-striped-row-bg);
}

.cui-${COMPONENT}.--striped-cols .cui-${COMPONENT}-cell:nth-child(even) {
  background: var(--cui-${COMPONENT}-striped-col-bg);
}

.cui-${COMPONENT}.--hoverable .cui-${COMPONENT}-row:hover {
  background: var(--cui-${COMPONENT}-hover-bg);
}

.cui-${COMPONENT}.--hoverable .cui-${COMPONENT}-row:hover .cui-${COMPONENT}-cell {
  color: var(--cui-${COMPONENT}-hover-color);
}`
}

function generateTableVariant(variant: TableVariant, variantName: string, globalConfig?: TypographyGlobalConfig): string {
  const lines: string[] = []
  const needsSeparate = variant.horizontalBorderEnabled || variant.verticalBorderEnabled

  lines.push(`/* Variant: ${variant.name} */`)
  lines.push(`.cui-${COMPONENT}.--${variantName} {`)

  lines.push(`  --cui-${COMPONENT}-bg: ${variant.background};`)
  lines.push(`  --cui-${COMPONENT}-color: ${variant.color};`)

  if (variant.border) lines.push(`  --cui-${COMPONENT}-border: ${buildBorder(variant.border)};`)
  if (variant.borderRadius) lines.push(`  --cui-${COMPONENT}-radius: ${buildBorderRadius(variant.borderRadius)};`)

  if (variant.shadow?.enabled) {
    lines.push(`  --cui-${COMPONENT}-shadow: ${variant.shadow.offsetX}px ${variant.shadow.offsetY}px ${variant.shadow.blur}px ${variant.shadow.spread}px ${variant.shadow.color};`)
  }

  lines.push(`  --cui-${COMPONENT}-header-bg: ${variant.headerBackground};`)
  lines.push(`  --cui-${COMPONENT}-header-color: ${variant.headerColor};`)

  if (variant.headerPadding) lines.push(`  --cui-${COMPONENT}-header-padding: ${buildPadding(variant.headerPadding)};`)
  if (variant.headerBorderBottom) lines.push(`  --cui-${COMPONENT}-header-border-bottom: ${buildBorder(variant.headerBorderBottom)};`)

  if (variant.cellPadding) lines.push(`  --cui-${COMPONENT}-cell-padding: ${buildPadding(variant.cellPadding)};`)

  if (variant.horizontalBorderEnabled && variant.horizontalBorder) {
    lines.push(`  --cui-${COMPONENT}-h-border: ${buildBorder(variant.horizontalBorder)};`)
  }

  if (variant.verticalBorderEnabled && variant.verticalBorder) {
    lines.push(`  --cui-${COMPONENT}-v-border: ${buildBorder(variant.verticalBorder)};`)
  }

  lines.push(`  --cui-${COMPONENT}-footer-bg: ${variant.footerBackground};`)
  lines.push(`  --cui-${COMPONENT}-footer-color: ${variant.footerColor};`)

  if (variant.footerBorderTop) lines.push(`  --cui-${COMPONENT}-footer-border-top: ${buildBorder(variant.footerBorderTop)};`)

  if (variant.stripedRows) {
    lines.push(`  --cui-${COMPONENT}-striped-row-bg: ${variant.stripedRowBackground};`)
  }

  if (variant.stripedColumns) {
    lines.push(`  --cui-${COMPONENT}-striped-col-bg: ${variant.stripedColumnBackground};`)
  }

  if (variant.hoverable) {
    lines.push(`  --cui-${COMPONENT}-hover-bg: ${variant.hoverBackground};`)
    lines.push(`  --cui-${COMPONENT}-hover-color: ${variant.hoverColor};`)
  }

  lines.push('}')

  if (needsSeparate) {
    lines.push(`\n.cui-${COMPONENT}.--${variantName}.--borders-separate {`)
    lines.push('}')
  }

  if (variant.stripedRows) {
    lines.push(`\n.cui-${COMPONENT}.--${variantName}.--striped-rows .cui-${COMPONENT}-row:nth-child(even) {`)
    lines.push(`  background: ${variant.stripedRowBackground};`)
    lines.push('}')
  }

  if (variant.stripedColumns) {
    lines.push(`\n.cui-${COMPONENT}.--${variantName}.--striped-cols .cui-${COMPONENT}-cell:nth-child(even) {`)
    lines.push(`  background: ${variant.stripedColumnBackground};`)
    lines.push('}')
  }

  if (variant.hoverable) {
    lines.push(`\n.cui-${COMPONENT}.--${variantName}.--hoverable .cui-${COMPONENT}-row:hover {`)
    lines.push(`  background: ${variant.hoverBackground};`)
    lines.push('}')
    lines.push(`\n.cui-${COMPONENT}.--${variantName}.--hoverable .cui-${COMPONENT}-row:hover .cui-${COMPONENT}-cell {`)
    lines.push(`  color: ${variant.hoverColor};`)
    lines.push('}')
  }

  const headerTypography = generateTypographyLines(
    variant.headerFontFamily,
    variant.headerFontSize,
    variant.headerFontWeight,
    variant.headerFontStyle,
    variant.headerLetterSpacing,
    globalConfig
  )

  if (headerTypography.length > 0) {
    lines.push('')
    lines.push(`.cui-${COMPONENT}.--${variantName} .cui-${COMPONENT}-header {`)
    lines.push(...headerTypography)
    lines.push('}')
  }

  const bodyTypography = generateTypographyLines(
    variant.fontFamily,
    variant.fontSize,
    variant.fontWeight,
    variant.fontStyle,
    variant.letterSpacing,
    globalConfig
  )

  if (bodyTypography.length > 0) {
    lines.push('')
    lines.push(`.cui-${COMPONENT}.--${variantName} .cui-${COMPONENT}-cell {`)
    lines.push(...bodyTypography)
    lines.push('}')
  }

  return lines.join('\n')
}

function generateTableVariantDark(variant: TableVariant, variantName: string): string {
  const dark = variant.dark
  if (!dark) return ''

  const lines: string[] = []
  lines.push(`/* Dark Mode Variant: ${variant.name} */`)
  lines.push(`body[color-scheme="dark"] .cui-${COMPONENT}.--${variantName} {`)

  if (dark.background) lines.push(`  --cui-${COMPONENT}-bg: ${dark.background};`)
  if (dark.color) lines.push(`  --cui-${COMPONENT}-color: ${dark.color};`)

  if (dark.borderColor && variant.border) {
    lines.push(`  --cui-${COMPONENT}-border: ${variant.border.width}${variant.border.unit} ${variant.border.style} ${dark.borderColor};`)
  }

  if (dark.headerBackground) lines.push(`  --cui-${COMPONENT}-header-bg: ${dark.headerBackground};`)
  if (dark.headerColor) lines.push(`  --cui-${COMPONENT}-header-color: ${dark.headerColor};`)

  if (dark.headerBorderBottomColor && variant.headerBorderBottom) {
    lines.push(`  --cui-${COMPONENT}-header-border-bottom: ${variant.headerBorderBottom.width}${variant.headerBorderBottom.unit} ${variant.headerBorderBottom.style} ${dark.headerBorderBottomColor};`)
  }

  if (dark.horizontalBorderColor && variant.horizontalBorder) {
    lines.push(`  --cui-${COMPONENT}-h-border: ${variant.horizontalBorder.width}${variant.horizontalBorder.unit} ${variant.horizontalBorder.style} ${dark.horizontalBorderColor};`)
  }

  if (dark.verticalBorderColor && variant.verticalBorder) {
    lines.push(`  --cui-${COMPONENT}-v-border: ${variant.verticalBorder.width}${variant.verticalBorder.unit} ${variant.verticalBorder.style} ${dark.verticalBorderColor};`)
  }

  if (dark.footerBackground) lines.push(`  --cui-${COMPONENT}-footer-bg: ${dark.footerBackground};`)
  if (dark.footerColor) lines.push(`  --cui-${COMPONENT}-footer-color: ${dark.footerColor};`)

  if (dark.footerBorderTopColor && variant.footerBorderTop) {
    lines.push(`  --cui-${COMPONENT}-footer-border-top: ${variant.footerBorderTop.width}${variant.footerBorderTop.unit} ${variant.footerBorderTop.style} ${dark.footerBorderTopColor};`)
  }

  if (dark.stripedRowBackground) {
    lines.push(`  --cui-${COMPONENT}-striped-row-bg: ${dark.stripedRowBackground};`)
  }

  if (dark.stripedColumnBackground) {
    lines.push(`  --cui-${COMPONENT}-striped-col-bg: ${dark.stripedColumnBackground};`)
  }

  if (dark.hoverBackground) lines.push(`  --cui-${COMPONENT}-hover-bg: ${dark.hoverBackground};`)
  if (dark.hoverColor) lines.push(`  --cui-${COMPONENT}-hover-color: ${dark.hoverColor};`)

  if (dark.shadowColor && variant.shadow?.enabled) {
    lines.push(`  --cui-${COMPONENT}-shadow: ${variant.shadow.offsetX}px ${variant.shadow.offsetY}px ${variant.shadow.blur}px ${variant.shadow.spread}px ${dark.shadowColor};`)
  }

  lines.push('}')

  if (variant.stripedRows && dark.stripedRowBackground) {
    lines.push('')
    lines.push(`body[color-scheme="dark"] .cui-${COMPONENT}.--${variantName}.--striped-rows .cui-${COMPONENT}-row:nth-child(even) {`)
    lines.push(`  background: ${dark.stripedRowBackground};`)
    lines.push('}')
  }

  if (variant.stripedColumns && dark.stripedColumnBackground) {
    lines.push('')
    lines.push(`body[color-scheme="dark"] .cui-${COMPONENT}.--${variantName}.--striped-cols .cui-${COMPONENT}-cell:nth-child(even) {`)
    lines.push(`  background: ${dark.stripedColumnBackground};`)
    lines.push('}')
  }

  if (variant.hoverable && dark.hoverBackground) {
    lines.push('')
    lines.push(`body[color-scheme="dark"] .cui-${COMPONENT}.--${variantName}.--hoverable .cui-${COMPONENT}-row:hover {`)
    lines.push(`  background: ${dark.hoverBackground};`)
    lines.push('}')
  }

  if (variant.hoverable && dark.hoverColor) {
    lines.push('')
    lines.push(`body[color-scheme="dark"] .cui-${COMPONENT}.--${variantName}.--hoverable .cui-${COMPONENT}-row:hover .cui-${COMPONENT}-cell {`)
    lines.push(`  color: ${dark.hoverColor};`)
    lines.push('}')
  }

  return lines.join('\n')
}

function generateTypographyLines(
  fontFamily: string | null | undefined,
  fontSize: { value: number; unit: string } | undefined,
  fontWeight: string | undefined,
  fontStyle: string | undefined,
  letterSpacing: { value: number; unit: string } | undefined,
  globalConfig?: TypographyGlobalConfig
): string[] {
  const lines: string[] = []

  const effectiveFont = fontFamily ?? globalConfig?.fontFamily
  if (effectiveFont) {
    lines.push(`  font-family: '${effectiveFont}', sans-serif;`)
  }
  if (fontSize) {
    lines.push(`  font-size: ${buildFontSize(fontSize)};`)
  }
  if (fontWeight) {
    lines.push(`  font-weight: ${fontWeight};`)
  }
  if (fontStyle) {
    lines.push(`  font-style: ${fontStyle};`)
  }
  if (letterSpacing) {
    lines.push(`  letter-spacing: ${buildLetterSpacing(letterSpacing)};`)
  }

  return lines
}
