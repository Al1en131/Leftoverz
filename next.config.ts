import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "backend-leftoverz-production.up.railway.app",
        pathname: "/uploads/**",
      },
    ],
  },
};


export default withFlowbiteReact(nextConfig);