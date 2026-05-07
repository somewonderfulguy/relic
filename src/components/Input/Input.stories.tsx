import type { Meta, StoryObj } from '@storybook/react-vite'

import { Input } from './Input'

/** A low-level text input primitive with sensible defaults, hardened numeric handling, and familiar native semantics. */
const meta: Meta = {
  title: 'Input',
  component: Input,
  args: {
    disabled: false,
  },
}

export default meta
type Story = StoryObj<typeof Input>

/** Renders a plain text input. When `type` is omitted, the component defaults to `text`. */
export const Default: Story = {}

/** A `placeholder` hints at the expected value without pre-filling the field. It disappears as soon as the user starts typing and is never submitted with the form. */
export const Placeholder: Story = {
  args: {
    placeholder: 'Enter your name',
  },
}

/** Native `type="number"` is notoriously problematic. It accepts characters such as `e`, `+`, and `-`, permits scientific notation like `+12-.2e7`, and ships with inconsistent browser UI.<br />
 * For background, see <a href="https://stackoverflow.blog/2022/12/26/why-the-number-input-is-the-worst-input/" rel="noopener noreferrer nofollow" target="_blank">Why the number input is the worst input</a>.<br />
 * `Input` transparently substitutes a hardened text field: the mobile keyboard stays numeric, pasted content is sanitized, and only digits are accepted by default.
 */
export const TypeNumber: Story = {
  args: {
    type: 'number',
  },
}

/** Enables decimals via `inputMode="decimal"`. Both `.` and `,` are accepted as the decimal separator, but only the first one typed is preserved. Additional separators are silently stripped. */
export const TypeNumberDecimal: Story = {
  args: {
    type: 'number',
    inputMode: 'decimal',
  },
}

/** `min`, `max`, and `step` are fully supported. When `min` is negative, the minus sign becomes typeable as the first character. `step` is honored by keyboard arrow keys even though the native spinner UI is suppressed. */
export const TypeNumberWithConstraints: Story = {
  args: {
    type: 'number',
    min: -100,
    max: 1200,
    step: 100,
  },
}

/** Override `pattern` to cap decimal precision. Here we permit at most three digits after the separator — suitable for thousandths such as weights or currency sub-units. */
export const TypeNumberPrecision: Story = {
  args: {
    type: 'number',
    inputMode: 'decimal',
    pattern: '[0-9]+([.,][0-9]{0,3})?',
  },
}

/** `type="email"` applies browser-native email validation on submit and surfaces an email-optimized keyboard on mobile devices. */
export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'name@example.com',
  },
}

/** `type="url"` validates URLs on submit and shows a URL-optimized keyboard on mobile. */
export const URL: Story = {
  args: {
    type: 'url',
    placeholder: 'https://example.com',
  },
}

/** `type="tel"` is intended for phone numbers. Format validation is intentionally skipped — phone conventions vary globally — but mobile devices render a dial-pad keyboard. */
export const Tel: Story = {
  args: {
    type: 'tel',
    placeholder: '+1 555 0100',
  },
}

/** `type="password"` masks the typed value. Password managers integrate automatically and browser autofill is respected. */
export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
  },
}

/** `type="search"` renders a search-optimized input with a native clear affordance that appears while the field has a value. */
export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
  },
}

/** Supplying a custom `pattern` restricts accepted characters. Input outside the pattern is silently rejected while the user types or pastes, mirroring the behavior used internally for numeric inputs. */
export const CustomPattern: Story = {
  args: {
    pattern: '[a-z]*',
    placeholder: 'Lowercase letters only',
  },
}

/** `required` marks the field as mandatory for form submission. The browser blocks submission and surfaces a native validation message when the field is left empty. */
export const Required: Story = {
  args: {
    required: true,
    placeholder: 'This field is required',
  },
}

/** `readOnly` displays a value but prevents edits. The field remains focusable and its value is submitted with the form. */
export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: 'Cannot be edited',
  },
}

/** `disabled` visually mutes the field and prevents focus, interaction, and form submission of its value. */
export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'Disabled value',
  },
}
