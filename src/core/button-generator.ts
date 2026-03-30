/**
 * Button CSS Generator
 * Generates CSS for button variants with custom properties
 */

import type { ButtonVariant } from '../types'
import {
  toKebabCase,
  buildBorder,
  buildBorderRadius,
  buildPadding,
  buildBorderOptional,
  buildOffset,
  deepMerge,
  buildFontSize,
  buildLetterSpacing
} from './utils'

/**
 * Generate complete CSS for button component
 */
export function generateButtonCSS(variants: ButtonVariant[], globalTypography?: { fontFamily?: string }): string {
  const css: string[] = []

  css.push(generateButtonBase(globalTypography))

  variants.forEach(variant => {
    const variantName = toKebabCase(variant.name)
    css.push(generateButtonVariant(variant, variantName, globalTypography))

    if (variant.dark) {
      const mergedVariant = deepMerge({ ...variant }, variant.dark)
      css.push(generateButtonVariantDark(mergedVariant as ButtonVariant, variantName, globalTypography))
    }
  })

  return css.join('\n\n')
}

/**
 * Generate base button styles
 */
function generateButtonBase(_globalTypography?: { fontFamily?: string }): string {
  return `/* Button Base Styles */
.cui-button {
  /* CSS Custom Properties (set by variants) */
  --cui-btn-bg: transparent;
  --cui-btn-color: inherit;
  --cui-btn-border: none;
  --cui-btn-radius: 0;
  --cui-btn-padding: 0;
  --cui-btn-font: inherit;
  --cui-btn-font-size: inherit;
  --cui-btn-font-weight: inherit;
  --cui-btn-font-style: inherit;
  --cui-btn-letter-spacing: inherit;
  --cui-btn-shadow: none;

  /* Hover state variables */
  --cui-btn-hover-bg: var(--cui-btn-bg);
  --cui-btn-hover-color: var(--cui-btn-color);
  --cui-btn-hover-border: var(--cui-btn-border);

  /* Active state variables */
  --cui-btn-active-bg: var(--cui-btn-bg);
  --cui-btn-active-color: var(--cui-btn-color);
  --cui-btn-active-border: var(--cui-btn-border);

  /* Focus state variables */
  --cui-btn-focus-color: #3b82f6;
  --cui-btn-focus-offset: 2px;

  /* Disabled state variables */
  --cui-btn-disabled-bg: var(--cui-btn-bg);
  --cui-btn-disabled-color: var(--cui-btn-color);
  --cui-btn-disabled-border: var(--cui-btn-border);
  --cui-btn-disabled-opacity: 0.5;

  /* Base styles */
  background: var(--cui-btn-bg);
  color: var(--cui-btn-color);
  border: var(--cui-btn-border);
  border-radius: var(--cui-btn-radius);
  padding: var(--cui-btn-padding);
  font-family: var(--cui-btn-font);
  font-size: var(--cui-btn-font-size);
  font-weight: var(--cui-btn-font-weight);
  font-style: var(--cui-btn-font-style);
  letter-spacing: var(--cui-btn-letter-spacing);
  box-shadow: var(--cui-btn-shadow);

  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

/* Hover state */
.cui-button:hover:not(:disabled) {
  background: var(--cui-btn-hover-bg);
  color: var(--cui-btn-hover-color);
  border: var(--cui-btn-hover-border);
}

/* Active state */
.cui-button:active:not(:disabled) {
  background: var(--cui-btn-active-bg);
  color: var(--cui-btn-active-color);
  border: var(--cui-btn-active-border);
}

/* Focus state */
.cui-button:focus-visible {
  outline: 2px solid var(--cui-btn-focus-color);
  outline-offset: var(--cui-btn-focus-offset);
}

/* Disabled state */
.cui-button:disabled {
  background: var(--cui-btn-disabled-bg);
  color: var(--cui-btn-disabled-color);
  border: var(--cui-btn-disabled-border);
  opacity: var(--cui-btn-disabled-opacity);
  cursor: not-allowed;
}`
}

/**
 * Generate CSS for a specific button variant
 */
