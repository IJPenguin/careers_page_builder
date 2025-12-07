import { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { LoginForm } from "@/components/auth/login-form";
import Image from "next/image";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const company = await prisma.company.findUnique({
        where: { slug },
        select: { name: true, logo: true },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com";
    const url = `${baseUrl}/${slug}/login`;

    return {
        title: `Login - ${company?.name || "Company"}`,
        description: `Login to manage ${
            company?.name || "your company"
        }'s careers page. Access your dashboard to edit and publish job listings.`,
        robots: {
            index: false,
            follow: false,
            googleBot: {
                index: false,
                follow: false,
            },
        },
        openGraph: {
            title: `Login - ${company?.name || "Company"}`,
            description: `Login to manage ${
                company?.name || "your company"
            }'s careers page`,
            url: url,
            siteName: company?.name || "Company",
            images: company?.logo
                ? [
                      {
                          url: company.logo,
                          alt: `${company.name} logo`,
                      },
                  ]
                : [],
            type: "website",
        },
    };
}

export default async function LoginPage({ params }: Props) {
    const { slug } = await params;

    // Check if user is already logged in
    const user = await getCurrentUser();
    if (user) {
        // If already logged in, redirect to edit page
        redirect(`/${slug}/edit`);
    }

    // Check if company exists
    const company = await prisma.company.findUnique({
        where: { slug },
        select: { name: true, logo: true },
    });

    if (!company) {
        redirect("/404");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    {company.logo && (
                        <div className="flex justify-center mb-6">
                            <Image
                                src={company.logo}
                                alt={`${company.name} logo`}
                                width={120}
                                height={120}
                                className="rounded-lg"
                            />
                        </div>
                    )}
                    <h1 className="text-3xl font-bold text-gray-900">
                        {company.name}
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to manage your careers page
                    </p>
                </div>

                <LoginForm companySlug={slug} />

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <a
                            href="/register"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Register your company
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
