/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Export as static HTML/CSS/JS for GitHub Pages
  trailingSlash: true, // Add trailing slashes to URLs for GitHub Pages
  images: {
    unoptimized: true, // Required for GitHub Pages
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  },
};

module.exports = nextConfig;