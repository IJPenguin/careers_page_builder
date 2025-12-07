import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";
import { generateToken } from "@/lib/auth/jwt";

const registerSchema = z.object({
    companyName: z
        .string()
        .min(2, "Company name must be at least 2 characters"),
    companySlug: z
        .string()
        .min(2, "Slug must be at least 2 characters")
        .max(50, "Slug must be less than 50 characters")
        .regex(
            /^[a-z0-9-]+$/,
            "Slug can only contain lowercase letters, numbers, and hyphens"
        ),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validate request body
        const validationResult = registerSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Validation error",
                    details: validationResult.error.issues,
                },
                { status: 400 }
            );
        }

        const { companyName, companySlug, email, password } =
            validationResult.data;

        // Check if company slug already exists
        const existingCompany = await prisma.company.findUnique({
            where: { slug: companySlug },
        });

        if (existingCompany) {
            return NextResponse.json(
                { error: "Company slug already taken" },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 400 }
            );
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create company
        const company = await prisma.company.create({
            data: {
                name: companyName,
                slug: companySlug,
            },
        });

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                companyId: company.id,
            },
        });

        // Create default careers page
        await prisma.careersPage.create({
            data: {
                companyId: company.id,
                sectionSelector: [],
                sectionContent: {},
                orderOfSections: [],
                colorTheme: {
                    primary: "#3B82F6",
                    secondary: "#1E40AF",
                    accent: "#60A5FA",
                    background: "#FFFFFF",
                    text: "#111827",
                },
                fontStyle: "Inter",
                images: {},
            },
        });

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            companyId: company.id,
            email: user.email,
        });

        // Create response with token in cookie
        const response = NextResponse.json(
            {
                success: true,
                company: {
                    id: company.id,
                    name: company.name,
                    slug: company.slug,
                },
                user: {
                    id: user.id,
                    email: user.email,
                },
                token,
            },
            { status: 201 }
        );

        // Set HTTP-only cookie
        response.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
