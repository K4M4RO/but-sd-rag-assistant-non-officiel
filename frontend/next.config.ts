import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@huggingface/transformers", "onnxruntime-node"],
  outputFileTracingIncludes: {
    "/api/chat": ["./node_modules/onnxruntime-node/bin/napi-v6/linux/x64/**/*"],
  },
};

export default nextConfig;
