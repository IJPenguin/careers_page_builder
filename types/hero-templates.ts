export type HeroTemplate =
    | "minimal"
    | "centered"
    | "split"
    | "gradient"
    | "image-background";

export type HeroConfig = {
    template: HeroTemplate;
    headline?: string;
    subheadline?: string;
    ctaText?: string;
    ctaLink?: string;
    showLogo?: boolean;
    backgroundImage?: string;
    overlayOpacity?: number;
};

export const HERO_TEMPLATES = {
    minimal: {
        id: "minimal" as const,
        name: "Minimal",
        description: "Clean and simple with centered text",
        preview: "Simple centered layout with company name and tagline",
    },
    centered: {
        id: "centered" as const,
        name: "Centered Hero",
        description: "Bold centered design with prominent CTA",
        preview: "Large headline with subtitle and call-to-action button",
    },
    split: {
        id: "split" as const,
        name: "Split Layout",
        description: "Content on left, visual on right",
        preview: "Two-column layout with text and image side by side",
    },
    gradient: {
        id: "gradient" as const,
        name: "Gradient Background",
        description: "Modern gradient background with overlay",
        preview: "Vibrant gradient background with text overlay",
    },
    "image-background": {
        id: "image-background" as const,
        name: "Image Background",
        description: "Full-width background image with content overlay",
        preview: "Full-screen background image with centered content",
    },
} as const;

export const DEFAULT_HERO_CONFIG: HeroConfig = {
    template: "centered",
    headline: "Join Our Team",
    subheadline: "Build the future with us",
    ctaText: "View Open Positions",
    ctaLink: "#jobs",
    showLogo: true,
    backgroundImage: "",
    overlayOpacity: 0.5,
};
