import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild", // Faster than terser
    target: "es2015", // Better compatibility
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          icons: ["react-icons"], // Separate chunk for icons
        },
        // Optimize for VM resources
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
      // Optimize for memory usage
      maxParallelFileOps: 2,
    },
    // Reduce memory usage
    chunkSizeWarningLimit: 1000,
  },
  // Optimize for VM environment
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
    exclude: ["react-icons"], // Exclude icons from dependency optimization
  },
  server: {
    proxy: {
      // Proxy TMDB requests via Vite dev server to avoid adblock/CORS issues
      "/tmdb": {
        target: "https://proxy-api-server-woz1.onrender.com/v1/tmdb/3",
        changeOrigin: true,
        rewrite: (pathStr) => pathStr.replace(/^\/tmdb/, ""),
        configure: (proxy, options) => {
          proxy.on("error", (err, req, res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, res) => {
            console.log("Sending Request to the Target:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, res) => {
            console.log(
              "Received Response from the Target:",
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },
    },
  },
});
