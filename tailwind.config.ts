import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        forge: {
          bg: "#0B0D11",
          surface: "#12161F",
          elevated: "#181E2A",
          border: "rgba(255, 255, 255, 0.08)",
          borderHover: "rgba(249, 115, 22, 0.4)",
          ember: "#F97316",
          emberDark: "#C2410C",
          emberLight: "#FB923C",
          emberGlow: "rgba(249, 115, 22, 0.15)",
          spark: "#8B5CF6",    // Spark Coordinator (Violet)
          scout: "#06B6D4",    // Scout Research (Cyan)
          judge: "#F59E0B",    // Judge Analyst & Critic (Amber)
          smith: "#10B981",    // Smith Planner (Emerald)
          trail: "#6366F1",    // Trail Tracker (Indigo)
        },
      },
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      animation: {
        "pulse-subtle": "pulseSubtle 4s ease-in-out infinite",
        "glow-ember": "glowEmber 3s ease-in-out infinite",
      },
      keyframes: {
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        glowEmber: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(249, 115, 22, 0.2)" },
          "50%": { boxShadow: "0 0 30px rgba(249, 115, 22, 0.45)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
