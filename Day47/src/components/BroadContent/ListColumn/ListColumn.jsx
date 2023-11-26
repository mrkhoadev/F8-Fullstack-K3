import React, { useRef } from "react";
import "./ListColumn.scss";
import {
    SortableContext,
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSelector } from "react-redux";
import Column from "./Column/Column";

export default function ListColumn() {
    const columns = useSelector((state) => state.todo.columns);

    const columnsIdRef = useRef([]);

    columnsIdRef.current = columns?.map((col) => col._id);
    return (
        <div className="todo-list">
            <SortableContext
                items={columnsIdRef.current}
                strategy={horizontalListSortingStrategy}
            >
                {columns?.map((col) => {
                    return <Column key={col._id} columnData={col} />;
                })}
            </SortableContext>
            <div className="todo-add">
                <button type="button">+</button>
            </div>
        </div>
    );
}
