import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const ASSET_PREFIX = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "standalone",
  assetPrefix: ASSET_PREFIX,
};

export default withFlowbiteReact(nextConfig);