import { cn } from '../cn'

test('cn util works', () => {
  expect(cn('foo', 'bar')).toBe('foo bar')
  expect(cn('foo', 'bar', 'baz')).toBe('foo bar baz')
  expect(cn('foo', 'bar', 'baz', 'qux')).toBe('foo bar baz qux')

  expect(cn(['foo', 'bar'])).toBe('foo bar')
  expect(cn(['foo', 'bar'], ['baz', 'qux'])).toBe('foo bar baz qux')
  expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz')
  expect(cn(['foo', 'bar'], ['baz', 'qux'], 'quux')).toBe(
    'foo bar baz qux quux',
  )

  expect(cn()).toBe('')
  expect(cn([])).toBe('')
  expect(cn([], [])).toBe('')
  expect(cn([], undefined, null, false)).toBe('')
  expect(cn('foo', undefined, null, false, 'bar', { test: 'test' })).toBe(
    'foo bar',
  )
})
