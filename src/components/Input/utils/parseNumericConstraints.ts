import type { ComponentProps } from 'react'

type NumericAttributeValue = ComponentProps<'input'>['min']

type NumericAttributeIssue = {
  prop: 'step' | 'min' | 'max'
  value: Exclude<NumericAttributeValue, undefined>
  reason: 'invalid-number' | 'non-positive-step'
}

type NumericRangeIssue = {
  prop: 'range'
  min: Exclude<NumericAttributeValue, undefined>
  max: Exclude<NumericAttributeValue, undefined>
  reason: 'min-greater-than-max'
}

export type NumericConstraintIssue = NumericAttributeIssue | NumericRangeIssue

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

  if (
    parsedMin.value !== undefined &&
    parsedMax.value !== undefined &&
    parsedMin.value > parsedMax.value
  ) {
    issues.push({
      prop: 'range',
      min: min ?? parsedMin.value,
      max: max ?? parsedMax.value,
      reason: 'min-greater-than-max',
    })

    return {
      step: parsedStep.value,
      min: undefined,
      max: undefined,
      issues,
    }
  }

  return {
    step: parsedStep.value,
    min: parsedMin.value,
    max: parsedMax.value,
    issues,
  }
}

export const formatNumericConstraintWarning = (
  issue: NumericConstraintIssue,
) => {
  if (issue.reason === 'min-greater-than-max') {
    return `Input: \`min=${formatPropValue(issue.min)}\` and \`max=${formatPropValue(issue.max)}\` were ignored because \`min\` is greater than \`max\`.`
  }

  if (issue.reason === 'non-positive-step') {
    return `Input: \`${issue.prop}=${formatPropValue(issue.value)}\` was ignored because numeric stepping requires a positive finite value. Use a positive number or \`step="any"\` to disable Arrow/Page stepping.`
  }

  return `Input: \`${issue.prop}=${formatPropValue(issue.value)}\` was ignored because it is not a finite number.`
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
  prop: NumericAttributeIssue['prop'],
  value: NumericAttributeValue | undefined,
): { value: number | undefined; issue?: NumericAttributeIssue } => {
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
