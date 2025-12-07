"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { SectionOrderManager } from "@/components/editor/section-order-manager";
import { ContentEditor } from "@/components/editor/content-editor";
import { ThemeCustomizer } from "@/components/editor/theme-customizer";
import { HeroTemplateEditor } from "@/components/editor/hero-template-editor";
import { LivePreview } from "@/components/editor/live-preview";
import { HeroConfig } from "@/types/hero-templates";

type ColorTheme = {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
};

type Props = {
    companySlug: string;
    companyName: string;
    companyLogo: string | null;
    initialOrder: string[];
    initialSelector: string[];
    initialContent: Record<string, any>;
    initialColorTheme: ColorTheme;
    initialFontStyle: string;
    initialHeroConfig: HeroConfig;
};

export function EditPageClient({
    companySlug,
    companyName,
    companyLogo,
    initialOrder,
    initialSelector,
    initialContent,
    initialColorTheme,
    initialFontStyle,
    initialHeroConfig,
}: Props) {
    const [activeTab, setActiveTab] = useState<
        "sections" | "content" | "theme" | "hero"
    >("sections");
    const [autoSaveStatus, setAutoSaveStatus] = useState<
        "idle" | "saving" | "saved" | "error"
    >("idle");
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // State for live preview updates
    const [currentContent, setCurrentContent] = useState(initialContent);
    const [currentTheme, setCurrentTheme] = useState(initialColorTheme);
    const [currentFont, setCurrentFont] = useState(initialFontStyle);
    const [currentHero, setCurrentHero] = useState(initialHeroConfig);
    const [currentOrder, setCurrentOrder] = useState(initialOrder);

    // Auto-save function with debounce
    const autoSave = useCallback(
        async (data: {
            sectionContent?: Record<string, any>;
            colorTheme?: ColorTheme;
            fontStyle?: string;
        }) => {
            try {
                setAutoSaveStatus("saving");

                const response = await fetch(
                    `/api/careers/${companySlug}/content`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data),
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to auto-save");
                }

                setAutoSaveStatus("saved");
                setTimeout(() => setAutoSaveStatus("idle"), 2000);
            } catch (error) {
                console.error("Auto-save error:", error);
                setAutoSaveStatus("error");
                setTimeout(() => setAutoSaveStatus("idle"), 3000);
            }
        },
        [companySlug]
    );

    // Debounced save handler
    const debouncedSave = useCallback(
        (data: {
            sectionContent?: Record<string, any>;
            colorTheme?: ColorTheme;
            fontStyle?: string;
            heroConfig?: HeroConfig;
        }) => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }

            saveTimeoutRef.current = setTimeout(() => {
                autoSave(data);
            }, 1000); // 1 second debounce
        },
        [autoSave]
    );

    const handleSaveSectionOrder = async (
        order: string[],
        selector: string[]
    ) => {
        const response = await fetch(`/api/careers/${companySlug}/sections`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                orderOfSections: order,
                sectionSelector: selector,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to save section order");
        }

        return response.json();
    };

    const handleContentSave = (content: Record<string, any>) => {
        setCurrentContent(content);
        debouncedSave({ sectionContent: content });
    };

    const handleThemeSave = (theme: ColorTheme, font: string) => {
        setCurrentTheme(theme);
        setCurrentFont(font);
        debouncedSave({ colorTheme: theme, fontStyle: font });
    };

    const handleHeroSave = (heroConfig: HeroConfig) => {
        setCurrentHero(heroConfig);
        debouncedSave({ heroConfig });
    };

    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Editor Controls */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                    {/* Auto-save Status */}
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            {autoSaveStatus === "saving" && (
                                <>
                                    <svg
                                        className="animate-spin h-4 w-4 text-blue-600"
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
                                    <span className="text-sm text-gray-600">
                                        Saving...
                                    </span>
                                </>
                            )}
                            {autoSaveStatus === "saved" && (
                                <>
                                    <svg
                                        className="h-4 w-4 text-green-600"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="text-sm text-green-600">
                                        Saved
                                    </span>
                                </>
                            )}
                            {autoSaveStatus === "error" && (
                                <>
                                    <svg
                                        className="h-4 w-4 text-red-600"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="text-sm text-red-600">
                                        Save failed
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab("hero")}
                            className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                                activeTab === "hero"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Hero
                        </button>
                        <button
                            onClick={() => setActiveTab("sections")}
                            className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                                activeTab === "sections"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Sections
                        </button>
                        <button
                            onClick={() => setActiveTab("content")}
                            className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                                activeTab === "content"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Content
                        </button>
                        <button
                            onClick={() => setActiveTab("theme")}
                            className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === "theme"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Theme
                        </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === "hero" && (
                        <HeroTemplateEditor
                            config={initialHeroConfig}
                            onSave={handleHeroSave}
                        />
                    )}

                    {activeTab === "sections" && (
                        <SectionOrderManager
                            companySlug={companySlug}
                            initialOrder={initialOrder}
                            initialSelector={initialSelector}
                            onSave={handleSaveSectionOrder}
                        />
                    )}

                    {activeTab === "content" && (
                        <ContentEditor
                            content={currentContent}
                            onSave={handleContentSave}
                        />
                    )}

                    {activeTab === "theme" && (
                        <ThemeCustomizer
                            colorTheme={currentTheme}
                            fontStyle={currentFont}
                            onSave={handleThemeSave}
                        />
                    )}
                </div>
            </div>

            {/* Right Side - Preview */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Live Preview
                        </h2>
                        <a
                            href={`/${companySlug}/preview`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Open Full Preview →
                        </a>
                    </div>
                    <div className="max-h-[800px] overflow-y-auto">
                        <LivePreview
                            companySlug={companySlug}
                            companyName={companyName}
                            companyLogo={companyLogo}
                            activeTab={activeTab}
                            content={currentContent}
                            colorTheme={currentTheme}
                            fontStyle={currentFont}
                            heroConfig={currentHero}
                            orderOfSections={currentOrder}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
