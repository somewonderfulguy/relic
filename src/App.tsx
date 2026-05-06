import { Button } from '@/components'

const themes = ['yellow', 'dark', 'dark-red', 'white-on-black'] as const

export const App = () => (
  <div>
    <select
      defaultValue="yellow"
      onChange={(e) => {
        document.documentElement.setAttribute('data-theme', e.target.value)
      }}
    >
      {themes.map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
    <Button>Button</Button>
  </div>
)
