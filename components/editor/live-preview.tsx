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
import { HeroConfig } from "@/types/hero-templates";

type ColorTheme = {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
};

type Props = {
    companySlug: string;
    companyName: string;
    companyLogo: string | null;
    activeTab: "hero" | "sections" | "content" | "theme";
    content: Record<string, any>;
    colorTheme: ColorTheme;
    fontStyle: string;
    heroConfig: HeroConfig;
    orderOfSections: string[];
};

export function LivePreview({
    companySlug,
    companyName,
    companyLogo,
    activeTab,
    content,
    colorTheme,
    fontStyle,
    heroConfig,
    orderOfSections,
}: Props) {
    const [previewContent, setPreviewContent] = useState(content);
    const [previewTheme, setPreviewTheme] = useState(colorTheme);
    const [previewFont, setPreviewFont] = useState(fontStyle);
    const [previewHero, setPreviewHero] = useState(heroConfig);
    const [previewOrder, setPreviewOrder] = useState(orderOfSections);
    const [previewSelector, setPreviewSelector] = useState<string[]>([]);
    const [jobs, setJobs] = useState<any[]>([]);

    // Fetch initial data and selector on mount
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await fetch(
                    `/api/careers/${companySlug}/content`
                );
                if (response.ok) {
                    const data = await response.json();
                    setPreviewSelector(data.sectionSelector || []);
                    console.log(data);
                }

                // Fetch jobs
                const jobsResponse = await fetch(
                    `/api/jobs?companySlug=${companySlug}`
                );
                if (jobsResponse.ok) {
                    const jobsData = await jobsResponse.json();
                    const transformedJobs = (jobsData.jobs || []).map(
                        (job: any) => ({
                            ...job,
                            jobSlug: job.id,
                            postedDaysAgo: Math.floor(
                                (Date.now() -
                                    new Date(job.createdAt).getTime()) /
                                    (1000 * 60 * 60 * 24)
                            ),
                        })
                    );
                    setJobs(transformedJobs);
                }
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
            }
        };

        fetchInitialData();
    }, [companySlug]);

    // Update preview when props change
    useEffect(() => {
        setPreviewContent(content);
        setPreviewTheme(colorTheme);
        setPreviewFont(fontStyle);
        setPreviewHero(heroConfig);
        setPreviewOrder(orderOfSections);
    }, [content, colorTheme, fontStyle, heroConfig, orderOfSections]);

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

    // Merge preview content with placeholder content for empty sections
    const getContentWithDefaults = () => {
        // First transform the nested API structure to flat structure
        const transformedContent = transformContent(previewContent);

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

        // Merge: for each key, use previewContent if it has a valid value, otherwise use default
        const merged: any = {};
        Object.keys(defaults).forEach((key) => {
            const userValue = transformedContent[key];
            const defaultValue = defaults[key as keyof typeof defaults];

            // Use user value if it exists and is not empty
            if (
                userValue !== undefined &&
                userValue !== null &&
                userValue !== ""
            ) {
                // For arrays, check if it has items
                if (Array.isArray(userValue) && userValue.length > 0) {
                    merged[key] = userValue;
                }
                // For objects, check if it has properties
                else if (
                    typeof userValue === "object" &&
                    !Array.isArray(userValue) &&
                    Object.keys(userValue).length > 0
                ) {
                    merged[key] = userValue;
                }
                // For strings, check if it's not empty
                else if (
                    typeof userValue === "string" &&
                    userValue.trim() !== ""
                ) {
                    merged[key] = userValue;
                }
                // If user value is invalid, use default
                else {
                    merged[key] = defaultValue;
                }
            } else {
                // No user value, use default
                merged[key] = defaultValue;
            }
        });

        // Also include any extra keys from previewContent that aren't in defaults
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
                colorTheme={previewTheme}
                fontStyle={previewFont}
            />
        ),
        lifeAtCompany: (
            <LifeAtCompanySection
                key="lifeAtCompany"
                content={contentWithDefaults}
                colorTheme={previewTheme}
                fontStyle={previewFont}
                images={{}}
            />
        ),
        values: (
            <ValuesSection
                key="values"
                content={contentWithDefaults}
                colorTheme={previewTheme}
                fontStyle={previewFont}
            />
        ),
        locations: (
            <LocationsSection
                key="locations"
                content={contentWithDefaults}
                colorTheme={previewTheme}
                fontStyle={previewFont}
            />
        ),
        perks: (
            <PerksSection
                key="perks"
                content={contentWithDefaults}
                colorTheme={previewTheme}
                fontStyle={previewFont}
            />
        ),
        otherPrograms: (
            <OtherProgramsSection
                key="otherPrograms"
                content={contentWithDefaults}
                colorTheme={previewTheme}
                fontStyle={previewFont}
            />
        ),
        testimonials: (
            <TestimonialsSection
                key="testimonials"
                content={contentWithDefaults}
                colorTheme={previewTheme}
                fontStyle={previewFont}
            />
        ),
        media: (
            <MediaSection
                key="media"
                content={contentWithDefaults}
                colorTheme={previewTheme}
                fontStyle={previewFont}
            />
        ),
        socials: (
            <SocialsSection
                key="socials"
                content={contentWithDefaults}
                colorTheme={previewTheme}
                fontStyle={previewFont}
            />
        ),
        jobs: (
            <JobsListing
                key="jobs"
                jobs={jobs}
                companySlug={companySlug}
                colorTheme={previewTheme}
            />
        ),
    };

    // Render preview based on active tab
    const renderPreview = () => {
        if (activeTab === "hero") {
            return (
                <HeroSection
                    config={previewHero}
                    companyName={companyName}
                    companyLogo={companyLogo}
                    colorTheme={previewTheme}
                />
            );
        }

        if (activeTab === "sections") {
            // If selector is empty, show all sections (default state)
            const shouldShowAll =
                !previewSelector || previewSelector.length === 0;

            // Show sections in the configured order
            if (previewOrder.length > 0) {
                return (
                    <>
                        {previewOrder
                            .filter(
                                (section) =>
                                    shouldShowAll ||
                                    previewSelector.includes(section)
                            )
                            .map(
                                (section) => sectionComponents[section] || null
                            )}
                    </>
                );
            }
            // Show default sections
            return (
                <>
                    {(shouldShowAll || previewSelector.includes("about")) &&
                        sectionComponents.about}
                    {(shouldShowAll || previewSelector.includes("values")) &&
                        sectionComponents.values}
                    {(shouldShowAll ||
                        previewSelector.includes("lifeAtCompany")) &&
                        sectionComponents.lifeAtCompany}
                    {(shouldShowAll || previewSelector.includes("perks")) &&
                        sectionComponents.perks}
                    {(shouldShowAll || previewSelector.includes("locations")) &&
                        sectionComponents.locations}
                    {(shouldShowAll || previewSelector.includes("jobs")) &&
                        sectionComponents.jobs}
                </>
            );
        }

        if (activeTab === "content") {
            // Show all sections in a consistent order
            const sectionOrder = [
                "about",
                "values",
                "lifeAtCompany",
                "perks",
                "locations",
                "otherPrograms",
                "testimonials",
                "media",
                "socials",
                "jobs",
            ];
            return (
                <>{sectionOrder.map((key) => sectionComponents[key] || null)}</>
            );
        }

        if (activeTab === "theme") {
            // Show hero and a couple sections to preview theme
            return (
                <>
                    <HeroSection
                        config={previewHero}
                        companyName={companyName}
                        companyLogo={companyLogo}
                        colorTheme={previewTheme}
                    />
                    {sectionComponents.about}
                    {sectionComponents.values}
                </>
            );
        }

        return null;
    };

    return (
        <div
            className="min-h-[600px] bg-white overflow-auto"
            style={{ fontFamily: previewFont }}
        >
            {/* Navigation */}
            <CareersNavigation
                companyName={companyName}
                companyLogo={companyLogo}
                logoUrl={contentWithDefaults.media?.logo}
                colorTheme={previewTheme}
            />
            {renderPreview()}
            {!renderPreview() && (
                <div className="flex items-center justify-center h-[600px] text-gray-400">
                    <div className="text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
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
                        <p className="mt-4 text-sm">No preview available</p>
                    </div>
                </div>
            )}
        </div>
    );
}
