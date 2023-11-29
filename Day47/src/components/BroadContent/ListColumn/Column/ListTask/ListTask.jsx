import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React, { useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import Task from "./Task/Task";
import "./ListTasks.scss";

export default function ListTask({ column }) {
    const tasks = useSelector((state) => state.todo.tasks);
    const tasksId = useMemo(
        () =>
            tasks
                ?.filter((task) => task.column === column)
                ?.map((task) => task._id),
        [tasks]
    );
    
    return (
        <div className="tasks">
            <SortableContext
                items={tasksId}
                strategy={verticalListSortingStrategy}
            >
                {tasks
                    ?.filter((task) => task.column === column)
                    ?.map((task) => (
                        <Task key={task._id} taskData={task} />
                    ))}
            </SortableContext>
        </div>
    );
}
