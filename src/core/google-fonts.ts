/**
 * Google Fonts loader for vanilla library
 */

const injectedFamilies = new Set<string>()

/**
 * Generate Google Fonts URL for the given family and variants
 */
function generateFontUrl(family: string, variants: string[]): string {
  const regulars: number[] = []
  const italics: number[] = []

  for (const v of variants) {
    if (v === 'regular') {
      regulars.push(400)
      continue
    }
    if (v === 'italic') {
      italics.push(400)
      continue
    }
    if (v.endsWith('italic')) {
      italics.push(parseInt(v) || 400)
      continue
    }
    const n = parseInt(v)
    if (!isNaN(n)) regulars.push(n)
  }

  let url: string
  if (italics.length === 0) {
    const wghtParam = regulars.map(w => `0,${w}`).join(';')
    url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:ital,wght@${wghtParam}&display=swap`
  } else if (regulars.length === 0) {
    const wghtParam = italics.map(w => `1,${w}`).join(';')
    url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:ital,wght@${wghtParam}&display=swap`
  } else {
    const pairs = [...regulars.map(w => `0,${w}`), ...italics.map(w => `1,${w}`)].join(';')
    url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:ital,wght@${pairs}&display=swap`
  }

  return url
}

/**
 * Load a Google Font by injecting a <link> in the <head>
 */
export function loadGoogleFont(family: string, style: string = 'normal', weight: string = '400'): void {
  if (injectedFamilies.has(family)) return

  // Build variants from style and weight
  const variants: string[] = []

  if (style === 'italic') {
    variants.push(weight.endsWith('italic') ? weight : `${weight}italic`)
  } else {
    variants.push(weight === 'regular' ? 'regular' : weight)
  }

  const url = generateFontUrl(family, variants)
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = url
  document.head.appendChild(link)
  injectedFamilies.add(family)
}

/**
 * Load fonts from button variants
 */
export function loadFontsFromButtonVariants(
  variants: Array<{ fontFamily?: string | null; fontStyle?: string; fontWeight?: string }>
): void {
  for (const variant of variants) {
    if (variant.fontFamily) {
      loadGoogleFont(variant.fontFamily, variant.fontStyle || 'normal', variant.fontWeight || '400')
    }
  }
}

/**
 * Load fonts from typography global config
 */
export function loadFontsFromTypography(typography: {
  globalConfig?: { fontFamily?: string }
  variants?: Array<{ fontFamily?: string | null; fontStyle?: string; fontWeight?: string }>
}): void {
  // Load global font
  if (typography.globalConfig?.fontFamily) {
    loadGoogleFont(typography.globalConfig.fontFamily)
  }

  // Load variant fonts
  if (typography.variants) {
    for (const variant of typography.variants) {
      if (variant.fontFamily) {
        loadGoogleFont(variant.fontFamily, variant.fontStyle || 'normal', variant.fontWeight || '400')
      }
    }
  }
}

/**
 * Load fonts from forms global config
 */
export function loadFontsFromForms(forms: {
  globalConfig?: { fontFamily?: string | null; optionFontFamily?: string | null }
}): void {
  // Load main form font
  if (forms.globalConfig?.fontFamily) {
    loadGoogleFont(forms.globalConfig.fontFamily)
  }

  // Load option font (for checkboxes, radios)
  if (forms.globalConfig?.optionFontFamily) {
    loadGoogleFont(forms.globalConfig.optionFontFamily)
  }
}

/**
 * Load fonts from avatar variants
 */
export function loadFontsFromAvatarVariants(
  variants: Array<{ fontFamily?: string | null; fontStyle?: string; fontWeight?: string }>
): void {
  for (const variant of variants) {
    if (variant.fontFamily) {
      loadGoogleFont(variant.fontFamily, variant.fontStyle || 'normal', variant.fontWeight || '400')
    }
  }
}
