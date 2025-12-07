"use client";

import { useState } from "react";

type SectionContent = Record<string, any>;

type Props = {
    content: SectionContent;
    onSave: (content: SectionContent) => void;
};

export function ContentEditor({ content, onSave }: Props) {
    const [activeSection, setActiveSection] = useState<string>("about");
    const [editedContent, setEditedContent] = useState<SectionContent>(content);
    const [isRewriting, setIsRewriting] = useState<Record<string, boolean>>({});

    const handleFieldChange = (section: string, field: string, value: any) => {
        const newContent = {
            ...editedContent,
            [section]: {
                ...editedContent[section],
                [field]: value,
            },
        };
        setEditedContent(newContent);
        onSave(newContent);
    };

    const handleArrayFieldChange = (
        section: string,
        field: string,
        index: number,
        value: string
    ) => {
        const currentArray = editedContent[section]?.[field] || [];
        const newArray = [...currentArray];
        newArray[index] = value;
        handleFieldChange(section, field, newArray);
    };

    const addArrayItem = (section: string, field: string) => {
        const currentArray = editedContent[section]?.[field] || [];
        handleFieldChange(section, field, [...currentArray, ""]);
    };

    const removeArrayItem = (section: string, field: string, index: number) => {
        const currentArray = editedContent[section]?.[field] || [];
        const newArray = currentArray.filter(
            (_: any, i: number) => i !== index
        );
        handleFieldChange(section, field, newArray);
    };

    const handleAIRewrite = async (
        section: string,
        field: string,
        currentValue: string
    ) => {
        const key = `${section}-${field}`;
        setIsRewriting({ ...isRewriting, [key]: true });

        try {
            const response = await fetch("/api/ai/rewrite", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: currentValue,
                    type: field,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to rewrite");
            }

            const { rewrittenText } = await response.json();
            handleFieldChange(section, field, rewrittenText);
        } catch (error) {
            console.error("AI Rewrite error:", error);
            alert("Failed to rewrite text. Please try again.");
        } finally {
            setIsRewriting({ ...isRewriting, [key]: false });
        }
    };

    const sections = [
        { id: "about", label: "About Us", icon: "📝" },
        { id: "values", label: "Our Values", icon: "⭐" },
        { id: "lifeAtCompany", label: "Life at Company", icon: "🏢" },
        { id: "perks", label: "Perks & Benefits", icon: "🎁" },
        { id: "locations", label: "Locations", icon: "📍" },
        { id: "otherPrograms", label: "Other Programs", icon: "🎯" },
        { id: "testimonials", label: "Testimonials", icon: "💬" },
        { id: "media", label: "Media & Assets", icon: "🎬" },
        { id: "socials", label: "Social Media", icon: "🔗" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Section Content
                </h2>
                <p className="text-sm text-gray-600">
                    Edit the content for each section of your careers page.
                </p>
            </div>

            {/* Section Tabs */}
            <div className="border-b border-gray-200">
                <div className="flex flex-wrap gap-2">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                                activeSection === section.id
                                    ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                        >
                            <span className="mr-1">{section.icon}</span>
                            {section.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Forms */}
            <div className="space-y-4">
                {/* About Section */}
                {activeSection === "about" && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                value={editedContent.about?.title || ""}
                                onChange={(e) =>
                                    handleFieldChange(
                                        "about",
                                        "title",
                                        e.target.value
                                    )
                                }
                                placeholder="About Our Company"
                                className="w-full px-3 py-2 border text-black placeholder:text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <button
                                    onClick={() =>
                                        handleAIRewrite(
                                            "about",
                                            "description",
                                            editedContent.about?.description ||
                                                ""
                                        )
                                    }
                                    disabled={
                                        isRewriting["about-description"] ||
                                        !editedContent.about?.description
                                    }
                                    className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isRewriting["about-description"] ? (
                                        <>
                                            <svg
                                                className="animate-spin h-3 w-3"
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
                                            Rewriting...
                                        </>
                                    ) : (
                                        <>
                                            <span>✨</span>
                                            Rewrite with AI
                                        </>
                                    )}
                                </button>
                            </div>
                            <textarea
                                value={editedContent.about?.description || ""}
                                onChange={(e) =>
                                    handleFieldChange(
                                        "about",
                                        "description",
                                        e.target.value
                                    )
                                }
                                placeholder="Tell your company story..."
                                rows={6}
                                className="text-black placeholder:text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                )}

                {/* Values Section */}
                {activeSection === "values" && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                value={editedContent.values?.title || ""}
                                onChange={(e) =>
                                    handleFieldChange(
                                        "values",
                                        "title",
                                        e.target.value
                                    )
                                }
                                placeholder="Our Core Values"
                                className="text-black placeholder:text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Values List
                            </label>
                            {(editedContent.values?.items || []).map(
                                (item: any, index: number) => (
                                    <div
                                        key={index}
                                        className="mb-3 p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">
                                                Value {index + 1}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    removeArrayItem(
                                                        "values",
                                                        "items",
                                                        index
                                                    )
                                                }
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <svg
                                                    className="w-4 h-4"
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
                                        <input
                                            type="text"
                                            value={item.name || ""}
                                            onChange={(e) => {
                                                const newItems = [
                                                    ...editedContent.values
                                                        .items,
                                                ];
                                                newItems[index] = {
                                                    ...newItems[index],
                                                    name: e.target.value,
                                                };
                                                handleFieldChange(
                                                    "values",
                                                    "items",
                                                    newItems
                                                );
                                            }}
                                            placeholder="Value name (e.g., Innovation)"
                                            className="text-black placeholder:text-black w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg"
                                        />
                                        <input
                                            type="text"
                                            value={item.icon || ""}
                                            onChange={(e) => {
                                                const newItems = [
                                                    ...editedContent.values
                                                        .items,
                                                ];
                                                newItems[index] = {
                                                    ...newItems[index],
                                                    icon: e.target.value,
                                                };
                                                handleFieldChange(
                                                    "values",
                                                    "items",
                                                    newItems
                                                );
                                            }}
                                            placeholder="Icon/Emoji (e.g., 💡 or 🚀)"
                                            className="text-black placeholder:text-black w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg"
                                        />
                                        <textarea
                                            value={item.description || ""}
                                            onChange={(e) => {
                                                const newItems = [
                                                    ...editedContent.values
                                                        .items,
                                                ];
                                                newItems[index] = {
                                                    ...newItems[index],
                                                    description: e.target.value,
                                                };
                                                handleFieldChange(
                                                    "values",
                                                    "items",
                                                    newItems
                                                );
                                            }}
                                            placeholder="Value description"
                                            rows={2}
                                            className="text-black placeholder:text-black w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                )
                            )}
                            <button
                                onClick={() => addArrayItem("values", "items")}
                                className="w-full px-4 py-2 text-sm font-medium text-blue-600 border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                + Add Value
                            </button>
                        </div>
                    </div>
                )}

                {/* Life at Company Section */}
                {activeSection === "lifeAtCompany" && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                value={editedContent.lifeAtCompany?.title || ""}
                                onChange={(e) =>
                                    handleFieldChange(
                                        "lifeAtCompany",
                                        "title",
                                        e.target.value
                                    )
                                }
                                placeholder="Life at Our Company"
                                className="text-black placeholder:text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <button
                                    onClick={() =>
                                        handleAIRewrite(
                                            "lifeAtCompany",
                                            "description",
                                            editedContent.lifeAtCompany
                                                ?.description || ""
                                        )
                                    }
                                    disabled={
                                        isRewriting[
                                            "lifeAtCompany-description"
                                        ] ||
                                        !editedContent.lifeAtCompany
                                            ?.description
                                    }
                                    className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isRewriting[
                                        "lifeAtCompany-description"
                                    ] ? (
                                        <>
                                            <svg
                                                className="animate-spin h-3 w-3"
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
                                            Rewriting...
                                        </>
                                    ) : (
                                        <>
                                            <span>✨</span>
                                            Rewrite with AI
                                        </>
                                    )}
                                </button>
                            </div>
                            <textarea
                                value={
                                    editedContent.lifeAtCompany?.description ||
                                    ""
                                }
                                onChange={(e) =>
                                    handleFieldChange(
                                        "lifeAtCompany",
                                        "description",
                                        e.target.value
                                    )
                                }
                                placeholder="Describe what it's like to work here..."
                                rows={4}
                                className="text-black placeholder:text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                )}

                {/* Perks Section */}
                {activeSection === "perks" && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                value={editedContent.perks?.title || ""}
                                onChange={(e) =>
                                    handleFieldChange(
                                        "perks",
                                        "title",
                                        e.target.value
                                    )
                                }
                                placeholder="Perks & Benefits"
                                className="text-black placeholder:text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Perks List
                            </label>
                            {(editedContent.perks?.items || []).map(
                                (_: string, index: number) => (
                                    <div
                                        key={index}
                                        className="flex gap-2 mb-2"
                                    >
                                        <input
                                            type="text"
                                            value={
                                                editedContent.perks?.items[
                                                    index
                                                ] || ""
                                            }
                                            onChange={(e) =>
                                                handleArrayFieldChange(
                                                    "perks",
                                                    "items",
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter a perk..."
                                            className="text-black placeholder:text-black flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                                        />
                                        <button
                                            onClick={() =>
                                                removeArrayItem(
                                                    "perks",
                                                    "items",
                                                    index
                                                )
                                            }
                                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <svg
                                                className="w-5 h-5"
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
                                )
                            )}
                            <button
                                onClick={() => addArrayItem("perks", "items")}
                                className="w-full px-4 py-2 text-sm font-medium text-blue-600 border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                + Add Perk
                            </button>
                        </div>
                    </div>
                )}

                {/* Other Programs Section */}
                {activeSection === "otherPrograms" && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                value={editedContent.otherPrograms?.title || ""}
                                onChange={(e) =>
                                    handleFieldChange(
                                        "otherPrograms",
                                        "title",
                                        e.target.value
                                    )
                                }
                                placeholder="Other Programs"
                                className="text-black placeholder:text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <button
                                    onClick={() =>
                                        handleAIRewrite(
                                            "otherPrograms",
                                            "description",
                                            editedContent.otherPrograms
                                                ?.description || ""
                                        )
                                    }
                                    disabled={
                                        isRewriting[
                                            "otherPrograms-description"
                                        ] ||
                                        !editedContent.otherPrograms
                                            ?.description
                                    }
                                    className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isRewriting[
                                        "otherPrograms-description"
                                    ] ? (
                                        <>
                                            <svg
                                                className="animate-spin h-3 w-3"
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
                                            Rewriting...
                                        </>
                                    ) : (
                                        <>
                                            <span>✨</span>
                                            Rewrite with AI
                                        </>
                                    )}
                                </button>
                            </div>
                            <textarea
                                value={
                                    editedContent.otherPrograms?.description ||
                                    ""
                                }
                                onChange={(e) =>
                                    handleFieldChange(
                                        "otherPrograms",
                                        "description",
                                        e.target.value
                                    )
                                }
                                placeholder="Describe other programs like internships, fellowships, apprenticeships..."
                                rows={4}
                                className="text-black placeholder:text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                )}

                {/* Locations Section */}
                {activeSection === "locations" && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                value={editedContent.locations?.title || ""}
                                onChange={(e) =>
                                    handleFieldChange(
                                        "locations",
                                        "title",
                                        e.target.value
                                    )
                                }
                                placeholder="Our Locations"
                                className="text-black placeholder:text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Locations List
                            </label>
                            {(editedContent.locations?.items || []).map(
                                (_: string, index: number) => (
                                    <div
                                        key={index}
                                        className="flex gap-2 mb-2"
                                    >
                                        <input
                                            type="text"
                                            value={
                                                editedContent.locations?.items[
                                                    index
                                                ] || ""
                                            }
                                            onChange={(e) =>
                                                handleArrayFieldChange(
                                                    "locations",
                                                    "items",
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            placeholder="City, Country"
                                            className="text-black placeholder:text-black flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                                        />
                                        <button
                                            onClick={() =>
                                                removeArrayItem(
                                                    "locations",
                                                    "items",
                                                    index
                                                )
                                            }
                                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <svg
                                                className="w-5 h-5"
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
                                )
                            )}
                            <button
                                onClick={() =>
                                    addArrayItem("locations", "items")
                                }
                                className="w-full px-4 py-2 text-sm font-medium text-blue-600 border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                + Add Location
                            </button>
                        </div>
                    </div>
                )}

                {/* Testimonials Section */}
                {activeSection === "testimonials" && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                value={editedContent.testimonials?.title || ""}
                                onChange={(e) =>
                                    handleFieldChange(
                                        "testimonials",
                                        "title",
                                        e.target.value
                                    )
                                }
                                placeholder="What Our Team Says"
                                className="text-black placeholder:text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Testimonials
                            </label>
                            {(editedContent.testimonials?.items || []).map(
                                (item: any, index: number) => (
                                    <div
                                        key={index}
                                        className="mb-3 p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">
                                                Testimonial {index + 1}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    removeArrayItem(
                                                        "testimonials",
                                                        "items",
                                                        index
                                                    )
                                                }
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <svg
                                                    className="w-4 h-4"
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
                                        <textarea
                                            value={item.quote || ""}
                                            onChange={(e) => {
                                                const newItems = [
                                                    ...editedContent
                                                        .testimonials.items,
                                                ];
                                                newItems[index] = {
                                                    ...newItems[index],
                                                    quote: e.target.value,
                                                };
                                                handleFieldChange(
                                                    "testimonials",
                                                    "items",
                                                    newItems
                                                );
                                            }}
                                            placeholder="Quote"
                                            rows={3}
                                            className="text-black placeholder:text-black w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg"
                                        />
                                        <input
                                            type="text"
                                            value={item.name || ""}
                                            onChange={(e) => {
                                                const newItems = [
                                                    ...editedContent
                                                        .testimonials.items,
                                                ];
                                                newItems[index] = {
                                                    ...newItems[index],
                                                    name: e.target.value,
                                                };
                                                handleFieldChange(
                                                    "testimonials",
                                                    "items",
                                                    newItems
                                                );
                                            }}
                                            placeholder="Name"
                                            className="text-black placeholder:text-black w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg"
                                        />
                                        <input
                                            type="text"
                                            value={item.role || ""}
                                            onChange={(e) => {
                                                const newItems = [
                                                    ...editedContent
                                                        .testimonials.items,
                                                ];
                                                newItems[index] = {
                                                    ...newItems[index],
                                                    role: e.target.value,
                                                };
                                                handleFieldChange(
                                                    "testimonials",
                                                    "items",
                                                    newItems
                                                );
                                            }}
                                            placeholder="Role"
                                            className="text-black placeholder:text-black w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                )
                            )}
                            <button
                                onClick={() =>
                                    addArrayItem("testimonials", "items")
                                }
                                className="w-full px-4 py-2 text-sm font-medium text-blue-600 border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                + Add Testimonial
                            </button>
                        </div>
                    </div>
                )}

                {/* Media Section */}
                {activeSection === "media" && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company Logo URL
                            </label>
                            <input
                                type="url"
                                value={editedContent.media?.logo || ""}
                                onChange={(e) =>
                                    handleFieldChange(
                                        "media",
                                        "logo",
                                        e.target.value
                                    )
                                }
                                placeholder="https://example.com/logo.png"
                                className="text-black placeholder:text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Enter the URL of your company logo. Recommended
                                size: 200x200px or larger.
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company Video URL
                            </label>
                            <input
                                type="url"
                                value={editedContent.media?.video || ""}
                                onChange={(e) =>
                                    handleFieldChange(
                                        "media",
                                        "video",
                                        e.target.value
                                    )
                                }
                                placeholder="https://www.youtube.com/embed/... or https://vimeo.com/..."
                                className="text-black placeholder:text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Enter a YouTube or Vimeo embed URL (not the
                                regular watch URL). This video will be displayed
                                on your careers page.
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Video Title
                            </label>
                            <input
                                type="text"
                                value={editedContent.media?.videoTitle || ""}
                                onChange={(e) =>
                                    handleFieldChange(
                                        "media",
                                        "videoTitle",
                                        e.target.value
                                    )
                                }
                                placeholder="Life at Our Company"
                                className="text-black placeholder:text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        {editedContent.media?.video && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 mb-2">
                                    Video Preview
                                </p>
                                <div
                                    className="relative w-full"
                                    style={{ paddingBottom: "56.25%" }}
                                >
                                    <iframe
                                        src={editedContent.media.video}
                                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title={
                                            editedContent.media.videoTitle ||
                                            "Company video"
                                        }
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Socials Section */}
                {activeSection === "socials" && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                value={editedContent.socials?.title || ""}
                                onChange={(e) =>
                                    handleFieldChange(
                                        "socials",
                                        "title",
                                        e.target.value
                                    )
                                }
                                placeholder="Connect With Us"
                                className="text-black placeholder:text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                LinkedIn URL
                            </label>
                            <input
                                type="url"
                                value={editedContent.socials?.linkedin || ""}
                                onChange={(e) =>
                                    handleFieldChange(
                                        "socials",
                                        "linkedin",
                                        e.target.value
                                    )
                                }
                                placeholder="https://linkedin.com/company/..."
                                className="text-black placeholder:text-black w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Twitter URL
                            </label>
                            <input
                                type="url"
                                value={editedContent.socials?.twitter || ""}
                                onChange={(e) =>
                                    handleFieldChange(
                                        "socials",
                                        "twitter",
                                        e.target.value
                                    )
                                }
                                placeholder="https://twitter.com/..."
                                className="text-black placeholder:text-black w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Facebook URL
                            </label>
                            <input
                                type="url"
                                value={editedContent.socials?.facebook || ""}
                                onChange={(e) =>
                                    handleFieldChange(
                                        "socials",
                                        "facebook",
                                        e.target.value
                                    )
                                }
                                placeholder="https://facebook.com/..."
                                className="text-black placeholder:text-black w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                    💡 Changes are automatically saved
                </p>
            </div>
        </div>
    );
}
