import type { NextConfig } from "next";
import { BACKEND_URL } from "./src/lib/backend-url";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // The browser calls /api/* on this origin and Next forwards it to the backend,
  // so the session cookie is same-origin and the backend needs no CORS.
  rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
