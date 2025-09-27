/** @type {import('next').NextConfig} */
const nextConfig = {
  // Votre configuration existante peut être ici
  experimental: {
    serverActions: {
      allowedOrigins: [],
    },
    esmExternals: 'loose',
  },
};

module.exports = nextConfig;
