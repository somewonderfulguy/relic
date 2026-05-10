import { getNumericPattern } from '../utils'

test('integer mode: returns digits-only pattern', () => {
  expect(getNumericPattern({ inputMode: 'numeric' })).toBe('[0-9]*')
})

test('integer mode with allowNegative: prefixes optional minus', () => {
  expect(getNumericPattern({ inputMode: 'numeric', allowNegative: true })).toBe(
    '-?[0-9]*',
  )
})

test('decimal mode: returns digits-plus-separator pattern', () => {
  expect(getNumericPattern({ inputMode: 'decimal' })).toBe(
    '[0-9]+([.,][0-9]+)?',
  )
})

test('decimal mode with allowNegative: prefixes optional minus', () => {
  expect(getNumericPattern({ inputMode: 'decimal', allowNegative: true })).toBe(
    '-?[0-9]+([.,][0-9]+)?',
  )
})

test('allowNegative=false is equivalent to omitting the flag', () => {
  expect(
    getNumericPattern({ inputMode: 'numeric', allowNegative: false }),
  ).toBe('[0-9]*')
  expect(
    getNumericPattern({ inputMode: 'decimal', allowNegative: false }),
  ).toBe('[0-9]+([.,][0-9]+)?')
})
