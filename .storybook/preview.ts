import type { Preview } from '@storybook/react-vite'
import { withThemeByDataAttribute } from '@storybook/addon-themes'

import '../src/styles'

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ['Welcome', 'Theming', '*'],
      },
    },
    backgrounds: { disable: true },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: 'error',
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: {
        Yellow: 'yellow',
        Dark: 'dark',
        'Dark Red': 'dark-red',
        'White on Black': 'white-on-black',
      },
      defaultTheme: 'Yellow',
      attributeName: 'data-theme',
    }),
  ],
  tags: ['autodocs'],
}

export default preview
