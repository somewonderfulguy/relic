# Testing conventions

- Test pure logic with Vitest unit tests next to the relevant source.
- Test component rendering and interactions with Storybook play functions.
  These run in Chromium through Vitest Browser Mode with Playwright.
- Prefer assertions on user-visible behavior over implementation details.

Run `pnpm test` for unit tests and `pnpm test:storybook` for component tests.
Run `pnpm test:coverage` for one combined report from both projects, written to
`coverage/`. Use coverage to find meaningful gaps; do not chase 100%.
