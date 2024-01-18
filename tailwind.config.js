/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dw: {
          // drawer bg
          500: "#1d1f25", // 500
          400: "#3e4554", // 400
          300: "#4c5366", // 300
          200: "#7e8baa", // 200
          100: "#efeff3",
        },
        "dw-t-1": {
          // drawer text
        },
        "dw-t-2": {
          // drawer title & icon
        },
        "dw-left-icon": {
          // drawer left icon & <sm icon color
        },
      },
    },
  },
  plugins: [],
};
