"use client";

import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const jobSchema = z.object({
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

type JobFormData = z.infer<typeof jobSchema>;

type Props = {
    companySlug: string;
    initialData?: Partial<JobFormData> & { id?: string };
    onSuccess?: () => void;
    onCancel?: () => void;
};

export function JobForm({
    companySlug,
    initialData,
    onSuccess,
    onCancel,
}: Props) {
    const [formData, setFormData] = useState<JobFormData>({
        title: initialData?.title || "",
        workPolicy: initialData?.workPolicy || "Remote",
        location: initialData?.location || "",
        department: initialData?.department || "",
        employmentType: initialData?.employmentType || "Full-time",
        experienceLevel: initialData?.experienceLevel || "Mid Level",
        jobType: initialData?.jobType || "",
        salaryRange: initialData?.salaryRange || "",
        description: initialData?.description || "",
        requirements: initialData?.requirements || [],
        responsibilities: initialData?.responsibilities || [],
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field: keyof JobFormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error for this field
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const handleArrayAdd = (field: "requirements" | "responsibilities") => {
        setFormData((prev) => ({
            ...prev,
            [field]: [...prev[field], ""],
        }));
    };

    const handleArrayChange = (
        field: "requirements" | "responsibilities",
        index: number,
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: prev[field].map((item, i) => (i === index ? value : item)),
        }));
    };

    const handleArrayRemove = (
        field: "requirements" | "responsibilities",
        index: number
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        try {
            // Validate form data
            const validatedData = jobSchema.parse(formData);

            // Make API call
            const url = initialData?.id
                ? `/api/jobs/${initialData.id}`
                : `/api/jobs`;

            const response = await fetch(url, {
                method: initialData?.id ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...validatedData,
                    companySlug,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to save job");
            }

            toast.success(initialData?.id ? "Job updated!" : "Job created!", {
                description: `${formData.title} has been ${
                    initialData?.id ? "updated" : "added"
                } successfully.`,
            });

            onSuccess?.();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors: Record<string, string> = {};
                error.issues.forEach((err) => {
                    if (err.path[0]) {
                        fieldErrors[err.path[0] as string] = err.message;
                    }
                });
                setErrors(fieldErrors);
                toast.error("Validation error", {
                    description: "Please check the form and try again.",
                });
            } else {
                const errorMessage = (error as Error).message;
                setErrors({ submit: errorMessage });
                toast.error("Failed to save job", {
                    description: errorMessage,
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                    {errors.submit}
                </div>
            )}

            {/* Job Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                </label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.title ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., Senior Software Engineer"
                />
                {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
            </div>

            {/* Work Policy */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Policy *
                </label>
                <select
                    value={formData.workPolicy}
                    onChange={(e) => handleChange("workPolicy", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                </select>
            </div>

            {/* Location */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                </label>
                <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.location ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., San Francisco, CA"
                />
                {errors.location && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.location}
                    </p>
                )}
            </div>

            {/* Department */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                </label>
                <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => handleChange("department", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.department ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., Engineering"
                />
                {errors.department && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.department}
                    </p>
                )}
            </div>

            {/* Employment Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Type *
                </label>
                <select
                    value={formData.employmentType}
                    onChange={(e) =>
                        handleChange("employmentType", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                </select>
            </div>

            {/* Experience Level */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level *
                </label>
                <select
                    value={formData.experienceLevel}
                    onChange={(e) =>
                        handleChange("experienceLevel", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior Level">Senior Level</option>
                    <option value="Lead">Lead</option>
                    <option value="Executive">Executive</option>
                </select>
            </div>

            {/* Job Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type *
                </label>
                <input
                    type="text"
                    value={formData.jobType}
                    onChange={(e) => handleChange("jobType", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.jobType ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., Software Development"
                />
                {errors.jobType && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.jobType}
                    </p>
                )}
            </div>

            {/* Salary Range */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Range
                </label>
                <input
                    type="text"
                    value={formData.salaryRange}
                    onChange={(e) =>
                        handleChange("salaryRange", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., $100k - $150k"
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) =>
                        handleChange("description", e.target.value)
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe the role..."
                />
            </div>

            {/* Requirements */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requirements
                </label>
                <div className="space-y-2">
                    {formData.requirements.map((req, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={req}
                                onChange={(e) =>
                                    handleArrayChange(
                                        "requirements",
                                        index,
                                        e.target.value
                                    )
                                }
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter a requirement"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    handleArrayRemove("requirements", index)
                                }
                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleArrayAdd("requirements")}
                        className="text-sm text-blue-600 hover:text-blue-700"
                    >
                        + Add Requirement
                    </button>
                </div>
            </div>

            {/* Responsibilities */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Responsibilities
                </label>
                <div className="space-y-2">
                    {formData.responsibilities.map((resp, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={resp}
                                onChange={(e) =>
                                    handleArrayChange(
                                        "responsibilities",
                                        index,
                                        e.target.value
                                    )
                                }
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter a responsibility"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    handleArrayRemove("responsibilities", index)
                                }
                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleArrayAdd("responsibilities")}
                        className="text-sm text-blue-600 hover:text-blue-700"
                    >
                        + Add Responsibility
                    </button>
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <LoadingSpinner
                                size="sm"
                                className="border-white border-t-transparent"
                            />
                            {initialData?.id ? "Updating..." : "Creating..."}
                        </>
                    ) : initialData?.id ? (
                        "Update Job"
                    ) : (
                        "Create Job"
                    )}
                </button>
            </div>
        </form>
    );
}
