/** @type {import('next').NextConfig} */

const nextConfig = {
    async rewrites() {
        return {
            afterFiles: [
                {
                    source: '/:path*.xml', // Match any URL ending with .xml
                    destination: '/sitemap.xml',
                },
                {
                    source: '/:path*.txt',
                    destination: '/robots.txt',
                }
            ]
        }
    },
    images: {
        remotePatterns: [
            {
                protocol: process.env.IMAGES_REMOTE_PROTOCOL,
                hostname: process.env.IMAGES_REMOTE_HOST,
                port: process.env.IMAGES_REMOTE_PORT,
                pathname: process.env.IMAGES_REMOTE_PATH,
            },
        ],
    },
    experimental: {
        serverActions: {
            allowedOrigins: process.env.NEXT_PUBLIC_ALLOWED_ORIGINS.split(","),
        }
    }
};

export default nextConfig;
