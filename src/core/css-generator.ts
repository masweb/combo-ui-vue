/**
 * CSS Injector - Manages style element injection
 */

const STYLE_ID = 'cux-styles'

export class CSSInjector {
  private styleElement: HTMLStyleElement | null = null

  /**
   * Get or create the style element in the document head
   */
  private getStyleElement(): HTMLStyleElement {
    if (this.styleElement) return this.styleElement

    let element = document.getElementById(STYLE_ID) as HTMLStyleElement | null

    if (!element) {
      element = document.createElement('style')
      element.id = STYLE_ID
      document.head.appendChild(element)
    }

    this.styleElement = element
    return element
  }

  /**
   * Inject CSS into the document
   */
  inject(css: string): void {
    this.getStyleElement().textContent = css
  }

  /**
   * Remove injected styles from the document
   */
  destroy(): void {
    if (this.styleElement?.parentNode) {
      this.styleElement.parentNode.removeChild(this.styleElement)
    }
    this.styleElement = null
  }
}
