/**
 * Google Fonts loader for vanilla library
 */

const injectedFamilies = new Map<string, { element: HTMLLinkElement; weights: Set<string> }>()

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
  const variant = style === 'italic'
    ? (weight.endsWith('italic') ? weight : `${weight}italic`)
    : (weight === 'regular' ? 'regular' : weight)

  const existing = injectedFamilies.get(family)
  if (existing) {
    if (existing.weights.has(variant)) return
    existing.weights.add(variant)
    existing.element.href = generateFontUrl(family, [...existing.weights])
    return
  }

  const url = generateFontUrl(family, [variant])
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = url
  document.head.appendChild(link)
  injectedFamilies.set(family, { element: link, weights: new Set([variant]) })
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
  const globalFamily = typography.globalConfig?.fontFamily

  if (globalFamily) {
    loadGoogleFont(globalFamily)
  }

  if (typography.variants) {
    for (const variant of typography.variants) {
      const family = variant.fontFamily || globalFamily
      if (family) {
        loadGoogleFont(family, variant.fontStyle || 'normal', variant.fontWeight || '400')
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
  if (forms.globalConfig?.fontFamily) {
    loadGoogleFont(forms.globalConfig.fontFamily)
  }

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

export function loadFontsFromTableVariants(
  variants: Array<{
    fontFamily?: string | null
    fontStyle?: string
    fontWeight?: string
    headerFontFamily?: string | null
    headerFontStyle?: string
    headerFontWeight?: string
  }>
): void {
  for (const variant of variants) {
    if (variant.fontFamily) {
      loadGoogleFont(variant.fontFamily, variant.fontStyle || 'normal', variant.fontWeight || '400')
    }
    if (variant.headerFontFamily) {
      loadGoogleFont(variant.headerFontFamily, variant.headerFontStyle || 'normal', variant.headerFontWeight || '400')
    }
  }
}

export function loadFontsFromListGroupVariants(
  variants: Array<{ fontFamily?: string | null; fontStyle?: string; fontWeight?: string }>
): void {
  for (const variant of variants) {
    if (variant.fontFamily) {
      loadGoogleFont(variant.fontFamily, variant.fontStyle || 'normal', variant.fontWeight || '400')
    }
  }
}

export function loadFontsFromAccordionVariants(
  variants: Array<{ fontFamily?: string | null; fontStyle?: string; fontWeight?: string }>
): void {
  for (const variant of variants) {
    if (variant.fontFamily) {
      loadGoogleFont(variant.fontFamily, variant.fontStyle || 'normal', variant.fontWeight || '400')
    }
  }
}

export function loadFontsFromPaginationVariants(
  variants: Array<{ fontFamily?: string | null; fontStyle?: string; fontWeight?: string }>
): void {
  for (const variant of variants) {
    if (variant.fontFamily) {
      loadGoogleFont(variant.fontFamily, variant.fontStyle || 'normal', variant.fontWeight || '400')
    }
  }
}
