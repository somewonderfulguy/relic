import type { ComponentProps } from 'react'

import { cn } from '@/utils'

import { sanitizeNumericValue } from './utils'

export type InputProps = ComponentProps<'input'>

const getNumericPattern = (inputMode: InputProps['inputMode']) =>
  inputMode === 'decimal' ? '[0-9]+([.,][0-9]+)?' : '[0-9]*'

export const Input = ({
  type = 'text',
  inputMode,
  pattern,
  className,
  onChange,
  ...props
}: InputProps) => {
  const isNumberInput = type === 'number'
  const resolvedInputMode = isNumberInput ? (inputMode ?? 'numeric') : inputMode
  const resolvedPattern = isNumberInput
    ? (pattern ?? getNumericPattern(resolvedInputMode))
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
            resolvedInputMode,
          )
        }
        onChange?.(event)
      }}
      {...props}
    />
  )
}
