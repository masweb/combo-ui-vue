/**
 * Theme loader - loads theme from URL or object
 */

import type { ThemeData, ThemeLoadCallback } from '../types'

export class ThemeLoader {
  private callbacks: Set<ThemeLoadCallback> = new Set()

  /**
   * Load theme from URL or object
   */
  async load(theme: ThemeData | string): Promise<ThemeData> {
    let themeData: ThemeData

    if (typeof theme === 'string') {
      themeData = await this.loadFromURL(theme)
    } else {
      themeData = theme
    }

    this.notifyCallbacks(themeData)
    return themeData
  }

  /**
   * Load theme from URL
   */
  private async loadFromURL(url: string): Promise<ThemeData> {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to load theme: ${response.status} ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error loading theme:', error)
      throw error
    }
  }

  /**
   * Load theme from File object (for file picker)
   */
  async loadFromFile(file: File): Promise<ThemeData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = e => {
        try {
          const content = e.target?.result as string
          const themeData = JSON.parse(content) as ThemeData
          this.notifyCallbacks(themeData)
          resolve(themeData)
        } catch {
          reject(new Error('Invalid JSON file'))
        }
      }

      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }

      reader.readAsText(file)
    })
  }

  /**
   * Open file picker and load theme
   */
  async openFilePicker(): Promise<ThemeData | null> {
    return new Promise(resolve => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'

      input.onchange = async e => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          try {
            const theme = await this.loadFromFile(file)
            resolve(theme)
          } catch (error) {
            console.error('Error loading theme from file:', error)
            resolve(null)
          }
        } else {
          resolve(null)
        }
      }

      input.click()
    })
  }

  /**
   * Register a callback for theme load events
   */
  onLoad(callback: ThemeLoadCallback): () => void {
    this.callbacks.add(callback)
    return () => this.callbacks.delete(callback)
  }

  /**
   * Notify all registered callbacks
   */
  private notifyCallbacks(theme: ThemeData): void {
    this.callbacks.forEach(callback => callback(theme))
  }

  /**
   * Clean up
   */
  destroy(): void {
    this.callbacks.clear()
  }
}
