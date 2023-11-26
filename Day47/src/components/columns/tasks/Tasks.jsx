import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./Tasks.scss";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "../../SortableItem";

export default function Tasks({ column }) {
    const tasks = useSelector((state) => state.todo.tasks);
    return (
        <div className="task">
            <SortableContext
                items={
                    tasks
                        ? tasks
                              .filter((task) => task.column === column)
                              .map((task) => task._id)
                        : []
                }
                strategy={verticalListSortingStrategy}
            >
                {tasks.map((task) => {
                    if (task.column === column) {
                        return (
                            <SortableItem
                                key={task._id}
                                data={task}
                                classEL="task-item"
                            >
                                {task.content}
                            </SortableItem>
                        );
                    }
                })}
            </SortableContext>
        </div>
    );
}
