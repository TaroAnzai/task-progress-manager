/** @type {import('tailwindcss').Config} */
export default {
  content: [
    ".index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ✅ Reactの全ファイルが対象
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

