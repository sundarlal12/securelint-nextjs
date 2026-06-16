import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Hide the dev "N" badge overlay that sits on top of the page in `next dev` */
  devIndicators: false,
  /* Static export — outputs flat HTML/CSS/JS to out/ for Netlify static hosting.
     API routes are replaced by netlify/functions/ (see netlify.toml). */
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
