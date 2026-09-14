// Mirrors next.config.ts's basePath so hardcoded /public asset paths
// (next/image with unoptimized:true, plain <video> tags) resolve correctly
// once this is deployed under github.io/pept-lab/ instead of at "/".
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
