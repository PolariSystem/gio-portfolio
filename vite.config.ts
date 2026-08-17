import { defineConfig, type Plugin } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function figmaAssetResolver(): Plugin {
  return {
    name: "figma-asset-resolver",

    resolveId(id: string) {
      if (id.startsWith("figma:asset/")) {
        const filename = id.replace("figma:asset/", "");

        return path.resolve(__dirname, "src/assets", filename);
      }

      return null;
    },
  };
}

export default defineConfig({
  plugins: [figmaAssetResolver(), react(), tailwindcss()],

  // GitHub Pages project repository
  base: "/gio-portfolio/",

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  assetsInclude: ["**/*.svg", "**/*.csv"],

  build: {
    outDir: "docs",
    emptyOutDir: true,

    // recharts lands in its own async chunk on its own (it is only reached
    // through a dynamic import). Pinning the always-needed runtime into stable
    // vendor chunks means a copy edit no longer invalidates react/gsap in the
    // visitor's cache.
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-motion": ["gsap", "lenis"],
        },
      },
    },

    // Everything above 4 kB stays a separate request instead of being inlined
    // as base64 (which costs ~33% and blocks the JS parse).
    assetsInlineLimit: 4096,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 600,
  },
});
