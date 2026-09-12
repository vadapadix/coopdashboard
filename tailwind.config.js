/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F111A",
        surface: "#1C1F2E",
        card: "#24283B",
        border: "#363C54",
        rkepk: {
          blue: "#2563EB",
          lightBlue: "#60A5FA",
          dark: "#141724"
        }
      }
    },
  },
  plugins: [],
}
