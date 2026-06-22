import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@huggingface/transformers", "onnxruntime-node"],
  outputFileTracingIncludes: {
    "/api/chat": ["./node_modules/onnxruntime-node/bin/**/*"],
  },
};

export default nextConfig;
