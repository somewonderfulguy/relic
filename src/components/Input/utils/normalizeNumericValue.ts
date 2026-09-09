import type { ComponentProps } from 'react'

export type NormalizeNumericValueOptions = {
  inputMode: ComponentProps<'input'>['inputMode']
  allowNegative?: boolean
}

/**
 * Converts an in-progress numeric value to its canonical committed form.
 * Runs on blur, not on every keystroke — the sanitizer permits intermediate
 * shapes like `.5`, `100.`, and `-` while typing; this collapses them to
 * `0.5`, `100`, and `''` once the field is committed. Preserves whichever
 * decimal separator (dot or comma) the user typed.
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

  const separator = unsigned.match(/[.,]/)?.[0]
  if (!separator) {
    return isNegative ? `-${unsigned}` : unsigned
  }

  const [integerPart, decimalPart = ''] = unsigned.split(/[.,]/)

  if (decimalPart === '') {
    return isNegative ? `-${integerPart}` : integerPart
  }

  const normalizedInt = integerPart === '' ? '0' : integerPart
  const normalized = `${normalizedInt}${separator}${decimalPart}`

  return isNegative ? `-${normalized}` : normalized
}
