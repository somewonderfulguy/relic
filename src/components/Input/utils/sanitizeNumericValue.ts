import type { ComponentProps } from 'react'

export const sanitizeNumericValue = (
  value: string,
  inputMode: ComponentProps<'input'>['inputMode'],
) => {
  if (inputMode === 'decimal') {
    const numericValue = value.replace(/[^\d.,]/g, '')
    const separator = numericValue.match(/[.,]/)?.[0]

    if (!separator) {
      return numericValue
    }

    const [integerPart = '', ...decimalParts] = numericValue.split(/[.,]/)

    return `${integerPart}${separator}${decimalParts.join('')}`
  }

  return value.replace(/\D/g, '')
}
