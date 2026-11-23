import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@company/post",
    "@company/ui",
    "@company/models",
    "@company/api",
  ],
  turbopack: {
    root: path.join(__dirname, '../../'),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
