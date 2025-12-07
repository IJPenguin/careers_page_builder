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

export function HeroMinimal({
    config,
    companyName,
    companyLogo,
    colorTheme,
}: Props) {
    return (
        <section
            className="py-16 md:py-24"
            style={{ backgroundColor: colorTheme.background }}
        >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {config.showLogo && companyLogo && (
                    <div className="flex justify-center mb-8">
                        <Image
                            src={companyLogo}
                            alt={`${companyName} logo`}
                            width={120}
                            height={120}
                            className="object-contain"
                        />
                    </div>
                )}
                <h1
                    className="text-4xl md:text-5xl font-bold mb-4"
                    style={{ color: colorTheme.text }}
                >
                    {config.headline || companyName}
                </h1>
                {config.subheadline && (
                    <p
                        className="text-lg md:text-xl mb-8 opacity-80"
                        style={{ color: colorTheme.text }}
                    >
                        {config.subheadline}
                    </p>
                )}
                {config.ctaText && config.ctaLink && (
                    <a
                        href={config.ctaLink}
                        className="inline-block px-6 py-3 rounded-lg font-medium text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: colorTheme.primary }}
                    >
                        {config.ctaText}
                    </a>
                )}
            </div>
        </section>
    );
}
