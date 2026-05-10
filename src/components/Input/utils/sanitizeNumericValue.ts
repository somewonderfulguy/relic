import type { ComponentProps } from 'react'

export type SanitizeNumericValueOptions = {
  inputMode: ComponentProps<'input'>['inputMode']
  allowNegative?: boolean
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

const sanitizeDecimal = (value: string) => {
  const numericValue = value.replace(/[^\d.,]/g, '')
  const separator = numericValue.match(/[.,]/)?.[0]

  if (!separator) {
    return numericValue
  }

  const [integerPart = '', ...decimalParts] = numericValue.split(/[.,]/)

  return `${integerPart}${separator}${decimalParts.join('')}`
}
