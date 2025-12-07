export type SectionType =
    | "about"
    | "life"
    | "values"
    | "locations"
    | "perks"
    | "programs"
    | "testimonials"
    | "jobs"
    | "socials"
    | "footer";

export interface Company {
    id: string;
    slug: string;
    name: string;
    logo?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CareersPage {
    id: string;
    companyId: string;
    sectionSelector: SectionType[];
    sectionContent: Record<string, any>;
    orderOfSections: SectionType[];
    colorTheme: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
    };
    fontStyle: string;
    images: Record<string, string[]>;
    heroTemplate?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Job {
    id: string;
    companyId: string;
    title: string;
    workPolicy: string;
    location: string;
    department: string;
    employmentType: string;
    experienceLevel: string;
    jobType: string;
    salaryRange?: string;
    jobSlug: string;
    postedDaysAgo: number;
    description?: string;
    requirements?: string[];
    responsibilities?: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface User {
    id: string;
    email: string;
    companyId: string;
    createdAt: Date;
    updatedAt: Date;
}
