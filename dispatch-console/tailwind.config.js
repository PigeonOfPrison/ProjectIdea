/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#14213D',
          950: '#0D1730',
          900: '#14213D',
          800: '#1D2E4E',
          700: '#2B3F63',
        },
        parchment: {
          DEFAULT: '#F2EFE6',
          100: '#FBFAF6',
          200: '#F2EFE6',
          300: '#E7E2D3',
        },
        stamp: {
          DEFAULT: '#C1443C',
          light: '#DE685F',
          dark: '#9A332C',
        },
        dispatch: {
          DEFAULT: '#E3A857',
          light: '#EFC488',
          dark: '#B9822F',
        },
        signal: {
          DEFAULT: '#4C8C6B',
          light: '#6FAE8B',
          dark: '#396B50',
        },
        slate: {
          DEFAULT: '#5C6B7A',
          light: '#8494A2',
          dark: '#3E4A56',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      backgroundImage: {
        'manifest-lines':
          'repeating-linear-gradient(transparent, transparent 27px, rgba(20,33,61,0.06) 28px)',
      },
    },
  },
  plugins: [],
}
