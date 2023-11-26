import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

export default function Task({ taskData }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: taskData._id, data: { ...taskData, isTask: true } });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : undefined,
    };
    return (
        <div
            className="tasks-item"
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            {taskData.content}
        </div>
    );
}
