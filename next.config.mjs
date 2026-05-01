/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["three"],
  // In dev, disable webpack persistent cache to avoid broken `.next` states when
  // iCloud sync or other tools touch files during `next dev`
  // (symptom: 404 on /_next/static/chunks/*.js and missing CSS).
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
