import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#13381F",        // 주요 초록색
        accent: "#FC6215",         // 주황색 강조
        background: "#F8F5EA",     // 배경 크림색
        white: "#FFFFFF",
        black: "#000000",
      },
      fontFamily: {
        title: ["gigalypse", "sans-serif"],           // 제목용
        accent: ["jttkkumejeonryeong", "sans-serif"], // 강조용
        body: ["Nunito", "sans-serif"],               // 본문용
      },
      fontSize: {
        h1: ["3rem", { lineHeight: "1.2", fontWeight: "800" }],
        h2: ["2rem", { lineHeight: "1.3", fontWeight: "800" }],
        h3: ["1.5rem", { lineHeight: "1.4", fontWeight: "600" }],
        body: ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        sm: ["0.875rem", { lineHeight: "1.5" }],
      },
    },
  },
  plugins: [],
};

export default config;
