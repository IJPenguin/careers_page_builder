import Image from "next/image";
import Link from "next/link";

type Props = {
    companyName: string;
    companyLogo?: string | null;
    logoUrl?: string;
    colorTheme: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
    };
};

export function CareersNavigation({
    companyName,
    companyLogo,
    logoUrl,
    colorTheme,
}: Props) {
    const displayLogo = logoUrl || companyLogo;

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Section */}
                    <div className="flex items-center space-x-3">
                        {displayLogo ? (
                            <div className="relative h-10 w-10">
                                <Image
                                    src={displayLogo}
                                    alt={`${companyName} logo`}
                                    fill
                                    className="object-contain"
                                    sizes="40px"
                                />
                            </div>
                        ) : (
                            <div
                                className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                                style={{ backgroundColor: colorTheme.primary }}
                            >
                                {companyName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <span
                            className="text-xl font-bold"
                            style={{ color: colorTheme.primary }}
                        >
                            {companyName}
                        </span>
                    </div>

                    {/* Navigation Links */}
                    <div
                        className="flex items-center space-x-6 p-2 rounded-md"
                        style={{ background: colorTheme.primary }}
                    >
                        <a
                            href="#jobs"
                            className="text-gray-700 font-semi-bold hover:text-gray-900 transition-colors"
                            style={{
                                color: "white",
                            }}
                        >
                            Open Positions
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}
