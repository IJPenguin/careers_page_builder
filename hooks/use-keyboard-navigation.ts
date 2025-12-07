"use client";

import { useEffect } from "react";

export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Don't trigger shortcuts when typing in inputs
            if (
                event.target instanceof HTMLInputElement ||
                event.target instanceof HTMLTextAreaElement ||
                event.target instanceof HTMLSelectElement
            ) {
                return;
            }

            const key = event.key.toLowerCase();
            const ctrl = event.ctrlKey || event.metaKey;
            const shift = event.shiftKey;
            const alt = event.altKey;

            let shortcutKey = "";
            if (ctrl) shortcutKey += "ctrl+";
            if (shift) shortcutKey += "shift+";
            if (alt) shortcutKey += "alt+";
            shortcutKey += key;

            const handler = shortcuts[shortcutKey];
            if (handler) {
                event.preventDefault();
                handler();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [shortcuts]);
}

// Trap focus within a container (useful for modals)
export function useFocusTrap(
    ref: React.RefObject<HTMLElement>,
    isActive: boolean
) {
    useEffect(() => {
        if (!isActive || !ref.current) return;

        const focusableElements = ref.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
            focusableElements.length - 1
        ] as HTMLElement;

        const handleTabKey = (e: KeyboardEvent) => {
            if (e.key !== "Tab") return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement?.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement?.focus();
                    e.preventDefault();
                }
            }
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                ref.current?.dispatchEvent(new Event("close"));
            }
        };

        document.addEventListener("keydown", handleTabKey);
        document.addEventListener("keydown", handleEscape);
        firstElement?.focus();

        return () => {
            document.removeEventListener("keydown", handleTabKey);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [ref, isActive]);
}
