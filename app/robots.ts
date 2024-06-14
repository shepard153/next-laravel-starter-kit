import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/api/',
        },
        sitemap: `${appUrl}/sitemap.xml`,
    }
}