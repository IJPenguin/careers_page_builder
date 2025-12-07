import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import {
    AboutSection,
    LifeAtCompanySection,
    ValuesSection,
    LocationsSection,
    PerksSection,
    OtherProgramsSection,
    TestimonialsSection,
    MediaSection,
    SocialsSection,
} from "@/components/sections/career-sections";
import { JobsListing } from "@/components/sections/jobs-listing";
import { HeroSection } from "@/components/hero/hero-section";
import { CareersNavigation } from "@/components/navigation/careers-navigation";
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

    if (!company) {
        return {
            title: "Company Not Found",
        };
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com";
    const url = `${baseUrl}/${slug}/careers`;

    return {
        title: `Careers - ${company.name}`,
        description: `Join ${company.name}. Explore our open positions and company culture. Find your next career opportunity with us.`,
        keywords: `${company.name} careers, ${company.name} jobs, work at ${company.name}, join ${company.name}`,
        authors: [{ name: company.name }],
        openGraph: {
            title: `Careers - ${company.name}`,
            description: `Join ${company.name}. Explore our open positions and company culture.`,
            url: url,
            siteName: company.name,
            images: company.logo
                ? [
                      {
                          url: company.logo,
                          alt: `${company.name} logo`,
                      },
                  ]
                : [],
            type: "website",
            locale: "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title: `Careers - ${company.name}`,
            description: `Join ${company.name}. Explore our open positions and company culture.`,
            images: company.logo ? [company.logo] : [],
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

export default async function CareersPage({ params }: Props) {
    const { slug } = await params;

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

    // Get the careers page data
    const careersPage = await prisma.careersPage.findUnique({
        where: { companyId: company.id },
    });

    // Get jobs for this company
    const rawJobs = await prisma.job.findMany({
        where: { companyId: company.id },
        orderBy: { createdAt: "desc" },
    });

    // Transform jobs to include required fields for the JobsListing component
    const jobs = rawJobs.map((job) => ({
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
        createdAt: job.createdAt,
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

    // Create structured data for jobs (JSON-LD)
    const jobPostings = jobs.map((job) => ({
        "@type": "JobPosting",
        title: job.title,
        description:
            job.description || `Join ${company.name} as a ${job.title}`,
        datePosted: job.createdAt.toISOString(),
        employmentType: job.employmentType,
        hiringOrganization: {
            "@type": "Organization",
            name: company.name,
            logo: company.logo,
        },
        jobLocation: {
            "@type": "Place",
            address: {
                "@type": "PostalAddress",
                addressLocality: job.location,
            },
        },
        baseSalary: job.salaryRange
            ? {
                  "@type": "MonetaryAmount",
                  currency: "USD",
                  value: {
                      "@type": "QuantitativeValue",
                      value: job.salaryRange,
                  },
              }
            : undefined,
    }));

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: jobPostings,
    };

    // Transform nested API data structure to flat structure that components expect
    const transformContent = (apiContent: any) => {
        const transformed: any = {};

        if (apiContent.about?.description) {
            transformed.about = apiContent.about.description;
        } else if (typeof apiContent.about === "string") {
            transformed.about = apiContent.about;
        }

        if (apiContent.values?.items) {
            transformed.values = apiContent.values.items.map((item: any) => ({
                title: item.name || item.title,
                description: item.description,
                icon: item.icon || undefined,
            }));
        } else if (Array.isArray(apiContent.values)) {
            transformed.values = apiContent.values;
        }

        if (apiContent.lifeAtCompany?.description) {
            transformed.lifeAtCompany = apiContent.lifeAtCompany.description;
        } else if (typeof apiContent.lifeAtCompany === "string") {
            transformed.lifeAtCompany = apiContent.lifeAtCompany;
        }

        if (apiContent.perks?.items) {
            transformed.perks = apiContent.perks.items.map((item: any) => {
                if (typeof item === "string") {
                    return { title: item, description: "" };
                }
                return {
                    title: item.title || item.name,
                    description: item.description || "",
                };
            });
        } else if (Array.isArray(apiContent.perks)) {
            transformed.perks = apiContent.perks;
        }

        if (apiContent.locations?.items) {
            transformed.locations = apiContent.locations.items;
        } else if (Array.isArray(apiContent.locations)) {
            transformed.locations = apiContent.locations;
        }

        if (apiContent.testimonials?.items) {
            transformed.testimonials = apiContent.testimonials.items;
        } else if (Array.isArray(apiContent.testimonials)) {
            transformed.testimonials = apiContent.testimonials;
        }

        if (apiContent.socials) {
            transformed.socials = {
                linkedin: apiContent.socials.linkedin,
                twitter: apiContent.socials.twitter,
                facebook: apiContent.socials.facebook,
            };
        }

        if (apiContent.otherPrograms?.description) {
            transformed.otherPrograms = apiContent.otherPrograms.description;
        } else if (typeof apiContent.otherPrograms === "string") {
            transformed.otherPrograms = apiContent.otherPrograms;
        }

        // Transform media
        if (apiContent.media) {
            transformed.media = {
                logo: apiContent.media.logo || "",
                video: apiContent.media.video || "",
                videoTitle: apiContent.media.videoTitle || "",
            };
        }

        return transformed;
    };

    // Merge section content with defaults for empty sections
    const getContentWithDefaults = () => {
        const transformedContent = transformContent(sectionContent);

        const defaults = {
            about: "Tell your story here. Describe your company mission, vision, and what makes you unique.",
            values: [
                {
                    title: "Innovation",
                    description: "We embrace new ideas and technologies",
                },
                {
                    title: "Integrity",
                    description: "We do the right thing, always",
                },
                {
                    title: "Excellence",
                    description: "We strive for the highest quality",
                },
            ],
            lifeAtCompany:
                "Share what it's like to work at your company. Describe the culture, team dynamics, and daily experiences.",
            perks: [
                {
                    title: "Health Insurance",
                    description: "Comprehensive health coverage",
                },
                {
                    title: "Flexible Hours",
                    description: "Work when you're most productive",
                },
                {
                    title: "Professional Development",
                    description: "Learning and growth opportunities",
                },
            ],
            locations: ["San Francisco, CA", "New York, NY", "Austin, TX"],
            testimonials: [
                {
                    name: "John Doe",
                    role: "Software Engineer",
                    quote: "Great place to work and grow your career!",
                },
            ],
            socials: {
                linkedin: "https://linkedin.com",
                twitter: "https://twitter.com",
                facebook: "https://facebook.com",
            },
            otherPrograms:
                "Describe any additional programs, initiatives, or benefits you offer.",
            media: {
                logo: "",
                video: "",
                videoTitle: "Our Story",
            },
        };

        const merged: any = {};
        Object.keys(defaults).forEach((key) => {
            const userValue = transformedContent[key];
            const defaultValue = defaults[key as keyof typeof defaults];

            if (
                userValue !== undefined &&
                userValue !== null &&
                userValue !== ""
            ) {
                if (Array.isArray(userValue) && userValue.length > 0) {
                    merged[key] = userValue;
                } else if (
                    typeof userValue === "object" &&
                    !Array.isArray(userValue) &&
                    Object.keys(userValue).length > 0
                ) {
                    merged[key] = userValue;
                } else if (
                    typeof userValue === "string" &&
                    userValue.trim() !== ""
                ) {
                    merged[key] = userValue;
                } else {
                    merged[key] = defaultValue;
                }
            } else {
                merged[key] = defaultValue;
            }
        });

        Object.keys(transformedContent).forEach((key) => {
            if (!(key in defaults) && transformedContent[key]) {
                merged[key] = transformedContent[key];
            }
        });

        return merged;
    };

    const contentWithDefaults = getContentWithDefaults();

    // Section renderer mapping
    const sectionComponents: Record<string, React.ReactElement> = {
        about: (
            <AboutSection
                content={contentWithDefaults}
                colorTheme={colorTheme}
                fontStyle={fontStyle}
            />
        ),
        lifeAtCompany: (
            <LifeAtCompanySection
                content={contentWithDefaults}
                colorTheme={colorTheme}
                fontStyle={fontStyle}
                images={images}
            />
        ),
        values: (
            <ValuesSection
                content={contentWithDefaults}
                colorTheme={colorTheme}
                fontStyle={fontStyle}
            />
        ),
        locations: (
            <LocationsSection
                content={contentWithDefaults}
                colorTheme={colorTheme}
                fontStyle={fontStyle}
            />
        ),
        perks: (
            <PerksSection
                content={contentWithDefaults}
                colorTheme={colorTheme}
                fontStyle={fontStyle}
            />
        ),
        otherPrograms: (
            <OtherProgramsSection
                content={contentWithDefaults}
                colorTheme={colorTheme}
                fontStyle={fontStyle}
            />
        ),
        testimonials: (
            <TestimonialsSection
                content={contentWithDefaults}
                colorTheme={colorTheme}
                fontStyle={fontStyle}
            />
        ),
        media: (
            <MediaSection
                content={contentWithDefaults}
                colorTheme={colorTheme}
                fontStyle={fontStyle}
            />
        ),
        socials: (
            <SocialsSection
                content={contentWithDefaults}
                colorTheme={colorTheme}
                fontStyle={fontStyle}
            />
        ),
        jobs: (
            <JobsListing
                key="jobs"
                jobs={jobs}
                companySlug={company.slug}
                colorTheme={colorTheme}
            />
        ),
    };

    return (
        <>
            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData),
                }}
            />

            <div
                className="min-h-screen bg-white"
                style={{ fontFamily: fontStyle }}
            >
                {/* Navigation */}
                <CareersNavigation
                    companyName={company.name}
                    companyLogo={company.logo}
                    logoUrl={contentWithDefaults.media?.logo}
                    colorTheme={colorTheme}
                />

                {/* Hero Section */}
                <HeroSection
                    config={heroConfig}
                    companyName={company.name}
                    companyLogo={company.logo}
                    colorTheme={colorTheme}
                />

                {/* Dynamic Sections */}
                {orderOfSections.length > 0 ? (
                    orderOfSections.map(
                        (section, idx) =>
                            sectionComponents[section] && (
                                <div key={idx}>
                                    {sectionComponents[section]}
                                </div>
                            )
                    )
                ) : (
                    <>
                        {/* Default sections if no order specified */}
                        {sectionComponents.about}
                        {sectionComponents.values}
                        {sectionComponents.lifeAtCompany}
                        {sectionComponents.perks}
                        {sectionComponents.locations}
                        {sectionComponents.otherPrograms}
                        {sectionComponents.testimonials}
                        {sectionComponents.media}
                        {sectionComponents.socials}
                        {sectionComponents.jobs}
                    </>
                )}

                {/* Footer */}
                <footer className="bg-gray-50 border-t border-gray-200 mt-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="text-center text-gray-600">
                            <p className="text-sm">
                                © {new Date().getFullYear()} {company.name}. All
                                rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
