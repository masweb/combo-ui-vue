import { defineComponent, h, ref, onMounted, onBeforeUnmount, Teleport, nextTick } from 'vue'

export const Popover = defineComponent({
  name: 'CuiPopover',

  props: {
    variant: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: ''
    }
  },

  setup(props, { slots }) {
    const visible = ref(false)
    const wrapperRef = ref<HTMLElement | null>(null)
    const popoverRef = ref<HTMLElement | null>(null)

    const updatePosition = () => {
      if (!wrapperRef.value || !popoverRef.value) return

      const triggerRect = wrapperRef.value.getBoundingClientRect()
      const popover = popoverRef.value
      const popoverRect = popover.getBoundingClientRect()

      const placement = getPlacementFromCSS(popover)

      let top = 0
      let left = 0
      const offset = 10

      switch (placement) {
        case 'top':
          top = triggerRect.top - popoverRect.height - offset
          left = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2
          break
        case 'bottom':
          top = triggerRect.bottom + offset
          left = triggerRect.left + triggerRect.width / 2 - popoverRect.width / 2
          break
        case 'left':
          top = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2
          left = triggerRect.left - popoverRect.width - offset
          break
        case 'right':
          top = triggerRect.top + triggerRect.height / 2 - popoverRect.height / 2
          left = triggerRect.right + offset
          break
      }

      popover.style.top = `${top + window.scrollY}px`
      popover.style.left = `${left + window.scrollX}px`
    }

    const getPlacementFromCSS = (_el: HTMLElement): string => {
      return 'bottom'
    }

    const toggle = () => {
      visible.value = !visible.value
      if (visible.value) {
        void nextTick(() => updatePosition())
      }
    }

    const onClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        wrapperRef.value &&
        !wrapperRef.value.contains(target) &&
        popoverRef.value &&
        !popoverRef.value.contains(target)
      ) {
        visible.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', onClickOutside, true)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('click', onClickOutside, true)
    })

    return () => {
      const trigger = slots.default ? slots.default() : []

      const headerContent = slots.header
        ? slots.header()
        : props.title
          ? h('div', { class: 'cui-popover-header' }, props.title)
          : null

      const bodyContent = slots.body
        ? slots.body()
        : slots.default
          ? null
          : h('div', { class: 'cui-popover-body' }, 'Popover content')

      const popoverChildren: any[] = []
      if (headerContent) popoverChildren.push(headerContent)
      if (bodyContent) popoverChildren.push(bodyContent)

      const popoverEl = h(Teleport, { to: 'body' }, [
        h(
          'div',
          {
            ref: popoverRef,
            class: ['cui-popover', `--${props.variant}`, { 'is-visible': visible.value }],
            style: {
              position: 'absolute',
              zIndex: 1060,
              visibility: visible.value ? 'visible' : 'hidden',
              opacity: visible.value ? 1 : 0,
              pointerEvents: visible.value ? 'auto' : 'none',
              transition: 'opacity 0.15s ease'
            }
          },
          popoverChildren
        )
      ])

      return h(
        'span',
        {
          ref: wrapperRef,
          class: 'cui-popover-wrapper',
          onClick: (e: Event) => {
            e.stopPropagation()
            toggle()
          }
        },
        [...trigger, popoverEl]
      )
    }
  }
})