function generateButtonVariant(
  variant: ButtonVariant,
  variantName: string,
  globalTypography?: { fontFamily?: string }
): string {
  const lines: string[] = []
  lines.push(`/* Variant: ${variant.name} */`)
  lines.push(`.cui-button.--${variantName} {`)

  // Basic properties
  lines.push(`  --cui-btn-bg: ${variant.background};`)
  lines.push(`  --cui-btn-color: ${variant.color};`)

  if (variant.border) {
    lines.push(`  --cui-btn-border: ${buildBorder(variant.border)};`)
  }

  if (variant.borderRadius) {
    lines.push(`  --cui-btn-radius: ${buildBorderRadius(variant.borderRadius)};`)
  }

  if (variant.padding) {
    lines.push(`  --cui-btn-padding: ${buildPadding(variant.padding)};`)
  }

  // Typography
  const fontFamily = variant.fontFamily ?? globalTypography?.fontFamily
  if (fontFamily) {
    lines.push(`  --cui-btn-font: '${fontFamily}', sans-serif;`)
  }
  if (variant.fontSize) {
    lines.push(`  --cui-btn-font-size: ${buildFontSize(variant.fontSize)};`)
  }
  if (variant.fontWeight) {
    lines.push(`  --cui-btn-font-weight: ${variant.fontWeight};`)
  }
  if (variant.fontStyle) {
    lines.push(`  --cui-btn-font-style: ${variant.fontStyle};`)
  }
  if (variant.letterSpacing) {
    lines.push(`  --cui-btn-letter-spacing: ${buildLetterSpacing(variant.letterSpacing)};`)
  }

  // Shadow
  if (variant.shadows) {
    const shadowValue = buildShadows(variant.shadows)
    if (shadowValue) {
      lines.push(`  --cui-btn-shadow: ${shadowValue};`)
    }
  }

  // Hover state
  if (variant.hoverBackground) {
    lines.push(`  --cui-btn-hover-bg: ${variant.hoverBackground};`)
  }
  if (variant.hoverColor) {
    lines.push(`  --cui-btn-hover-color: ${variant.hoverColor};`)
  }
  if (variant.hoverBorder) {
    lines.push(`  --cui-btn-hover-border: ${buildBorderOptional(variant.hoverBorder)};`)
  }

  // Active state
  if (variant.activeBackground) {
    lines.push(`  --cui-btn-active-bg: ${variant.activeBackground};`)
  }
  if (variant.activeColor) {
    lines.push(`  --cui-btn-active-color: ${variant.activeColor};`)
  }
  if (variant.activeBorder) {
    lines.push(`  --cui-btn-active-border: ${buildBorderOptional(variant.activeBorder)};`)
  }

  // Focus state
  if (variant.focusColor) {
    lines.push(`  --cui-btn-focus-color: ${variant.focusColor};`)
  }
  if (variant.focusOffset !== undefined) {
    lines.push(`  --cui-btn-focus-offset: ${buildOffset(variant.focusOffset)};`)
  }

  // Disabled state
  if (variant.disabledBackground) {
    lines.push(`  --cui-btn-disabled-bg: ${variant.disabledBackground};`)
  }
  if (variant.disabledColor) {
    lines.push(`  --cui-btn-disabled-color: ${variant.disabledColor};`)
  }
  if (variant.disabledBorder) {
    lines.push(`  --cui-btn-disabled-border: ${buildBorderOptional(variant.disabledBorder)};`)
  }
  if (variant.disabledOpacity !== undefined) {
    lines.push(`  --cui-btn-disabled-opacity: ${variant.disabledOpacity};`)
  }

  lines.push('}')
  return lines.join('\n')
}

/**
 * Generate dark mode CSS for a button variant
 */
