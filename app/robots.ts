import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com";

    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/**/careers", "/**/careers/jobs/*"],
                disallow: [
                    "/**/edit",
                    "/**/preview",
                    "/**/jobs",
                    "/**/login",
                    "/api/*",
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
