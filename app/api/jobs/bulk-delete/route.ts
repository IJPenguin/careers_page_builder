import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { z } from "zod";

const bulkDeleteSchema = z.object({
    jobIds: z.array(z.string()).min(1, "At least one job ID is required"),
});

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Parse and validate request body
        const body = await request.json();
        const { jobIds } = bulkDeleteSchema.parse(body);

        // Verify all jobs belong to the user's company
        const jobs = await prisma.job.findMany({
            where: {
                id: { in: jobIds },
            },
            select: { id: true, companyId: true },
        });

        // Check if all jobs exist and belong to user's company
        if (jobs.length !== jobIds.length) {
            return NextResponse.json(
                { error: "Some jobs were not found" },
                { status: 404 }
            );
        }

        const unauthorizedJobs = jobs.filter(
            (job) => job.companyId !== user.companyId
        );

        if (unauthorizedJobs.length > 0) {
            return NextResponse.json(
                {
                    error: "Forbidden - You don't have access to some of these jobs",
                },
                { status: 403 }
            );
        }

        // Delete jobs
        await prisma.job.deleteMany({
            where: {
                id: { in: jobIds },
            },
        });

        return NextResponse.json({
            success: true,
            message: `Successfully deleted ${jobIds.length} jobs`,
            count: jobIds.length,
        });
    } catch (error) {
        console.error("Bulk delete error:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid request data", details: error.issues },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to delete jobs" },
            { status: 500 }
        );
    }
}
