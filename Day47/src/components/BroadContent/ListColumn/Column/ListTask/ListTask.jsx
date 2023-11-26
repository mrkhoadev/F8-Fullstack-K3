import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import Task from "./Task/Task";
import "./ListTasks.scss";

export default function ListTask({ column }) {
    const tasks = useSelector((state) => state.todo.tasks);
    const tasksIdRef = useRef([]);

    tasksIdRef.current = tasks
        ?.filter((task) => task.column === column)
        ?.map((task) => task._id);
    return (
        <div className="tasks">
            <SortableContext
                items={tasksIdRef.current}
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
