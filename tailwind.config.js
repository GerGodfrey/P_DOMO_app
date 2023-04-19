/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pink1: "#EE2A7B",
        green1: "#1FE72E",
        white1: "#FFFFFF",
        rgbaGrey:'rgba(255, 255, 255, 0.50)',
        pink2:'#F986B7',
        rgbaBlack:'rgba(0, 0, 0, 0.7)',
        background: '#1E2022'

      },
      backgroundImage: {
        gradientGray: 'linear-gradient(180deg, rgba(64, 67, 71, 0.74) 0%, rgba(30, 32, 34, 0.74) 100%)',
        gradientPink: 'linear-gradient(0deg, rgba(238, 42, 123, 0.15) 0%, rgba(244, 244, 244, 0.15) 100%, rgba(0, 0, 0, 0.15) 100%)',
        gradientPink2: 'linear-gradient(0deg, rgba(249, 134, 183, 0.41) 0%, rgba(43, 38, 43, 0.41) 62%, rgba(30, 32, 34, 0.41) 72%, rgba(30, 32, 34, 0.41) 99%, rgba(30, 32, 34, 0.41) 100%, rgba(6, 3, 5, 0.41) 100%, rgba(0, 0, 0, 0.41) 100%)',
        gradientGray2:'linear-gradient(180deg, #404347 0%, #1E2022 100%)',
        imgDaap:'url(/assets/search.png)',
      },

      boxShadow: {
        '13xl':'inset 0 3px 13px 0 rgba(255, 255, 255, 0.50)' 
      },

      fontFamily: {
        montserrat: ["Montserrat", 'sans-serif'],
      },
      height:{
        nav:{

        }
      }
    },
    screens: {
      sm: "800px",
      md: "1120px",
    },
  },
  plugins: [],
}
