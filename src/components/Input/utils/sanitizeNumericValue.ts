import type { ComponentProps } from 'react'

export type SanitizeNumericValueOptions = {
  inputMode: ComponentProps<'input'>['inputMode']
  allowNegative?: boolean
}

export type SanitizedNumericSelectionOptions = SanitizeNumericValueOptions & {
  selectionStart: number | null
  selectionEnd: number | null
}

export const sanitizeNumericValue = (
  value: string,
  { inputMode, allowNegative }: SanitizeNumericValueOptions,
) => {
  const isNegative = allowNegative === true && value.startsWith('-')
  const unsigned = value.replace(/-/g, '')

  const cleaned =
    inputMode === 'decimal'
      ? sanitizeDecimal(unsigned)
      : unsigned.replace(/\D/g, '')

  return isNegative ? `-${cleaned}` : cleaned
}

export const getSanitizedNumericSelection = (
  value: string,
  {
    selectionStart,
    selectionEnd,
    ...options
  }: SanitizedNumericSelectionOptions,
) => {
  if (selectionStart === null || selectionEnd === null) return null

  return {
    selectionStart: sanitizeNumericValue(
      value.slice(0, selectionStart),
      options,
    ).length,
    selectionEnd: sanitizeNumericValue(value.slice(0, selectionEnd), options)
      .length,
  }
}

const sanitizeDecimal = (value: string) => {
  const numericValue = value.replace(/[^\d.,]/g, '')
  const separator = numericValue.match(/[.,]/)?.[0]

  if (!separator) {
    return numericValue
  }

  const [integerPart = '', ...decimalParts] = numericValue.split(/[.,]/)

  return `${integerPart}${separator}${decimalParts.join('')}`
}
