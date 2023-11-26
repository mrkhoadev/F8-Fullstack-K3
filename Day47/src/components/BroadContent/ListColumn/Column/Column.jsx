import React from 'react';
import './Column.scss'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ListTask from './ListTask/ListTask';

export default function Column({ columnData }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: columnData._id, data: { ...columnData, isColumn: true } });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : undefined,
    };
    return (
        <div className="column" style={style} ref={setNodeRef} {...attributes}>
            <div className="column-title" {...listeners}>
                <p>{columnData.columnName}</p>
                <span className="icon">
                    <i className="bx bx-trash"></i>
                </span>
                <hr />
            </div>
            <div className="column-content">
                <ListTask column={ columnData.column } />
            </div>
            <button>
                <span className="text">Add task</span>
                <i className="bx bx-plus-circle"></i>
            </button>
        </div>
    );
}
