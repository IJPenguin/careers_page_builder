import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { z } from "zod";

const updateContentSchema = z.object({
    sectionContent: z.record(z.string(), z.any()).optional(),
    colorTheme: z
        .object({
            primary: z.string(),
            secondary: z.string(),
            accent: z.string(),
            background: z.string(),
            text: z.string(),
        })
        .optional(),
    fontStyle: z.string().optional(),
    heroConfig: z
        .object({
            template: z.enum([
                "minimal",
                "centered",
                "split",
                "gradient",
                "image-background",
            ]),
            headline: z.string().optional(),
            subheadline: z.string().optional(),
            ctaText: z.string().optional(),
            ctaLink: z.string().optional(),
            showLogo: z.boolean().optional(),
            backgroundImage: z.string().optional(),
            overlayOpacity: z.number().min(0).max(1).optional(),
        })
        .optional(),
});

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        // Check authentication
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Verify company exists and user has access
        const company = await prisma.company.findUnique({
            where: { slug },
            select: { id: true },
        });

        if (!company) {
            return NextResponse.json(
                { error: "Company not found" },
                { status: 404 }
            );
        }

        if (user.companyId !== company.id) {
            return NextResponse.json(
                { error: "Forbidden - You don't have access to this company" },
                { status: 403 }
            );
        }

        // Get careers page data
        const careersPage = await prisma.careersPage.findUnique({
            where: { companyId: company.id },
        });

        if (!careersPage) {
            // Return empty/default data if no careers page exists
            return NextResponse.json({
                sectionContent: {},
                orderOfSections: [],
                sectionSelector: [],
                colorTheme: {
                    primary: "#3B82F6",
                    secondary: "#1E40AF",
                    accent: "#60A5FA",
                    background: "#FFFFFF",
                    text: "#111827",
                },
                fontStyle: "Inter",
                images: {},
                heroConfig: {
                    template: "centered",
                    headline: "",
                    subheadline: "",
                    ctaText: "",
                    ctaLink: "",
                    showLogo: true,
                },
            });
        }

        return NextResponse.json({
            sectionContent: careersPage.sectionContent || {},
            orderOfSections: careersPage.orderOfSections || [],
            sectionSelector: careersPage.sectionSelector || [],
            colorTheme: careersPage.colorTheme || {
                primary: "#3B82F6",
                secondary: "#1E40AF",
                accent: "#60A5FA",
                background: "#FFFFFF",
                text: "#111827",
            },
            fontStyle: careersPage.fontStyle || "Inter",
            images: careersPage.images || {},
            heroConfig: (careersPage as any).heroConfig || {
                template: "centered",
                headline: "",
                subheadline: "",
                ctaText: "",
                ctaLink: "",
                showLogo: true,
            },
        });
    } catch (error) {
        console.error("Get content error:", error);
        return NextResponse.json(
            { error: "Failed to fetch content" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        // Check authentication
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Verify company exists and user has access
        const company = await prisma.company.findUnique({
            where: { slug },
            select: { id: true },
        });

        if (!company) {
            return NextResponse.json(
                { error: "Company not found" },
                { status: 404 }
            );
        }

        if (user.companyId !== company.id) {
            return NextResponse.json(
                { error: "Forbidden - You don't have access to this company" },
                { status: 403 }
            );
        }

        // Parse and validate request body
        const body = await request.json();
        const validatedData = updateContentSchema.parse(body);

        // Build update data object
        const updateData: any = {
            updatedAt: new Date(),
        };

        if (validatedData.sectionContent !== undefined) {
            updateData.sectionContent = validatedData.sectionContent;
        }

        if (validatedData.colorTheme !== undefined) {
            updateData.colorTheme = validatedData.colorTheme;
        }

        if (validatedData.fontStyle !== undefined) {
            updateData.fontStyle = validatedData.fontStyle;
        }

        if (validatedData.heroConfig !== undefined) {
            updateData.heroConfig = validatedData.heroConfig;
        }

        // Update or create careers page
        const careersPage = (await prisma.careersPage.upsert({
            where: { companyId: company.id },
            update: updateData,
            create: {
                companyId: company.id,
                sectionContent: validatedData.sectionContent || ({} as any),
                colorTheme:
                    validatedData.colorTheme ||
                    ({
                        primary: "#3B82F6",
                        secondary: "#1E40AF",
                        accent: "#60A5FA",
                        background: "#FFFFFF",
                        text: "#111827",
                    } as any),
                fontStyle: validatedData.fontStyle || "Inter",
                orderOfSections: [],
                sectionSelector: [],
                images: {},
            },
        })) as any;

        return NextResponse.json({
            success: true,
            message: "Content updated successfully",
            data: {
                sectionContent: careersPage.sectionContent,
                colorTheme: careersPage.colorTheme,
                fontStyle: careersPage.fontStyle,
                heroConfig: careersPage.heroConfig,
            },
        });
    } catch (error) {
        console.error("Update content error:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid request data", details: error.issues },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to update content" },
            { status: 500 }
        );
    }
}
