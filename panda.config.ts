import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  preflight: true,
  outdir: "src/styled-system",
  include: ["./src/**/*.{js,jsx,ts,tsx}"],
  exclude: [],
  jsxFramework: "react",
  presets: ["@pandacss/preset-panda"],
  theme: {
    extend: {
      tokens: {
        colors: {
          brand: {
            50: { value: "#fef7ec" },
            100: { value: "#fde7c2" },
            200: { value: "#f9c56b" },
            300: { value: "#f4a53d" },
            400: { value: "#dd7d13" },
            500: { value: "#b95f00" },
            600: { value: "#8c4700" }
          },
          surface: {
            50: { value: "#fbf8f2" },
            100: { value: "#f2ece2" },
            200: { value: "#dfd5c6" },
            700: { value: "#4e4336" },
            900: { value: "#211c16" }
          }
        }
      },
      semanticTokens: {
        colors: {
          page: { value: "{colors.surface.50}" },
          panel: { value: "#fffcf7" },
          ink: { value: "{colors.surface.900}" },
          muted: { value: "{colors.surface.700}" },
          accent: { value: "{colors.brand.500}" }
        }
      }
    }
  },
  globalCss: {
    "html, body": {
      minHeight: "100%"
    },
    body: {
      margin: 0,
      background: "page",
      color: "ink",
      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    },
    "*": {
      boxSizing: "border-box"
    },
    a: {
      color: "inherit"
    }
  }
});
