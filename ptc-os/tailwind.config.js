/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ptc: {
          base03: '#000000', // Primary Background
          base02: '#161616', // Panel / Card Background
          base0:  '#ffffff', // Primary Typography
          yellow: '#f0c040', // Part Numbers / Accent
          orange: '#f97316', // Warnings
          green:  '#22c55e', // Positive Margins
          red:    '#ef4444', // Deficits / Loss
        }
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', '"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
