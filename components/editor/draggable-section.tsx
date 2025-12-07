"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
    id: string;
    label: string;
    children?: React.ReactNode;
};

export function DraggableSection({ id, label, children }: Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-white border rounded-lg p-4 mb-3 ${
                isDragging ? "shadow-lg z-10" : "shadow-sm"
            }`}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3 flex-1">
                    <button
                        type="button"
                        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors touch-none"
                        {...attributes}
                        {...listeners}
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
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                    <span className="font-medium text-gray-900">{label}</span>
                </div>
            </div>
            {children && <div className="mt-3 pt-3 border-t">{children}</div>}
        </div>
    );
}
