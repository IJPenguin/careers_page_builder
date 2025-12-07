import Image from "next/image";

type SectionProps = {
    content: any;
    colorTheme: any;
    fontStyle: string;
    images?: any;
};

export function AboutSection({ content, colorTheme }: SectionProps) {
    // Allow any truthy about value that is a string
    if (!content?.about || typeof content.about !== "string") return null;

    return (
        <section className="py-16 bg-white" aria-labelledby="about-heading">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2
                    id="about-heading"
                    className="text-3xl md:text-4xl font-bold mb-8 text-center"
                    style={{ color: colorTheme?.primary || "#3B82F6" }}
                >
                    About Us
                </h2>
                <div className="prose flex items-center justify-center prose-lg max-w-4xl mx-auto">
                    <p className="text-lg text-gray-700 leading-relaxed">
                        {content.about}
                    </p>
                </div>
            </div>
        </section>
    );
}

export function LifeAtCompanySection({
    content,
    colorTheme,
    images,
}: SectionProps) {
    // Allow any truthy lifeAtCompany value that is a string
    if (!content?.lifeAtCompany || typeof content.lifeAtCompany !== "string")
        return null;

    return (
        <section className="py-16 bg-gray-50" aria-labelledby="life-heading">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2
                    id="life-heading"
                    className="text-3xl md:text-4xl font-bold mb-8 text-center"
                    style={{ color: colorTheme?.primary || "#3B82F6" }}
                >
                    Life @ Company
                </h2>
                <div className="prose flex items-center justify-center prose-lg max-w-4xl mx-auto mb-8">
                    <p className="text-lg text-gray-700 leading-relaxed">
                        {content.lifeAtCompany}
                    </p>
                </div>
                {images?.lifeAtCompany && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                        {images.lifeAtCompany.map(
                            (img: string, idx: number) => (
                                <div
                                    key={idx}
                                    className="rounded-lg overflow-hidden shadow-lg relative h-64"
                                >
                                    <Image
                                        src={img}
                                        alt={`Office culture and team environment photo ${
                                            idx + 1
                                        }`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                                    />
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

export function ValuesSection({ content, colorTheme }: SectionProps) {
    if (!content?.values || !Array.isArray(content.values)) return null;

    // Filter out invalid values
    const validValues = content.values.filter(
        (value: any) =>
            value &&
            typeof value === "object" &&
            typeof value.title === "string" &&
            typeof value.description === "string"
    );

    if (validValues.length === 0) return null;

    return (
        <section className="py-16 bg-white" aria-labelledby="values-heading">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2
                    id="values-heading"
                    className="text-3xl md:text-4xl font-bold mb-12 text-center"
                    style={{ color: colorTheme?.primary || "#3B82F6" }}
                >
                    Our Values
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {validValues.map(
                        (
                            value: {
                                title: string;
                                description: string;
                                icon?: string;
                            },
                            idx: number
                        ) => (
                            <div key={idx} className="text-center">
                                <div
                                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-white border-2"
                                    style={{
                                        borderColor:
                                            colorTheme?.accent || "#60A5FA",
                                    }}
                                >
                                    {value.icon ? (
                                        <span className="text-3xl">
                                            {value.icon}
                                        </span>
                                    ) : (
                                        <span
                                            className="text-2xl font-bold"
                                            style={{
                                                color:
                                                    colorTheme?.accent ||
                                                    "#60A5FA",
                                            }}
                                        >
                                            {value.title[0]}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                                    {value.title}
                                </h3>
                                <p className="text-gray-600">
                                    {value.description}
                                </p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </section>
    );
}

export function LocationsSection({ content, colorTheme }: SectionProps) {
    if (!content?.locations || !Array.isArray(content.locations)) return null;

    // Filter out invalid locations (ensure they are strings)
    const validLocations = content.locations.filter(
        (location: any) =>
            typeof location === "string" && location.trim().length > 0
    );

    if (validLocations.length === 0) return null;

    return (
        <section
            className="py-16 bg-gray-50"
            aria-labelledby="locations-heading"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2
                    id="locations-heading"
                    className="text-3xl md:text-4xl font-bold mb-12 text-center"
                    style={{ color: colorTheme?.primary || "#3B82F6" }}
                >
                    Our Locations
                </h2>
                <div className="flex items-center justify-evenly">
                    {validLocations.map((location: string, idx: number) => (
                        <div
                            key={idx}
                            className="bg-white rounded-lg p-6 shadow-md text-center"
                        >
                            <svg
                                className="w-8 h-8 mx-auto mb-3"
                                style={{
                                    color: colorTheme?.primary || "#3B82F6",
                                }}
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
                            <p className="font-semibold text-gray-900">
                                {location}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function PerksSection({ content, colorTheme }: SectionProps) {
    if (!content?.perks || !Array.isArray(content.perks)) return null;

    // Filter out invalid perks
    const validPerks = content.perks.filter(
        (perk: any) =>
            perk &&
            typeof perk === "object" &&
            typeof perk.title === "string" &&
            typeof perk.description === "string"
    );

    if (validPerks.length === 0) return null;

    return (
        <section className="py-16 bg-white" aria-labelledby="perks-heading">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2
                    id="perks-heading"
                    className="text-3xl md:text-4xl font-bold mb-12 text-center"
                    style={{ color: colorTheme?.primary || "#3B82F6" }}
                >
                    Perks & Benefits
                </h2>
                <div className="flex items-center justify-evenly">
                    {validPerks.map(
                        (
                            perk: { title: string; description: string },
                            idx: number
                        ) => (
                            <div
                                key={idx}
                                className="bg-gray-50 rounded-lg p-6 border-l-4"
                                style={{
                                    borderColor:
                                        colorTheme?.primary || "#3B82F6",
                                }}
                            >
                                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                                    {perk.title}
                                </h3>
                                <p className="text-gray-600">
                                    {perk.description}
                                </p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </section>
    );
}

export function OtherProgramsSection({ content, colorTheme }: SectionProps) {
    if (
        !content?.otherPrograms ||
        typeof content.otherPrograms !== "string" ||
        content.otherPrograms.trim().length === 0
    )
        return null;

    return (
        <section
            className="py-16 bg-gray-50"
            aria-labelledby="programs-heading"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2
                    id="programs-heading"
                    className="text-3xl md:text-4xl font-bold mb-8 text-center"
                    style={{ color: colorTheme?.primary || "#3B82F6" }}
                >
                    Other Programs
                </h2>
                <div className="prose flex items-center justify-center prose-lg max-w-4xl mx-auto">
                    <p className="text-lg text-gray-700 leading-relaxed">
                        {content.otherPrograms}
                    </p>
                </div>
            </div>
        </section>
    );
}

export function TestimonialsSection({ content, colorTheme }: SectionProps) {
    if (!content?.testimonials || !Array.isArray(content.testimonials))
        return null;

    // Filter out invalid testimonials
    const validTestimonials = content.testimonials.filter(
        (testimonial: any) =>
            testimonial &&
            typeof testimonial === "object" &&
            typeof testimonial.name === "string" &&
            typeof testimonial.role === "string" &&
            typeof testimonial.quote === "string"
    );

    if (validTestimonials.length === 0) return null;

    return (
        <section
            className="py-16 bg-white"
            aria-labelledby="testimonials-heading"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2
                    id="testimonials-heading"
                    className="text-3xl md:text-4xl font-bold mb-12 text-center"
                    style={{ color: colorTheme?.primary || "#3B82F6" }}
                >
                    What Our Team Says
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {validTestimonials.map(
                        (
                            testimonial: {
                                name: string;
                                role: string;
                                quote: string;
                            },
                            idx: number
                        ) => (
                            <div
                                key={idx}
                                className="bg-gray-50 rounded-lg p-6 shadow-md"
                            >
                                <p className="text-gray-700 italic mb-4">
                                    "{testimonial.quote}"
                                </p>
                                <div className="border-t pt-4">
                                    <p className="font-semibold text-gray-900">
                                        {testimonial.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </section>
    );
}

export function SocialsSection({ content, colorTheme }: SectionProps) {
    if (!content?.socials) return null;

    return (
        <section className="py-16 bg-gray-50" aria-labelledby="socials-heading">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2
                    id="socials-heading"
                    className="text-3xl md:text-4xl font-bold mb-8 text-center"
                    style={{ color: colorTheme?.primary || "#3B82F6" }}
                >
                    Connect With Us
                </h2>
                <div className="flex justify-center space-x-6">
                    {content.socials.linkedin && (
                        <a
                            href={content.socials.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Visit our LinkedIn page"
                            className="w-12 h-12 flex items-center justify-center rounded-full transition-colors"
                            style={{
                                backgroundColor:
                                    colorTheme?.primary || "#3B82F6",
                                color: "white",
                            }}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                        </a>
                    )}
                    {content.socials.twitter && (
                        <a
                            href={content.socials.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Follow us on Twitter"
                            className="w-12 h-12 flex items-center justify-center rounded-full transition-colors"
                            style={{
                                backgroundColor:
                                    colorTheme?.primary || "#3B82F6",
                                color: "white",
                            }}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                            </svg>
                        </a>
                    )}
                    {content.socials.facebook && (
                        <a
                            href={content.socials.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Like us on Facebook"
                            className="w-12 h-12 flex items-center justify-center rounded-full transition-colors"
                            style={{
                                backgroundColor:
                                    colorTheme?.primary || "#3B82F6",
                                color: "white",
                            }}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}

export function MediaSection({ content, colorTheme }: SectionProps) {
    const hasVideo = content?.media?.video;
    const hasLogo = content?.media?.logo;

    if (!hasVideo && !hasLogo) return null;

    return (
        <section className="py-16 bg-white" aria-labelledby="media-heading">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {hasVideo && (
                    <div className="mb-12">
                        <h2
                            id="media-heading"
                            className="text-3xl md:text-4xl font-bold mb-8 text-center"
                            style={{ color: colorTheme?.primary || "#3B82F6" }}
                        >
                            {content.media.videoTitle || "Our Story"}
                        </h2>
                        <div className="max-w-4xl mx-auto">
                            <div
                                className="relative w-full rounded-xl overflow-hidden shadow-2xl"
                                style={{ paddingBottom: "56.25%" }}
                            >
                                <iframe
                                    src={content.media.video}
                                    className="absolute top-0 left-0 w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title={
                                        content.media.videoTitle ||
                                        "Company video"
                                    }
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
