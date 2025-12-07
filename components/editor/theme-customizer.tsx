"use client";

import { useState, useEffect } from "react";

type ColorTheme = {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
};

type Props = {
    colorTheme: ColorTheme;
    fontStyle: string;
    onSave: (theme: ColorTheme, font: string) => void;
};

const FONT_OPTIONS = [
    { value: "Inter", label: "Inter (Modern Sans)" },
    { value: "Georgia", label: "Georgia (Serif)" },
    { value: "Helvetica", label: "Helvetica (Classic)" },
    { value: "Arial", label: "Arial (Clean)" },
    { value: "Times New Roman", label: "Times (Traditional)" },
    { value: "Roboto", label: "Roboto (Google)" },
    { value: "Open Sans", label: "Open Sans (Friendly)" },
    { value: "Lato", label: "Lato (Professional)" },
];

const PRESET_THEMES = [
    {
        name: "Blue Professional",
        colors: {
            primary: "#3B82F6",
            secondary: "#1E40AF",
            accent: "#60A5FA",
            background: "#FFFFFF",
            text: "#111827",
        },
    },
    {
        name: "Green Tech",
        colors: {
            primary: "#10B981",
            secondary: "#047857",
            accent: "#6EE7B7",
            background: "#FFFFFF",
            text: "#111827",
        },
    },
    {
        name: "Purple Creative",
        colors: {
            primary: "#8B5CF6",
            secondary: "#6D28D9",
            accent: "#C4B5FD",
            background: "#FFFFFF",
            text: "#111827",
        },
    },
    {
        name: "Orange Energy",
        colors: {
            primary: "#F97316",
            secondary: "#C2410C",
            accent: "#FDBA74",
            background: "#FFFFFF",
            text: "#111827",
        },
    },
    {
        name: "Red Bold",
        colors: {
            primary: "#EF4444",
            secondary: "#B91C1C",
            accent: "#FCA5A5",
            background: "#FFFFFF",
            text: "#111827",
        },
    },
    // {
    //     name: "Dark Mode",
    //     colors: {
    //         primary: "#60A5FA",
    //         secondary: "#3B82F6",
    //         accent: "#93C5FD",
    //         background: "#111827",
    //         text: "#F9FAFB",
    //     },
    // },
];

