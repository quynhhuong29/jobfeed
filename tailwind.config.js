/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        white: "#fff",
        blue: "#1f86ef",
        indigo: "#564ab1",
        purple: "#766df4",
        pink: "#e83e8c",
        orange: "#f1734f",
        yellow: "#f7cc53",
        teal: "#050505",
        cyan: "#5fd0f3",
        black: "#000000",

        gray: {
          100: "#f8f9fa",
          200: "#f8f9fc",
          300: "#eff0f2",
          400: "#e2e5e8",
          500: "#adb5bd",
          600: "#74788d",
          700: "#495057",
          800: "#314047",
          900: "#212529",
        },
        green: {
          50: "#048565",
          100: "#02af741a",
          200: "#02af74",
          400: "#017d53",
        },
        yellow: {
          100: "#fdf5dd",
          400: "#947a32",
        },
        red: {
          100: "#da3746",
        },

        grayf4: "#F4F4F4",
        grayfc: "#FCFCFC",
        graye4: "#e4e4e4",
        gray80: "#808191",
        primaryText: "#11142D",
        primary: "#475BE8",
        secondary: "#2ED480",
      },
      spacing: {
        c10: "10px",
      },
    },
  },
  plugins: [],
};
