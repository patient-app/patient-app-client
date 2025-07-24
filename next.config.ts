import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "standalone",

  basePath: BASE_PATH,
  assetPrefix: BASE_PATH,
};

export default withFlowbiteReact(nextConfig);