/**
 * Spinner - Vue 3 component that renders spinner based on theme configuration
 *
 * Props:
 *   - variant: string (required) - Variant name (e.g., 'v1', 'primary')
 *   - class: string (optional) - Additional CSS classes
 *
 * Usage:
 * ```vue
 * <Spinner variant="v1" />
 * <Spinner variant="primary" class="my-custom-class" />
 * ```
 */
import { defineComponent, h, computed } from 'vue'
import { useComboUI } from '../composables/useComboUI'
import type { SpinnerType } from '../types'

export const Spinner = defineComponent({
  name: 'CuiSpinner',

  props: {
    variant: {
      type: String,
      required: true
    },
    class: {
      type: String,
      default: ''
    }
  },

  setup(props, { slots }) {
    const { theme } = useComboUI()

    const spinnerConfig = computed(() => {
      if (!theme.value?.spinners?.variants) return null

      const variant = theme.value.spinners.variants.find(
        v => v.name.toLowerCase() === props.variant.toLowerCase()
      )

      return variant || null
    })

    const spinnerType = computed<SpinnerType>(() => {
      return spinnerConfig.value?.type || 'ring'
    })

    const renderSpinner = () => {
      const type = spinnerType.value

      switch (type) {
        case 'ring':
          return h('svg', {
            class: 'cui-spinner-ring',
            viewBox: '0 0 24 24',
            fill: 'none'
          }, [
            h('circle', {
              class: 'cui-spinner-ring-track',
              cx: '12',
              cy: '12',
              r: '10',
              'stroke-width': '2.5'
            }),
            h('circle', {
              class: 'cui-spinner-ring-arc',
              cx: '12',
              cy: '12',
              r: '10',
              'stroke-width': '2.5',
              'stroke-dasharray': '43.98',
              'stroke-dashoffset': '32.99',
              'stroke-linecap': 'round'
            })
          ])

        case 'pulse':
          return h('svg', {
            class: 'cui-spinner-pulse',
            viewBox: '0 0 24 24'
          }, [
            h('circle', {
              class: 'cui-spinner-pulse-bg',
              cx: '12',
              cy: '12',
              r: '10'
            }),
            h('circle', {
              class: 'cui-spinner-pulse-fg',
              cx: '12',
              cy: '12',
              r: '10'
            })
          ])

        case 'dots':
          return h('div', { class: 'cui-spinner-dots' }, [
            h('div', { class: 'cui-spinner-dot' }),
            h('div', { class: 'cui-spinner-dot' }),
            h('div', { class: 'cui-spinner-dot' })
          ])

        case 'bars':
          return h('div', { class: 'cui-spinner-bars' }, [
            h('div', { class: 'cui-spinner-bar' }),
            h('div', { class: 'cui-spinner-bar' }),
            h('div', { class: 'cui-spinner-bar' }),
            h('div', { class: 'cui-spinner-bar' }),
            h('div', { class: 'cui-spinner-bar' })
          ])

        case 'dual':
          return h('svg', {
            class: 'cui-spinner-dual',
            viewBox: '0 0 24 24',
            fill: 'none'
          }, [
            h('g', { class: 'cui-spinner-dual-outer' }, [
              h('circle', {
                cx: '12',
                cy: '12',
                r: '10',
                'stroke-width': '2.5',
                'stroke-dasharray': '40.84 62.83',
                'stroke-dashoffset': '10.99'
              })
            ]),
            h('g', { class: 'cui-spinner-dual-inner' }, [
              h('circle', {
                cx: '12',
                cy: '12',
                r: '5.5',
                'stroke-width': '2.5',
                'stroke-dasharray': '22.46 34.56',
                'stroke-dashoffset': '6.05'
              })
            ])
          ])

        default:
          return null
      }
    }

    return () => {
      const variantClass = `--${props.variant.toLowerCase()}`
      const classes = ['cui-spinner', variantClass]
      
      if (props.class) {
        classes.push(props.class)
      }

      if (slots.default) {
        return h('div', { class: classes.join(' ') }, slots.default())
      }

      return h('div', { class: classes.join(' ') }, renderSpinner())
    }
  }
})
