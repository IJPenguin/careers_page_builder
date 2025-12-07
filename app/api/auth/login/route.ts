import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { comparePassword } from "@/lib/auth/password";
import { generateToken } from "@/lib/auth/jwt";

const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
    companySlug: z.string().min(1, "Company slug is required"),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validate request body
        const validationResult = loginSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Validation error",
                    details: validationResult.error.issues,
                },
                { status: 400 }
            );
        }

        const { email, password, companySlug } = validationResult.data;

        // Find company by slug
        const company = await prisma.company.findUnique({
            where: { slug: companySlug },
        });

        if (!company) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Find user by email and company
        const user = await prisma.user.findFirst({
            where: {
                email,
                companyId: company.id,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await comparePassword(
            password,
            user.passwordHash
        );
        if (!isValidPassword) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            companyId: user.companyId,
            email: user.email,
        });

        // Create response with token in cookie
        const response = NextResponse.json(
            {
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    companyId: user.companyId,
                },
                token,
            },
            { status: 200 }
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
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
