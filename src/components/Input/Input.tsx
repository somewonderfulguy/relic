'use client'

import type { ComponentProps } from 'react'

import { cn } from '@/utils'

import {
  getNumericPattern,
  sanitizeNumericValue,
  handleNumericStepping,
} from './utils'

type NativeInputProps = ComponentProps<'input'>

/**
 * Props that only apply when `type="number"`.
 * New number-only props should be added here — the non-numeric branch of
 * `InputProps` excludes them automatically via a mapped type.
 */
type NumericOnlyProps = {
  /**
   * When `true`, permits typing a leading minus sign to produce a negative value.
   * Redundant when a negative `min` is provided — a negative bound already enables negatives.
   */
  allowNegative?: boolean
}

type NumericInputProps = Omit<NativeInputProps, 'type'> & {
  type: 'number'
} & NumericOnlyProps

type NonNumericInputProps = Omit<NativeInputProps, 'type'> & {
  type?: Exclude<NativeInputProps['type'], 'number'>
} & { [K in keyof NumericOnlyProps]?: never }

export type InputProps = NumericInputProps | NonNumericInputProps

export const Input = ({
  type = 'text',
  inputMode,
  pattern,
  className,
  onChange,
  onKeyDown,
  allowNegative,
  step,
  min,
  max,
  ...props
}: InputProps) => {
  const isNumberInput = type === 'number'
  const resolvedInputMode = isNumberInput ? (inputMode ?? 'numeric') : inputMode
  const resolvedPattern = isNumberInput
    ? (pattern ??
      getNumericPattern({ inputMode: resolvedInputMode, allowNegative }))
    : pattern

  return (
    <input
      type={isNumberInput ? 'text' : type}
      inputMode={resolvedInputMode}
      pattern={resolvedPattern}
      className={cn(className)}
      onChange={(event) => {
        if (isNumberInput) {
          event.currentTarget.value = sanitizeNumericValue(
            event.currentTarget.value,
            { inputMode: resolvedInputMode, allowNegative },
          )
        }
        onChange?.(event)
      }}
      onKeyDown={(event) => {
        if (isNumberInput && !event.defaultPrevented) {
          handleNumericStepping(event, { step, min, max })
        }
        onKeyDown?.(event)
      }}
      {...props}
    />
  )
}
