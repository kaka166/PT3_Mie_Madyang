
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

  allowedDevOrigins: ["192.168.56.1"], // biar warning hilang
};

export default nextConfig;
