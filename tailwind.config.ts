import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'bg-class-S-gradient',
    'bg-class-A-gradient',
    'bg-class-B-gradient',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Playfair Display"],
      },
      colors: {
        background: "black",
        foreground: "var(--foreground)",
        "s1n-border": "#2b2b2b",
        bloodred: "var(--bloodred)",
      },
      backgroundImage: {
        "s1n-gradient": "linear-gradient(to bottom right, #111, #161616)",
        "class-S-gradient": "linear-gradient(to bottom right, #b85cff99, #00000000)",
        "class-A-gradient": "linear-gradient(to bottom right, #ffad4499, #00000000)",
        "class-B-gradient": "linear-gradient(to bottom right, #43a3ff99, #00000000)",
      },
    },
  },
  plugins: [],
} satisfies Config;
