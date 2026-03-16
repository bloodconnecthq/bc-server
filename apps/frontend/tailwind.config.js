import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [
    heroui({
       layout: {
        radius: {
          small: "10px",
          medium: "10px",
          large: "10px",
        },
      },
      defaultTheme: "light",
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#005456",
              foreground: "#ffffff",
            },
            secondary: {
              DEFAULT: "#42B677",
              foreground: "#ffffff",
            },
            
          },
        },
      },
    }),
  ],
};

export default config;
