"use client";

import { useState } from "react";
import {
    HeroConfig,
    HeroTemplate,
    HERO_TEMPLATES,
    DEFAULT_HERO_CONFIG,
} from "@/types/hero-templates";

type Props = {
    config: HeroConfig;
    onSave: (config: HeroConfig) => void;
};

export function HeroTemplateEditor({ config, onSave }: Props) {
    const [localConfig, setLocalConfig] = useState<HeroConfig>(config);

    const handleTemplateChange = (template: HeroTemplate) => {
        const updated = { ...localConfig, template };
        setLocalConfig(updated);
        onSave(updated);
    };

    const handleFieldChange = (field: keyof HeroConfig, value: any) => {
        const updated = { ...localConfig, [field]: value };
        setLocalConfig(updated);
        onSave(updated);
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Hero Section
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                    Customize the hero section that appears at the top of your
                    careers page.
                </p>
            </div>

            {/* Template Selector */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Choose Template
                </label>
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(HERO_TEMPLATES).map((template) => (
                        <button
                            key={template.id}
                            onClick={() => handleTemplateChange(template.id)}
                            className={`text-left p-4 border-2 rounded-lg transition-all ${
                                localConfig.template === template.id
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200 hover:border-gray-300"
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 mb-1">
                                        {template.name}
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {template.description}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {template.preview}
                                    </p>
                                </div>
                                {localConfig.template === template.id && (
                                    <svg
                                        className="w-5 h-5 text-blue-500 flex-shrink-0 ml-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Customization Fields */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900">
                    Customize Content
                </h4>

                {/* Headline */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Headline
                    </label>
                    <input
                        type="text"
                        value={localConfig.headline || ""}
                        onChange={(e) =>
                            handleFieldChange("headline", e.target.value)
                        }
                        placeholder="Join Our Team"
                        className="w-full text-black placeholder:text-black px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Subheadline */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subheadline
                    </label>
                    <textarea
                        value={localConfig.subheadline || ""}
                        onChange={(e) =>
                            handleFieldChange("subheadline", e.target.value)
                        }
                        placeholder="Build the future with us"
                        rows={2}
                        className="w-full text-black placeholder:text-black px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* CTA Text */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Text
                    </label>
                    <input
                        type="text"
                        value={localConfig.ctaText || ""}
                        onChange={(e) =>
                            handleFieldChange("ctaText", e.target.value)
                        }
                        placeholder="View Open Positions"
                        className="w-full px-3 py-2 border text-black placeholder:text-black border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* CTA Link */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Link
                    </label>
                    <input
                        type="text"
                        value={localConfig.ctaLink || ""}
                        onChange={(e) =>
                            handleFieldChange("ctaLink", e.target.value)
                        }
                        placeholder="#jobs"
                        className="w-full px-3 py-2 border text-black placeholder:text-black border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Show Logo Toggle */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="showLogo"
                        checked={localConfig.showLogo ?? true}
                        onChange={(e) =>
                            handleFieldChange("showLogo", e.target.checked)
                        }
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                        htmlFor="showLogo"
                        className="ml-2 text-sm text-gray-700"
                    >
                        Show company logo
                    </label>
                </div>

                {/* Background Image (for split and image-background templates) */}
                {(localConfig.template === "split" ||
                    localConfig.template === "image-background") && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Background Image URL
                        </label>
                        <input
                            type="text"
                            value={localConfig.backgroundImage || ""}
                            onChange={(e) =>
                                handleFieldChange(
                                    "backgroundImage",
                                    e.target.value
                                )
                            }
                            placeholder="https://example.com/image.jpg"
                            className="text-black placeholder:text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Leave empty to use gradient colors
                        </p>
                    </div>
                )}

                {/* Overlay Opacity (for image-background template) */}
                {localConfig.template === "image-background" && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Overlay Opacity:{" "}
                            {Math.round(
                                (localConfig.overlayOpacity ?? 0.5) * 100
                            )}
                            %
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={localConfig.overlayOpacity ?? 0.5}
                            onChange={(e) =>
                                handleFieldChange(
                                    "overlayOpacity",
                                    parseFloat(e.target.value)
                                )
                            }
                            className="w-full"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Adjust the darkness of the overlay on the background
                            image
                        </p>
                    </div>
                )}
            </div>

            {/* Reset Button */}
            <div className="pt-4 border-t border-gray-200">
                <button
                    onClick={() => {
                        setLocalConfig(DEFAULT_HERO_CONFIG);
                        onSave(DEFAULT_HERO_CONFIG);
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900 underline"
                >
                    Reset to defaults
                </button>
            </div>
        </div>
    );
}
