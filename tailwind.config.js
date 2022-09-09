/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0B846C",
        secondary: "#0E9D58",
        secondaryDark: "hsl(151,84%,27%)",
      },
    },
  },
  plugins: [],
};
