import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

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

export default defineConfig({
  plugins: [react()],
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
        target: "http://softmaxs.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
