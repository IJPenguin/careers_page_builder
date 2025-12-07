import { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com";
    const currentDate = new Date();

    try {
        // Get all companies
        const companies = await prisma.company.findMany({
            select: {
                slug: true,
                updatedAt: true,
            },
        });

        // Get all jobs
        const jobs = await prisma.job.findMany({
            select: {
                jobSlug: true,
                updatedAt: true,
                company: {
                    select: {
                        slug: true,
                    },
                },
            },
        });

        // Build sitemap entries
        const sitemapEntries: MetadataRoute.Sitemap = [];

        // Add homepage
        sitemapEntries.push({
            url: baseUrl,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 1.0,
        });

        // Add company careers pages
        for (const company of companies) {
            sitemapEntries.push({
                url: `${baseUrl}/${company.slug}/careers`,
                lastModified: company.updatedAt,
                changeFrequency: "weekly",
                priority: 0.9,
            });
        }

        // Add individual job pages
        for (const job of jobs) {
            sitemapEntries.push({
                url: `${baseUrl}/${job.company.slug}/careers/jobs/${job.jobSlug}`,
                lastModified: job.updatedAt,
                changeFrequency: "weekly",
                priority: 0.8,
            });
        }

        return sitemapEntries;
    } catch (error) {
        console.error("Sitemap generation error:", error);
        return [
            {
                url: baseUrl,
                lastModified: currentDate,
                changeFrequency: "monthly",
                priority: 1.0,
            },
        ];
    }
}
