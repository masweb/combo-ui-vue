/**
 * Button CSS Generator
 * Generates CSS for button variants with custom properties
 */

import type { ButtonVariant } from '../types'
import { toKebabCase, buildBorder, buildBorderRadius, buildPadding, buildBorderOptional, buildOffset, deepMerge, buildFontSize, buildLetterSpacing } from './utils'

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
.cux-button {
  /* CSS Custom Properties (set by variants) */
  --cux-btn-bg: transparent;
  --cux-btn-color: inherit;
  --cux-btn-border: none;
  --cux-btn-radius: 0;
  --cux-btn-padding: 0;
  --cux-btn-font: inherit;
  --cux-btn-font-size: inherit;
  --cux-btn-font-weight: inherit;
  --cux-btn-font-style: inherit;
  --cux-btn-letter-spacing: inherit;
  --cux-btn-shadow: none;

  /* Hover state variables */
  --cux-btn-hover-bg: var(--cux-btn-bg);
  --cux-btn-hover-color: var(--cux-btn-color);
  --cux-btn-hover-border: var(--cux-btn-border);

  /* Active state variables */
  --cux-btn-active-bg: var(--cux-btn-bg);
  --cux-btn-active-color: var(--cux-btn-color);
  --cux-btn-active-border: var(--cux-btn-border);

  /* Focus state variables */
  --cux-btn-focus-color: #3b82f6;
  --cux-btn-focus-offset: 2px;

  /* Disabled state variables */
  --cux-btn-disabled-bg: var(--cux-btn-bg);
  --cux-btn-disabled-color: var(--cux-btn-color);
  --cux-btn-disabled-border: var(--cux-btn-border);
  --cux-btn-disabled-opacity: 0.5;

  /* Base styles */
  background: var(--cux-btn-bg);
  color: var(--cux-btn-color);
  border: var(--cux-btn-border);
  border-radius: var(--cux-btn-radius);
  padding: var(--cux-btn-padding);
  font-family: var(--cux-btn-font);
  font-size: var(--cux-btn-font-size);
  font-weight: var(--cux-btn-font-weight);
  font-style: var(--cux-btn-font-style);
  letter-spacing: var(--cux-btn-letter-spacing);
  box-shadow: var(--cux-btn-shadow);

  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

/* Hover state */
.cux-button:hover:not(:disabled) {
  background: var(--cux-btn-hover-bg);
  color: var(--cux-btn-hover-color);
  border: var(--cux-btn-hover-border);
}

/* Active state */
.cux-button:active:not(:disabled) {
  background: var(--cux-btn-active-bg);
  color: var(--cux-btn-active-color);
  border: var(--cux-btn-active-border);
}

/* Focus state */
.cux-button:focus-visible {
  outline: 2px solid var(--cux-btn-focus-color);
  outline-offset: var(--cux-btn-focus-offset);
}

/* Disabled state */
.cux-button:disabled {
  background: var(--cux-btn-disabled-bg);
  color: var(--cux-btn-disabled-color);
  border: var(--cux-btn-disabled-border);
  opacity: var(--cux-btn-disabled-opacity);
  cursor: not-allowed;
}`
}

/**
 * Generate CSS for a specific button variant
 */
function generateButtonVariant(variant: ButtonVariant, variantName: string, globalTypography?: { fontFamily?: string }): string {
  const lines: string[] = []
  lines.push(`/* Variant: ${variant.name} */`)
  lines.push(`.cux-button.--${variantName} {`)

  // Basic properties
  lines.push(`  --cux-btn-bg: ${variant.background};`)
  lines.push(`  --cux-btn-color: ${variant.color};`)

  if (variant.border) {
    lines.push(`  --cux-btn-border: ${buildBorder(variant.border)};`)
  }

  if (variant.borderRadius) {
    lines.push(`  --cux-btn-radius: ${buildBorderRadius(variant.borderRadius)};`)
  }

  if (variant.padding) {
    lines.push(`  --cux-btn-padding: ${buildPadding(variant.padding)};`)
  }

  // Typography
  const fontFamily = variant.fontFamily ?? globalTypography?.fontFamily
  if (fontFamily) {
    lines.push(`  --cux-btn-font: '${fontFamily}', sans-serif;`)
  }
  if (variant.fontSize) {
    lines.push(`  --cux-btn-font-size: ${buildFontSize(variant.fontSize)};`)
  }
  if (variant.fontWeight) {
    lines.push(`  --cux-btn-font-weight: ${variant.fontWeight};`)
  }
  if (variant.fontStyle) {
    lines.push(`  --cux-btn-font-style: ${variant.fontStyle};`)
  }
  if (variant.letterSpacing) {
    lines.push(`  --cux-btn-letter-spacing: ${buildLetterSpacing(variant.letterSpacing)};`)
  }

  // Shadow
  if (variant.shadows) {
    const shadowValue = buildShadows(variant.shadows)
    if (shadowValue) {
      lines.push(`  --cux-btn-shadow: ${shadowValue};`)
    }
  }

  // Hover state
  if (variant.hoverBackground) {
    lines.push(`  --cux-btn-hover-bg: ${variant.hoverBackground};`)
  }
  if (variant.hoverColor) {
    lines.push(`  --cux-btn-hover-color: ${variant.hoverColor};`)
  }
  if (variant.hoverBorder) {
    lines.push(`  --cux-btn-hover-border: ${buildBorderOptional(variant.hoverBorder)};`)
  }

  // Active state
  if (variant.activeBackground) {
    lines.push(`  --cux-btn-active-bg: ${variant.activeBackground};`)
  }
  if (variant.activeColor) {
    lines.push(`  --cux-btn-active-color: ${variant.activeColor};`)
  }
  if (variant.activeBorder) {
    lines.push(`  --cux-btn-active-border: ${buildBorderOptional(variant.activeBorder)};`)
  }

  // Focus state
  if (variant.focusColor) {
    lines.push(`  --cux-btn-focus-color: ${variant.focusColor};`)
  }
  if (variant.focusOffset !== undefined) {
    lines.push(`  --cux-btn-focus-offset: ${buildOffset(variant.focusOffset)};`)
  }

  // Disabled state
  if (variant.disabledBackground) {
    lines.push(`  --cux-btn-disabled-bg: ${variant.disabledBackground};`)
  }
  if (variant.disabledColor) {
    lines.push(`  --cux-btn-disabled-color: ${variant.disabledColor};`)
  }
  if (variant.disabledBorder) {
    lines.push(`  --cux-btn-disabled-border: ${buildBorderOptional(variant.disabledBorder)};`)
  }
  if (variant.disabledOpacity !== undefined) {
    lines.push(`  --cux-btn-disabled-opacity: ${variant.disabledOpacity};`)
  }

  lines.push('}')
  return lines.join('\n')
}

/**
 * Generate dark mode CSS for a button variant
 */
function generateButtonVariantDark(variant: ButtonVariant, variantName: string, globalTypography?: { fontFamily?: string }): string {
  const lines: string[] = []
  lines.push(`/* Dark Mode Variant: ${variant.name} */`)
  lines.push(`.dark .cux-button.--${variantName} {`)

  // Basic properties
  if (variant.background) {
    lines.push(`  --cux-btn-bg: ${variant.background};`)
  }
  if (variant.color) {
    lines.push(`  --cux-btn-color: ${variant.color};`)
  }
  if (variant.border) {
    lines.push(`  --cux-btn-border: ${buildBorder(variant.border)};`)
  }

  // Typography (dark mode may have different font)
  const fontFamily = variant.fontFamily ?? globalTypography?.fontFamily
  if (fontFamily) {
    lines.push(`  --cux-btn-font: '${fontFamily}', sans-serif;`)
  }

  // Shadow for dark mode - use dark shadow colors
  if (variant.shadows) {
    const shadowValue = buildShadowsDark(variant.shadows, variant.dark)
    if (shadowValue) {
      lines.push(`  --cux-btn-shadow: ${shadowValue};`)
    }
  }

  // Hover state (dark)
  if (variant.hoverBackground) {
    lines.push(`  --cux-btn-hover-bg: ${variant.hoverBackground};`)
  }
  if (variant.hoverColor) {
    lines.push(`  --cux-btn-hover-color: ${variant.hoverColor};`)
  }
  if (variant.hoverBorder) {
    lines.push(`  --cux-btn-hover-border: ${buildBorderOptional(variant.hoverBorder)};`)
  }

  // Active state (dark)
  if (variant.activeBackground) {
    lines.push(`  --cux-btn-active-bg: ${variant.activeBackground};`)
  }
  if (variant.activeColor) {
    lines.push(`  --cux-btn-active-color: ${variant.activeColor};`)
  }

  lines.push('}')
  return lines.join('\n')
}

/**
 * Build a CSS box-shadow string from ComponentShadows (handles offset, inset, and insetHighlight)
 */
function buildShadows(shadows: { offset?: { enabled: boolean; offsetX: number; offsetY: number; blur: number; spread: number; color: string }; inset?: { enabled: boolean; offsetX: number; offsetY: number; blur: number; spread: number; color: string }; insetHighlight?: { enabled: boolean; offsetX: number; offsetY: number; blur: number; spread: number; color: string } } | undefined): string {
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
  shadows: { offset?: { enabled: boolean; offsetX: number; offsetY: number; blur: number; spread: number; color: string }; inset?: { enabled: boolean; offsetX: number; offsetY: number; blur: number; spread: number; color: string }; insetHighlight?: { enabled: boolean; offsetX: number; offsetY: number; blur: number; spread: number; color: string } },
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
