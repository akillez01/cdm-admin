import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Base sempre na raiz para deploy no Plesk
  base: '/',

  server: {
    host: "::",
    port: 3000,
    strictPort: true,
    historyApiFallback: true, // Habilita o suporte para History API Fallback (roteamento SPA)
  },

  plugins: [
    react(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    // Garantir que o build seja otimizado para SPA
    ssrManifest: false,
  },
}));