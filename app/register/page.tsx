import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { RegisterForm } from "@/components/auth/register-form";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Register - Careers Page Builder",
    description:
        "Create your company account and start building your careers page. Set up your hiring presence and attract top talent.",
    keywords:
        "careers page builder, company registration, hiring platform, job board",
    robots: {
        index: false,
        follow: false,
        googleBot: {
            index: false,
            follow: false,
        },
    },
    openGraph: {
        title: "Register - Careers Page Builder",
        description:
            "Create your company account and start building your careers page",
        type: "website",
    },
};

export default async function RegisterPage() {
    // Check if user is already logged in
    const user = await getCurrentUser();
    if (user) {
        // If already logged in, get company slug and redirect
        const { prisma } = await import("@/lib/db/prisma");
        const company = await prisma.company.findUnique({
            where: { id: user.companyId },
            select: { slug: true },
        });

        if (company) {
            redirect(`/${company.slug}/edit`);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Careers Page Builder
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Create beautiful careers pages for your company
                    </p>
                </div>

                {/* Register Form */}
                <RegisterForm />

                {/* Footer */}
                <div className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                        href="/"
                        className="font-medium text-blue-600 hover:text-blue-500"
                    >
                        Find your company login
                    </Link>
                </div>
            </div>
        </div>
    );
}