function generateButtonVariantDark(
  variant: ButtonVariant,
  variantName: string,
  globalTypography?: { fontFamily?: string }
): string {
  const lines: string[] = []
  lines.push(`/* Dark Mode Variant: ${variant.name} */`)
  lines.push(`body[color-scheme="dark"] .cui-button.--${variantName} {`)

  // Basic properties
  if (variant.background) {
    lines.push(`  --cui-btn-bg: ${variant.background};`)
  }
  if (variant.color) {
    lines.push(`  --cui-btn-color: ${variant.color};`)
  }
  if (variant.border) {
    lines.push(`  --cui-btn-border: ${buildBorder(variant.border)};`)
  }

  // Typography (dark mode may have different font)
  const fontFamily = variant.fontFamily ?? globalTypography?.fontFamily
  if (fontFamily) {
    lines.push(`  --cui-btn-font: '${fontFamily}', sans-serif;`)
  }

  // Shadow for dark mode - use dark shadow colors
  if (variant.shadows) {
    const shadowValue = buildShadowsDark(variant.shadows, variant.dark)
    if (shadowValue) {
      lines.push(`  --cui-btn-shadow: ${shadowValue};`)
    }
  }

  // Hover state (dark)
  if (variant.hoverBackground) {
    lines.push(`  --cui-btn-hover-bg: ${variant.hoverBackground};`)
  }
  if (variant.hoverColor) {
    lines.push(`  --cui-btn-hover-color: ${variant.hoverColor};`)
  }
  if (variant.hoverBorder) {
    lines.push(`  --cui-btn-hover-border: ${buildBorderOptional(variant.hoverBorder)};`)
  }

  // Active state (dark)
  if (variant.activeBackground) {
    lines.push(`  --cui-btn-active-bg: ${variant.activeBackground};`)
  }
  if (variant.activeColor) {
    lines.push(`  --cui-btn-active-color: ${variant.activeColor};`)
  }

  lines.push('}')
  return lines.join('\n')
}

/**
 * Build a CSS box-shadow string from ComponentShadows (handles offset, inset, and insetHighlight)
 */
function buildShadows(
  shadows:
    | {
        offset?: {
          enabled: boolean
          offsetX: number
          offsetY: number
          blur: number
          spread: number
          color: string
        }
        inset?: {
          enabled: boolean
          offsetX: number
          offsetY: number
          blur: number
          spread: number
          color: string
        }
        insetHighlight?: {
          enabled: boolean
          offsetX: number
          offsetY: number
          blur: number
          spread: number
          color: string
        }
      }
    | undefined
): string {
  if (!shadows) return ''

  const shadowParts: string[] = []

  if (shadows.offset?.enabled) {
    const { offsetX, offsetY, blur, spread, color } = shadows.offset
    shadowParts.push(`${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}`)
  }

  if (shadows.inset?.enabled) {
    const { offsetX, offsetY, blur, spread, color } = shadows.inset
    shadowParts.push(`inset ${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}`)
  }

  if (shadows.insetHighlight?.enabled) {
    const { offsetX, offsetY, blur, spread, color } = shadows.insetHighlight
    shadowParts.push(`inset ${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}`)
  }

  return shadowParts.join(', ')
}

/**
 * Build shadows with dark mode color overrides
 */
function buildShadowsDark(
  shadows: {
    offset?: {
      enabled: boolean
      offsetX: number
      offsetY: number
      blur: number
      spread: number
      color: string
    }
    inset?: {
      enabled: boolean
      offsetX: number
      offsetY: number
      blur: number
      spread: number
      color: string
    }
    insetHighlight?: {
      enabled: boolean
      offsetX: number
      offsetY: number
      blur: number
      spread: number
      color: string
    }
  },
  dark?: { shadowColor?: string; shadowInsetColor?: string; shadowInsetHighlightColor?: string }
): string {
  const shadowParts: string[] = []

  if (shadows.offset?.enabled) {
    const { offsetX, offsetY, blur, spread, color } = shadows.offset
    const darkColor = dark?.shadowColor || color
    shadowParts.push(`${offsetX}px ${offsetY}px ${blur}px ${spread}px ${darkColor}`)
  }

  if (shadows.inset?.enabled) {
    const { offsetX, offsetY, blur, spread, color } = shadows.inset
    const darkColor = dark?.shadowInsetColor || color
    shadowParts.push(`inset ${offsetX}px ${offsetY}px ${blur}px ${spread}px ${darkColor}`)
  }

  if (shadows.insetHighlight?.enabled) {
    const { offsetX, offsetY, blur, spread, color } = shadows.insetHighlight
    const darkColor = dark?.shadowInsetHighlightColor || color
    shadowParts.push(`inset ${offsetX}px ${offsetY}px ${blur}px ${spread}px ${darkColor}`)
  }

  return shadowParts.join(', ')
}
