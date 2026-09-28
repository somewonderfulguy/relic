'use client'

import type { ComponentProps } from 'react'

import { cn } from '@/utils'

import {
  formatNumericConstraintWarning,
  getNumericPattern,
  parseNumericConstraints,
  normalizeNumericValue,
  sanitizeNumericValue,
  getSanitizedNumericSelection,
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
  onBlur,
  allowNegative,
  step,
  min,
  max,
  ...props
}: InputProps) => {
  const isNumberInput = type === 'number'
  const resolvedInputMode = isNumberInput ? (inputMode ?? 'numeric') : inputMode
  const numericConstraints = isNumberInput
    ? parseNumericConstraints({ step, min, max })
    : undefined
  const numericMin = numericConstraints?.min
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

  if (process.env.NODE_ENV !== 'production' && numericConstraints) {
    numericConstraints.issues.forEach((issue) => {
      console.warn(formatNumericConstraintWarning(issue))
    })
  }

  return (
    <input
      type={isNumberInput ? 'text' : type}
      inputMode={resolvedInputMode}
      pattern={resolvedPattern}
      min={min}
      max={max}
      step={step}
      className={cn(className)}
      onChange={(event) => {
        if (isNumberInput) {
          const value = event.currentTarget.value
          const numericOptions = {
            inputMode: resolvedInputMode,
            allowNegative: resolvedAllowNegative,
          }
          const sanitizedValue = sanitizeNumericValue(value, numericOptions)

          if (sanitizedValue !== value) {
            const selectionDirection = event.currentTarget.selectionDirection
            const selection = getSanitizedNumericSelection(value, {
              ...numericOptions,
              selectionStart: event.currentTarget.selectionStart,
              selectionEnd: event.currentTarget.selectionEnd,
            })

            event.currentTarget.value = sanitizedValue

            if (selection) {
              event.currentTarget.setSelectionRange(
                selection.selectionStart,
                selection.selectionEnd,
                selectionDirection ?? undefined,
              )
            }
          }
        }
        onChange?.(event)
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (isNumberInput && !event.defaultPrevented) {
          handleNumericStepping(event, {
            step,
            min,
            max,
            allowNegative: resolvedAllowNegative,
          })
        }
      }}
      onBlur={(event) => {
        if (isNumberInput) {
          const normalized = normalizeNumericValue(event.currentTarget.value, {
            inputMode: resolvedInputMode,
            allowNegative: resolvedAllowNegative,
          })
          if (normalized !== event.currentTarget.value) {
            // Prototype setter + input event: same trick as numericStepping,
            // so controlled inputs' onChange fires with the normalized value
            // instead of silently diverging from React state.
            const setValue = Object.getOwnPropertyDescriptor(
              HTMLInputElement.prototype,
              'value',
            )?.set
            setValue?.call(event.currentTarget, normalized)
            event.currentTarget.dispatchEvent(
              new Event('input', { bubbles: true }),
            )
          }
        }
        onBlur?.(event)
      }}
      {...props}
    />
  )
}
