/**
 * Theme Sync - WebSocket client for real-time theme updates
 */

import type { ThemeData, ThemeSyncOptions } from '../types'

interface ThemeMessage {
  type: 'theme-update'
  payload: ThemeData
  timestamp: number
}

type ConnectionCallback = () => void
type DisconnectionCallback = () => void
type ErrorCallback = (error: Error) => void
type ThemeUpdateCallback = (theme: ThemeData) => void

export class ThemeSync {
  private url: string
  private ws: WebSocket | null = null
  private reconnect: boolean
  private reconnectInterval: number
  private maxReconnectAttempts: number
  private reconnectAttempts = 0
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null
  private isIntentionallyClosed = false

  // Callbacks
  private connectCallbacks: Set<ConnectionCallback> = new Set()
  private disconnectCallbacks: Set<DisconnectionCallback> = new Set()
  private errorCallbacks: Set<ErrorCallback> = new Set()
  private themeUpdateCallbacks: Set<ThemeUpdateCallback> = new Set()

  // Reference to ComboUX for applying theme updates
  private applyTheme: (theme: ThemeData) => void

  constructor(
    applyTheme: (theme: ThemeData) => void,
    options: ThemeSyncOptions
  ) {
    this.applyTheme = applyTheme
    this.url = options.url
    this.reconnect = options.reconnect ?? true
    this.reconnectInterval = options.reconnectInterval ?? 3000
    this.maxReconnectAttempts = options.maxReconnectAttempts ?? 10

    // Register initial callbacks
    if (options.onConnect) this.connectCallbacks.add(options.onConnect)
    if (options.onDisconnect) this.disconnectCallbacks.add(options.onDisconnect)
    if (options.onError) this.errorCallbacks.add(options.onError)
    if (options.onThemeUpdate) this.themeUpdateCallbacks.add(options.onThemeUpdate)
  }

  /**
   * Connect to WebSocket server
   */
  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN || this.ws?.readyState === WebSocket.CONNECTING) {
      return
    }

    this.isIntentionallyClosed = false

    try {
      this.ws = new WebSocket(this.url)
      this.setupEventListeners()
    } catch (error) {
      this.notifyErrorCallbacks(error as Error)
    }
  }

  /**
   * Set up WebSocket event listeners
   */
  private setupEventListeners(): void {
    if (!this.ws) return

    this.ws.onopen = () => {
      this.reconnectAttempts = 0
      this.notifyConnectCallbacks()
    }

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const message: ThemeMessage = JSON.parse(event.data)

        if (message.type === 'theme-update' && message.payload) {
          console.log('[ThemeSync] Received theme with keys:', Object.keys(message.payload))
          // Apply theme via ComboUX
          this.applyTheme(message.payload)
          // Notify callbacks
          this.notifyThemeUpdateCallbacks(message.payload)
        }
      } catch (error) {
        console.error('[ThemeSync] Error parsing message:', error)
      }
    }

    this.ws.onclose = () => {
      this.notifyDisconnectCallbacks()

      // Attempt reconnection if not intentionally closed
      if (!this.isIntentionallyClosed && this.reconnect) {
        this.scheduleReconnect()
      }
    }

    this.ws.onerror = (event: Event) => {
      const error = new Error('WebSocket connection error')
      this.notifyErrorCallbacks(error)
    }
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn(`[ThemeSync] Max reconnection attempts (${this.maxReconnectAttempts}) reached`)
      return
    }

    this.reconnectAttempts++

    this.reconnectTimeout = setTimeout(() => {
      this.connect()
    }, this.reconnectInterval)
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    this.isIntentionallyClosed = true
    this.clearReconnectTimeout()

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  /**
   * Check if connected
   */
  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  /**
   * Clear reconnection timeout
   */
  private clearReconnectTimeout(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }
  }

  // ==================== Callback Registration ====================

  onConnect(callback: ConnectionCallback): () => void {
    this.connectCallbacks.add(callback)
    return () => this.connectCallbacks.delete(callback)
  }

  onDisconnect(callback: DisconnectionCallback): () => void {
    this.disconnectCallbacks.add(callback)
    return () => this.disconnectCallbacks.delete(callback)
  }

  onError(callback: ErrorCallback): () => void {
    this.errorCallbacks.add(callback)
    return () => this.errorCallbacks.delete(callback)
  }

  onThemeUpdate(callback: ThemeUpdateCallback): () => void {
    this.themeUpdateCallbacks.add(callback)
    return () => this.themeUpdateCallbacks.delete(callback)
  }

  // ==================== Callback Notification ====================

  private notifyConnectCallbacks(): void {
    this.connectCallbacks.forEach(cb => cb())
  }

  private notifyDisconnectCallbacks(): void {
    this.disconnectCallbacks.forEach(cb => cb())
  }

  private notifyErrorCallbacks(error: Error): void {
    this.errorCallbacks.forEach(cb => cb(error))
  }

  private notifyThemeUpdateCallbacks(theme: ThemeData): void {
    this.themeUpdateCallbacks.forEach(cb => cb(theme))
  }

  // ==================== Lifecycle ====================

  /**
   * Destroy instance and clean up
   */
  destroy(): void {
    this.disconnect()
    this.connectCallbacks.clear()
    this.disconnectCallbacks.clear()
    this.errorCallbacks.clear()
    this.themeUpdateCallbacks.clear()
  }
}
