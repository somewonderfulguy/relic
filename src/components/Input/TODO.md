What does bubbles do? event.currentTarget.dispatchEvent(new Event('input', { bubbles: true }))
What is "FP artifacts"?
Need an explanation what does this line do:`const parsed = parseFloat(value.replace(',', '.'))`

Learn about tests in Storybook. Do they have coverage?

Learn about these and add/fill in:
AGENTS.md
SKILLS.md
CLAUDE.md
other...md...?

# Input Functionality TODO

Focus order: functionality first, styles later.

This file tracks what to read, decide, test, and fix before treating `Input` as
a production-grade design-system primitive. Styling, sizes, and visual states are
intentionally listed as later work unless they affect behavior or accessibility.

## Read First

- `Input.tsx` - public props, event ordering, numeric-mode adapter.
- `utils/sanitizeNumericValue.ts` - typing and paste cleanup.
- `utils/getNumericPattern.ts` - pattern generation for numeric mode.
- `utils/numericStepping.ts` - Arrow/Page/Home/End behavior.
- `__tests__/*.test.ts` - pure utility coverage.
- `Input.stories.tsx` - browser-level behavior checks and docs copy.

## Current Behavior Snapshot

- Non-number inputs pass native input behavior through.
- `type="number"` renders a DOM `type="text"` input to avoid native number
  quirks.
- Numeric mode defaults `inputMode` to `numeric`.
- Decimal mode is opt-in with `inputMode="decimal"`.
- Numeric input is sanitized in `onChange`.
- ArrowUp/ArrowDown step by `step`.
- PageUp/PageDown step by `step * 10`.
- Home/End jump to `min`/`max` when present.
- Negative values are allowed when `min < 0`, or when `allowNegative` is true
  and `min` is absent.
- The known controlled-input stepping bug is fixed by using the native
  prototype value setter before dispatching an `input` event.

## Priority 1 - Numeric Correctness

- [x] Decide and fix user `onKeyDown` ordering.
  - Decision: call the user's `onKeyDown` first, then step only if
    `event.defaultPrevented` is still false.
  - Storybook regression: `TypeNumberPreventStepping` proves consumers can
    prevent one step key while leaving the rest of the numeric behavior intact.

- [x] Normalize `step`, `min`, and `max` parsing.
  - Decision:
    - missing `step` means `1`;
    - `step="any"` disables Arrow/Page stepping but still allows Home/End;
    - `step <= 0`, invalid, `NaN`, or non-finite step disables Arrow/Page
      stepping and warns in development;
    - invalid `min`/`max` are treated as absent and warn in development;
    - empty strings are invalid, not accidental zeroes.
  - Pure parser: `parseNumericConstraints`.
  - Storybook regressions: `TypeNumberStepAny` and
    `TypeNumberInvalidConstraints`.

- [x] Decide `min > max` behavior.
  - Decision: treat it as an invalid constraint set, warn in development, and
    skip range clamping/validation until the constraint is fixed.
  - `step` remains usable, but parsed `min`/`max` are absent, so Home/End do not
    jump to contradictory bounds.
  - Storybook regression: `TypeNumberInvalidRange`.

- [x] Pass `min`, `max`, and `step` back to the DOM input intentionally.
  - Shipped behavior: the raw prop values are explicitly rendered as DOM
    attributes as well as being used by the numeric logic.
  - Note: because numeric mode renders `type="text"`, these attributes will not
    provide native range validation, but they are useful for devtools,
    inspection, and future a11y work.

- [ ] Decide typed-value behavior for `min`/`max`.
  - Current behavior: stepping clamps to `min`/`max`, but manual typing can
    exceed the range.
  - Native `type="number"` validates range, but this component renders text, so
    native range validation is lost.
  - Options:
    - clamp on blur;
    - set custom validity for out-of-range values;
    - leave it as caller-owned validation and document that `min`/`max` only
      affect stepping.
  - This needs an explicit decision before calling `min`/`max` "fully
    supported."

- [ ] Decide decimal separator behavior during stepping.
  - Current behavior: typed comma values are parsed, but stepped output is
    normalized to a dot.
  - Decide whether `1,5` stepped by `0.5` should become `2`, `2.0`, or preserve
    comma formatting when applicable.

- [ ] Align numeric pattern with sanitized values.
  - Current sanitizer allows intermediate/final values such as `.5`, `100.`,
    `-.5`, and `-`.
  - Current decimal pattern requires digits around the separator:
    `[0-9]+([.,][0-9]+)?`.
  - Decide whether the pattern should validate only final submit-ready values,
    or allow the same values the sanitizer allows.

## Priority 2 - API And Semantics

- [ ] Decide whether numeric mode should expose spinbutton semantics.
  - Current rendered role is textbox.
  - Keyboard behavior borrows from the WAI-ARIA spinbutton pattern.
  - If using `role="spinbutton"`, also design `aria-valuemin`,
    `aria-valuemax`, `aria-valuenow`, and behavior for partial values like
    `-`, `.`, or `1.`.
  - If keeping textbox semantics, update docs so they do not imply full
    spinbutton semantics.

