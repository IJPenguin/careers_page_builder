import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Careers Page Builder - Create Beautiful Career Pages",
    description:
        "Build and manage beautiful careers pages for your company. Attract top talent with customizable job listings, drag-and-drop editing, and SEO optimization.",
    keywords:
        "careers page builder, job board, hiring platform, company careers page, job listings",
    authors: [{ name: "Careers Page Builder" }],
    openGraph: {
        title: "Careers Page Builder - Create Beautiful Career Pages",
        description:
            "Build and manage beautiful careers pages for your company",
        type: "website",
    },
    robots: {
        index: true,
        follow: true,
    },
};

import { redirect } from "next/navigation";

export default function Home() {
    redirect("/register");
}
