import {
  formatNumericConstraintWarning,
  parseNumericConstraints,
} from '../utils'

test('defaults omitted step to 1 and leaves missing bounds absent', () => {
  expect(parseNumericConstraints({})).toEqual({
    step: 1,
    min: undefined,
    max: undefined,
    issues: [],
  })
})

test('parses finite numeric strings and numbers', () => {
  expect(
    parseNumericConstraints({
      step: '0.5',
      min: '-.5',
      max: 10,
    }),
  ).toEqual({
    step: 0.5,
    min: -0.5,
    max: 10,
    issues: [],
  })
})

test('accepts exponent notation for constraints', () => {
  expect(
    parseNumericConstraints({
      step: '1e-3',
      min: '-1e2',
      max: '+1.5e2',
    }),
  ).toEqual({
    step: 0.001,
    min: -100,
    max: 150,
    issues: [],
  })
})

test('step="any" disables incremental stepping without warning', () => {
  expect(parseNumericConstraints({ step: 'any' })).toEqual({
    step: undefined,
    min: undefined,
    max: undefined,
    issues: [],
  })
})

test('rejects invalid and empty strings instead of coercing them', () => {
  expect(
    parseNumericConstraints({
      step: '',
      min: 'low',
      max: '1,5',
    }),
  ).toEqual({
    step: undefined,
    min: undefined,
    max: undefined,
    issues: [
      { prop: 'step', value: '', reason: 'invalid-number' },
      { prop: 'min', value: 'low', reason: 'invalid-number' },
      { prop: 'max', value: '1,5', reason: 'invalid-number' },
    ],
  })
})

test('rejects non-finite values', () => {
  expect(
    parseNumericConstraints({
      step: Infinity,
      min: NaN,
      max: '-Infinity',
    }),
  ).toEqual({
    step: undefined,
    min: undefined,
    max: undefined,
    issues: [
      { prop: 'step', value: Infinity, reason: 'invalid-number' },
      { prop: 'min', value: NaN, reason: 'invalid-number' },
      { prop: 'max', value: '-Infinity', reason: 'invalid-number' },
    ],
  })
})

test('rejects non-positive step values while allowing zero bounds', () => {
  expect(
    parseNumericConstraints({
      step: 0,
      min: 0,
      max: '0',
    }),
  ).toEqual({
    step: undefined,
    min: 0,
    max: 0,
    issues: [{ prop: 'step', value: 0, reason: 'non-positive-step' }],
  })

  expect(parseNumericConstraints({ step: '-0.1' })).toEqual({
    step: undefined,
    min: undefined,
    max: undefined,
    issues: [{ prop: 'step', value: '-0.1', reason: 'non-positive-step' }],
  })
})

test('rejects hexadecimal-looking strings instead of using Number coercion', () => {
  expect(parseNumericConstraints({ min: '0x10' })).toEqual({
    step: 1,
    min: undefined,
    max: undefined,
    issues: [{ prop: 'min', value: '0x10', reason: 'invalid-number' }],
  })
})

test('formats constraint warnings for dev output', () => {
  expect(
    formatNumericConstraintWarning({
      prop: 'step',
      value: 0,
      reason: 'non-positive-step',
    }),
  ).toBe(
    'Input: `step={0}` was ignored because numeric stepping requires a positive finite value. Use a positive number or `step="any"` to disable Arrow/Page stepping.',
  )

  expect(
    formatNumericConstraintWarning({
      prop: 'min',
      value: 'low',
      reason: 'invalid-number',
    }),
  ).toBe('Input: `min="low"` was ignored because it is not a finite number.')
})
