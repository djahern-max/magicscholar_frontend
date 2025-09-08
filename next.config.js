/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable standalone mode for Docker
    output: 'standalone',

    images: {
        domains: [
            'localhost',
            'magicscholar-images.nyc3.cdn.digitaloceanspaces.com',
            'magicscholar-images.nyc3.digitaloceanspaces.com',
            'www.magicscholar.com'
        ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'magicscholar-images.nyc3.cdn.digitaloceanspaces.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'magicscholar-images.nyc3.digitaloceanspaces.com',
                port: '',
                pathname: '/**',
            }
        ],
    },

    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
            },
        ]
    },

    env: {
        CUSTOM_KEY: process.env.CUSTOM_KEY,
    },
}

module.exports = nextConfig