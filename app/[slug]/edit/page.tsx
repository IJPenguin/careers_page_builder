import { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { EditPageClient } from "@/components/editor/edit-page-client";
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
    const url = `${baseUrl}/${slug}/edit`;

    return {
        title: `Edit Careers Page - ${company?.name || "Company"}`,
        description: `Manage and customize ${
            company?.name || "your company"
        }'s careers page. Edit sections, upload content, and customize your company's hiring presence.`,
        robots: {
            index: false,
            follow: false,
            googleBot: {
                index: false,
                follow: false,
            },
        },
        openGraph: {
            title: `Edit Careers Page - ${company?.name || "Company"}`,
            description: `Manage ${
                company?.name || "your company"
            }'s careers page`,
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

export default async function EditPage({ params }: Props) {
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

    const orderOfSections = (careersPage?.orderOfSections as string[]) || [];
    const sectionSelector = (careersPage?.sectionSelector as string[]) || [];
    const sectionContent =
        (careersPage?.sectionContent as Record<string, any>) || {};
    const colorTheme = (careersPage?.colorTheme as {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
    }) || {
        primary: "#2563eb",
        secondary: "#3b82f6",
        accent: "#60a5fa",
        background: "#ffffff",
        text: "#1f2937",
    };
    const fontStyle = (careersPage?.fontStyle as string) || "Inter";
    const heroConfig =
        ((careersPage as any)?.heroConfig as HeroConfig) || DEFAULT_HERO_CONFIG;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {company.name}
                            </h1>
                            <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full">
                                Edit Mode
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <a
                                href={`/${slug}/jobs`}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Manage Jobs
                            </a>
                            <a
                                href={`/${slug}/preview`}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Preview
                            </a>
                            <button
                                type="button"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Publish
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <EditPageClient
                    companySlug={company.slug}
                    companyName={company.name}
                    companyLogo={company.logo}
                    initialOrder={orderOfSections}
                    initialSelector={sectionSelector}
                    initialContent={sectionContent}
                    initialColorTheme={colorTheme}
                    initialFontStyle={fontStyle}
                    initialHeroConfig={heroConfig}
                />
            </main>
        </div>
    );
}
