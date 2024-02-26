/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "worker-little-field-096a.artrei-dev.workers.dev",
      "replicate.delivery",
      "res.cloudinary.com",
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/posts",
        destination: "https://dating-app-server-m0vj.onrender.com/api/v1/posts",
      },
      {
        source: "/api/v1/posts/:id",
        destination:
          "https://dating-app-server-m0vj.onrender.com/api/v1/posts/:id",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/launch",
        destination: "https://twitter.com/steventey/status/1616505632001232896",
        permanent: false,
      },
      {
        source: "/github",
        destination: "https://github.com/artreimus/dating-app-client",
        permanent: false,
      },
      {
        source: "/deploy",
        destination: "https://vercel.com/templates/next.js",
        permanent: false,
      },
      {
        source: "/p",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
