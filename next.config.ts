import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bcchkxzaxkyeowxhpepk.supabase.co", 
      },
    ],
  },
}
export default nextConfig;
