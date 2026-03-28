/**
 * Types for @combo-ux/vanilla
 */

// ==================== Generic Types ====================

export interface BorderValue {
  style: string
  width: number
  unit: string
  color: string
}

export interface BorderRadiusValue {
  linked: boolean
  unit: string
  tl: number
  tr: number
  br: number
  bl: number
}

export interface PaddingValue {
  linkedV: boolean
  linkedH: boolean
  unit: string
  top: number
  right: number
  bottom: number
  left: number
}

export interface UnitNumber {
  value: number
  unit: string
}

export interface ShadowValue {
  enabled: boolean
  offsetX: number
  offsetY: number
  blur: number
  spread: number
  color: string
}

export interface ComponentShadows {
  offset?: ShadowValue
  inset?: ShadowValue
  insetHighlight?: ShadowValue
}

export type Position =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center-center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

// ==================== Button Types ====================

export interface ButtonVariant {
  name: string
  background: string
  color: string
  border: BorderValue
  borderRadius: BorderRadiusValue
  padding: PaddingValue
  fontFamily?: string
  fontSize?: UnitNumber
  fontWeight?: string
  fontStyle?: string
  letterSpacing?: UnitNumber | string
  hoverBackground?: string
  hoverColor?: string
  hoverBorder?: BorderValue | string
  activeBackground?: string
  activeColor?: string
  activeBorder?: BorderValue | string
  focusColor?: string
  focusOffset?: UnitNumber | number
  showFocus?: boolean
  disabledBackground?: string
  disabledColor?: string
  disabledBorder?: BorderValue | string
  disabledOpacity?: number
  showDisabled?: boolean
  shadows?: ComponentShadows
  dark?: Partial<Omit<ButtonVariant, 'dark'>> & {
    shadowColor?: string
    shadowInsetColor?: string
    shadowInsetHighlightColor?: string
  }
}

export interface ButtonComponentData {
  variants: ButtonVariant[]
  selectedVariantIndex: number
}

// ==================== Typography Types ====================

export interface TypographyGlobalConfig {
  fontFamily?: string
  color?: string
  backgroundColor?: string
  dark?: {
    color?: string
    backgroundColor?: string
  }
}

export interface TypographyVariant {
  id: string
  name: string
  isFixed?: boolean
  fontFamily?: string | null
  fontStyle?: string
  fontWeight?: string
  fontSize?: UnitNumber
  letterSpacing?: UnitNumber
  lineHeight?: UnitNumber
  textTransform?: string
  textDecoration?: string
  color?: string | null
  dark?: {
    color?: string | null
  }
}

export interface TypographyData {
  globalConfig?: TypographyGlobalConfig
  variants?: TypographyVariant[]
  selectedVariantIndex?: number
}

// ==================== Forms Types ====================

export interface FormsGlobalConfig {
  fontFamily?: string
  color?: string
  background?: string
  border?: BorderValue
  borderRadius?: BorderRadiusValue
  padding?: PaddingValue
  fontSize?: UnitNumber
  fieldHeight?: number
  showLabel?: boolean
  labelColor?: string
  labelFontSize?: UnitNumber
  labelFontWeight?: string
  labelMarginBottom?: number
  showPlaceholder?: boolean
  placeholderColor?: string
  focusOutlineColor?: string
  focusOutlineWidth?: number
  errorBorderColor?: string
  errorColor?: string
  errorFontSize?: UnitNumber
  errorMarginTop?: number
  disabledOpacity?: number
  disabledColor?: string
  disabledBackground?: string
  disabledBorderColor?: string
  checkRadioColor?: string
  checkRadioSize?: number
  optionColor?: string
  optionFontFamily?: string | null
  optionFontSize?: UnitNumber
  optionFontWeight?: string
  optionSpacingHorizontal?: UnitNumber
  optionSpacingVertical?: UnitNumber
  optionOrientation?: 'horizontal' | 'vertical'
  dropzoneBackground?: string
  dropzoneColor?: string
  dropzoneBorder?: BorderValue
  dropzoneBorderRadius?: BorderRadiusValue
  dark?: {
    color?: string
    background?: string
    borderColor?: string
    labelColor?: string
    placeholderColor?: string
    focusOutlineColor?: string
    errorBorderColor?: string
    errorColor?: string
    disabledColor?: string
    disabledBackground?: string
    disabledBorderColor?: string
    checkRadioColor?: string
    checkRadioSize?: number
    optionColor?: string
    optionSpacingHorizontal?: UnitNumber
    optionSpacingVertical?: UnitNumber
    dropzoneBackground?: string
    dropzoneColor?: string
    dropzoneBorderColor?: string
  }
}

