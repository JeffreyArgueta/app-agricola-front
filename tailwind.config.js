/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta agro empresarial
        brand: {
          DEFAULT: '#1b5e20',
          dark: '#144a18',
          light: '#e8f5e9',
          muted: '#f1f8e9',
        },
        earth: {
          DEFAULT: '#795548',
          light: '#efebe9',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f7f5ef',
        },
        border: {
          DEFAULT: '#e5e0d3',
        },
        text: {
          primary: '#1a2e1f',
          secondary: '#5f6f60',
        },
        danger: '#b3261e',
        'danger-muted': '#fdecea',
        warning: '#8a6100',
        'warning-muted': '#fff8e1',
        success: '#1b5e20',
        'success-muted': '#e8f5e9',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      borderRadius: { DEFAULT: '8px' },
      boxShadow: {
        card: '0 1px 2px rgba(26, 46, 31, 0.06), 0 4px 16px rgba(26, 46, 31, 0.08)',
      },
    },
  },
  plugins: [],
};
