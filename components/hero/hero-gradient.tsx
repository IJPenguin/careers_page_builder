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

export function HeroGradient({
    config,
    companyName,
    companyLogo,
    colorTheme,
}: Props) {
    return (
        <section
            className="py-20 md:py-32 relative overflow-hidden"
            style={{
                background: `linear-gradient(135deg, ${colorTheme.primary} 0%, ${colorTheme.secondary} 50%, ${colorTheme.accent} 100%)`,
            }}
        >
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
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
                    {config.headline || `Join ${companyName}`}
                </h1>
                {config.subheadline && (
                    <p className="text-xl md:text-2xl mb-10 text-white opacity-90 max-w-3xl mx-auto">
                        {config.subheadline}
                    </p>
                )}
                {config.ctaText && config.ctaLink && (
                    <a
                        href={config.ctaLink}
                        className="inline-block px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-xl"
                        style={{
                            backgroundColor: "white",
                            color: colorTheme.primary,
                        }}
                    >
                        {config.ctaText}
                    </a>
                )}
            </div>
        </section>
    );
}
