import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-border": "var(--card-border)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        danger: "var(--danger)",
        "danger-hover": "var(--danger-hover)",
        "input-bg": "var(--input-bg)",
        "input-border": "var(--input-border)",
        "sidebar-bg": "var(--sidebar-bg)",
      },
    },
  },
  plugins: [],
};
export default config;
