/**
 * Forms CSS Generator
 */

import type { FormsData, TypographyData, UnitNumber } from '../types'
import { buildBorder, buildBorderRadius, buildPadding, buildFontSize } from './utils'

/**
 * Build CSS value from UnitNumber
 */
function buildUnitValue(value: UnitNumber | undefined, defaultUnit: string = 'px'): string {
  if (!value) return ''
  return `${value.value}${value.unit || defaultUnit}`
}

/**
 * Get effective font family (fallback to typography)
 */
function getEffectiveFontFamily(formsFontFamily: string | null | undefined, typography?: TypographyData): string {
  if (formsFontFamily) return formsFontFamily
  if (typography?.globalConfig?.fontFamily) return typography.globalConfig.fontFamily
  return 'system-ui, sans-serif'
}

/**
 * Generate complete forms CSS
 */
export function generateFormsCSS(forms: FormsData, typography?: TypographyData): string {
  const css: string[] = []
  const config = forms.globalConfig

  if (!config) return ''

  // Get effective font family from forms or typography
  const effectiveFontFamily = getEffectiveFontFamily(config.fontFamily, typography)

  // ==================== Base Form Styles ====================
  css.push(`/* Forms Base Styles */`)

  // Form field base
  css.push(`.cux-field {`)
  css.push(`  position: relative;`)
  css.push(`  margin-bottom: ${config.fieldHeight || 95}px;`)
  css.push(`}`)

  // Label
  if (config.showLabel) {
    css.push(`.cux-label {`)
    css.push(`  display: block;`)
    css.push(`  font-family: '${effectiveFontFamily}', sans-serif;`)
    css.push(`  color: ${config.labelColor || '#212529'};`)
    if (config.labelFontSize) {
      css.push(`  font-size: ${buildFontSize(config.labelFontSize)};`)
    }
    css.push(`  font-weight: ${config.labelFontWeight || '500'};`)
    css.push(`  margin-bottom: ${config.labelMarginBottom || 4}px;`)
    css.push(`}`)

    // Dark mode label
    css.push(`.dark .cux-label {`)
    css.push(`  color: ${config.dark?.labelColor || '#f8f9fa'};`)
    css.push(`}`)
  }

  // Input base
  css.push(`.cux-input {`)
  css.push(`  width: 100%;`)
  css.push(`  font-family: '${effectiveFontFamily}', sans-serif;`)
  css.push(`  font-size: ${buildFontSize(config.fontSize || { value: 14, unit: 'px' })};`)
  css.push(`  color: ${config.color || '#212529'};`)
  css.push(`  background: ${config.background || '#ffffff'};`)
  css.push(`  border: ${buildBorder(config.border)};`)
  css.push(`  border-radius: ${buildBorderRadius(config.borderRadius)};`)
  css.push(`  padding: ${buildPadding(config.padding)};`)
  css.push(`  transition: border-color 0.15s ease, box-shadow 0.15s ease;`)
  css.push(`}`)

  // Dark mode input
  css.push(`.dark .cux-input {`)
  css.push(`  color: ${config.dark?.color || '#f8f9fa'};`)
  css.push(`  background: ${config.dark?.background || '#222222'};`)
  css.push(`  border-color: ${config.dark?.borderColor || '#495057'};`)
  css.push(`}`)

  // Placeholder
  if (config.showPlaceholder) {
    css.push(`.cux-input::placeholder {`)
    css.push(`  color: ${config.placeholderColor || '#6c757d'};`)
    css.push(`  opacity: 1;`)
    css.push(`}`)

    css.push(`.dark .cux-input::placeholder {`)
    css.push(`  color: ${config.dark?.placeholderColor || '#adb5bd'};`)
    css.push(`}`)
  }

  // Focus state
  css.push(`.cux-input:focus {`)
  css.push(`  outline: none;`)
  css.push(`  border-color: ${config.border?.color || '#ced4da'};`)
  css.push(
    `  box-shadow: 0 0 0 ${config.focusOutlineWidth || 3}px ${config.focusOutlineColor || 'rgba(13, 110, 253, 0.16)'};`
  )
  css.push(`}`)

  css.push(`.dark .cux-input:focus {`)
  css.push(`  border-color: ${config.dark?.borderColor || '#495057'};`)
  css.push(
    `  box-shadow: 0 0 0 ${config.focusOutlineWidth || 3}px ${config.dark?.focusOutlineColor || 'rgba(117, 149, 194, 0.4)'};`
  )
  css.push(`}`)

  // Error state
  css.push(`.cux-input.cux-error,`)
  css.push(`.cux-input[aria-invalid="true"] {`)
  css.push(`  border-color: ${config.errorBorderColor || '#dc3545'};`)
  css.push(`}`)

  css.push(`.dark .cux-input.cux-error,`)
  css.push(`.dark .cux-input[aria-invalid="true"] {`)
  css.push(`  border-color: ${config.dark?.errorBorderColor || '#ea868f'};`)
  css.push(`}`)

  // Error message
  css.push(`.cux-error-message {`)
  css.push(`  font-family: '${effectiveFontFamily}', sans-serif;`)
  css.push(`  color: ${config.errorColor || '#dc3545'};`)
  if (config.errorFontSize) {
    css.push(`  font-size: ${buildFontSize(config.errorFontSize)};`)
  }
  css.push(`  margin-top: ${config.errorMarginTop || 4}px;`)
  css.push(`}`)

  css.push(`.dark .cux-error-message {`)
  css.push(`  color: ${config.dark?.errorColor || '#ea868f'};`)
  css.push(`}`)

  // Disabled state
  css.push(`.cux-input:disabled {`)
  css.push(`  opacity: ${config.disabledOpacity || 0.65};`)
  css.push(`  color: ${config.disabledColor || '#6c757d'};`)
  css.push(`  background: ${config.disabledBackground || '#e9ecef'};`)
  css.push(`  border-color: ${config.disabledBorderColor || '#ced4da'};`)
  css.push(`  cursor: not-allowed;`)
  css.push(`}`)

  css.push(`.dark .cux-input:disabled {`)
  css.push(`  color: ${config.dark?.disabledColor || '#6c757d'};`)
  css.push(`  background: ${config.dark?.disabledBackground || '#222222'};`)
  css.push(`  border-color: ${config.dark?.disabledBorderColor || '#495057'};`)
  css.push(`}`)

  // ==================== Checkbox & Radio ====================
  css.push(``)
  css.push(`/* Checkbox & Radio */`)

  const checkSize = config.checkRadioSize || 18

  css.push(`.cux-checkbox,`)
  css.push(`.cux-radio {`)
  css.push(`  display: inline-flex;`)
  css.push(`  align-items: center;`)
  css.push(`  gap: 8px;`)
  css.push(`  cursor: pointer;`)
  css.push(`}`)

  css.push(`.cux-checkbox input,`)
  css.push(`.cux-radio input {`)
  css.push(`  width: ${checkSize}px;`)
  css.push(`  height: ${checkSize}px;`)
  css.push(`  accent-color: ${config.checkRadioColor || '#0d6efd'};`)
  css.push(`  cursor: pointer;`)
  css.push(`}`)

  css.push(`.dark .cux-checkbox input,`)
  css.push(`.dark .cux-radio input {`)
  css.push(`  accent-color: ${config.dark?.checkRadioColor || '#6ea8fe'};`)
  css.push(`}`)

  // Option label
  css.push(`.cux-option-label {`)
  css.push(`  font-family: '${config.optionFontFamily || effectiveFontFamily}', sans-serif;`)
  css.push(`  color: ${config.optionColor || '#212529'};`)
  if (config.optionFontSize) {
    css.push(`  font-size: ${buildFontSize(config.optionFontSize)};`)
  }
  css.push(`  font-weight: ${config.optionFontWeight || '400'};`)
  css.push(`}`)

  css.push(`.dark .cux-option-label {`)
  css.push(`  color: ${config.dark?.optionColor || '#f8f9fa'};`)
  css.push(`}`)

  // Option groups
  const spacingH = config.optionSpacingHorizontal
  const spacingV = config.optionSpacingVertical

  css.push(`.cux-option-group {`)
  css.push(`  display: flex;`)
  if (config.optionOrientation === 'vertical') {
    css.push(`  flex-direction: column;`)
    if (spacingV) {
      css.push(`  gap: ${buildUnitValue(spacingV)};`)
    }
  } else {
    css.push(`  flex-direction: row;`)
    css.push(`  flex-wrap: wrap;`)
    if (spacingH) {
      css.push(`  gap: ${buildUnitValue(spacingH)};`)
    }
  }
  css.push(`}`)

  // ==================== Select ====================
  css.push(``)
  css.push(`/* Select */`)

  css.push(`.cux-select {`)
  css.push(`  width: 100%;`)
  css.push(`  font-family: '${effectiveFontFamily}', sans-serif;`)
  css.push(`  font-size: ${buildFontSize(config.fontSize || { value: 14, unit: 'px' })};`)
  css.push(`  color: ${config.color || '#212529'};`)
  css.push(`  background: ${config.background || '#ffffff'};`)
  css.push(`  border: ${buildBorder(config.border)};`)
  css.push(`  border-radius: ${buildBorderRadius(config.borderRadius)};`)
  css.push(`  padding: ${buildPadding(config.padding)};`)
  css.push(`  cursor: pointer;`)
  css.push(`  appearance: none;`)
  css.push(
    `  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236c757d' d='M6 8L1 3h10z'/%3E%3C/svg%3E");`
  )
  css.push(`  background-repeat: no-repeat;`)
  css.push(`  background-position: right 12px center;`)
  css.push(`  padding-right: 36px;`)
  css.push(`}`)

  css.push(`.dark .cux-select {`)
  css.push(`  color: ${config.dark?.color || '#f8f9fa'};`)
  css.push(`  background: ${config.dark?.background || '#222222'};`)
  css.push(`  border-color: ${config.dark?.borderColor || '#495057'};`)
  css.push(`}`)

  // ==================== Textarea ====================
  css.push(``)
  css.push(`/* Textarea */`)

  css.push(`.cux-textarea {`)
  css.push(`  width: 100%;`)
  css.push(`  min-height: 100px;`)
  css.push(`  font-family: '${effectiveFontFamily}', sans-serif;`)
  css.push(`  font-size: ${buildFontSize(config.fontSize || { value: 14, unit: 'px' })};`)
  css.push(`  color: ${config.color || '#212529'};`)
  css.push(`  background: ${config.background || '#ffffff'};`)
  css.push(`  border: ${buildBorder(config.border)};`)
  css.push(`  border-radius: ${buildBorderRadius(config.borderRadius)};`)
  css.push(`  padding: ${buildPadding(config.padding)};`)
  css.push(`  resize: vertical;`)
  css.push(`}`)

  css.push(`.dark .cux-textarea {`)
  css.push(`  color: ${config.dark?.color || '#f8f9fa'};`)
  css.push(`  background: ${config.dark?.background || '#222222'};`)
  css.push(`  border-color: ${config.dark?.borderColor || '#495057'};`)
  css.push(`}`)

  // ==================== File / Dropzone ====================
  css.push(``)
  css.push(`/* File / Dropzone */`)

  css.push(`.cux-dropzone {`)
  css.push(`  display: flex;`)
  css.push(`  flex-direction: column;`)
  css.push(`  align-items: center;`)
  css.push(`  justify-content: center;`)
  css.push(`  padding: ${buildPadding(config.padding)};`)
  css.push(`  min-height: 120px;`)
  css.push(`  font-family: '${effectiveFontFamily}', sans-serif;`)
  css.push(`  background: ${config.dropzoneBackground || '#f8f9fa'};`)
  css.push(`  color: ${config.dropzoneColor || '#6c757d'};`)
  if (config.dropzoneBorder) {
    css.push(`  border: ${buildBorder(config.dropzoneBorder)};`)
  }
  if (config.dropzoneBorderRadius) {
    css.push(`  border-radius: ${buildBorderRadius(config.dropzoneBorderRadius)};`)
  }
  css.push(`  cursor: pointer;`)
  css.push(`  transition: background-color 0.15s ease, border-color 0.15s ease;`)
  css.push(`}`)

  css.push(`.dark .cux-dropzone {`)
  css.push(`  background: ${config.dark?.dropzoneBackground || '#222222'};`)
  css.push(`  color: ${config.dark?.dropzoneColor || '#adb5bd'};`)
  css.push(`  border-color: ${config.dark?.dropzoneBorderColor || '#495057'};`)
  css.push(`}`)

  css.push(`.cux-dropzone:hover {`)
  css.push(`  background: ${config.dropzoneBackground || '#f8f9fa'}dd;`)
  css.push(`}`)

  return css.join('\n')
}
