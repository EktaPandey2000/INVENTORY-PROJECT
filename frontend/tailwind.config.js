/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sage: { 50:'#f4f7f5',100:'#e3ebe5',200:'#c7d7cb',300:'#a3bfaa',400:'#7c9d96',500:'#5d8177',600:'#48665e',700:'#3a524c',800:'#2f423e',900:'#273733' },
        sand: { 50:'#faf8f3',100:'#f3eee2',200:'#e7ddc5',300:'#d6c6a3',400:'#c2a97d',500:'#b0905f',600:'#96754c',700:'#7a5d3f',800:'#654e37',900:'#544130' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      boxShadow: { soft: '0 4px 20px -4px rgba(0,0,0,0.06)' },
    },
  },
  plugins: [],
}