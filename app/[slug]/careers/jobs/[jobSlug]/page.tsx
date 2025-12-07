import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { Metadata } from "next";

type Props = {
    params: Promise<{ slug: string; jobSlug: string }>;
};

type ColorTheme = {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, jobSlug } = await params;

    const company = await prisma.company.findUnique({
        where: { slug },
    });

    const job = await prisma.job.findFirst({
        where: {
            jobSlug,
            company: { slug },
        },
    });

    if (!company || !job) {
        return {
            title: "Job Not Found",
        };
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com";
    const url = `${baseUrl}/${slug}/careers/jobs/${jobSlug}`;
    const description =
        job.description?.substring(0, 160) ||
        `Apply for ${job.title} position at ${company.name}. ${job.location} - ${job.employmentType}`;

    return {
        title: `${job.title} at ${company.name}`,
        description: description,
        keywords: `${job.title}, ${company.name} jobs, ${job.department}, ${job.location}, ${job.employmentType}, ${job.experienceLevel}`,
        authors: [{ name: company.name }],
        openGraph: {
            title: `${job.title} at ${company.name}`,
            description: description,
            url: url,
            siteName: company.name,
            type: "website",
            locale: "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title: `${job.title} at ${company.name}`,
            description: description,
        },
        alternates: {
            canonical: url,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
    };
}

export default async function JobDetailPage({ params }: Props) {
    const { slug, jobSlug } = await params;

    const company = await prisma.company.findUnique({
        where: { slug },
        include: {
            careersPage: true,
        },
    });

    if (!company) {
        notFound();
    }

    const job = await prisma.job.findFirst({
        where: {
            jobSlug,
            companyId: company.id,
        },
    });

    if (!job) {
        notFound();
    }

    const colorTheme = (company.careersPage?.colorTheme || {
        primary: "#3B82F6",
        secondary: "#60A5FA",
        accent: "#DBEAFE",
        background: "#FFFFFF",
        text: "#1F2937",
    }) as ColorTheme;

    return (
        <div
            className="min-h-screen"
            style={{ backgroundColor: colorTheme.background }}
        >
            {/* Breadcrumb Navigation */}
            <div
                className="border-b"
                style={{ borderColor: colorTheme.accent }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center space-x-2 text-sm">
                        <Link
                            href={`/${slug}/careers`}
                            className="hover:underline"
                            style={{ color: colorTheme.primary }}
                        >
                            Careers
                        </Link>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-600">{job.title}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-start justify-between mb-4">
                                <h1
                                    className="text-4xl font-bold"
                                    style={{ color: colorTheme.primary }}
                                >
                                    {job.title}
                                </h1>
                                {job.postedDaysAgo <= 7 && (
                                    <span
                                        className="px-3 py-1 text-sm font-medium rounded"
                                        style={{
                                            backgroundColor:
                                                colorTheme.accent + "40",
                                            color: colorTheme.primary,
                                        }}
                                    >
                                        New
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-3 text-gray-600">
                                <div className="flex items-center">
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    {job.location}
                                </div>
                                <span>•</span>
                                <div className="flex items-center">
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    {job.department}
                                </div>
                                <span>•</span>
                                <div className="flex items-center">
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    {job.employmentType}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4">
                                <span
                                    className="px-3 py-1 text-sm font-medium rounded"
                                    style={{
                                        backgroundColor:
                                            colorTheme.accent + "30",
                                        color: colorTheme.primary,
                                    }}
                                >
                                    {job.workPolicy}
                                </span>
                                <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-50 rounded">
                                    {job.experienceLevel}
                                </span>
                                <span className="px-3 py-1 text-sm font-medium text-purple-700 bg-purple-50 rounded">
                                    {job.jobType}
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        {job.description && (
                            <div className="mb-8">
                                <h2
                                    className="text-2xl font-semibold mb-4"
                                    style={{ color: colorTheme.text }}
                                >
                                    About the Role
                                </h2>
                                <div
                                    className="prose max-w-none text-gray-700"
                                    style={{ color: colorTheme.text }}
                                >
                                    {job.description}
                                </div>
                            </div>
                        )}

                        {/* Responsibilities */}
                        {job.responsibilities &&
                            Array.isArray(job.responsibilities) &&
                            job.responsibilities.length > 0 && (
                                <div className="mb-8">
                                    <h2
                                        className="text-2xl font-semibold mb-4"
                                        style={{ color: colorTheme.text }}
                                    >
                                        Key Responsibilities
                                    </h2>
                                    <ul className="space-y-3">
                                        {(job.responsibilities as string[]).map(
                                            (
                                                responsibility: string,
                                                index: number
                                            ) => (
                                                <li
                                                    key={index}
                                                    className="flex items-start"
                                                >
                                                    <svg
                                                        className="w-5 h-5 mr-3 shrink-0 mt-0.5"
                                                        style={{
                                                            color: colorTheme.primary,
                                                        }}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    <span className="text-gray-700">
                                                        {responsibility}
                                                    </span>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}

                        {/* Requirements */}
                        {job.requirements &&
                            Array.isArray(job.requirements) &&
                            job.requirements.length > 0 && (
                                <div className="mb-8">
                                    <h2
                                        className="text-2xl font-semibold mb-4"
                                        style={{ color: colorTheme.text }}
                                    >
                                        Requirements
                                    </h2>
                                    <ul className="space-y-3">
                                        {(job.requirements as string[]).map(
                                            (
                                                requirement: string,
                                                index: number
                                            ) => (
                                                <li
                                                    key={index}
                                                    className="flex items-start"
                                                >
                                                    <svg
                                                        className="w-5 h-5 mr-3 shrink-0 mt-0.5"
                                                        style={{
                                                            color: colorTheme.primary,
                                                        }}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    <span className="text-gray-700">
                                                        {requirement}
                                                    </span>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Apply Card */}
                            <div
                                className="bg-white rounded-lg border p-6"
                                style={{ borderColor: colorTheme.accent }}
                            >
                                <h3
                                    className="text-lg font-semibold mb-4"
                                    style={{ color: colorTheme.text }}
                                >
                                    Apply for this position
                                </h3>
                                <button
                                    className="w-full py-3 px-4 rounded-lg font-medium text-white transition-opacity hover:opacity-90"
                                    style={{
                                        backgroundColor: colorTheme.primary,
                                    }}
                                >
                                    Apply Now
                                </button>
                                <p className="text-xs text-gray-500 mt-3 text-center">
                                    Application opens in a new window
                                </p>
                            </div>

                            {/* Job Details Card */}
                            <div
                                className="bg-white rounded-lg border p-6"
                                style={{ borderColor: colorTheme.accent }}
                            >
                                <h3
                                    className="text-lg font-semibold mb-4"
                                    style={{ color: colorTheme.text }}
                                >
                                    Job Details
                                </h3>
                                <div className="space-y-4 text-sm">
                                    {job.salaryRange && (
                                        <div>
                                            <dt className="text-gray-500 mb-1">
                                                Salary Range
                                            </dt>
                                            <dd className="font-medium text-gray-900">
                                                {job.salaryRange}
                                            </dd>
                                        </div>
                                    )}
                                    <div>
                                        <dt className="text-gray-500 mb-1">
                                            Posted
                                        </dt>
                                        <dd className="font-medium text-gray-900">
                                            {job.postedDaysAgo === 0
                                                ? "Today"
                                                : job.postedDaysAgo === 1
                                                ? "Yesterday"
                                                : `${job.postedDaysAgo} days ago`}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-gray-500 mb-1">
                                            Job Type
                                        </dt>
                                        <dd className="font-medium text-gray-900">
                                            {job.jobType}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-gray-500 mb-1">
                                            Experience Level
                                        </dt>
                                        <dd className="font-medium text-gray-900">
                                            {job.experienceLevel}
                                        </dd>
                                    </div>
                                </div>
                            </div>

                            {/* Share Card */}
                            <div
                                className="bg-white rounded-lg border p-6"
                                style={{ borderColor: colorTheme.accent }}
                            >
                                <h3
                                    className="text-lg font-semibold mb-4"
                                    style={{ color: colorTheme.text }}
                                >
                                    Share this job
                                </h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            if (navigator.share) {
                                                navigator.share({
                                                    title: job.title,
                                                    text: `Check out this ${job.title} position at ${company.name}`,
                                                    url: window.location.href,
                                                });
                                            }
                                        }}
                                        className="flex-1 py-2 px-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                        style={{
                                            borderColor: colorTheme.accent,
                                        }}
                                    >
                                        <svg
                                            className="w-5 h-5 mx-auto"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                window.location.href
                                            );
                                        }}
                                        className="flex-1 py-2 px-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                        style={{
                                            borderColor: colorTheme.accent,
                                        }}
                                    >
                                        <svg
                                            className="w-5 h-5 mx-auto"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
