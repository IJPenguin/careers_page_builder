import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { z } from "zod";

const updateSectionOrderSchema = z.object({
    orderOfSections: z.array(z.string()),
    sectionSelector: z.array(z.string()),
});

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
        const { orderOfSections, sectionSelector } =
            updateSectionOrderSchema.parse(body);

        // Update or create careers page with new section order
        const careersPage = await prisma.careersPage.upsert({
            where: { companyId: company.id },
            update: {
                orderOfSections,
                sectionSelector,
                updatedAt: new Date(),
            },
            create: {
                companyId: company.id,
                orderOfSections,
                sectionSelector,
                sectionContent: {},
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

        return NextResponse.json({
            success: true,
            message: "Section order updated successfully",
            data: {
                orderOfSections: careersPage.orderOfSections,
                sectionSelector: careersPage.sectionSelector,
            },
        });
    } catch (error) {
        console.error("Update section order error:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid request data", details: error.issues },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to update section order" },
            { status: 500 }
        );
    }
}
