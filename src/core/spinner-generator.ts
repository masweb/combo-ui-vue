/**
 * Spinner CSS Generator
 * Generates CSS for spinner variants with custom properties and animations
 */

import type { SpinnerVariant } from '../types'
import { toKebabCase } from './utils'

const COMPONENT = 'spinner'

/**
 * Generate complete CSS for spinner component
 */
export function generateSpinnerCSS(variants: SpinnerVariant[]): string {
  const css: string[] = []

  // Base styles and animations (only once)
  css.push(generateSpinnerBase())
  css.push(generateSpinnerAnimations())

  // Generate variant styles
  variants.forEach(variant => {
    const variantName = toKebabCase(variant.name)
    css.push(generateSpinnerVariant(variant, variantName))

    if (variant.dark) {
      css.push(generateSpinnerVariantDark(variant, variantName))
    }
  })

  return css.join('\n\n')
}

/**
 * Generate base spinner styles (shared across all types)
 */
function generateSpinnerBase(): string {
  return `/* Spinner Base Styles */
.cux-${COMPONENT} {
  --cux-${COMPONENT}-color: #0d6efd;
  --cux-${COMPONENT}-track: #95b6d8;
  --cux-${COMPONENT}-size: 40px;
  --cux-${COMPONENT}-speed: 1s;
  --cux-${COMPONENT}-delay2: 0.2s;
  --cux-${COMPONENT}-delay3: 0.4s;
  --cux-${COMPONENT}-delay4: 0.6s;
  --cux-${COMPONENT}-delay5: 0.8s;

  display: inline-flex;
  align-items: center;
  justify-content: center;
}`
}

/**
 * Generate all spinner animations
 */
function generateSpinnerAnimations(): string {
  return `/* Spinner Animations */
@keyframes cux-${COMPONENT}-ring-spin {
  to { transform: rotate(360deg); }
}

@keyframes cux-${COMPONENT}-pulse-scale {
  0%, 100% {
    transform: scale(0.5);
    opacity: 0.3;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes cux-${COMPONENT}-dots-bounce {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.3;
  }
  50% {
    transform: translateY(calc(var(--cux-${COMPONENT}-size) * -0.25));
    opacity: 1;
  }
}

@keyframes cux-${COMPONENT}-bars-stretch {
  0%, 100% {
    transform: scaleY(0.3);
    opacity: 0.3;
  }
  50% {
    transform: scaleY(1);
    opacity: 1;
  }
}

@keyframes cux-${COMPONENT}-dual-spin {
  to { transform: rotate(360deg); }
}

/* Ring Spinner */
.cux-${COMPONENT}-ring {
  width: var(--cux-${COMPONENT}-size);
  height: var(--cux-${COMPONENT}-size);
}

.cux-${COMPONENT}-ring-track {
  stroke: var(--cux-${COMPONENT}-track);
  fill: none;
}

.cux-${COMPONENT}-ring-arc {
  stroke: var(--cux-${COMPONENT}-color);
  fill: none;
  stroke-linecap: round;
  animation: cux-${COMPONENT}-ring-spin var(--cux-${COMPONENT}-speed) linear infinite;
  transform-origin: center;
  transform-box: fill-box;
}

/* Pulse Spinner */
.cux-${COMPONENT}-pulse {
  width: var(--cux-${COMPONENT}-size);
  height: var(--cux-${COMPONENT}-size);
}

.cux-${COMPONENT}-pulse-bg {
  fill: var(--cux-${COMPONENT}-track);
  opacity: 0.3;
  animation: cux-${COMPONENT}-pulse-scale var(--cux-${COMPONENT}-speed) ease-in-out infinite;
  transform-origin: center;
  transform-box: fill-box;
}

.cux-${COMPONENT}-pulse-fg {
  fill: var(--cux-${COMPONENT}-color);
  animation: cux-${COMPONENT}-pulse-scale var(--cux-${COMPONENT}-speed) ease-in-out infinite reverse;
  transform-origin: center;
  transform-box: fill-box;
}

/* Dots Spinner */
.cux-${COMPONENT}-dots {
  display: flex;
  gap: calc(var(--cux-${COMPONENT}-size) * 0.15);
  align-items: center;
}

.cux-${COMPONENT}-dot {
  width: calc(var(--cux-${COMPONENT}-size) * 0.2);
  height: calc(var(--cux-${COMPONENT}-size) * 0.2);
  background: var(--cux-${COMPONENT}-color);
  border-radius: 50%;
  animation: cux-${COMPONENT}-dots-bounce var(--cux-${COMPONENT}-speed) ease-in-out infinite;
}

.cux-${COMPONENT}-dot:nth-child(1) { animation-delay: 0s; }
.cux-${COMPONENT}-dot:nth-child(2) { animation-delay: var(--cux-${COMPONENT}-delay2); }
.cux-${COMPONENT}-dot:nth-child(3) { animation-delay: var(--cux-${COMPONENT}-delay3); }

/* Bars Spinner */
.cux-${COMPONENT}-bars {
  display: flex;
  gap: calc(var(--cux-${COMPONENT}-size) * 0.1);
  align-items: center;
}

.cux-${COMPONENT}-bar {
  width: calc(var(--cux-${COMPONENT}-size) * 0.15);
  height: calc(var(--cux-${COMPONENT}-size) * 0.4);
  background: var(--cux-${COMPONENT}-color);
  border-radius: 2px;
  animation: cux-${COMPONENT}-bars-stretch var(--cux-${COMPONENT}-speed) ease-in-out infinite;
}

.cux-${COMPONENT}-bar:nth-child(1) { animation-delay: 0s; }
.cux-${COMPONENT}-bar:nth-child(2) { animation-delay: var(--cux-${COMPONENT}-delay2); }
.cux-${COMPONENT}-bar:nth-child(3) { animation-delay: var(--cux-${COMPONENT}-delay3); }
.cux-${COMPONENT}-bar:nth-child(4) { animation-delay: var(--cux-${COMPONENT}-delay4); }
.cux-${COMPONENT}-bar:nth-child(5) { animation-delay: var(--cux-${COMPONENT}-delay5); }

/* Dual Spinner */
.cux-${COMPONENT}-dual {
  width: var(--cux-${COMPONENT}-size);
  height: var(--cux-${COMPONENT}-size);
}

.cux-${COMPONENT}-dual-outer,
.cux-${COMPONENT}-dual-inner {
  animation: cux-${COMPONENT}-dual-spin var(--cux-${COMPONENT}-speed) linear infinite;
  transform-origin: center;
  transform-box: fill-box;
}

.cux-${COMPONENT}-dual-outer circle {
  stroke: var(--cux-${COMPONENT}-color);
  fill: none;
  stroke-linecap: round;
}

.cux-${COMPONENT}-dual-inner circle {
  stroke: var(--cux-${COMPONENT}-track);
  fill: none;
  stroke-linecap: round;
}

.cux-${COMPONENT}-dual-inner {
  animation-direction: reverse;
  opacity: 0.6;
}`
}

