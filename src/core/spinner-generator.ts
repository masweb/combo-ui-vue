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
.cui-${COMPONENT} {
  --cui-${COMPONENT}-color: #0d6efd;
  --cui-${COMPONENT}-track: #95b6d8;
  --cui-${COMPONENT}-size: 40px;
  --cui-${COMPONENT}-speed: 1s;
  --cui-${COMPONENT}-delay2: 0.2s;
  --cui-${COMPONENT}-delay3: 0.4s;
  --cui-${COMPONENT}-delay4: 0.6s;
  --cui-${COMPONENT}-delay5: 0.8s;

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
@keyframes cui-${COMPONENT}-ring-spin {
  to { transform: rotate(360deg); }
}

@keyframes cui-${COMPONENT}-pulse-scale {
  0%, 100% {
    transform: scale(0.5);
    opacity: 0.3;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes cui-${COMPONENT}-dots-bounce {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.3;
  }
  50% {
    transform: translateY(calc(var(--cui-${COMPONENT}-size) * -0.25));
    opacity: 1;
  }
}

@keyframes cui-${COMPONENT}-bars-stretch {
  0%, 100% {
    transform: scaleY(0.3);
    opacity: 0.3;
  }
  50% {
    transform: scaleY(1);
    opacity: 1;
  }
}

@keyframes cui-${COMPONENT}-dual-spin {
  to { transform: rotate(360deg); }
}

/* Ring Spinner */
.cui-${COMPONENT}-ring {
  width: var(--cui-${COMPONENT}-size);
  height: var(--cui-${COMPONENT}-size);
}

.cui-${COMPONENT}-ring-track {
  stroke: var(--cui-${COMPONENT}-track);
  fill: none;
}

.cui-${COMPONENT}-ring-arc {
  stroke: var(--cui-${COMPONENT}-color);
  fill: none;
  stroke-linecap: round;
  animation: cui-${COMPONENT}-ring-spin var(--cui-${COMPONENT}-speed) linear infinite;
  transform-origin: center;
  transform-box: fill-box;
}

/* Pulse Spinner */
.cui-${COMPONENT}-pulse {
  width: var(--cui-${COMPONENT}-size);
  height: var(--cui-${COMPONENT}-size);
}

.cui-${COMPONENT}-pulse-bg {
  fill: var(--cui-${COMPONENT}-track);
  opacity: 0.3;
  animation: cui-${COMPONENT}-pulse-scale var(--cui-${COMPONENT}-speed) ease-in-out infinite;
  transform-origin: center;
  transform-box: fill-box;
}

.cui-${COMPONENT}-pulse-fg {
  fill: var(--cui-${COMPONENT}-color);
  animation: cui-${COMPONENT}-pulse-scale var(--cui-${COMPONENT}-speed) ease-in-out infinite reverse;
  transform-origin: center;
  transform-box: fill-box;
}

/* Dots Spinner */
.cui-${COMPONENT}-dots {
  display: flex;
  gap: calc(var(--cui-${COMPONENT}-size) * 0.15);
  align-items: center;
}

.cui-${COMPONENT}-dot {
  width: calc(var(--cui-${COMPONENT}-size) * 0.2);
  height: calc(var(--cui-${COMPONENT}-size) * 0.2);
  background: var(--cui-${COMPONENT}-color);
  border-radius: 50%;
  animation: cui-${COMPONENT}-dots-bounce var(--cui-${COMPONENT}-speed) ease-in-out infinite;
}

.cui-${COMPONENT}-dot:nth-child(1) { animation-delay: 0s; }
.cui-${COMPONENT}-dot:nth-child(2) { animation-delay: var(--cui-${COMPONENT}-delay2); }
.cui-${COMPONENT}-dot:nth-child(3) { animation-delay: var(--cui-${COMPONENT}-delay3); }

/* Bars Spinner */
.cui-${COMPONENT}-bars {
  display: flex;
  gap: calc(var(--cui-${COMPONENT}-size) * 0.1);
  align-items: center;
}

.cui-${COMPONENT}-bar {
  width: calc(var(--cui-${COMPONENT}-size) * 0.15);
  height: calc(var(--cui-${COMPONENT}-size) * 0.4);
  background: var(--cui-${COMPONENT}-color);
  border-radius: 2px;
  animation: cui-${COMPONENT}-bars-stretch var(--cui-${COMPONENT}-speed) ease-in-out infinite;
}

.cui-${COMPONENT}-bar:nth-child(1) { animation-delay: 0s; }
.cui-${COMPONENT}-bar:nth-child(2) { animation-delay: var(--cui-${COMPONENT}-delay2); }
.cui-${COMPONENT}-bar:nth-child(3) { animation-delay: var(--cui-${COMPONENT}-delay3); }
.cui-${COMPONENT}-bar:nth-child(4) { animation-delay: var(--cui-${COMPONENT}-delay4); }
.cui-${COMPONENT}-bar:nth-child(5) { animation-delay: var(--cui-${COMPONENT}-delay5); }

/* Dual Spinner */
.cui-${COMPONENT}-dual {
  width: var(--cui-${COMPONENT}-size);
  height: var(--cui-${COMPONENT}-size);
}

.cui-${COMPONENT}-dual-outer,
.cui-${COMPONENT}-dual-inner {
  animation: cui-${COMPONENT}-dual-spin var(--cui-${COMPONENT}-speed) linear infinite;
  transform-origin: center;
  transform-box: fill-box;
}

.cui-${COMPONENT}-dual-outer circle {
  stroke: var(--cui-${COMPONENT}-color);
  fill: none;
  stroke-linecap: round;
}

.cui-${COMPONENT}-dual-inner circle {
  stroke: var(--cui-${COMPONENT}-track);
  fill: none;
  stroke-linecap: round;
}

.cui-${COMPONENT}-dual-inner {
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
  lines.push(`.cui-${COMPONENT}.--${variantName} {`)
  lines.push(`  --cui-${COMPONENT}-color: ${variant.color};`)
  lines.push(`  --cui-${COMPONENT}-track: ${variant.trackColor};`)
  lines.push(`  --cui-${COMPONENT}-size: ${size};`)
  lines.push(`  --cui-${COMPONENT}-speed: ${speed};`)
  lines.push(`  --cui-${COMPONENT}-delay2: ${delay2};`)
  lines.push(`  --cui-${COMPONENT}-delay3: ${delay3};`)
  lines.push(`  --cui-${COMPONENT}-delay4: ${delay4};`)
  lines.push(`  --cui-${COMPONENT}-delay5: ${delay5};`)
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
  lines.push(`body[color-scheme="dark"] .cui-${COMPONENT}.--${variantName} {`)

  if (dark.color) lines.push(`  --cui-${COMPONENT}-color: ${dark.color};`)
  if (dark.trackColor) lines.push(`  --cui-${COMPONENT}-track: ${dark.trackColor};`)

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
      return `<svg class="cui-spinner-ring" viewBox="0 0 24 24" fill="none">
  <circle class="cui-spinner-ring-track" cx="12" cy="12" r="10" stroke-width="2.5" />
  <circle class="cui-spinner-ring-arc" cx="12" cy="12" r="10" stroke-width="2.5" stroke-dasharray="43.98" stroke-dashoffset="32.99" />
</svg>`

    case 'pulse':
      return `<svg class="cui-spinner-pulse" viewBox="0 0 24 24">
  <circle class="cui-spinner-pulse-bg" cx="12" cy="12" r="10" />
  <circle class="cui-spinner-pulse-fg" cx="12" cy="12" r="10" />
</svg>`

    case 'dots':
      return `<div class="cui-spinner-dots">
  <div class="cui-spinner-dot"></div>
  <div class="cui-spinner-dot"></div>
  <div class="cui-spinner-dot"></div>
</div>`

    case 'bars':
      return `<div class="cui-spinner-bars">
  <div class="cui-spinner-bar"></div>
  <div class="cui-spinner-bar"></div>
  <div class="cui-spinner-bar"></div>
  <div class="cui-spinner-bar"></div>
  <div class="cui-spinner-bar"></div>
</div>`

    case 'dual':
      return `<svg class="cui-spinner-dual" viewBox="0 0 24 24" fill="none">
  <g class="cui-spinner-dual-outer">
    <circle cx="12" cy="12" r="10" stroke-width="2.5" stroke-dasharray="40.84 62.83" stroke-dashoffset="10.99" />
  </g>
  <g class="cui-spinner-dual-inner">
    <circle cx="12" cy="12" r="5.5" stroke-width="2.5" stroke-dasharray="22.46 34.56" stroke-dashoffset="6.05" />
  </g>
</svg>`

    default:
      return ''
  }
}
