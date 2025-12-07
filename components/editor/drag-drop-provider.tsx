"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

type Section = {
    id: string;
    name: string;
    label: string;
    enabled: boolean;
};

type DragDropContextType = {
    sections: Section[];
    setSections: (sections: Section[]) => void;
    activeId: string | null;
    handleDragStart: (event: DragStartEvent) => void;
    handleDragEnd: (event: DragEndEvent) => void;
};

const DragDropContext = createContext<DragDropContextType | undefined>(
    undefined
);

export function useDragDrop() {
    const context = useContext(DragDropContext);
    if (!context) {
        throw new Error("useDragDrop must be used within DragDropProvider");
    }
    return context;
}

type Props = {
    children: React.ReactNode;
    initialSections: Section[];
    onOrderChange: (sections: Section[]) => void;
};

export function DragDropProvider({
    children,
    initialSections,
    onOrderChange,
}: Props) {
    const [sections, setSectionsState] = useState<Section[]>(initialSections);
    const [activeId, setActiveId] = useState<string | null>(null);

    // Update internal state when initialSections changes
    useEffect(() => {
        setSectionsState(initialSections);
    }, [initialSections]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const setSections = (newSections: Section[]) => {
        setSectionsState(newSections);
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        setActiveId(null);

        if (over && active.id !== over.id) {
            // Get only enabled sections for reordering
            const enabledSections = sections.filter((s) => s.enabled);
            const oldIndex = enabledSections.findIndex(
                (item) => item.id === active.id
            );
            const newIndex = enabledSections.findIndex(
                (item) => item.id === over.id
            );

            if (oldIndex !== -1 && newIndex !== -1) {
                // Reorder only the enabled sections
                const reorderedEnabled = arrayMove(
                    enabledSections,
                    oldIndex,
                    newIndex
                );

                // Merge back with disabled sections (keep them at the end)
                const disabledSections = sections.filter((s) => !s.enabled);
                const newOrder = [...reorderedEnabled, ...disabledSections];

                setSectionsState(newOrder);
                // Call onOrderChange after state update
                onOrderChange(newOrder);
            }
        }
    };

    const enabledSections = sections.filter((s) => s.enabled);

    return (
        <DragDropContext.Provider
            value={{
                sections,
                setSections,
                activeId,
                handleDragStart,
                handleDragEnd,
            }}
        >
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={enabledSections.map((s) => s.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {children}
                </SortableContext>
                <DragOverlay>
                    {activeId ? (
                        <div className="bg-white border-2 border-blue-500 rounded-lg p-4 shadow-lg cursor-grabbing">
                            <div className="flex items-center space-x-3">
                                <svg
                                    className="w-5 h-5 text-gray-400"
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
                                <span className="font-medium text-gray-900">
                                    {
                                        enabledSections.find(
                                            (s) => s.id === activeId
                                        )?.label
                                    }
                                </span>
                            </div>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </DragDropContext.Provider>
    );
}
