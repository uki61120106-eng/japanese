import type { NextConfig } from "next";

/** アプリごとの Service Worker（public/ 直下） */
const SERVICE_WORKERS = ["/workout-sw.js", "/rm-sw.js"];

const nextConfig: NextConfig = {
  async headers() {
    return SERVICE_WORKERS.map((source) => ({
      // Service Worker 自体はブラウザに保存させず、更新がすぐ届くようにする
      source,
      headers: [
        { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        { key: "Content-Type", value: "application/javascript; charset=utf-8" },
      ],
    }));
  },
};

export default nextConfig;
