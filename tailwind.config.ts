import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        // Custom colors for the futuristic theme
        "deep-black": "var(--deep-black)",
        "dark-gray": "var(--dark-gray)",
        "neon-cyan": "var(--neon-cyan)",
        "glass-white": "var(--glass-white)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
        inter: ["Inter", "sans-serif"],
        "jetbrains-mono": ["JetBrains Mono", "monospace"],
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "rotate-slow": "rotate-slow 20s linear infinite",
        morph: "morph 8s ease-in-out infinite",
        "particle-float": "particle-float 4s infinite ease-in-out",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        float: {
          "0%, 100%": { 
            transform: "translateY(0px) rotateX(0deg)" 
          },
          "50%": { 
            transform: "translateY(-20px) rotateX(10deg)" 
          },
        },
        glow: {
          from: { 
            boxShadow: "0 0 20px hsla(180, 100%, 50%, 0.3)" 
          },
          to: { 
            boxShadow: "0 0 40px hsla(180, 100%, 50%, 0.8)" 
          },
        },
        morph: {
          "0%, 100%": { 
            borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" 
          },
          "25%": { 
            borderRadius: "50% 50% 20% 80% / 25% 75% 25% 75%" 
          },
          "50%": { 
            borderRadius: "80% 20% 50% 50% / 75% 25% 75% 25%" 
          },
          "75%": { 
            borderRadius: "20% 80% 80% 20% / 70% 70% 30% 30%" 
          },
        },
        "rotate-slow": {
          from: {
            transform: "rotate(0deg)",
          },
          to: {
            transform: "rotate(360deg)",
          },
        },
        "particle-float": {
          "0%, 100%": {
            transform: "translateY(0px) translateX(0px)",
            opacity: "0.6",
          },
          "33%": {
            transform: "translateY(-20px) translateX(10px)",
            opacity: "1",
          },
          "66%": {
            transform: "translateY(-10px) translateX(-10px)",
            opacity: "0.8",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
