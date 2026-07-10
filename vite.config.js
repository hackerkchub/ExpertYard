import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), "");

  console.log("==================================");
  console.log("VITE MODE :", mode);
  console.log("APP TYPE  :", env.VITE_APP_TYPE);
  console.log("APP NAME  :", env.VITE_APP_NAME);
  console.log("==================================");

  const vendorChunkGroups = [
    {
      name: "firebase-vendor",
      match: ["firebase"],
    },
    {
      name: "ui-vendor",
      match: [
        "styled-components",
        "framer-motion",
        "lucide-react",
        "react-icons",
        "react-hot-toast",
        "react-toastify",
        "sweetalert2",
      ],
    },
    {
      name: "realtime-vendor",
      match: ["socket.io-client", "uuid"],
    },
  ];

  const manualChunks = (id) => {
    if (!id.includes("node_modules")) return undefined;

    const matchedGroup = vendorChunkGroups.find((group) =>
      group.match.some((pkg) => id.includes(`/node_modules/${pkg}/`))
    );

    return matchedGroup?.name || "vendor";
  };

  const devRobotsPlugin = () => ({
    name: "g9experts-dev-robots",
    configureServer(server) {
      server.middlewares.use("/robots.txt", (_req, res) => {
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end("User-agent: *\nDisallow: /\n");
      });
    },
  });

  return {
    plugins: [react(), devRobotsPlugin()],

    build: {
      rollupOptions: {
        output: {
          manualChunks,
        },
      },
    },

    server: {
      proxy: {
        "/api": {
          target: "https://softmaxs.com",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});