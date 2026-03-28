/**
 * Utility functions for CSS generation
 */

import type { BorderValue, BorderRadiusValue, PaddingValue, UnitNumber } from '../types'

/**
 * Convert a string to kebab-case for CSS class names
 * Removes accents and special characters
 */
export function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Build a CSS border string from BorderValue
 */
export function buildBorder(border: BorderValue | undefined): string {
  if (!border) return ''
  return `${border.width}${border.unit} ${border.style} ${border.color}`
}

/**
 * Build a CSS border-radius string from BorderRadiusValue
 */
export function buildBorderRadius(radius: BorderRadiusValue | undefined): string {
  if (!radius) return ''

  if (radius.linked) {
    return `${radius.tl}${radius.unit}`
  }

  return `${radius.tl}${radius.unit} ${radius.tr}${radius.unit} ${radius.br}${radius.unit} ${radius.bl}${radius.unit}`
}

/**
 * Build a CSS padding string from PaddingValue
 */
export function buildPadding(padding: PaddingValue | undefined): string {
  if (!padding) return ''

  const { top, right, bottom, left, unit } = padding

  // All same
  if (top === right && right === bottom && bottom === left) {
    return `${top}${unit}`
  }

  // Vertical same, horizontal same
  if (top === bottom && right === left) {
    return `${top}${unit} ${right}${unit}`
  }

  return `${top}${unit} ${right}${unit} ${bottom}${unit} ${left}${unit}`
}

/**
 * Build a CSS font-size string from UnitNumber
 */
export function buildFontSize(fontSize: UnitNumber | undefined): string {
  if (!fontSize) return ''
  return `${fontSize.value}${fontSize.unit}`
}

/**
 * Build a CSS letter-spacing string
 */
export function buildLetterSpacing(value: string | UnitNumber | undefined): string {
  if (!value) return ''

  // If it's a UnitNumber object
  if (typeof value === 'object' && 'value' in value) {
    return `${value.value}${value.unit}`
  }

  // If it's a string
  if (typeof value === 'string') {
    // If it's already a valid CSS value, return it
    if (value.endsWith('px') || value.endsWith('em') || value.endsWith('rem')) {
      return value
    }
    // Otherwise assume it's a number
    return `${value}px`
  }

  return ''
}

/**
 * Build a CSS border string from BorderValue | string
 */
export function buildBorderOptional(border: BorderValue | string | undefined): string {
  if (!border) return ''

  // If it's a string, return it directly
  if (typeof border === 'string') {
    return border
  }

  // Otherwise, build from BorderValue object
  return `${border.width}${border.unit} ${border.style} ${border.color}`
}

/**
 * Build a CSS offset string from UnitNumber | number
 */
export function buildOffset(offset: UnitNumber | number | undefined): string {
  if (offset === undefined) return ''

  // If it's a number, add px
  if (typeof offset === 'number') {
    return `${offset}px`
  }

  // If it's a UnitNumber object
  return `${offset.value}${offset.unit}`
}

/**
 * Deep merge objects (for dark mode overrides)
 */
export function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T> | undefined): T {
  if (!source) return target

  const result = { ...target }

  for (const key in source) {
    const sourceValue = source[key]
    const targetValue = target[key]

    if (
      sourceValue !== undefined &&
      sourceValue !== null &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue !== null &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      result[key] = deepMerge(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>
      ) as T[Extract<keyof T, string>]
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue as T[Extract<keyof T, string>]
    }
  }

  return result
}

/**
 * Get effective font family (fallback to global config)
 * Shared utility used by all component generators
 */
export function getEffectiveFontFamily(
  variantFontFamily: string | null | undefined,
  globalFontFamily?: string
): string | null {
  if (variantFontFamily !== null && variantFontFamily !== undefined) {
    return variantFontFamily
  }
  return globalFontFamily || null
}
