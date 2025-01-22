/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#16181E", 
        secondary: "#00B9AE",
      },
      animation: {
        'fade-right': 'fadeRight 0.3s ease-in-out forwards',
      },
     keyframes: {
  fadeRight: {
    '0%': {
      transform: 'translateX(0)',
      opacity: '0',
    },
    '30%': {
      transform: 'translateX(5px)', 
      opacity: '0.4',
    },
    '60%': {
      transform: 'translateX(10px)', 
      opacity: '0.7',
    },
    '100%': {
      transform: 'translateX(15px)', 
      opacity: '1',
    },
  },
},

    },
  },
  plugins: [],
};
