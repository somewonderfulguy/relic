import { sanitizeNumericValue } from '../utils'

test('integer mode: strips non-digit characters', () => {
  expect(sanitizeNumericValue('abc123', { inputMode: 'numeric' })).toBe('123')
  expect(sanitizeNumericValue('1a2b3c', { inputMode: 'numeric' })).toBe('123')
  expect(sanitizeNumericValue('!@#$%', { inputMode: 'numeric' })).toBe('')
  expect(sanitizeNumericValue('', { inputMode: 'numeric' })).toBe('')
})

test('integer mode: keeps only digits', () => {
  expect(sanitizeNumericValue('42', { inputMode: 'numeric' })).toBe('42')
  expect(sanitizeNumericValue('007', { inputMode: 'numeric' })).toBe('007')
  expect(sanitizeNumericValue('1.5', { inputMode: 'numeric' })).toBe('15')
  expect(sanitizeNumericValue('1,5', { inputMode: 'numeric' })).toBe('15')
})

test('integer mode: strips minus when allowNegative is not set', () => {
  expect(sanitizeNumericValue('-42', { inputMode: 'numeric' })).toBe('42')
  expect(sanitizeNumericValue('-', { inputMode: 'numeric' })).toBe('')
  expect(sanitizeNumericValue('5-', { inputMode: 'numeric' })).toBe('5')
})

test('decimal mode: allows single dot separator', () => {
  expect(sanitizeNumericValue('12.34', { inputMode: 'decimal' })).toBe('12.34')
  expect(sanitizeNumericValue('.5', { inputMode: 'decimal' })).toBe('.5')
  expect(sanitizeNumericValue('100.', { inputMode: 'decimal' })).toBe('100.')
})

test('decimal mode: allows single comma separator', () => {
  expect(sanitizeNumericValue('12,34', { inputMode: 'decimal' })).toBe('12,34')
  expect(sanitizeNumericValue(',5', { inputMode: 'decimal' })).toBe(',5')
  expect(sanitizeNumericValue('100,', { inputMode: 'decimal' })).toBe('100,')
})

test('decimal mode: collapses multiple separators', () => {
  expect(sanitizeNumericValue('1.2.3', { inputMode: 'decimal' })).toBe('1.23')
  expect(sanitizeNumericValue('1,2,3', { inputMode: 'decimal' })).toBe('1,23')
  expect(sanitizeNumericValue('1.2,3', { inputMode: 'decimal' })).toBe('1.23')
  expect(sanitizeNumericValue('1,2.3', { inputMode: 'decimal' })).toBe('1,23')
})

test('decimal mode: strips non-digit/separator characters', () => {
  expect(sanitizeNumericValue('abc12.34xyz', { inputMode: 'decimal' })).toBe(
    '12.34',
  )
  expect(sanitizeNumericValue('$1,000', { inputMode: 'decimal' })).toBe('1,000')
  expect(sanitizeNumericValue('--5.5', { inputMode: 'decimal' })).toBe('5.5')
})

test('decimal mode: no separator returns digits only', () => {
  expect(sanitizeNumericValue('abc123', { inputMode: 'decimal' })).toBe('123')
  expect(sanitizeNumericValue('42', { inputMode: 'decimal' })).toBe('42')
})

test('allowNegative: preserves single leading minus in integer mode', () => {
  const options = { inputMode: 'numeric' as const, allowNegative: true }

  expect(sanitizeNumericValue('-42', options)).toBe('-42')
  expect(sanitizeNumericValue('-', options)).toBe('-')
  expect(sanitizeNumericValue('-abc42', options)).toBe('-42')
})

test('allowNegative: collapses multiple minuses to a single leading one', () => {
  const options = { inputMode: 'numeric' as const, allowNegative: true }

  expect(sanitizeNumericValue('--42', options)).toBe('-42')
  expect(sanitizeNumericValue('-4-2', options)).toBe('-42')
})

test('allowNegative: does not add minus for trailing or embedded minuses', () => {
  const options = { inputMode: 'numeric' as const, allowNegative: true }

  expect(sanitizeNumericValue('42-', options)).toBe('42')
  expect(sanitizeNumericValue('4-2', options)).toBe('42')
})

test('allowNegative: preserves minus in decimal mode', () => {
  const options = { inputMode: 'decimal' as const, allowNegative: true }

  expect(sanitizeNumericValue('-12.34', options)).toBe('-12.34')
  expect(sanitizeNumericValue('-.5', options)).toBe('-.5')
  expect(sanitizeNumericValue('-', options)).toBe('-')
  expect(sanitizeNumericValue('-1.2.3', options)).toBe('-1.23')
})

test('allowNegative=false is equivalent to omitting the option', () => {
  expect(
    sanitizeNumericValue('-42', { inputMode: 'numeric', allowNegative: false }),
  ).toBe('42')
})
