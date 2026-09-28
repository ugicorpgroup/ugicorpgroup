/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      { protocol: "http", hostname: "127.0.0.1", port: "1337", pathname: "/uploads/**" },
      { protocol: "http", hostname: "localhost", port: "1337", pathname: "/uploads/**" },
      { protocol: "https", hostname: "**.up.railway.app", pathname: "/uploads/**" },
    ],
  },
};

export default nextConfig;
