import { stepNumericValue } from '../utils'

test('steps up by the given amount', () => {
  expect(stepNumericValue({ value: '10', step: 1, direction: 'up' })).toBe('11')
  expect(stepNumericValue({ value: '0', step: 100, direction: 'up' })).toBe(
    '100',
  )
  expect(stepNumericValue({ value: '1.5', step: 0.5, direction: 'up' })).toBe(
    '2',
  )
})

test('steps down by the given amount', () => {
  expect(stepNumericValue({ value: '10', step: 1, direction: 'down' })).toBe(
    '9',
  )
  expect(stepNumericValue({ value: '100', step: 100, direction: 'down' })).toBe(
    '0',
  )
  expect(stepNumericValue({ value: '2', step: 0.5, direction: 'down' })).toBe(
    '1.5',
  )
})

test('empty value is treated as 0', () => {
  expect(stepNumericValue({ value: '', step: 1, direction: 'up' })).toBe('1')
  expect(stepNumericValue({ value: '', step: 1, direction: 'down' })).toBe('-1')
})

test('clamps to min', () => {
  expect(
    stepNumericValue({ value: '-90', step: 100, min: -100, direction: 'down' }),
  ).toBe('-100')
  expect(
    stepNumericValue({ value: '-100', step: 1, min: -100, direction: 'down' }),
  ).toBe('-100')
})

test('clamps to max', () => {
  expect(
    stepNumericValue({ value: '1150', step: 100, max: 1200, direction: 'up' }),
  ).toBe('1200')
  expect(
    stepNumericValue({ value: '1200', step: 1, max: 1200, direction: 'up' }),
  ).toBe('1200')
})

test('accepts comma as decimal separator', () => {
  expect(stepNumericValue({ value: '1,5', step: 0.5, direction: 'up' })).toBe(
    '2',
  )
  expect(stepNumericValue({ value: '2,0', step: 0.5, direction: 'down' })).toBe(
    '1.5',
  )
})

test('avoids floating-point rounding artifacts', () => {
  expect(stepNumericValue({ value: '0.1', step: 0.1, direction: 'up' })).toBe(
    '0.2',
  )
  expect(stepNumericValue({ value: '0.2', step: 0.1, direction: 'up' })).toBe(
    '0.3',
  )
  expect(stepNumericValue({ value: '1', step: 0.25, direction: 'down' })).toBe(
    '0.75',
  )
})

test('multiplier scales the step without corrupting precision', () => {
  expect(
    stepNumericValue({ value: '0', step: 1, multiplier: 10, direction: 'up' }),
  ).toBe('10')
  expect(
    stepNumericValue({
      value: '100',
      step: 100,
      multiplier: 10,
      direction: 'down',
    }),
  ).toBe('-900')
  // 0.3 * 10 = 2.9999... in JS — precision must be derived from step, not step*multiplier
  expect(
    stepNumericValue({
      value: '0',
      step: 0.3,
      multiplier: 10,
      direction: 'up',
    }),
  ).toBe('3')
  expect(
    stepNumericValue({
      value: '0',
      step: 0.1,
      multiplier: 10,
      direction: 'up',
    }),
  ).toBe('1')
})

test('handles negative values', () => {
  expect(stepNumericValue({ value: '-5', step: 1, direction: 'up' })).toBe('-4')
  expect(stepNumericValue({ value: '-5', step: 1, direction: 'down' })).toBe(
    '-6',
  )
})
