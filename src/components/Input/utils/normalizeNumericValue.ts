import type { ComponentProps } from 'react'

export type NormalizeNumericValueOptions = {
  inputMode: ComponentProps<'input'>['inputMode']
  allowNegative?: boolean
}

/**
 * Converts an in-progress numeric value to its canonical committed form.
 * Runs on blur, not on every keystroke — the sanitizer permits intermediate
 * shapes like `.5`, `100.`, `-`, and comma separators while typing; this
 * collapses them to `0.5`, `100`, `''`, and dot-form once the field is
 * committed. Dot is the model separator: consumers can `Number(value)` the
 * result without a locale-aware parse step. Comma is a typing convenience.
 */
export const normalizeNumericValue = (
  value: string,
  { inputMode, allowNegative }: NormalizeNumericValueOptions,
): string => {
  const isNegative = allowNegative === true && value.startsWith('-')
  const unsigned = isNegative ? value.slice(1) : value

  // No digits at all → not a committed number (lone `-`, `.`, `,`, `-.`, ``).
  if (!/\d/.test(unsigned)) return ''

  if (inputMode !== 'decimal') {
    return isNegative ? `-${unsigned}` : unsigned
  }

  const [integerPart, decimalPart = ''] = unsigned.split(/[.,]/)

  if (decimalPart === '') {
    return isNegative ? `-${integerPart}` : integerPart
  }

  const normalizedInt = integerPart === '' ? '0' : integerPart
  const normalized = `${normalizedInt}.${decimalPart}`

  return isNegative ? `-${normalized}` : normalized
}
