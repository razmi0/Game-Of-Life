/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dw: {
          // drawer bg
          500: "#1d1f25",
        },
        "dw-t-1": {
          // drawer text
          500: "#efeff3",
        },
        "dw-t-2": {
          // drawer title & icon
          500: "#4c5366",
        },
        "dw-left-icon": {
          // drawer left icon & <sm icon color
          500: "#7e8baa",
        },
      },
    },
  },
  plugins: [],
};
