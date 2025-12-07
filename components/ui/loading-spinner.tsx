interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}

export function LoadingSpinner({
    size = "md",
    className = "",
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "w-4 h-4 border-2",
        md: "w-8 h-8 border-3",
        lg: "w-12 h-12 border-4",
    };

    return (
        <div
            className={`${sizeClasses[size]} border-blue-600 border-t-transparent rounded-full animate-spin ${className}`}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
}

export function LoadingOverlay({
    message = "Loading...",
}: {
    message?: string;
}) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 shadow-xl flex flex-col items-center space-y-4">
                <LoadingSpinner size="lg" />
                <p className="text-gray-700 font-medium">{message}</p>
            </div>
        </div>
    );
}

export function LoadingPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center space-y-4">
                <LoadingSpinner size="lg" className="mx-auto" />
                <p className="text-gray-600 text-lg">Loading...</p>
            </div>
        </div>
    );
}
