import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "FoodHub - Sistema de Pedidos de Comida",
        short_name: "FoodHub",
        description:
          "Sistema web para venda de refeições em restaurantes, com pedidos online e gestão de pratos.",
        theme_color: "#ea580c",
        background_color: "#f8fafc",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",

        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}"]
      },

      devOptions: {
        enabled: true
      }
    })
  ]
});