"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type Job = {
    id: string;
    title: string;
    workPolicy: string;
    location: string;
    department: string;
    employmentType: string;
    experienceLevel: string;
    jobType: string;
    salaryRange: string | null;
    jobSlug: string;
    postedDaysAgo: number;
};

type Props = {
    jobs: Job[];
    companySlug: string;
    colorTheme: any;
};

export function JobsListing({ jobs, companySlug, colorTheme }: Props) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        department: "",
        location: "",
        workPolicy: "",
        employmentType: "",
    });

    // Extract unique values for filters
    const filterOptions = useMemo(() => {
        return {
            departments: [...new Set(jobs.map((j) => j.department))].sort(),
            locations: [...new Set(jobs.map((j) => j.location))].sort(),
            workPolicies: [...new Set(jobs.map((j) => j.workPolicy))].sort(),
            employmentTypes: [
                ...new Set(jobs.map((j) => j.employmentType)),
            ].sort(),
        };
    }, [jobs]);

    // Filter jobs based on search and filters
    const filteredJobs = useMemo(() => {
        return jobs.filter((job) => {
            // Search filter
            if (
                searchQuery &&
                !job.title.toLowerCase().includes(searchQuery.toLowerCase())
            ) {
                return false;
            }

            // Department filter
            if (filters.department && job.department !== filters.department) {
                return false;
            }

            // Location filter
            if (filters.location && job.location !== filters.location) {
                return false;
            }

            // Work Policy filter
            if (filters.workPolicy && job.workPolicy !== filters.workPolicy) {
                return false;
            }

            // Employment Type filter
            if (
                filters.employmentType &&
                job.employmentType !== filters.employmentType
            ) {
                return false;
            }

            return true;
        });
    }, [jobs, searchQuery, filters]);

    const clearFilters = () => {
        setSearchQuery("");
        setFilters({
            department: "",
            location: "",
            workPolicy: "",
            employmentType: "",
        });
    };

    const activeFiltersCount =
        Object.values(filters).filter((v) => v).length + (searchQuery ? 1 : 0);

    return (
        <section
            id="jobs"
            className="py-16"
            style={{ backgroundColor: colorTheme.background }}
            aria-labelledby="jobs-heading"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex flex-col justify-center items-center">
                    <h2
                        id="jobs-heading"
                        className="text-3xl md:text-4xl font-bold mb-2"
                        style={{ color: colorTheme.primary }}
                    >
                        Open Positions
                    </h2>
                    <p className="text-lg" style={{ color: colorTheme.text }}>
                        {filteredJobs.length === 0 && jobs.length > 0
                            ? "No positions match your filters"
                            : filteredJobs.length === 0
                            ? "No open positions at the moment. Check back soon!"
                            : `${filteredJobs.length} ${
                                  filteredJobs.length === 1
                                      ? "position"
                                      : "positions"
                              } available`}
                    </p>
                </div>

                {jobs.length > 0 && (
                    <>
                        {/* Search and Filters */}
                        <div className="mb-8 space-y-4">
                            {/* Search Bar */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search job titles..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="text-black placeholder:text-black outline-none focus:ring-0 focus:outline-none w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg"
                                    style={{
                                        borderColor: colorTheme.accent,
                                    }}
                                />
                                <svg
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>

                            {/* Filter Dropdowns */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <select
                                    value={filters.department}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            department: e.target.value,
                                        })
                                    }
                                    className=" text-black placeholder:text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                                    style={{ borderColor: colorTheme.accent }}
                                >
                                    <option value="">All Departments</option>
                                    {filterOptions.departments.map((dept) => (
                                        <option key={dept} value={dept}>
                                            {dept}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={filters.location}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            location: e.target.value,
                                        })
                                    }
                                    className="px-4 py-2 border text-black placeholder:text-black border-gray-300 rounded-lg focus:outline-none"
                                    style={{ borderColor: colorTheme.accent }}
                                >
                                    <option value="">All Locations</option>
                                    {filterOptions.locations.map((loc) => (
                                        <option key={loc} value={loc}>
                                            {loc}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={filters.workPolicy}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            workPolicy: e.target.value,
                                        })
                                    }
                                    className="px-4 py-2 border text-black placeholder:text-black border-gray-300 rounded-lg focus:outline-none "
                                    style={{ borderColor: colorTheme.accent }}
                                >
                                    <option value="">All Work Policies</option>
                                    {filterOptions.workPolicies.map(
                                        (policy) => (
                                            <option key={policy} value={policy}>
                                                {policy}
                                            </option>
                                        )
                                    )}
                                </select>

                                <select
                                    value={filters.employmentType}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            employmentType: e.target.value,
                                        })
                                    }
                                    className="px-4 text-black focus:border-gray-300 placeholder:text-black py-2 border border-gray-300 rounded-lg focus:outline-none "
                                    style={{ borderColor: colorTheme.accent }}
                                >
                                    <option value="">
                                        All Employment Types
                                    </option>
                                    {filterOptions.employmentTypes.map(
                                        (type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {/* Clear Filters Button */}
                            {activeFiltersCount > 0 && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        {activeFiltersCount} filter
                                        {activeFiltersCount > 1 ? "s" : ""}{" "}
                                        active
                                    </span>
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm font-medium transition-colors"
                                        style={{ color: colorTheme.primary }}
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Jobs Grid */}
                        {filteredJobs.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {filteredJobs.map((job) => (
                                    <Link
                                        key={job.id}
                                        href={`/${companySlug}/careers/jobs/${job.jobSlug}`}
                                        className="block bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow"
                                        style={{
                                            borderColor: colorTheme.accent,
                                        }}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h3
                                                className="text-xl font-semibold flex-1"
                                                style={{
                                                    color: colorTheme.text,
                                                }}
                                            >
                                                {job.title}
                                            </h3>
                                            {job.postedDaysAgo <= 7 && (
                                                <span
                                                    className="px-2 py-1 text-xs font-medium rounded"
                                                    style={{
                                                        backgroundColor:
                                                            colorTheme.accent +
                                                            "30",
                                                        color: colorTheme.primary,
                                                    }}
                                                >
                                                    New
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                                            <p className="flex items-center">
                                                <svg
                                                    className="w-4 h-4 mr-2 shrink-0"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                </svg>
                                                {job.location}
                                            </p>
                                            <p className="flex items-center">
                                                <svg
                                                    className="w-4 h-4 mr-2 shrink-0"
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
                                                {job.department}
                                            </p>
                                            <p className="flex items-center">
                                                <svg
                                                    className="w-4 h-4 mr-2 shrink-0"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                {job.employmentType}
                                            </p>
                                            {job.salaryRange && (
                                                <p className="flex items-center">
                                                    <svg
                                                        className="w-4 h-4 mr-2 shrink-0"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                        />
                                                    </svg>
                                                    {job.salaryRange}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span
                                                className="px-2 py-1 text-xs font-medium rounded"
                                                style={{
                                                    backgroundColor:
                                                        colorTheme.accent +
                                                        "20",
                                                    color: colorTheme.primary,
                                                }}
                                            >
                                                {job.workPolicy}
                                            </span>
                                            <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-50 rounded">
                                                {job.experienceLevel}
                                            </span>
                                        </div>

                                        <div
                                            className="text-sm font-medium flex items-center"
                                            style={{
                                                color: colorTheme.primary,
                                            }}
                                        >
                                            View Details
                                            <svg
                                                className="w-4 h-4 ml-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
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
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                                <p className="mt-4 text-gray-600">
                                    No jobs match your current filters
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="mt-2 font-medium"
                                    style={{ color: colorTheme.primary }}
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
