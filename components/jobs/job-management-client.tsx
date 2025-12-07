"use client";

import { useState, useEffect } from "react";
import { JobForm } from "@/components/jobs/job-form";
import { BulkJobUpload } from "@/components/jobs/bulk-job-upload";

type Job = {
    id: string;
    title: string;
    workPolicy: "Remote" | "Hybrid" | "On-site";
    location: string;
    department: string;
    employmentType: "Full-time" | "Part-time" | "Contract" | "Internship";
    experienceLevel:
        | "Entry Level"
        | "Mid Level"
        | "Senior Level"
        | "Lead"
        | "Executive";
    jobType: string;
    salaryRange: string | null;
    description: string | null;
    postedDaysAgo: number;
    createdAt: string;
};

type Props = {
    companySlug: string;
};

export function JobManagementClient({ companySlug }: Props) {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    const [showBulkUpload, setShowBulkUpload] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterDepartment, setFilterDepartment] = useState("");

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await fetch(
                `/api/jobs?companySlug=${companySlug}`
            );
            if (response.ok) {
                const result = await response.json();
                setJobs(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (jobId: string) => {
        if (!confirm("Are you sure you want to delete this job?")) return;

        try {
            const response = await fetch(`/api/jobs/${jobId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setJobs(jobs.filter((job) => job.id !== jobId));
            }
        } catch (error) {
            console.error("Failed to delete job:", error);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedJobs.size === 0) return;
        if (
            !confirm(
                `Are you sure you want to delete ${selectedJobs.size} jobs?`
            )
        )
            return;

        try {
            const response = await fetch("/api/jobs/bulk-delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    jobIds: Array.from(selectedJobs),
                }),
            });

            if (response.ok) {
                setJobs(jobs.filter((job) => !selectedJobs.has(job.id)));
                setSelectedJobs(new Set());
            }
        } catch (error) {
            console.error("Failed to bulk delete jobs:", error);
        }
    };

    const toggleJobSelection = (jobId: string) => {
        const newSelected = new Set(selectedJobs);
        if (newSelected.has(jobId)) {
            newSelected.delete(jobId);
        } else {
            newSelected.add(jobId);
        }
        setSelectedJobs(newSelected);
    };

    const toggleSelectAll = () => {
        if (selectedJobs.size === filteredJobs.length) {
            setSelectedJobs(new Set());
        } else {
            setSelectedJobs(new Set(filteredJobs.map((job) => job.id)));
        }
    };

    const departments = Array.from(new Set(jobs.map((job) => job.department)));

    const filteredJobs = jobs.filter((job) => {
        const matchesSearch = job.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesDepartment =
            !filterDepartment || job.department === filterDepartment;
        return matchesSearch && matchesDepartment;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Job Management
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage your job postings - create, edit, and delete
                        positions
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowBulkUpload(true)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Bulk Upload
                    </button>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        + Create Job
                    </button>
                </div>
            </div>

            {/* Create Form Modal */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Create New Job
                        </h3>
                        <JobForm
                            companySlug={companySlug}
                            onSuccess={() => {
                                setShowCreateForm(false);
                                fetchJobs();
                            }}
                            onCancel={() => setShowCreateForm(false)}
                        />
                    </div>
                </div>
            )}

            {/* Edit Form Modal */}
            {editingJob && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Edit Job
                        </h3>
                        <JobForm
                            companySlug={companySlug}
                            initialData={{
                                ...editingJob,
                                salaryRange:
                                    editingJob.salaryRange || undefined,
                                description:
                                    editingJob.description || undefined,
                            }}
                            onSuccess={() => {
                                setEditingJob(null);
                                fetchJobs();
                            }}
                            onCancel={() => setEditingJob(null)}
                        />
                    </div>
                </div>
            )}

            {/* Bulk Upload Modal */}
            {showBulkUpload && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">
                                Bulk Upload Jobs
                            </h3>
                            <button
                                onClick={() => setShowBulkUpload(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <BulkJobUpload
                            companySlug={companySlug}
                            onUploadSuccess={(count) => {
                                fetchJobs();
                                setTimeout(
                                    () => setShowBulkUpload(false),
                                    2000
                                );
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="text-black placeholder:text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <select
                        value={filterDepartment}
                        onChange={(e) => setFilterDepartment(e.target.value)}
                        className="text-black placeholder:text-blackpx-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Departments</option>
                        {departments.map((dept) => (
                            <option key={dept} value={dept}>
                                {dept}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Bulk Actions */}
            {selectedJobs.size > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-900">
                        {selectedJobs.size} job(s) selected
                    </span>
                    <button
                        onClick={handleBulkDelete}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                        Delete Selected
                    </button>
                </div>
            )}

            {/* Jobs List */}
            {filteredJobs.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                        No jobs found
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                        Get started by creating a new job or uploading jobs in
                        bulk.
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={
                                            selectedJobs.size ===
                                                filteredJobs.length &&
                                            filteredJobs.length > 0
                                        }
                                        onChange={toggleSelectAll}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                    />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Job Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Department
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredJobs.map((job) => (
                                <tr key={job.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedJobs.has(job.id)}
                                            onChange={() =>
                                                toggleJobSelection(job.id)
                                            }
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {job.title}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {job.employmentType}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {job.department}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {job.location}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {job.workPolicy}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <button
                                            onClick={() => setEditingJob(job)}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(job.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
