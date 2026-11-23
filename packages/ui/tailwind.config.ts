import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "../../apps/app-one/**/*.{js,ts,jsx,tsx}",
    "../../apps/app-two/**/*.{js,ts,jsx,tsx}",
    "../**/src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        secondary: "#64748B",
        surface: "#FFFFFF",
        background: "#F8FAFC",
      },
    },
  },

  plugins: [],
};

export default config;