import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleChangeData } from "../../../../../../helper/chaneData";
import {
    deleteTodoData,
    editTodoData,
    postTodoData,
} from "../../../../../../redux/middlewares/tasksMiddlewares";
import { htmlScript } from "../../../../../../helper/regex";
import alertify from "alertifyjs";

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
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : undefined,
    };
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.todo.tasks);
    const [editMouse, setEditMouse] = useState(false);
    const inputRef = useRef(null);
    const [value, setValue] = useState(htmlScript(taskData.content));
    const handleDeleteTask = (taskId) => {
        alertify
            .confirm(
                `Xóa Công việc hiện tại!`,
                "Bạn đang làm xong công việc này rồi sao?",
                function () {
                    const newTasks = handleChangeData(
                        tasks.filter((task) => task._id !== taskId)
                    );
                    dispatch(deleteTodoData(newTasks));
                },
                function () {
                    alertify.error("Đã hủy!");
                }
            )
            .set("labels", { ok: "Xong rồi!", cancel: "Hủy" });
    };
    const handleOnChange = (e) => {
        const value = htmlScript(e.target.value)
        setValue(value);
    };
    const handleDoubleClick = (e) => {
        setEditMouse(true);
    };
    const handleEditColumns = (value) => {
        const newTasks = handleChangeData(
            tasks.map((tasks) => {
                if (tasks._id === taskData._id) {
                    return { ...tasks, content: value };
                }
                return tasks;
            })
        );
        dispatch(editTodoData(newTasks));
    };
    const handleBlur = (e) => {
        if (value.trim() !== "" && value.trim() !== taskData.content) {
            handleEditColumns(value);
        }
        inputRef.current.parentNode.style.boxShadow = "";
        inputRef.current.parentNode.style.backgroundColor = "#eee";
        setEditMouse(false);
    };
    const handleInputOnKeyDown = (e) => {
        if (e.code === "Enter") {
            if (value !== "" && value !== taskData.content) {
                handleEditColumns(value);
            }
            setEditMouse(false);
        }
    };
    useEffect(() => {
        if (editMouse) {
            inputRef.current.focus();
            inputRef.current.parentNode.style.boxShadow = "0 0 0 2px #ff7f50";
            inputRef.current.parentNode.style.backgroundColor = "#f6f6f6";
        }
    }, [editMouse]);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...(!editMouse ? listeners : {})}
            className="tasks-item"
            onDoubleClick={handleDoubleClick}
        >
            {editMouse ? (
                <textarea
                    className="input"
                    ref={inputRef}
                    onKeyDown={handleInputOnKeyDown}
                    onBlur={handleBlur}
                    onChange={handleOnChange}
                    value={value}
                ></textarea>
            ) : (
                <>
                    <p>{value}</p>
                    <span
                        className="icon"
                        onClick={(e) => handleDeleteTask(taskData._id)}
                    >
                        <i className="bx bx-trash"></i>
                    </span>
                </>
            )}
        </div>
    );
}
