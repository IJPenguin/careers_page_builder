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

export function HeroImageBackground({
    config,
    companyName,
    companyLogo,
    colorTheme,
}: Props) {
    return (
        <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            {config.backgroundImage ? (
                <Image
                    src={config.backgroundImage}
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                />
            ) : (
                <div
                    className="absolute inset-0"
                    style={{
                        background: `linear-gradient(135deg, ${colorTheme.primary} 0%, ${colorTheme.secondary} 100%)`,
                    }}
                />
            )}

            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black"
                style={{ opacity: config.overlayOpacity ?? 0.5 }}
            />

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {config.showLogo && companyLogo && (
                    <div className="flex justify-center mb-10">
                        <Image
                            src={companyLogo}
                            alt={`${companyName} logo`}
                            width={140}
                            height={140}
                            className="object-contain"
                        />
                    </div>
                )}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
                    {config.headline || `Careers at ${companyName}`}
                </h1>
                {config.subheadline && (
                    <p className="text-xl md:text-2xl mb-10 text-white opacity-90 max-w-3xl mx-auto">
                        {config.subheadline}
                    </p>
                )}
                {config.ctaText && config.ctaLink && (
                    <a
                        href={config.ctaLink}
                        className="inline-block px-8 py-4 rounded-lg font-semibold text-lg text-white transition-all hover:scale-105 shadow-xl"
                        style={{ backgroundColor: colorTheme.primary }}
                    >
                        {config.ctaText}
                    </a>
                )}
            </div>
        </section>
    );
}
