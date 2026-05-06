import type { Preview } from '@storybook/react-vite'
import { withThemeByDataAttribute } from '@storybook/addon-themes'

import '../src/styles'

const preview: Preview = {
  parameters: {
    backgrounds: { disable: true },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: {
        Default: 'default',
        Dark: 'dark',
        'Dark Red': 'dark-red',
        'White on Black': 'white-on-black',
      },
      defaultTheme: 'Default',
      attributeName: 'data-theme',
    }),
  ],
  tags: ['autodocs'],
}

export default preview
