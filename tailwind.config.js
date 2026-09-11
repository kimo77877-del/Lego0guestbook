/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 브랜드 팔레트: 녹색 / 미색(크림) / 연노랑
        forest: {
          50: "#f2f7ee",
          100: "#e1eed7",
          200: "#c3ddb0",
          300: "#9ec680",
          400: "#79ad57",
          500: "#5c9139",
          600: "#47732c",
          700: "#385a24",
          800: "#2d481f",
          900: "#243a1b",
        },
        cream: {
          50: "#fffdf8",
          100: "#fdf8ec",
          200: "#faf0d6",
        },
        sunny: {
          100: "#fff6cf",
          200: "#ffedA0",
          300: "#ffe066",
          400: "#ffd23f",
        },
      },
      fontFamily: {
        rounded: ["'Baloo 2'", "'Jua'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        blob: "2.5rem",
      },
      boxShadow: {
        soft: "0 6px 20px rgba(72, 115, 44, 0.12)",
        card: "0 4px 14px rgba(72, 115, 44, 0.10)",
      },
    },
  },
  plugins: [],
};
