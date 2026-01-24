/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.{html,js}",
    "./scripts/**/*.py"
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          yellow: '#FFB81C', // Standard brand yellow
          black: '#000000',
          dark: '#111111',
          light: '#F0F0F0',
        }
      },
      fontFamily: {
        industrial: ['Oswald', 'sans-serif'],
        machine: ['Chakra Petch', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #000',
        'brutal-lg': '8px 8px 0px 0px #000',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