export interface FormsVariant {
  id: string
  name: string
  type: 'input' | 'select' | 'radio' | 'checkbox' | 'slider' | 'textarea' | 'file'
  isFixed?: boolean
}

export interface FormsData {
  globalConfig?: FormsGlobalConfig
  variants?: FormsVariant[]
  selectedVariantIndex?: number
  currentState?: string
}

// ==================== Card Types ====================

export interface CardVariant {
  name: string
  background: string
  color: string
  border: BorderValue
  borderRadius: BorderRadiusValue
  padding: PaddingValue
  fontFamily?: string | null
  fontSize?: UnitNumber
  fontStyle?: string
  fontWeight?: string
  letterSpacing?: UnitNumber
  textAlign?: string
  headerBackground: string
  headerColor: string
  headerPadding: PaddingValue
  headerBorderBottom: BorderValue
  headerFontFamily?: string | null
  headerFontStyle?: string
  headerFontWeight?: string
  headerFontSize?: UnitNumber
  headerLetterSpacing?: UnitNumber
  headerTextAlign?: string
  shadows?: ComponentShadows
  dark?: Partial<Omit<CardVariant, 'dark'>> & {
    borderColor?: string
    headerBorderBottomColor?: string
    shadowColor?: string
    shadowInsetColor?: string
    shadowInsetHighlightColor?: string
  }
}

export interface CardComponentData {
  variants: CardVariant[]
  selectedVariantIndex: number
}

// ==================== Alert Types ====================

export interface AlertVariant {
  name: string
  background: string
  color: string
  border: BorderValue
  borderRadius: BorderRadiusValue
  padding: PaddingValue
  fontFamily?: string | null
  fontSize: UnitNumber
  fontStyle: string
  fontWeight: string
  letterSpacing?: UnitNumber
  textAlign: string
  headerBackground: string
  headerColor: string
  headerPadding: PaddingValue
  headerBorderBottom: BorderValue
  headerFontFamily?: string | null
  headerFontStyle: string
  headerFontWeight: string
  headerFontSize: UnitNumber
  headerLetterSpacing: UnitNumber
  headerTextAlign: string
  showClose: boolean
  autoDismiss: number
  closeSize: UnitNumber
  closeColor: string
  closeHoverColor: string
  closeActiveColor: string
  maxWidth: UnitNumber
  offset: UnitNumber
  position: Position
  shadows?: ComponentShadows
  dark?: Partial<Omit<AlertVariant, 'dark'>> & {
    borderColor?: string
    headerBorderBottomColor?: string
    closeColor?: string
    closeHoverColor?: string
    closeActiveColor?: string
    shadowColor?: string
    shadowInsetColor?: string
    shadowInsetHighlightColor?: string
  }
}

export interface AlertComponentData {
  variants: AlertVariant[]
  selectedVariantIndex: number
}

// ==================== Avatar Types ====================

export interface AvatarVariant {
  name: string
  background: string
  color: string
  border: BorderValue
  borderRadius: BorderRadiusValue
  padding: PaddingValue
  fontFamily?: string | null
  fontSize: UnitNumber
  fontStyle: string
  fontWeight: string
  letterSpacing: UnitNumber
  shadows?: ComponentShadows
  dark?: Partial<Omit<AvatarVariant, 'dark'>> & {
    borderColor?: string
    shadowColor?: string
    shadowInsetColor?: string
    shadowInsetHighlightColor?: string
  }
}

export interface AvatarComponentData {
  variants: AvatarVariant[]
  selectedVariantIndex: number
}

// ==================== Badge Types ====================

export interface BadgeVariant {
  name: string
  background: string
  color: string
  border: BorderValue
  borderRadius: BorderRadiusValue
  padding: PaddingValue
  fontFamily?: string | null
  fontSize: UnitNumber
  fontStyle: string
  fontWeight: string
  letterSpacing: UnitNumber
  shadows?: ComponentShadows
  dark?: Partial<Omit<BadgeVariant, 'dark'>> & {
    borderColor?: string
    shadowColor?: string
    shadowInsetColor?: string
    shadowInsetHighlightColor?: string
  }
}

export interface BadgeComponentData {
  variants: BadgeVariant[]
  selectedVariantIndex: number
}

// ==================== Chip Types ====================

