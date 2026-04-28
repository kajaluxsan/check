/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Prevent the page from being framed (clickjacking)
          { key: "X-Frame-Options", value: "DENY" },
          // Disable MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Restrict referrer info sent on outbound links
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Disallow potentially abused browser features by default
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
          },
          // Force HTTPS once first served (only relevant in production over HTTPS)
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
