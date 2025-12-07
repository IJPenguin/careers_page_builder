import { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { JobManagementClient } from "@/components/jobs/job-management-client";

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
    const url = `${baseUrl}/${slug}/jobs`;

    return {
        title: `Manage Jobs - ${company?.name || "Company"}`,
        description: `Manage job postings for ${
            company?.name || "your company"
        }. Add, edit, and organize job listings for your careers page.`,
        robots: {
            index: false,
            follow: false,
            googleBot: {
                index: false,
                follow: false,
            },
        },
        openGraph: {
            title: `Manage Jobs - ${company?.name || "Company"}`,
            description: `Manage job postings for ${
                company?.name || "your company"
            }`,
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

export default async function JobManagementPage({ params }: Props) {
    const { slug } = await params;

    // Check if user is authenticated
    const user = await getCurrentUser();
    if (!user) {
        redirect(`/${slug}/login`);
    }

    // Check if company exists
    const company = await prisma.company.findUnique({
        where: { slug },
        select: {
            id: true,
            name: true,
            slug: true,
        },
    });

    if (!company) {
        notFound();
    }

    // Verify user belongs to this company
    if (user.companyId !== company.id) {
        redirect(`/${slug}/login`);
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {company.name}
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <a
                                href={`/${slug}/edit`}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Edit Page
                            </a>
                            <a
                                href={`/${slug}/careers`}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                View Careers Page
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <JobManagementClient companySlug={company.slug} />
            </main>
        </div>
    );
}
