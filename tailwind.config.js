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
          150: "#b3b3b7", // 150
          100: "#efeff3",
        },
      },
      fontSize: {
        "2xs": "0.625rem",
        "3xs": "0.5rem",
      },
    },
  },
  plugins: [],
};
