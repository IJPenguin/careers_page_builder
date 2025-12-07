import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";

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

        // Get form data
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const companySlug = formData.get("companySlug") as string;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

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

        // Read file content
        const text = await file.text();
        const lines = text.split("\n").filter((line) => line.trim());

        if (lines.length < 2) {
            return NextResponse.json(
                { error: "File must contain headers and at least one job" },
                { status: 400 }
            );
        }

        // Parse CSV
        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
        const jobs = [];

        // Helper function to normalize field names (convert snake_case to camelCase)
        const normalizeFieldName = (name: string): string => {
            return name.replace(/_([a-z])/g, (_, letter) =>
                letter.toUpperCase()
            );
        };

        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            if (values.length !== headers.length) continue;

            const job: any = {};
            headers.forEach((header, index) => {
                const normalizedHeader = normalizeFieldName(header);
                job[normalizedHeader] = values[index];
            });

            // Validate required fields (check both snake_case and camelCase)
            if (
                !job.title ||
                !(job.workPolicy || job.workpolicy) ||
                !job.location ||
                !job.department ||
                !(job.employmentType || job.employmenttype) ||
                !(job.experienceLevel || job.experiencelevel) ||
                !(job.jobType || job.jobtype)
            ) {
                continue; // Skip invalid rows
            }

            // Normalize the field values
            const workPolicy = job.workPolicy || job.workpolicy;
            const employmentType = job.employmentType || job.employmenttype;
            const experienceLevel = job.experienceLevel || job.experiencelevel;
            const jobType = job.jobType || job.jobtype;
            const salaryRange = job.salaryRange || job.salaryrange || null;
            const description = job.description || null;

            // Parse requirements and responsibilities
            const requirements = job.requirements
                ? job.requirements
                      .split(";")
                      .map((r: string) => r.trim())
                      .filter(Boolean)
                : [];
            const responsibilities = job.responsibilities
                ? job.responsibilities
                      .split(";")
                      .map((r: string) => r.trim())
                      .filter(Boolean)
                : [];

            // Generate job slug with unique identifier
            const baseSlug = job.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");

            // Use timestamp + random number + index to ensure uniqueness
            const uniqueId = `${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 9)}-${i}`;
            const jobSlug = `${baseSlug}-${uniqueId}`;

            jobs.push({
                companyId: company.id,
                title: job.title,
                workPolicy: workPolicy,
                location: job.location,
                department: job.department,
                employmentType: employmentType,
                experienceLevel: experienceLevel,
                jobType: jobType,
                salaryRange: salaryRange,
                jobSlug: jobSlug,
                description: description,
                requirements,
                responsibilities,
                postedDaysAgo: 0,
            });
        }

        if (jobs.length === 0) {
            return NextResponse.json(
                { error: "No valid jobs found in file" },
                { status: 400 }
            );
        }

        // Create jobs in database
        await prisma.job.createMany({
            data: jobs,
        });

        return NextResponse.json({
            success: true,
            message: `Successfully uploaded ${jobs.length} jobs`,
            count: jobs.length,
        });
    } catch (error) {
        console.error("Bulk upload error:", error);
        return NextResponse.json(
            { error: "Failed to upload jobs" },
            { status: 500 }
        );
    }
}

// Helper function to parse CSV line (handles quoted values)
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
            result.push(current.trim());
            current = "";
        } else {
            current += char;
        }
    }

    result.push(current.trim());
    return result;
}
