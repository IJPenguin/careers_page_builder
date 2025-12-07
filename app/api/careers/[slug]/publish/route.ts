import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";

export async function POST(
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

        // In a real app, you would:
        // 1. Copy draft data to published data
        // 2. Update a "published_at" timestamp
        // 3. Clear any draft-only flags

        // For now, we'll just update the updatedAt timestamp
        // as all changes are already "published" in this simplified version
        const careersPage = await prisma.careersPage.update({
            where: { companyId: company.id },
            data: {
                updatedAt: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
            message: "Changes published successfully",
            publishedAt: careersPage.updatedAt,
        });
    } catch (error) {
        console.error("Publish error:", error);
        return NextResponse.json(
            { error: "Failed to publish changes" },
            { status: 500 }
        );
    }
}
