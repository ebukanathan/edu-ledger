/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Compile the shared workspace package from source (it ships raw TS).
  transpilePackages: ['@eduledger/shared'],
  // Proxy `/api/*` to the backend during dev so the browser talks to one origin
  // (avoids CORS). In production, set NEXT_PUBLIC_API_URL to the real API host.
  async rewrites() {
    const apiUrl = process.env.BACKEND_URL ?? 'http://localhost:3000';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
