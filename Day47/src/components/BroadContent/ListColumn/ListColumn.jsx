import React, { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import "./ListColumn.scss";
import {
    SortableContext,
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDispatch, useSelector } from "react-redux";
import Column from "./Column/Column";
import { sortColumnsData } from "../../../redux/slice/todoSlice";

export default function ListColumn() {
    const columns = useSelector((state) => state.todo.columns);
    const columnsId = useMemo(() => columns?.map((col) => col._id), [columns]);
    const dispatch = useDispatch();
    const addColumnsRef = useRef(null);
    const handleAddColumn = () => {
        const newId = Date.now().toString();
        const columnsLen = columns.length;
        const newColumn = {
            _id: newId,
            columnName: `Column ${columnsLen + 1}`,
            column: newId,
        };
        const newColumns = columns.toSpliced(columnsLen, 0, newColumn);
        dispatch(sortColumnsData(newColumns));
    };
    useLayoutEffect(() => {
        if (addColumnsRef.current) {
            addColumnsRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, []);
    return (
        <div className="todo-list">
            {columns.length > 0 && (
                <SortableContext
                    items={columnsId}
                    strategy={horizontalListSortingStrategy}
                >
                    {columns?.map((col) => {
                        return <Column key={col._id} columnData={col} />;
                    })}
                </SortableContext>
            )}
            <div className="todo-add">
                <button
                    type="button"
                    onClick={handleAddColumn}
                    ref={addColumnsRef}
                >
                    +
                </button>
            </div>
        </div>
    );
}