export function ThemeCustomizer({ colorTheme, fontStyle, onSave }: Props) {
    const [editedTheme, setEditedTheme] = useState<ColorTheme>(colorTheme);
    const [editedFont, setEditedFont] = useState<string>(fontStyle);

    // Sync internal state with props when they change
    useEffect(() => {
        setEditedTheme(colorTheme);
    }, [colorTheme]);

    useEffect(() => {
        setEditedFont(fontStyle);
    }, [fontStyle]);

    const handleColorChange = (key: keyof ColorTheme, value: string) => {
        const newTheme = { ...editedTheme, [key]: value };
        setEditedTheme(newTheme);
        onSave(newTheme, editedFont);
    };

    const handleFontChange = (font: string) => {
        setEditedFont(font);
        onSave(editedTheme, font);
    };

    const applyPreset = (preset: ColorTheme) => {
        setEditedTheme(preset);
        onSave(preset, editedFont);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Theme Customization
                </h2>
                <p className="text-sm text-gray-600">
                    Customize colors and fonts for your careers page.
                </p>
            </div>

            {/* Preset Themes */}
            <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Preset Themes
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {PRESET_THEMES.map((preset) => (
                        <button
                            key={preset.name}
                            onClick={() => applyPreset(preset.colors)}
                            className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors text-left"
                        >
                            <div className="flex items-center space-x-2 mb-2">
                                <div
                                    className="w-6 h-6 rounded"
                                    style={{
                                        backgroundColor: preset.colors.primary,
                                    }}
                                />
                                <div
                                    className="w-6 h-6 rounded"
                                    style={{
                                        backgroundColor:
                                            preset.colors.secondary,
                                    }}
                                />
                                <div
                                    className="w-6 h-6 rounded"
                                    style={{
                                        backgroundColor: preset.colors.accent,
                                    }}
                                />
                            </div>
                            <p className="text-sm font-medium text-gray-900">
                                {preset.name}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Custom Colors */}
            <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Custom Colors
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Primary Color
                        </label>
                        <div className="flex items-center space-x-3">
                            <input
                                type="color"
                                value={editedTheme.primary}
                                onChange={(e) =>
                                    handleColorChange("primary", e.target.value)
                                }
                                className="text-black placeholder:text-black w-12 h-12 rounded border border-gray-300 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={editedTheme.primary}
                                onChange={(e) =>
                                    handleColorChange("primary", e.target.value)
                                }
                                placeholder="#3B82F6"
                                className="text-black placeholder:text-black flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Main brand color for headings and buttons
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Secondary Color
                        </label>
                        <div className="flex items-center space-x-3">
                            <input
                                type="color"
                                value={editedTheme.secondary}
                                onChange={(e) =>
                                    handleColorChange(
                                        "secondary",
                                        e.target.value
                                    )
                                }
                                className="text-black placeholder:text-black w-12 h-12 rounded border border-gray-300 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={editedTheme.secondary}
                                onChange={(e) =>
                                    handleColorChange(
                                        "secondary",
                                        e.target.value
                                    )
                                }
                                placeholder="#1E40AF"
                                className="text-black placeholder:text-black flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Darker shade for gradients and emphasis
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Accent Color
                        </label>
                        <div className="flex items-center space-x-3">
                            <input
                                type="color"
                                value={editedTheme.accent}
                                onChange={(e) =>
                                    handleColorChange("accent", e.target.value)
                                }
                                className="text-black placeholder:text-black w-12 h-12 rounded border border-gray-300 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={editedTheme.accent}
                                onChange={(e) =>
                                    handleColorChange("accent", e.target.value)
                                }
                                placeholder="#60A5FA"
                                className="text-black placeholder:text-black flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Light shade for borders and backgrounds
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Background Color
                        </label>
                        <div className="flex items-center space-x-3">
                            <input
                                type="color"
                                value={editedTheme.background}
                                onChange={(e) =>
                                    handleColorChange(
                                        "background",
                                        e.target.value
                                    )
                                }
                                className="text-black placeholder:text-black w-12 h-12 rounded border border-gray-300 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={editedTheme.background}
                                onChange={(e) =>
                                    handleColorChange(
                                        "background",
                                        e.target.value
                                    )
                                }
                                placeholder="#FFFFFF"
                                className="text-black placeholder:text-black flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Page background color
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Text Color
                        </label>
                        <div className="flex items-center space-x-3">
                            <input
                                type="color"
                                value={editedTheme.text}
                                onChange={(e) =>
                                    handleColorChange("text", e.target.value)
                                }
                                className="text-black placeholder:text-black w-12 h-12 rounded border border-gray-300 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={editedTheme.text}
                                onChange={(e) =>
                                    handleColorChange("text", e.target.value)
                                }
                                placeholder="#111827"
                                className="text-black placeholder:text-black flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Main text color
                        </p>
                    </div>
                </div>
            </div>

            {/* Font Selection */}
            <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Font Style
                </h3>
                <select
                    value={editedFont}
                    onChange={(e) => handleFontChange(e.target.value)}
                    className="text-black placeholder:text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    style={{ fontFamily: editedFont }}
                >
                    {FONT_OPTIONS.map((font) => (
                        <option
                            key={font.value}
                            value={font.value}
                            className="text-black  "
                            style={{ fontFamily: font.value }}
                        >
                            {font.label}
                        </option>
                    ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                    Choose a font that matches your brand
                </p>
            </div>

            {/* Preview */}
            <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Preview
                </h3>
                <div
                    className="p-6 rounded-lg border-2"
                    style={{
                        backgroundColor: editedTheme.background,
                        borderColor: editedTheme.accent,
                        fontFamily: editedFont,
                    }}
                >
                    <h3
                        className="text-2xl font-bold mb-2"
                        style={{ color: editedTheme.primary }}
                    >
                        Heading Text
                    </h3>
                    <p style={{ color: editedTheme.text }} className="mb-4">
                        This is how your body text will look on the careers
                        page. Make sure it's readable and matches your brand
                        identity.
                    </p>
                    <button
                        className="px-4 py-2 rounded-lg text-white font-medium"
                        style={{ backgroundColor: editedTheme.primary }}
                    >
                        Button Example
                    </button>
                </div>
            </div>

            <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                    💡 Changes are automatically saved
                </p>
            </div>
        </div>
    );
}
