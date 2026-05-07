import { sanitizeNumericValue } from '../utils'

test('integer mode: strips non-digit characters', () => {
  expect(sanitizeNumericValue('abc123', 'numeric')).toBe('123')
  expect(sanitizeNumericValue('1a2b3c', 'numeric')).toBe('123')
  expect(sanitizeNumericValue('!@#$%', 'numeric')).toBe('')
  expect(sanitizeNumericValue('', 'numeric')).toBe('')
})

test('integer mode: keeps only digits', () => {
  expect(sanitizeNumericValue('42', 'numeric')).toBe('42')
  expect(sanitizeNumericValue('007', 'numeric')).toBe('007')
  expect(sanitizeNumericValue('1.5', 'numeric')).toBe('15')
  expect(sanitizeNumericValue('1,5', 'numeric')).toBe('15')
})

test('decimal mode: allows single dot separator', () => {
  expect(sanitizeNumericValue('12.34', 'decimal')).toBe('12.34')
  expect(sanitizeNumericValue('.5', 'decimal')).toBe('.5')
  expect(sanitizeNumericValue('100.', 'decimal')).toBe('100.')
})

test('decimal mode: allows single comma separator', () => {
  expect(sanitizeNumericValue('12,34', 'decimal')).toBe('12,34')
  expect(sanitizeNumericValue(',5', 'decimal')).toBe(',5')
  expect(sanitizeNumericValue('100,', 'decimal')).toBe('100,')
})

test('decimal mode: collapses multiple separators', () => {
  expect(sanitizeNumericValue('1.2.3', 'decimal')).toBe('1.23')
  expect(sanitizeNumericValue('1,2,3', 'decimal')).toBe('1,23')
  expect(sanitizeNumericValue('1.2,3', 'decimal')).toBe('1.23')
  expect(sanitizeNumericValue('1,2.3', 'decimal')).toBe('1,23')
})

test('decimal mode: strips non-digit/separator characters', () => {
  expect(sanitizeNumericValue('abc12.34xyz', 'decimal')).toBe('12.34')
  expect(sanitizeNumericValue('$1,000', 'decimal')).toBe('1,000')
  expect(sanitizeNumericValue('--5.5', 'decimal')).toBe('5.5')
})

test('decimal mode: no separator returns digits only', () => {
  expect(sanitizeNumericValue('abc123', 'decimal')).toBe('123')
  expect(sanitizeNumericValue('42', 'decimal')).toBe('42')
})
