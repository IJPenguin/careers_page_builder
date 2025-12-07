import { HeroConfig, HeroTemplate } from "@/types/hero-templates";
import { HeroMinimal } from "./hero-minimal";
import { HeroCentered } from "./hero-centered";
import { HeroSplit } from "./hero-split";
import { HeroGradient } from "./hero-gradient";
import { HeroImageBackground } from "./hero-image-background";

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

export function HeroSection({
    config,
    companyName,
    companyLogo,
    colorTheme,
}: Props) {
    const template = config.template || "centered";

    const componentMap: Record<HeroTemplate, React.ComponentType<Props>> = {
        minimal: HeroMinimal,
        centered: HeroCentered,
        split: HeroSplit,
        gradient: HeroGradient,
        "image-background": HeroImageBackground,
    };

    const Component = componentMap[template];

    if (!Component) {
        // Fallback to centered if template not found
        return (
            <HeroCentered
                config={config}
                companyName={companyName}
                companyLogo={companyLogo}
                colorTheme={colorTheme}
            />
        );
    }

    return (
        <Component
            config={config}
            companyName={companyName}
            companyLogo={companyLogo}
            colorTheme={colorTheme}
        />
    );
}
