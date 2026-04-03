import { defineComponent, h, ref } from 'vue'

export const Tooltip = defineComponent({
  name: 'CuiTooltip',

  props: {
    variant: {
      type: String,
      required: true
    },
    text: {
      type: String,
      default: ''
    }
  },

  setup(props, { slots }) {
    const visible = ref(false)

    const show = () => {
      visible.value = true
    }
    const hide = () => {
      visible.value = false
    }

    return () => {
      const trigger = slots.default ? slots.default() : []

      const tooltipContent = slots.content
        ? slots.content()
        : props.text

      const tooltipEl = h(
        'span',
        {
          class: [`cui-tooltip`, `--${props.variant}`],
          style: visible.value ? 'visibility: visible; opacity: 1;' : ''
        },
        tooltipContent
      )

      return h(
        'span',
        {
          class: 'cui-tooltip-wrapper',
          onMouseenter: show,
          onMouseleave: hide,
          onFocusin: show,
          onFocusout: hide
        },
        [...trigger, tooltipEl]
      )
    }
  }
})