- [ ] Verify ref behavior under React 19.
  - Confirm whether `ref` works as expected through the current function
    component shape.
  - If not, add the smallest supported ref-forwarding pattern for this stack.
  - Add a small test or story harness if the behavior is easy to cover.

- [ ] Decide where invalid/error state belongs.
  - Functionality-first recommendation: keep `Input` low-level and let native
    `aria-invalid`, `aria-describedby`, `required`, and `pattern` pass through.
  - Defer label, description, and error-message layout to a future `FormField`.

- [ ] Decide whether `Input` should ever sanitize non-number values.
  - Current implementation only sanitizes numeric mode.
  - Current `CustomPattern` story copy implies arbitrary `pattern` input is
    silently rejected while typing. That is not true today.
  - Recommended behavior: do not implement arbitrary regex sanitization in
    `Input`; fix the story copy instead.

- [ ] Decide whether custom numeric `pattern` should actively restrict typing.
  - Current `TypeNumberPrecision` story implies the pattern caps decimal
    precision.
  - In reality, pattern affects validity, not sanitization.
  - Recommended behavior: either fix the docs copy, or add a separate explicit
    prop for precision if live enforcement is wanted.

- [ ] Decide browser autofill and autocomplete expectations.
  - Non-number inputs should preserve native behavior.
  - Numeric text-substitute mode should not interfere with standard
    `name`, `autoComplete`, `required`, `disabled`, `readOnly`, or form
    submission behavior.

## Priority 3 - Caret, Editing, And Input Events

- [x] Preserve caret position when sanitizing. Fixed 2026-09-21.
  - Current `event.currentTarget.value = sanitizedValue` likely moves the caret
    to the end after invalid characters are removed.
  - High-quality behavior: typing or pasting in the middle of the value should
    keep the caret as close as possible to the user's intended edit point.
  - Shipped behavior: no-op sanitization no longer writes `.value` at all, and
    sanitizing changes restore the selection by mapping both selection edges
    through the sanitizer.

- [ ] Test paste behavior directly.
  - Unit tests cover sanitizer output.
  - Add Storybook play coverage for paste into numeric and decimal inputs.

- [ ] Consider composition/IME behavior.
  - Sanitizing every `onChange` may interact poorly with composition events.
  - Numeric fields are less IME-heavy than free text, but the behavior should be
    consciously tested or documented.

- [ ] Decide whether to prevent invalid input before it lands.
  - Current approach sanitizes after the change.
  - Alternative: use `beforeinput` for numeric mode to block invalid insertions.
  - If attempted, make sure paste, undo, mobile keyboards, and assistive tech
    are not harmed.

## Priority 4 - Tests To Add

- [ ] Story: controlled numeric input with ArrowUp/ArrowDown updates React
      state and does not snap back.
- [x] Story: consumer `onKeyDown` can prevent internal stepping.
- [x] Story: `step="any"` does not write `NaN`.
- [x] Story: invalid `step`/`min`/`max` does not write `NaN`.
- [ ] Story: manual out-of-range value behavior matches the chosen `min`/`max`
      decision.
- [ ] Story: decimal separator behavior during stepping matches the chosen
      decision.
- [ ] Story: paste sanitization in integer and decimal modes.
- [x] Unit: parsing/normalization helpers for `step`, `min`, and `max`.
- [ ] Unit: `stepNumericValue` behavior for decimal precision and edge cases.
- [ ] Type-level check: `allowNegative` is rejected for non-number input types.

## Docs And Story Cleanup

- [ ] Fix `CustomPattern` story wording. Pattern does not currently sanitize
      arbitrary text input.
- [ ] Fix `TypeNumberPrecision` story wording or implement explicit precision
      enforcement.
- [ ] Update `TypeNumberWithConstraints` wording after the `min`/`max` manual
      typing decision.
- [ ] Make the numeric semantics explicit: this is a text-backed numeric input,
      not a native `input[type=number]`.
- [ ] Keep Storybook a11y exceptions narrow. The meta-level label rule is
      disabled for isolated stories, but real form examples should use labels.

## Later - Styling Phase

- [ ] Add `Input.module.css`.
- [ ] Add size variants matching Button: `small`, `medium`, `large`.
- [ ] Add visual states: focus, hover, disabled, readOnly, invalid.
- [ ] Add `FormField` or equivalent composition for label, description, and
      error message.
- [ ] Add visual Storybook coverage across all themes.

## Recommended First Mini-PR

Keep the first functional pass small:

1. Swap `onKeyDown` ordering so consumers can prevent stepping.
2. Add safe parsing for `step`, `min`, and `max`.
3. Handle `step="any"` and invalid numeric constraints without writing `NaN`.
4. Pass `min`, `max`, and `step` through to the DOM input.
5. Fix misleading `CustomPattern` and `TypeNumberPrecision` story copy.
6. Add Storybook play tests for the changed behavior.

That would close the highest-risk behavior gaps without mixing in visual design.
