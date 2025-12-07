"use client";

import { useState, useEffect } from "react";
import { DragDropProvider } from "./drag-drop-provider";
import { DraggableSection } from "./draggable-section";

type Section = {
    id: string;
    name: string;
    label: string;
    enabled: boolean;
};

const AVAILABLE_SECTIONS: Omit<Section, "enabled">[] = [
    { id: "about", name: "about", label: "About Us" },
    { id: "values", name: "values", label: "Our Values" },
    { id: "lifeAtCompany", name: "lifeAtCompany", label: "Life at Company" },
    { id: "perks", name: "perks", label: "Perks & Benefits" },
    { id: "locations", name: "locations", label: "Locations" },
    { id: "otherPrograms", name: "otherPrograms", label: "Other Programs" },
    { id: "testimonials", name: "testimonials", label: "Testimonials" },
    { id: "media", name: "media", label: "Media & Assets" },
    { id: "socials", name: "socials", label: "Social Media" },
    { id: "jobs", name: "jobs", label: "Open Jobs" },
];

type Props = {
    companySlug: string;
    initialOrder: string[];
    initialSelector: string[];
    onSave: (order: string[], selector: string[]) => Promise<void>;
};

export function SectionOrderManager({
    companySlug,
    initialOrder,
    initialSelector,
    onSave,
}: Props) {
    const [sections, setSections] = useState<Section[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    useEffect(() => {
        // Initialize sections based on saved order and selector
        const orderedSections: Section[] = [];

        // First, add sections in the saved order
        initialOrder.forEach((sectionName) => {
            const sectionDef = AVAILABLE_SECTIONS.find(
                (s) => s.name === sectionName
            );
            if (sectionDef) {
                orderedSections.push({
                    ...sectionDef,
                    enabled: initialSelector.includes(sectionName),
                });
            }
        });

        // Then, add any remaining sections that aren't in the order yet
        AVAILABLE_SECTIONS.forEach((sectionDef) => {
            if (!orderedSections.find((s) => s.name === sectionDef.name)) {
                orderedSections.push({
                    ...sectionDef,
                    enabled: initialSelector.includes(sectionDef.name),
                });
            }
        });

        setSections(orderedSections);
    }, [initialOrder, initialSelector]);

    const handleOrderChange = (newSections: Section[]) => {
        setSections(newSections);
    };

    const handleToggleSection = (sectionId: string) => {
        setSections((prev) =>
            prev.map((s) =>
                s.id === sectionId ? { ...s, enabled: !s.enabled } : s
            )
        );
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setSaveMessage(null);

            const order = sections.map((s) => s.name);
            const selector = sections
                .filter((s) => s.enabled)
                .map((s) => s.name);

            await onSave(order, selector);

            setSaveMessage({ type: "success", text: "Section order saved!" });
            setTimeout(() => setSaveMessage(null), 3000);
        } catch (error) {
            setSaveMessage({
                type: "error",
                text: error instanceof Error ? error.message : "Failed to save",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Section Order
                </h2>
                <p className="text-sm text-gray-600">
                    Drag sections to reorder them. Toggle checkboxes to
                    show/hide sections on your careers page.
                </p>
            </div>

            {/* Section List with Checkboxes */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Available Sections
                </h3>
                {sections.map((section) => (
                    <div
                        key={section.id}
                        className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg"
                    >
                        <input
                            type="checkbox"
                            id={`section-${section.id}`}
                            checked={section.enabled}
                            onChange={() => handleToggleSection(section.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                            htmlFor={`section-${section.id}`}
                            className="text-sm font-medium text-gray-900 cursor-pointer flex-1"
                        >
                            {section.label}
                        </label>
                    </div>
                ))}
            </div>

            {/* Drag and Drop Section Order */}
            <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Section Order (Drag to Reorder)
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                    Only enabled sections can be reordered
                </p>
                <DragDropProvider
                    initialSections={sections}
                    onOrderChange={handleOrderChange}
                >
                    {sections
                        .filter((s) => s.enabled)
                        .map((section) => (
                            <DraggableSection
                                key={section.id}
                                id={section.id}
                                label={section.label}
                            />
                        ))}
                </DragDropProvider>
            </div>

            {/* Save Button and Status */}
            <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex-1">
                    {saveMessage && (
                        <div
                            className={`text-sm font-medium ${
                                saveMessage.type === "success"
                                    ? "text-green-600"
                                    : "text-red-600"
                            }`}
                        >
                            {saveMessage.type === "success" && (
                                <span className="inline-flex items-center">
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
                                    {saveMessage.text}
                                </span>
                            )}
                            {saveMessage.type === "error" && saveMessage.text}
                        </div>
                    )}
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {isSaving ? "Saving..." : "Save Order"}
                </button>
            </div>
        </div>
    );
}
