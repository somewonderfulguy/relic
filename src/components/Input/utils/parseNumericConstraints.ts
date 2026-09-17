import type { ComponentProps } from 'react'

type NumericAttributeValue = ComponentProps<'input'>['min']

export type NumericConstraintIssue = {
  prop: 'step' | 'min' | 'max'
  value: Exclude<NumericAttributeValue, undefined>
  reason: 'invalid-number' | 'non-positive-step'
}

export type ParsedNumericConstraints = {
  /**
   * `undefined` means incremental Arrow/Page stepping is intentionally disabled.
   * This happens for `step="any"` and invalid step values.
   */
  step: number | undefined
  min: number | undefined
  max: number | undefined
  issues: NumericConstraintIssue[]
}

type ParseNumericConstraintsOptions = {
  step?: NumericAttributeValue
  min?: NumericAttributeValue
  max?: NumericAttributeValue
}

const DECIMAL_ATTRIBUTE_PATTERN =
  /^[+-]?(?:(?:\d+\.?\d*)|(?:\.\d+))(?:[eE][+-]?\d+)?$/

export const parseNumericConstraints = ({
  step,
  min,
  max,
}: ParseNumericConstraintsOptions): ParsedNumericConstraints => {
  const issues: NumericConstraintIssue[] = []
  const parsedStep = parseStep(step)
  const parsedMin = parseFiniteNumericAttribute('min', min)
  const parsedMax = parseFiniteNumericAttribute('max', max)

  if (parsedStep.issue) issues.push(parsedStep.issue)
  if (parsedMin.issue) issues.push(parsedMin.issue)
  if (parsedMax.issue) issues.push(parsedMax.issue)

  return {
    step: parsedStep.value,
    min: parsedMin.value,
    max: parsedMax.value,
    issues,
  }
}

export const formatNumericConstraintWarning = ({
  prop,
  value,
  reason,
}: NumericConstraintIssue) => {
  if (reason === 'non-positive-step') {
    return `Input: \`${prop}=${formatPropValue(value)}\` was ignored because numeric stepping requires a positive finite value. Use a positive number or \`step="any"\` to disable Arrow/Page stepping.`
  }

  return `Input: \`${prop}=${formatPropValue(value)}\` was ignored because it is not a finite number.`
}

const parseStep = (
  value: NumericAttributeValue | undefined,
): { value: number | undefined; issue?: NumericConstraintIssue } => {
  if (value === undefined) return { value: 1 }
  if (typeof value === 'string' && value.trim() === 'any') {
    return { value: undefined }
  }

  const parsed = parseFiniteNumericAttribute('step', value)
  if (parsed.issue || parsed.value === undefined) return parsed
  if (parsed.value <= 0) {
    return {
      value: undefined,
      issue: { prop: 'step', value, reason: 'non-positive-step' },
    }
  }

  return parsed
}

const parseFiniteNumericAttribute = (
  prop: NumericConstraintIssue['prop'],
  value: NumericAttributeValue | undefined,
): { value: number | undefined; issue?: NumericConstraintIssue } => {
  if (value === undefined) return { value: undefined }

  const parsed = parseFiniteNumber(value)
  if (parsed === undefined) {
    return {
      value: undefined,
      issue: { prop, value, reason: 'invalid-number' },
    }
  }

  return { value: parsed }
}

const parseFiniteNumber = (
  value: Exclude<NumericAttributeValue, undefined>,
) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined
  }

  const trimmed = value.trim()
  if (!DECIMAL_ATTRIBUTE_PATTERN.test(trimmed)) return undefined

  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : undefined
}

const formatPropValue = (value: Exclude<NumericAttributeValue, undefined>) => {
  return typeof value === 'string' ? `"${value}"` : `{${String(value)}}`
}
