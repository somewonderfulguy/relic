import type { ComponentProps } from 'react'

export type GetNumericPatternOptions = {
  inputMode: ComponentProps<'input'>['inputMode']
  allowNegative?: boolean
}

export const getNumericPattern = ({
  inputMode,
  allowNegative,
}: GetNumericPatternOptions) => {
  const sign = allowNegative ? '-?' : ''
  return inputMode === 'decimal'
    ? `${sign}[0-9]+([.,][0-9]+)?`
    : `${sign}[0-9]*`
}
