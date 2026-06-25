import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          DEFAULT: '#FF6A3D',
          600: '#F25A2C',
        },
        sea: {
          DEFAULT: '#11607A',
          700: '#0E4456',
        },
        ink: '#0A2A36',
        sand: '#FBF6EE',
        sand2: '#F4ECDF',
        surface: '#F8FAFB',
        free: '#1FB877',
        muted: '#45626C',
        subtle: '#5C7681',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        ping2: {
          '0%': { transform: 'scale(1)', opacity: '0.5' },
          '80%, 100%': { transform: 'scale(2.6)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        float2: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(9px)' },
        },
        spin2: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        ping2: 'ping2 1.8s ease-out infinite',
        float: 'float 6s ease-in-out infinite',
        float2: 'float2 5s ease-in-out infinite',
        float3: 'float 7s ease-in-out infinite',
        spin2: 'spin2 0.7s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
