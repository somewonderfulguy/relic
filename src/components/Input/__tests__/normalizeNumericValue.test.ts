import { normalizeNumericValue } from '../utils'

test('decimal mode: prepends 0 to a leading separator', () => {
  expect(normalizeNumericValue('.5', { inputMode: 'decimal' })).toBe('0.5')
  expect(normalizeNumericValue(',5', { inputMode: 'decimal' })).toBe('0.5')
})

test('decimal mode: prepends 0 to a leading separator with negative', () => {
  const options = { inputMode: 'decimal' as const, allowNegative: true }

  expect(normalizeNumericValue('-.5', options)).toBe('-0.5')
  expect(normalizeNumericValue('-,5', options)).toBe('-0.5')
})

test('decimal mode: drops trailing separator', () => {
  expect(normalizeNumericValue('100.', { inputMode: 'decimal' })).toBe('100')
  expect(normalizeNumericValue('100,', { inputMode: 'decimal' })).toBe('100')
})

test('decimal mode: drops trailing separator with negative', () => {
  const options = { inputMode: 'decimal' as const, allowNegative: true }

  expect(normalizeNumericValue('-100.', options)).toBe('-100')
  expect(normalizeNumericValue('-100,', options)).toBe('-100')
})

test('decimal mode: canonicalizes comma to dot', () => {
  expect(normalizeNumericValue('12,34', { inputMode: 'decimal' })).toBe('12.34')
  expect(normalizeNumericValue('0,5', { inputMode: 'decimal' })).toBe('0.5')
})

test('decimal mode: dot-form values pass through unchanged', () => {
  expect(normalizeNumericValue('12.34', { inputMode: 'decimal' })).toBe('12.34')
  expect(normalizeNumericValue('0.5', { inputMode: 'decimal' })).toBe('0.5')
  expect(normalizeNumericValue('0', { inputMode: 'decimal' })).toBe('0')
  expect(normalizeNumericValue('42', { inputMode: 'decimal' })).toBe('42')
})

test('clears values that have no digits', () => {
  const negativeDecimal = { inputMode: 'decimal' as const, allowNegative: true }

  expect(normalizeNumericValue('', { inputMode: 'decimal' })).toBe('')
  expect(normalizeNumericValue('-', negativeDecimal)).toBe('')
  expect(normalizeNumericValue('.', { inputMode: 'decimal' })).toBe('')
  expect(normalizeNumericValue(',', { inputMode: 'decimal' })).toBe('')
  expect(normalizeNumericValue('-.', negativeDecimal)).toBe('')
})

test('integer mode: canonical values pass through unchanged', () => {
  expect(normalizeNumericValue('42', { inputMode: 'numeric' })).toBe('42')
  expect(normalizeNumericValue('0', { inputMode: 'numeric' })).toBe('0')
})

test('integer mode: preserves negative digits under allowNegative', () => {
  expect(
    normalizeNumericValue('-42', { inputMode: 'numeric', allowNegative: true }),
  ).toBe('-42')
})

test('integer mode: clears a lone minus under allowNegative', () => {
  expect(
    normalizeNumericValue('-', { inputMode: 'numeric', allowNegative: true }),
  ).toBe('')
})