/**
 * Generate CSS for a specific spinner variant
 */
function generateSpinnerVariant(variant: SpinnerVariant, variantName: string): string {
  const size = variant.size ? `${variant.size.value}${variant.size.unit}` : '40px'
  const speed = `${variant.speed}s`
  const delay2 = `${Math.round(variant.speed * 0.2 * 100) / 100}s`
  const delay3 = `${Math.round(variant.speed * 0.4 * 100) / 100}s`
  const delay4 = `${Math.round(variant.speed * 0.6 * 100) / 100}s`
  const delay5 = `${Math.round(variant.speed * 0.8 * 100) / 100}s`

  const lines: string[] = []
  lines.push(`/* Variant: ${variant.name} */`)
  lines.push(`.cux-${COMPONENT}.--${variantName} {`)
  lines.push(`  --cux-${COMPONENT}-color: ${variant.color};`)
  lines.push(`  --cux-${COMPONENT}-track: ${variant.trackColor};`)
  lines.push(`  --cux-${COMPONENT}-size: ${size};`)
  lines.push(`  --cux-${COMPONENT}-speed: ${speed};`)
  lines.push(`  --cux-${COMPONENT}-delay2: ${delay2};`)
  lines.push(`  --cux-${COMPONENT}-delay3: ${delay3};`)
  lines.push(`  --cux-${COMPONENT}-delay4: ${delay4};`)
  lines.push(`  --cux-${COMPONENT}-delay5: ${delay5};`)
  lines.push('}')

  return lines.join('\n')
}

/**
 * Generate dark mode CSS for a spinner variant
 */
function generateSpinnerVariantDark(variant: SpinnerVariant, variantName: string): string {
  const dark = variant.dark
  if (!dark) return ''

  const lines: string[] = []
  lines.push(`/* Dark Mode Variant: ${variant.name} */`)
  lines.push(`.dark .cux-${COMPONENT}.--${variantName} {`)

  if (dark.color) lines.push(`  --cux-${COMPONENT}-color: ${dark.color};`)
  if (dark.trackColor) lines.push(`  --cux-${COMPONENT}-track: ${dark.trackColor};`)

  lines.push('}')

  return lines.join('\n')
}

/**
 * Generate HTML for a spinner variant
 * This helper can be used to generate the correct HTML structure for each spinner type
 */
export function generateSpinnerHTML(type: SpinnerVariant['type']): string {
  switch (type) {
    case 'ring':
      return `<svg class="cux-spinner-ring" viewBox="0 0 24 24" fill="none">
  <circle class="cux-spinner-ring-track" cx="12" cy="12" r="10" stroke-width="2.5" />
  <circle class="cux-spinner-ring-arc" cx="12" cy="12" r="10" stroke-width="2.5" stroke-dasharray="43.98" stroke-dashoffset="32.99" />
</svg>`

    case 'pulse':
      return `<svg class="cux-spinner-pulse" viewBox="0 0 24 24">
  <circle class="cux-spinner-pulse-bg" cx="12" cy="12" r="10" />
  <circle class="cux-spinner-pulse-fg" cx="12" cy="12" r="10" />
</svg>`

    case 'dots':
      return `<div class="cux-spinner-dots">
  <div class="cux-spinner-dot"></div>
  <div class="cux-spinner-dot"></div>
  <div class="cux-spinner-dot"></div>
</div>`

    case 'bars':
      return `<div class="cux-spinner-bars">
  <div class="cux-spinner-bar"></div>
  <div class="cux-spinner-bar"></div>
  <div class="cux-spinner-bar"></div>
  <div class="cux-spinner-bar"></div>
  <div class="cux-spinner-bar"></div>
</div>`

    case 'dual':
      return `<svg class="cux-spinner-dual" viewBox="0 0 24 24" fill="none">
  <g class="cux-spinner-dual-outer">
    <circle cx="12" cy="12" r="10" stroke-width="2.5" stroke-dasharray="40.84 62.83" stroke-dashoffset="10.99" />
  </g>
  <g class="cux-spinner-dual-inner">
    <circle cx="12" cy="12" r="5.5" stroke-width="2.5" stroke-dasharray="22.46 34.56" stroke-dashoffset="6.05" />
  </g>
</svg>`

    default:
      return ''
  }
}
