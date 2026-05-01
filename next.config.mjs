/** @type {import('next').NextConfig} */
const nextConfig = {
  // En dev, desactivar caché persistente de webpack evita estados rotos en `.next`
  // cuando Sync/iCloud u otras herramientas tocan archivos durante `next dev`
  // (síntoma: 404 en /_next/static/chunks/*.js y CSS sin cargar).
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
