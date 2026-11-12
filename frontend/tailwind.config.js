/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bone: "#F5EFE6",
        paper: "#FBF8F3",
        sand: "#E7DDCF",
        ink: {
          DEFAULT: "#1C1A17",
          soft: "#5C564D",
          muted: "#8C8479",
        },
        terracotta: {
          DEFAULT: "#C4532D",
          deep: "#9E3F20",
          soft: "#E88D6F",
          light: "#FBECE7",
        },
        saffron: {
          DEFAULT: "#E2A336",
          deep: "#B87F1E",
          light: "#FDF5E6",
        },
        sage: {
          DEFAULT: "#8FA58B",
          deep: "#5B7358",
          light: "#EFF4EE",
        },
        forest: {
          DEFAULT: "#22382E",
          deep: "#15241E",
          light: "#304D40",
        },
        roseclay: {
          DEFAULT: "#D9A79A",
          soft: "#F2D8D2",
        },
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        sans: ["Manrope", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        urdu: ["Noto Nastaliq Urdu", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        warm: "0 10px 30px -5px rgba(60, 35, 15, 0.08), 0 4px 12px -2px rgba(60, 35, 15, 0.04)",
        "warm-lg": "0 20px 45px -10px rgba(60, 35, 15, 0.12), 0 8px 20px -4px rgba(60, 35, 15, 0.06)",
        "warm-sm": "0 2px 8px rgba(60, 35, 15, 0.05)",
      },
      borderRadius: {
        card: "20px",
        pill: "999px",
      },
    },
  },
  plugins: [],
};
