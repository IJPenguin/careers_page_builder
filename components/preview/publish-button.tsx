"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

type Props = {
    companySlug: string;
};

export function PublishButton({ companySlug }: Props) {
    const router = useRouter();
    const [isPublishing, setIsPublishing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handlePublish = async () => {
        try {
            setIsPublishing(true);
            setError(null);

            const response = await fetch(
                `/api/careers/${companySlug}/publish`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to publish changes");
            }

            setSuccess(true);
            toast.success("Changes published!", {
                description: "Your careers page is now live.",
            });

            // Show success message for 2 seconds then refresh
            setTimeout(() => {
                router.refresh();
                setSuccess(false);
            }, 2000);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "An error occurred";
            setError(errorMessage);
            toast.error("Failed to publish", {
                description: errorMessage,
            });
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="flex items-center space-x-3">
            {error && <span className="text-sm text-red-600">{error}</span>}
            {success && (
                <span className="text-sm text-green-600 flex items-center">
                    <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Published successfully!
                </span>
            )}
            <a
                href={`/${companySlug}/edit`}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
                Back to Edit
            </a>
            <button
                onClick={handlePublish}
                disabled={isPublishing || success}
                className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
                {isPublishing ? (
                    <>
                        <LoadingSpinner
                            size="sm"
                            className="mr-2 border-white border-t-transparent"
                        />
                        Publishing...
                    </>
                ) : success ? (
                    "Published!"
                ) : (
                    "Publish Changes"
                )}
            </button>
        </div>
    );
}
