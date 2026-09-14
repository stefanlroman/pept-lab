import type { NextConfig } from "next";

// GitHub Pages serves this repo at username.github.io/pept-lab/, not at
// the domain root, so the build needs a base path — but only in CI
// (GITHUB_ACTIONS is set there), never for local dev/preview.
const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const repoName = "pept-lab";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: isGithubActions ? `/${repoName}` : "",
  assetPrefix: isGithubActions ? `/${repoName}/` : "",
};

export default nextConfig;
