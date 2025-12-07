import { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { PublishButton } from "@/components/preview/publish-button";
import { PreviewClient } from "@/components/preview/preview-client";
import { HeroConfig, DEFAULT_HERO_CONFIG } from "@/types/hero-templates";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const company = await prisma.company.findUnique({
        where: { slug },
        select: { name: true, logo: true },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com";
    const url = `${baseUrl}/${slug}/preview`;

    return {
        title: `Preview Careers Page - ${company?.name || "Company"}`,
        description: `Preview ${
            company?.name || "your company"
        }'s careers page before publishing. Review changes and ensure everything looks perfect.`,
        robots: {
            index: false,
            follow: false,
            googleBot: {
                index: false,
                follow: false,
            },
        },
        openGraph: {
            title: `Preview Careers Page - ${company?.name || "Company"}`,
            description: `Preview ${
                company?.name || "your company"
            }'s careers page before publishing`,
            url: url,
            siteName: company?.name || "Company",
            images: company?.logo
                ? [
                      {
                          url: company.logo,
                          alt: `${company.name} logo`,
                      },
                  ]
                : [],
            type: "website",
        },
    };
}

export default async function PreviewPage({ params }: Props) {
    const { slug } = await params;

    // Check if user is authenticated
    const user = await getCurrentUser();
    if (!user) {
        // Redirect to login page if not authenticated
        redirect(`/${slug}/login`);
    }

    // Check if company exists
    const company = await prisma.company.findUnique({
        where: { slug },
        select: {
            id: true,
            name: true,
            logo: true,
            slug: true,
        },
    });

    if (!company) {
        notFound();
    }

    // Verify user belongs to this company
    if (user.companyId !== company.id) {
        // User is authenticated but doesn't belong to this company
        redirect(`/${slug}/login`);
    }

    // Get the careers page data
    const careersPage = await prisma.careersPage.findUnique({
        where: { companyId: company.id },
    });

    // Get jobs for this company
    const jobs = await prisma.job.findMany({
        where: { companyId: company.id },
        orderBy: { createdAt: "desc" },
    });

    // Transform jobs to include required fields
    const transformedJobs = jobs.map((job) => ({
        id: job.id,
        title: job.title,
        workPolicy: job.workPolicy,
        location: job.location,
        department: job.department,
        employmentType: job.employmentType,
        experienceLevel: job.experienceLevel,
        jobType: job.jobType,
        salaryRange: job.salaryRange,
        description: job.description,
        jobSlug: job.id,
        postedDaysAgo: Math.floor(
            (Date.now() - job.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        ),
    }));

    // Parse careers page data
    const sectionContent = (careersPage?.sectionContent as any) || {};
    const orderOfSections = (careersPage?.orderOfSections as string[]) || [];
    const colorTheme = (careersPage?.colorTheme as any) || {
        primary: "#3B82F6",
        secondary: "#1E40AF",
        accent: "#60A5FA",
        background: "#FFFFFF",
        text: "#111827",
    };
    const fontStyle = (careersPage?.fontStyle as string) || "Inter";
    const images = (careersPage?.images as any) || {};
    const heroConfig =
        ((careersPage as any)?.heroConfig as HeroConfig) || DEFAULT_HERO_CONFIG;

    // Prepare initial data for the client component
    const initialData = {
        company: {
            id: company.id,
            name: company.name,
            logo: company.logo,
            slug: company.slug,
        },
        sectionContent,
        orderOfSections,
        colorTheme,
        fontStyle,
        images,
        heroConfig,
        jobs: transformedJobs,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Preview Banner */}
            <div className="bg-yellow-50 border-b border-yellow-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center space-x-3">
                            <svg
                                className="w-5 h-5 text-yellow-600 shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                            <span className="text-sm font-medium text-yellow-800">
                                Preview Mode - This is how your careers page
                                will look
                            </span>
                        </div>
                        <PublishButton companySlug={company.slug} />
                    </div>
                </div>
            </div>

            {/* Careers Page Content (mirrors public view) */}
            <PreviewClient initialData={initialData} />
        </div>
    );
}
