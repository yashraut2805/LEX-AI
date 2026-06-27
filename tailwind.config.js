/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        legal: {
          50: '#f4f7fb',
          100: '#e7eef7',
          200: '#c9daf0',
          300: '#9bbce3',
          400: '#6497d1',
          500: '#3f78b8',
          600: '#2e5e9b',
          700: '#264c7f',
          800: '#22416b',
          900: '#21385b',
          950: '#15243e',
        },
        navy: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
      },
      fontFamily: {
        sans: ['"Times New Roman"', 'Times', '"Times Roman"', 'Georgia', 'serif'],
        serif: ['"Times New Roman"', 'Times', '"Times Roman"', 'Georgia', 'serif'],
        mono: ['"Times New Roman"', 'Times', '"Times Roman"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'premium': '0 4px 30px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'premium-hover': '0 10px 40px rgba(0, 0, 0, 0.06), 0 2px 10px rgba(0, 0, 0, 0.03)',
        'dark-premium': '0 4px 30px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)',
        'dark-premium-hover': '0 10px 40px rgba(0, 0, 0, 0.5), 0 2px 10px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}
