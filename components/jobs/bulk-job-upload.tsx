"use client";

import { useState } from "react";

type Props = {
    companySlug: string;
    onUploadSuccess?: (count: number) => void;
};

export function BulkJobUpload({ companySlug, onUploadSuccess }: Props) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file type
        const validTypes = [
            "text/csv",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ];

        if (
            !validTypes.includes(file.type) &&
            !file.name.match(/\.(csv|xlsx|xls)$/i)
        ) {
            setError("Please upload a CSV or Excel file");
            return;
        }

        setIsUploading(true);
        setError("");
        setSuccess("");

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("companySlug", companySlug);

            const response = await fetch("/api/jobs/bulk-upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to upload file");
            }

            const result = await response.json();
            setSuccess(`Successfully uploaded ${result.count} jobs`);
            onUploadSuccess?.(result.count);

            // Reset file input
            e.target.value = "";
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsUploading(false);
        }
    };

    const downloadTemplate = () => {
        // Create CSV template
        const headers = [
            "title",
            "workPolicy",
            "location",
            "department",
            "employmentType",
            "experienceLevel",
            "jobType",
            "salaryRange",
            "description",
            "requirements",
            "responsibilities",
        ];

        const exampleRow = [
            "Senior Software Engineer",
            "Remote",
            "San Francisco, CA",
            "Engineering",
            "Full-time",
            "Senior Level",
            "Software Development",
            "$120k - $180k",
            "We are looking for a talented software engineer...",
            "5+ years experience; Proficiency in React and Node.js; Strong problem-solving skills",
            "Design and develop features; Code reviews; Mentor junior developers",
        ];

        const csv = [headers.join(","), exampleRow.join(",")].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "job-upload-template.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <svg
                        className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <div className="flex-1">
                        <h3 className="text-sm font-medium text-blue-900 mb-1">
                            Upload Multiple Jobs
                        </h3>
                        <p className="text-sm text-blue-700">
                            Upload a CSV or Excel file containing job listings.
                            Make sure your file follows the template format.
                        </p>
                        <button
                            onClick={downloadTemplate}
                            className="mt-2 text-sm text-blue-600 hover:text-blue-700 underline"
                        >
                            Download Template
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
                    {success}
                </div>
            )}

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                    id="file-upload"
                />
                <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                >
                    <svg
                        className="w-12 h-12 text-gray-400 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                    </svg>
                    {isUploading ? (
                        <div className="flex items-center gap-2 text-gray-600">
                            <svg
                                className="animate-spin h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            <span>Uploading...</span>
                        </div>
                    ) : (
                        <>
                            <span className="text-sm text-gray-600 mb-1">
                                Click to upload or drag and drop
                            </span>
                            <span className="text-xs text-gray-500">
                                CSV or Excel files only
                            </span>
                        </>
                    )}
                </label>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                    File Format Requirements
                </h4>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>
                        <strong>workPolicy:</strong> Remote, Hybrid, or On-site
                    </li>
                    <li>
                        <strong>employmentType:</strong> Full-time, Part-time,
                        Contract, or Internship
                    </li>
                    <li>
                        <strong>experienceLevel:</strong> Entry Level, Mid
                        Level, Senior Level, Lead, or Executive
                    </li>
                    <li>
                        <strong>requirements & responsibilities:</strong>{" "}
                        Separate multiple items with semicolons (;)
                    </li>
                </ul>
            </div>
        </div>
    );
}
