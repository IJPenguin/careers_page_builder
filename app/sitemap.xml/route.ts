import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
    try {
        const baseUrl =
            process.env.NEXT_PUBLIC_BASE_URL || "https://example.com";
        const currentDate = new Date().toISOString();

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

        // Build sitemap XML
        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`;

        // Add homepage
        sitemap += `  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
`;

        // Add company careers pages
        for (const company of companies) {
            sitemap += `  <url>
    <loc>${baseUrl}/${company.slug}/careers</loc>
    <lastmod>${company.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;
        }

        // Add individual job pages
        for (const job of jobs) {
            sitemap += `  <url>
    <loc>${baseUrl}/${job.company.slug}/careers/jobs/${job.jobSlug}</loc>
    <lastmod>${job.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
        }

        sitemap += `</urlset>`;

        return new NextResponse(sitemap, {
            headers: {
                "Content-Type": "application/xml",
                "Cache-Control": "public, max-age=3600, s-maxage=3600",
            },
        });
    } catch (error) {
        console.error("Sitemap generation error:", error);
        return new NextResponse("Error generating sitemap", { status: 500 });
    }
}