export interface ChipVariant {
  name: string
  background: string
  color: string
  border: BorderValue
  borderRadius: BorderRadiusValue
  padding: PaddingValue
  fontFamily?: string | null
  fontSize: UnitNumber
  fontStyle: string
  fontWeight: string
  letterSpacing?: UnitNumber
  closeSize: UnitNumber
  closeColor: string
  closeHoverColor: string
  closeActiveColor: string
  shadows?: ComponentShadows
  dark?: Partial<Omit<ChipVariant, 'dark'>> & {
    borderColor?: string
    closeColor?: string
    closeHoverColor?: string
    closeActiveColor?: string
    shadowColor?: string
    shadowInsetColor?: string
    shadowInsetHighlightColor?: string
  }
}

export interface ChipComponentData {
  variants: ChipVariant[]
  selectedVariantIndex: number
}

// ==================== Spinner Types ====================

export type SpinnerType = 'ring' | 'pulse' | 'dots' | 'bars' | 'dual'

export interface SpinnerVariant {
  name: string
  type: SpinnerType
  color: string
  trackColor: string
  border: BorderValue
  size: UnitNumber
  speed: number
  dark: {
    color: string
    trackColor: string
    borderColor: string
  }
}

export interface SpinnerComponentData {
  variants: SpinnerVariant[]
  selectedVariantIndex: number
}

// ==================== Progress Types ====================

export type ProgressType = 'default' | 'striped' | 'animated'

export interface ProgressVariant {
  name: string
  background: string
  border: BorderValue
  type: ProgressType
  trackColor: string
  fillColor: string
  stripeColor: string
  height: UnitNumber
  borderRadius: BorderRadiusValue
  speed: number
  showLabel: boolean
  labelColor: string
  fontFamily?: string | null
  labelFontSize: UnitNumber
  fontStyle: string
  fontWeight: string
  shadows?: ComponentShadows
  dark?: Partial<Omit<ProgressVariant, 'dark'>> & {
    borderColor?: string
    trackColor?: string
    fillColor?: string
    stripeColor?: string
    labelColor?: string
    shadowColor?: string
    shadowInsetColor?: string
    shadowInsetHighlightColor?: string
  }
}

export interface ProgressComponentData {
  variants: ProgressVariant[]
  selectedVariantIndex: number
}

// ==================== Theme Types ====================

export interface ThemeData {
  name: string
  version: string
  typography?: TypographyData
  forms?: FormsData
  buttons?: ButtonComponentData
  cards?: CardComponentData
  alerts?: AlertComponentData
  avatars?: AvatarComponentData
  badges?: BadgeComponentData
  chips?: ChipComponentData
  progress?: ProgressComponentData
  spinners?: SpinnerComponentData
  // Future components will be added here
  // etc.
}

// ==================== Library Options ====================

export type DarkModeSetting = 'auto' | 'light' | 'dark'

export interface ThemeSyncOptions {
  /** WebSocket server URL */
  url: string
  /** Auto-reconnect on disconnect (default: true) */
  reconnect?: boolean
  /** Reconnection interval in ms (default: 3000) */
  reconnectInterval?: number
  /** Max reconnection attempts (default: 10) */
  maxReconnectAttempts?: number
  /** Callback when connected */
  onConnect?: () => void
  /** Callback when disconnected */
  onDisconnect?: () => void
  /** Callback on error */
  onError?: (error: Error) => void
  /** Callback when theme is updated */
  onThemeUpdate?: (theme: ThemeData) => void
}

export interface ComboUXOptions {
  /** Theme data object or URL to JSON file */
  theme: ThemeData | string
  /** Dark mode setting: 'auto' (follows system), 'light', or 'dark' */
  darkMode?: DarkModeSetting
  /** Persist dark mode preference in localStorage */
  persistDarkMode?: boolean
  /** Key for localStorage persistence */
  darkModeStorageKey?: string
  /** WebSocket options for real-time theme sync, or URL string, or false to disable */
  ws?: string | ThemeSyncOptions | false
}

export interface ThemeButtonOptions {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  icon?: string
  onClick?: () => void
}

export interface DarkToggleOptions {
  iconLight?: string
  iconDark?: string
}

export interface ControlsOptions {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  theme?: Omit<ThemeButtonOptions, 'position'>
  darkToggle?: DarkToggleOptions
}

// ==================== Event Types ====================

export type DarkModeChangeCallback = (isDark: boolean) => void
export type ThemeLoadCallback = (theme: ThemeData) => void
