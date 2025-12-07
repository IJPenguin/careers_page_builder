"use client";

import { useEffect, useState } from "react";
import { HeroSection } from "@/components/hero/hero-section";
import { JobsListing } from "@/components/sections/jobs-listing";
import { CareersNavigation } from "@/components/navigation/careers-navigation";
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
import { HeroConfig, DEFAULT_HERO_CONFIG } from "@/types/hero-templates";

type Company = {
    id: string;
    name: string;
    logo: string | null;
    slug: string;
};

type Job = {
    id: string;
    title: string;
    workPolicy: string;
    location: string;
    department: string;
    employmentType: string;
    experienceLevel: string;
    jobType: string;
    salaryRange: string | null;
    description: string | null;
    jobSlug: string;
    postedDaysAgo: number;
};

type PreviewData = {
    company: Company;
    sectionContent: any;
    orderOfSections: string[];
    colorTheme: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
    };
    fontStyle: string;
    images: any;
    heroConfig: HeroConfig;
    jobs: Job[];
};

export function PreviewClient({ initialData }: { initialData: PreviewData }) {
    const [data] = useState<PreviewData>(initialData);

    // Transform nested API data structure to flat structure that components expect
    const transformContent = (apiContent: any) => {
        const transformed: any = {};

        // Transform about
        if (apiContent.about?.description) {
            transformed.about = apiContent.about.description;
        } else if (typeof apiContent.about === "string") {
            transformed.about = apiContent.about;
        }

        // Transform values
        if (apiContent.values?.items) {
            transformed.values = apiContent.values.items.map((item: any) => ({
                title: item.name || item.title,
                description: item.description,
                icon: item.icon || undefined,
            }));
        } else if (Array.isArray(apiContent.values)) {
            transformed.values = apiContent.values;
        }

        // Transform lifeAtCompany
        if (apiContent.lifeAtCompany?.description) {
            transformed.lifeAtCompany = apiContent.lifeAtCompany.description;
        } else if (typeof apiContent.lifeAtCompany === "string") {
            transformed.lifeAtCompany = apiContent.lifeAtCompany;
        }

        // Transform perks
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

        // Transform locations
        if (apiContent.locations?.items) {
            transformed.locations = apiContent.locations.items;
        } else if (Array.isArray(apiContent.locations)) {
            transformed.locations = apiContent.locations;
        }

        // Transform testimonials
        if (apiContent.testimonials?.items) {
            transformed.testimonials = apiContent.testimonials.items;
        } else if (Array.isArray(apiContent.testimonials)) {
            transformed.testimonials = apiContent.testimonials;
        }

        // Transform socials
        if (apiContent.socials) {
            transformed.socials = {
                linkedin: apiContent.socials.linkedin,
                twitter: apiContent.socials.twitter,
                facebook: apiContent.socials.facebook,
            };
        }

        // Transform otherPrograms
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
        // First transform the nested API structure to flat structure
        const transformedContent = transformContent(data.sectionContent);

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
                key="about"
                content={contentWithDefaults}
                colorTheme={data.colorTheme}
                fontStyle={data.fontStyle}
            />
        ),
        lifeAtCompany: (
            <LifeAtCompanySection
                key="lifeAtCompany"
                content={contentWithDefaults}
                colorTheme={data.colorTheme}
                fontStyle={data.fontStyle}
                images={data.images}
            />
        ),
        values: (
            <ValuesSection
                key="values"
                content={contentWithDefaults}
                colorTheme={data.colorTheme}
                fontStyle={data.fontStyle}
            />
        ),
        locations: (
            <LocationsSection
                key="locations"
                content={contentWithDefaults}
                colorTheme={data.colorTheme}
                fontStyle={data.fontStyle}
            />
        ),
        perks: (
            <PerksSection
                key="perks"
                content={contentWithDefaults}
                colorTheme={data.colorTheme}
                fontStyle={data.fontStyle}
            />
        ),
        otherPrograms: (
            <OtherProgramsSection
                key="otherPrograms"
                content={contentWithDefaults}
                colorTheme={data.colorTheme}
                fontStyle={data.fontStyle}
            />
        ),
        testimonials: (
            <TestimonialsSection
                key="testimonials"
                content={contentWithDefaults}
                colorTheme={data.colorTheme}
                fontStyle={data.fontStyle}
            />
        ),
        media: (
            <MediaSection
                key="media"
                content={contentWithDefaults}
                colorTheme={data.colorTheme}
                fontStyle={data.fontStyle}
            />
        ),
        socials: (
            <SocialsSection
                key="socials"
                content={contentWithDefaults}
                colorTheme={data.colorTheme}
                fontStyle={data.fontStyle}
            />
        ),
        jobs: (
            <JobsListing
                key="jobs"
                jobs={data.jobs}
                companySlug={data.company.slug}
                colorTheme={data.colorTheme}
            />
        ),
    };

    return (
        <div
            className="min-h-screen bg-white"
            style={{ fontFamily: data.fontStyle }}
        >
            {/* Navigation */}
            <CareersNavigation
                companyName={data.company.name}
                companyLogo={data.company.logo}
                logoUrl={contentWithDefaults.media?.logo}
                colorTheme={data.colorTheme}
            />

            {/* Hero Section */}
            <HeroSection
                config={data.heroConfig}
                companyName={data.company.name}
                companyLogo={data.company.logo}
                colorTheme={data.colorTheme}
            />

            {/* Dynamic Sections */}
            {data.orderOfSections.length > 0 ? (
                data.orderOfSections.map(
                    (section) => sectionComponents[section] || null
                )
            ) : (
                <>
                    {/* Default sections if no order specified */}
                    {sectionComponents.about}
                    {sectionComponents.values}
                    {sectionComponents.lifeAtCompany}
                    {sectionComponents.perks}
                    {sectionComponents.locations}
                    {sectionComponents.testimonials}
                    {sectionComponents.socials}
                    {sectionComponents.jobs}
                </>
            )}

            {/* Footer */}
            <footer className="bg-gray-50 border-t border-gray-200 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center text-gray-600">
                        <p className="text-sm">
                            © {new Date().getFullYear()} {data.company.name}.
                            All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
