import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        basalt:           'var(--basalt)',
        'basalt-mid':     'var(--basalt-mid)',
        'basalt-raised':  'var(--basalt-raised)',
        'basalt-edge':    'var(--basalt-edge)',
        'lapis-deep':     'var(--lapis-deep)',
        lapis:            'var(--lapis)',
        'lapis-mid':      'var(--lapis-mid)',
        'lapis-bright':   'var(--lapis-bright)',
        moon:             'var(--moon)',
        'moon-bright':    'var(--moon-bright)',
        'moon-dim':       'var(--moon-dim)',
        muted:            'var(--muted)',
        faint:            'var(--faint)',
        papyrus:          'var(--papyrus)',
        'papyrus-dark':   'var(--papyrus-dark)',
      },
      fontFamily: {
        cinzel:  ['Cinzel', 'serif'],
        crimson: ['Crimson Pro', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
