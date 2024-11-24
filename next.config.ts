/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uwja77bygk2kgfqe.public.blob.vercel-storage.com',
        port: '', // Leave blank if no specific port is required
        pathname: '/**', // Allows all paths from this hostname
      },
    ],
  },
};

module.exports = nextConfig;