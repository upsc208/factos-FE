import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker 이미지용: .next/standalone에 server.js와 필요한 node_modules만 모은다 (Dockerfile 참고)
  output: "standalone",
};

export default nextConfig;
