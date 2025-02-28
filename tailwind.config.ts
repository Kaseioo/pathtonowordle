import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.{css,scss}"
  ],
  safelist: [
    'bg-class-S-gradient',
    'bg-class-Z-gradient',
    'bg-class-A-gradient',
    'bg-class-B-gradient',
    'bg-class-S-sinner',
    'bg-class-Z-sinner',
    'bg-class-A-sinner',
    'bg-class-B-sinner',
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
        "class-Z-sinner": "var(--class-Z-sinner)",
        "class-S-sinner": "var(--class-S-sinner)",
        "class-A-sinner": "var(--class-A-sinner)",
        "class-B-sinner": "var(--class-B-sinner)",
      },
      backgroundImage: {
        "s1n-gradient": "linear-gradient(to bottom right, #111, #161616)",
        "class-Z-gradient": "linear-gradient(to top, var(--class-Z-sinner) 0%, transparent 75%)",
        "class-S-gradient": "linear-gradient(to top, var(--class-S-sinner) 0%, transparent 75%)",
        "class-A-gradient": "linear-gradient(to top, var(--class-A-sinner) 0%, transparent 75%)",
        "class-B-gradient": "linear-gradient(to top, var(--class-B-sinner) 0%, transparent 75%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
