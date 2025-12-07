export default function LoginLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="w-[120px] h-[120px] bg-gray-200 rounded-lg animate-pulse" />
                    </div>
                    <div className="h-9 bg-gray-200 rounded w-48 mx-auto animate-pulse mb-2" />
                    <div className="h-5 bg-gray-200 rounded w-64 mx-auto animate-pulse" />
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
                    <div className="h-10 bg-gray-200 rounded animate-pulse" />
                    <div className="h-10 bg-gray-200 rounded animate-pulse" />
                    <div className="h-10 bg-gray-200 rounded animate-pulse mt-6" />
                </div>
            </div>
        </div>
    );
}
