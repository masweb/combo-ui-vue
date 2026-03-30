/**
 * ThemeToggler - Vue 3 component to toggle dark/light mode
 *
 * Slots:
 *   - default: replaces everything, receives { isDark, toggleDarkMode }
 *   - light: icon/content shown when in light mode (inside button)
 *   - dark: icon/content shown when in dark mode (inside button)
 */
import { defineComponent, h, onMounted } from 'vue'
import { useComboUI } from '../composables/useComboUI'

// Tabler Icons: sun (light mode icon, shown when dark to switch to light)
const SUN_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"/>
  <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"/>
</svg>`

// Tabler Icons: moon (dark mode icon, shown when light to switch to dark)
const MOON_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"/>
</svg>`

const STYLE_ID = 'cui-theme-toggler-styles'

function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return

  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
    .cui-theme-toggler {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      background: white;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.15s, border-color 0.15s;
    }

    .cui-theme-toggler:hover {
      background: #f3f4f6;
      border-color: #d1d5db;
    }

    .cui-theme-toggler svg {
      width: 20px;
      height: 20px;
      stroke: #374151;
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    body[color-scheme="dark"] .cui-theme-toggler {
      background: #1f2937;
      border-color: #374151;
    }

    body[color-scheme="dark"] .cui-theme-toggler:hover {
      background: #374151;
      border-color: #4b5563;
    }

    body[color-scheme="dark"] .cui-theme-toggler svg {
      stroke: #e5e7eb;
    }
  `
  document.head.appendChild(style)
}

export const ThemeToggler = defineComponent({
  name: 'CuiThemeToggler',

  props: {
    iconLight: {
      type: String,
      default: SUN_ICON
    },
    iconDark: {
      type: String,
      default: MOON_ICON
    }
  },

  setup(props, { slots }) {
    const { isDark, toggleDarkMode } = useComboUI()

    onMounted(() => {
      injectStyles()
    })

    return () => {
      const dark = isDark.value

      // Default slot: fully custom trigger
      if (slots.default) {
        return slots.default({ isDark: dark, toggleDarkMode })
      }

      // Build button content
      const content = dark
        ? slots.light
          ? slots.light()
          : h('span', { innerHTML: props.iconLight })
        : slots.dark
          ? slots.dark()
          : h('span', { innerHTML: props.iconDark })

      return h(
        'button',
        {
          class: 'cui-theme-toggler',
          title: 'Toggle dark mode',
          'aria-label': 'Toggle dark mode',
          type: 'button',
          onClick: toggleDarkMode
        },
        [content]
      )
    }
  }
})
