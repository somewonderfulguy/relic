import type { ComponentProps, KeyboardEvent } from 'react'

import { parseNumericConstraints } from './parseNumericConstraints'

export type StepNumericValueOptions = {
  value: string
  step: number
  multiplier?: number
  min?: number
  max?: number
  direction: 'up' | 'down'
}

export const stepNumericValue = ({
  value,
  step,
  multiplier = 1,
  min,
  max,
  direction,
}: StepNumericValueOptions): string => {
  const parsed = parseFloat(value.replace(',', '.'))
  const current = isNaN(parsed) ? 0 : parsed

  const delta = step * multiplier
  let next = current + (direction === 'up' ? delta : -delta)

  if (min !== undefined) next = Math.max(next, min)
  if (max !== undefined) next = Math.min(next, max)

  // Precision is derived from step, not step*multiplier, to avoid FP artifacts
  // (e.g. 0.3 * 10 = 2.9999... in JS)
  return formatSteppedValue(next, getDecimalPrecision(step))
}

const formatSteppedValue = (value: number, precision: number) => {
  const fixed = value.toFixed(precision)
  const trimmed = fixed.includes('.') ? fixed.replace(/\.?0+$/, '') : fixed

  return trimmed === '-0' ? '0' : trimmed
}

const getDecimalPrecision = (value: number) => {
  const str = String(value)
  if (str.includes('e')) {
    const [coefficient, exponent = '0'] = str.split('e')
    const coefficientPrecision = coefficient.split('.')[1]?.length ?? 0
    return Math.min(Math.max(coefficientPrecision - Number(exponent), 0), 100)
  }

  const i = str.indexOf('.')
  return i === -1 ? 0 : str.length - i - 1
}

export const handleNumericStepping = (
  event: KeyboardEvent<HTMLInputElement>,
  props: {
    step: ComponentProps<'input'>['step']
    min: ComponentProps<'input'>['min']
    max: ComponentProps<'input'>['max']
    allowNegative?: boolean
  },
) => {
  const { key } = event
  const { step, min, max } = parseNumericConstraints(props)
  // When negatives aren't allowed, 0 is the effective floor for incremental
  // stepping. Without this, Arrow/PageDown produces a transient negative that
  // the sanitizer strips back to positive, causing 0 ↔ step oscillation.
  // Home still uses the parsed min (no-op when absent/invalid, per W3C APG).
  const steppingMin = props.allowNegative ? min : Math.max(min ?? 0, 0)

  let newValue: string | undefined

  if (step !== undefined && (key === 'ArrowUp' || key === 'ArrowDown')) {
    newValue = stepNumericValue({
      value: event.currentTarget.value,
      step,
      min: steppingMin,
      max,
      direction: key === 'ArrowUp' ? 'up' : 'down',
    })
  } else if (step !== undefined && (key === 'PageUp' || key === 'PageDown')) {
    newValue = stepNumericValue({
      value: event.currentTarget.value,
      step,
      multiplier: 10,
      min: steppingMin,
      max,
      direction: key === 'PageUp' ? 'up' : 'down',
    })
  } else if (key === 'Home' && min !== undefined) {
    newValue = String(min)
  } else if (key === 'End' && max !== undefined) {
    newValue = String(max)
  }

  if (newValue !== undefined) {
    event.preventDefault()
    // Assigning `currentTarget.value = newValue` updates React's internal
    // valueTracker too, so the synthetic `input` event sees no delta and
    // `onChange` is skipped — breaking controlled inputs. Call the prototype
    // setter to update the DOM without touching the tracker.
    const setValue = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    )?.set
    setValue?.call(event.currentTarget, newValue)
    event.currentTarget.dispatchEvent(new Event('input', { bubbles: true }))
  }
}
