import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { z } from "zod";

const createJobSchema = z.object({
    companySlug: z.string(),
    title: z.string().min(1, "Title is required"),
    workPolicy: z.enum(["Remote", "Hybrid", "On-site"]),
    location: z.string().min(1, "Location is required"),
    department: z.string().min(1, "Department is required"),
    employmentType: z.enum([
        "Full-time",
        "Part-time",
        "Contract",
        "Internship",
    ]),
    experienceLevel: z.enum([
        "Entry Level",
        "Mid Level",
        "Senior Level",
        "Lead",
        "Executive",
    ]),
    jobType: z.string().min(1, "Job type is required"),
    salaryRange: z.string().optional(),
    description: z.string().optional(),
    requirements: z.array(z.string()).default([]),
    responsibilities: z.array(z.string()).default([]),
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
        const validatedData = createJobSchema.parse(body);

        // Verify company exists and user has access
        const company = await prisma.company.findUnique({
            where: { slug: validatedData.companySlug },
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

        // Generate job slug from title
        const jobSlug = validatedData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        // Create job
        const job = await prisma.job.create({
            data: {
                companyId: company.id,
                title: validatedData.title,
                workPolicy: validatedData.workPolicy,
                location: validatedData.location,
                department: validatedData.department,
                employmentType: validatedData.employmentType,
                experienceLevel: validatedData.experienceLevel,
                jobType: validatedData.jobType,
                salaryRange: validatedData.salaryRange || null,
                jobSlug,
                description: validatedData.description || null,
                requirements: validatedData.requirements,
                responsibilities: validatedData.responsibilities,
                postedDaysAgo: 0,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Job created successfully",
            data: job,
        });
    } catch (error) {
        console.error("Create job error:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Invalid request data", details: error.issues },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to create job" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        // Check authentication
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get company slug from query params
        const { searchParams } = new URL(request.url);
        const companySlug = searchParams.get("companySlug");

        if (!companySlug) {
            return NextResponse.json(
                { error: "Company slug is required" },
                { status: 400 }
            );
        }

        // Verify company exists and user has access
        const company = await prisma.company.findUnique({
            where: { slug: companySlug },
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

        // Get all jobs for the company
        const jobs = await prisma.job.findMany({
            where: { companyId: company.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({
            success: true,
            data: jobs,
        });
    } catch (error) {
        console.error("Get jobs error:", error);
        return NextResponse.json(
            { error: "Failed to fetch jobs" },
            { status: 500 }
        );
    }
}
