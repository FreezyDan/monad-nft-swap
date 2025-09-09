// tailwind.config.cjs
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        foxPurple: "#3b1a4f",
        foxOrange: "#ff8a00",
        foxDark: "#0b0b0d",
        foxGray: "#bfbfbf"
      }
    }
  },
  plugins: [],
};
