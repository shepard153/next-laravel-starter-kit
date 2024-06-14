import { MetadataRoute } from "next";

type ChangeFrequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const restUrls = [
        {
            url: `${appUrl}/`, // Home Page
            lastModified: new Date(),
            priority: 1.0,
            changeFrequency: "weekly" as ChangeFrequency,
        },
        {
            url: `${appUrl}/login`, // Login Page
            lastModified: new Date(),
            priority: 0.8,
            changeFrequency: "monthly" as ChangeFrequency,
        },
        {
            url: `${appUrl}/register`, // Register Page
            lastModified: new Date(),
            priority: 0.8,
            changeFrequency: "monthly" as ChangeFrequency,
        },
        {
            url: `${appUrl}/request-email-verification`, // Request Email Verification Page
            lastModified: new Date(),
            priority: 0.8,
            changeFrequency: "monthly" as ChangeFrequency,
        },
        {
            url: `${appUrl}/verify-email`, // Verify Email Page
            lastModified: new Date(),
            priority: 0.8,
            changeFrequency: "monthly" as ChangeFrequency,
        },
        {
            url: `${appUrl}/forgot-password`, // Forgot Password Page
            lastModified: new Date(),
            priority: 0.8,
            changeFrequency: "monthly" as ChangeFrequency,
        },
        {
            url: `${appUrl}/password-reset`, // Password Reset Page
            lastModified: new Date(),
            priority: 0.8,
            changeFrequency: "monthly" as ChangeFrequency,
        },
        {
            url: `${appUrl}/profile`, // Profile Page
            lastModified: new Date(),
            priority: 0.8,
            changeFrequency: "monthly" as ChangeFrequency,
        }
    ];

    return [...restUrls];
}