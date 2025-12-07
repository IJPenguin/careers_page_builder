import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { z } from "zod";

const updateJobSchema = z.object({
    title: z.string().min(1, "Title is required").optional(),
    workPolicy: z.enum(["Remote", "Hybrid", "On-site"]).optional(),
    location: z.string().min(1, "Location is required").optional(),
    department: z.string().min(1, "Department is required").optional(),
    employmentType: z
        .enum(["Full-time", "Part-time", "Contract", "Internship"])
        .optional(),
    experienceLevel: z
        .enum(["Entry Level", "Mid Level", "Senior Level", "Lead", "Executive"])
        .optional(),
    jobType: z.string().min(1, "Job type is required").optional(),
    salaryRange: z.string().optional(),
    description: z.string().optional(),
    requirements: z.array(z.string()).optional(),
    responsibilities: z.array(z.string()).optional(),
});

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Check authentication
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get job
        const job = await prisma.job.findUnique({
            where: { id },
        });

        if (!job) {
            return NextResponse.json(
                { error: "Job not found" },
                { status: 404 }
            );
        }

        // Verify user has access to this job's company
        if (user.companyId !== job.companyId) {
            return NextResponse.json(
                { error: "Forbidden - You don't have access to this job" },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            data: job,
        });
    } catch (error) {
        console.error("Get job error:", error);
        return NextResponse.json(
            { error: "Failed to fetch job" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Check authentication
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get existing job
        const existingJob = await prisma.job.findUnique({
            where: { id },
        });

        if (!existingJob) {
            return NextResponse.json(
                { error: "Job not found" },
                { status: 404 }
            );
        }

        // Verify user has access
        if (user.companyId !== existingJob.companyId) {
            return NextResponse.json(
                { error: "Forbidden - You don't have access to this job" },
                { status: 403 }
            );
        }

        // Parse and validate request body
        const body = await request.json();
        const validatedData = updateJobSchema.parse(body);

        // Build update data
        const updateData: any = { ...validatedData };

        // Update job slug if title changed
        if (validatedData.title) {
            updateData.jobSlug = validatedData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
        }

        // Update job
        const job = await prisma.job.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({
            success: true,
            message: "Job updated successfully",
            data: job,
        });
    } catch (error) {
        console.error("Update job error:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid request data", details: error.issues },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to update job" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Check authentication
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get existing job
        const existingJob = await prisma.job.findUnique({
            where: { id },
        });

        if (!existingJob) {
            return NextResponse.json(
                { error: "Job not found" },
                { status: 404 }
            );
        }

        // Verify user has access
        if (user.companyId !== existingJob.companyId) {
            return NextResponse.json(
                { error: "Forbidden - You don't have access to this job" },
                { status: 403 }
            );
        }

        // Delete job
        await prisma.job.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: "Job deleted successfully",
        });
    } catch (error) {
        console.error("Delete job error:", error);
        return NextResponse.json(
            { error: "Failed to delete job" },
            { status: 500 }
        );
    }
}
