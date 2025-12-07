import Image from "next/image";
import { HeroConfig } from "@/types/hero-templates";

type Props = {
    config: HeroConfig;
    companyName: string;
    companyLogo?: string | null;
    colorTheme: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
    };
};

export function HeroSplit({
    config,
    companyName,
    companyLogo,
    colorTheme,
}: Props) {
    return (
        <section
            className="py-16 md:py-20"
            style={{ backgroundColor: colorTheme.background }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left - Content */}
                    <div>
                        {config.showLogo && companyLogo && (
                            <div className="mb-8">
                                <Image
                                    src={companyLogo}
                                    alt={`${companyName} logo`}
                                    width={100}
                                    height={100}
                                    className="object-contain"
                                />
                            </div>
                        )}
                        <h1
                            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                            style={{ color: colorTheme.text }}
                        >
                            {config.headline || `Work at ${companyName}`}
                        </h1>
                        {config.subheadline && (
                            <p
                                className="text-lg md:text-xl mb-8"
                                style={{ color: colorTheme.text, opacity: 0.8 }}
                            >
                                {config.subheadline}
                            </p>
                        )}
                        {config.ctaText && config.ctaLink && (
                            <a
                                href={config.ctaLink}
                                className="inline-block px-8 py-4 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                                style={{ backgroundColor: colorTheme.primary }}
                            >
                                {config.ctaText}
                            </a>
                        )}
                    </div>

                    {/* Right - Visual */}
                    <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
                        {config.backgroundImage ? (
                            <Image
                                src={config.backgroundImage}
                                alt="Team"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div
                                className="w-full h-full"
                                style={{
                                    background: `linear-gradient(135deg, ${colorTheme.primary} 0%, ${colorTheme.secondary} 50%, ${colorTheme.accent} 100%)`,
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
