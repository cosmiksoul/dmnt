export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Hanken Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        paper: '#f3f4f1',
        surface: '#ffffff',
        line: { DEFAULT: '#e5e7e1', strong: '#d4d7cf' },
        ink: { DEFAULT: '#171a1e', soft: '#3a414a', muted: '#6b737d', faint: '#a3aab3' },
        accent: { DEFAULT: '#0c7d6f', bright: '#11a596', ink: '#06403a', wash: '#e4f3ef' },
        danger: { DEFAULT: '#c4452e', wash: '#fbe9e5' },
        warn: { DEFAULT: '#9c6b15', wash: '#f7eed9' },
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,19,23,.04), 0 14px 32px -20px rgba(16,19,23,.25)',
        pop: '0 10px 34px -12px rgba(16,19,23,.30)',
      },
    },
  },
  plugins: [],
}
