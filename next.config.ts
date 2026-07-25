import type { NextConfig } from "next";

/**
 * Atlas ships as a fully static site to GitHub Pages.
 *
 * PAGES_BASE is empty locally (so dev runs at "/") and "/atlas" in CI, where the
 * site is served from https://deadalus5.github.io/atlas/. basePath handles both
 * routing and asset prefixing, so assetPrefix must NOT also be set.
 */
const basePath = process.env.PAGES_BASE ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // GitHub Pages serves directories, so every route needs its own index.html.
  trailingSlash: true,
  // There is no Image Optimization server on a static host.
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
