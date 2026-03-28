/**
 * Base styles for ComboUX
 */

const BASE_STYLES_ID = 'cux-base-styles'

interface BaseStylesOptions {
  backgroundColor?: string
  darkBackgroundColor?: string
  textColor?: string
  darkTextColor?: string
}

const DEFAULT_OPTIONS: BaseStylesOptions = {
  backgroundColor: '#ffffff',
  darkBackgroundColor: '#333333',
  textColor: '#212529',
  darkTextColor: '#f8f9fa'
}

let styleElement: HTMLStyleElement | null = null

/**
 * Build base CSS with dynamic colors
 */
function buildBaseCSS(options: BaseStylesOptions = DEFAULT_OPTIONS): string {
  const bgColor = options.backgroundColor ?? DEFAULT_OPTIONS.backgroundColor
  const darkBgColor = options.darkBackgroundColor ?? DEFAULT_OPTIONS.darkBackgroundColor
  const textColor = options.textColor ?? DEFAULT_OPTIONS.textColor
  const darkTextColor = options.darkTextColor ?? DEFAULT_OPTIONS.darkTextColor

  return `
/* Base styles */
:root {
  --cux-bg: ${bgColor};
  --cux-text: ${textColor};
  --cux-text-muted: #6c757d;
  --cux-border: #dee2e6;
  --cux-surface: #f8f9fa;
}

.dark {
  --cux-bg: ${darkBgColor};
  --cux-text: ${darkTextColor};
  --cux-text-muted: #adb5bd;
  --cux-border: #495057;
  --cux-surface: #222222;
}

body {
  background-color: var(--cux-bg);
  color: var(--cux-text);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  transition: background-color 0.2s ease, color 0.2s ease;
}
`
}

/**
 * Inject base styles with dynamic colors
 */
export function injectBaseStyles(options?: BaseStylesOptions): void {
  if (typeof document === 'undefined') return

  const existing = document.getElementById(BASE_STYLES_ID) as HTMLStyleElement | null

  if (existing) {
    // Update existing styles if options provided
    if (options) {
      existing.textContent = buildBaseCSS(options)
    }
    return
  }

  const style = document.createElement('style')
  style.id = BASE_STYLES_ID
  style.textContent = buildBaseCSS(options)
  document.head.insertBefore(style, document.head.firstChild)
  styleElement = style
}

/**
 * Update base styles (for theme updates)
 */
export function updateBaseStyles(options: BaseStylesOptions): void {
  if (typeof document === 'undefined') return

  const existing = document.getElementById(BASE_STYLES_ID) as HTMLStyleElement | null

  if (existing) {
    existing.textContent = buildBaseCSS(options)
  } else {
    injectBaseStyles(options)
  }
}
