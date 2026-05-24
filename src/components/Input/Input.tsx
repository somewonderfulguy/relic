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
   * Implicitly enabled when `min` is negative.
   *
   * `min` is the source of truth when defined: a non-negative `min` resolves
   * `allowNegative` to `false`, and a negative `min` resolves it to `true`,
   * regardless of the prop value. A dev-only `console.warn` fires only for the
   * hard conflict (`allowNegative={true}` paired with `min >= 0`); the
   * symmetric case (`allowNegative={false}` with a negative `min`) resolves
   * silently, since that one is often produced by Storybook / form-library
   * defaults rather than intentional input.
   */
  allowNegative?: boolean
}

type NumericInputProps = Omit<NativeInputProps, 'type'> & {
  type: 'number'
} & NumericOnlyProps

type NonNumericInputProps = Omit<NativeInputProps, 'type'> & {
  type?: Exclude<NativeInputProps['type'], 'number'>
} & { [Key in keyof NumericOnlyProps]?: never }

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
  const numericMin = min !== undefined ? Number(min) : undefined
  // `min` is the source of truth when defined: its sign decides whether
  // negatives are reachable, regardless of the prop. Only when `min` is unset
  // does `allowNegative` actually drive the result.
  const resolvedAllowNegative =
    numericMin !== undefined ? numericMin < 0 : (allowNegative ?? false)
  const resolvedPattern = isNumberInput
    ? (pattern ??
      getNumericPattern({
        inputMode: resolvedInputMode,
        allowNegative: resolvedAllowNegative,
      }))
    : pattern

  if (
    process.env.NODE_ENV !== 'production' &&
    isNumberInput &&
    allowNegative === true &&
    numericMin !== undefined &&
    numericMin >= 0
  ) {
    console.warn(
      `Input: \`allowNegative={true}\` was ignored because \`min={${min}}\` already forbids negative values. Either set a negative \`min\` or remove \`allowNegative\`.`,
    )
  }

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
            {
              inputMode: resolvedInputMode,
              allowNegative: resolvedAllowNegative,
            },
          )
        }
        onChange?.(event)
      }}
      onKeyDown={(event) => {
        if (isNumberInput && !event.defaultPrevented) {
          handleNumericStepping(event, {
            step,
            min,
            max,
            allowNegative: resolvedAllowNegative,
          })
        }
        onKeyDown?.(event)
      }}
      {...props}
    />
  )
}
