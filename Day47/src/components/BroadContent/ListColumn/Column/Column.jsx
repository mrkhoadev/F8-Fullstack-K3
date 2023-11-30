import React, {
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import "./Column.scss";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ListTask from "./ListTask/ListTask";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteColumn,
    sortColumnsData,
    sortTasksData,
} from "../../../../redux/slice/todoSlice";
import {
    deleteTodoData,
    editTodoData,
    getData,
} from "../../../../redux/middlewares/tasksMiddlewares";
import { handleChangeData } from "../../../../helper/chaneData";
import { htmlScript } from "../../../../helper/regex";
import alertify from "alertifyjs";
import { flatMap } from "lodash";

export default function Column({ columnData }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: columnData._id,
        data: { ...columnData, isColumn: true },
    });
    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : undefined,
    };
    const dispatch = useDispatch();
    const columns = useSelector((state) => state.todo.columns);
    const tasks = useSelector((state) => state.todo.tasks);
    const isDeleteColumn = useSelector((state) => state.todo.isDeleteColumn);
    const columnRef = useRef("");
    const inputRef = useRef(null);
    const [editMouse, setEditMouse] = useState(false);
    const listTaskRef = useRef(null);
    const isClickRef = useRef(false);
    const status = useSelector((state) => state.todo.status);
    const handleDeleteColumn = (column) => {
        alertify
            .confirm(
                `Xóa cột hiện tại!`,
                `Bạn có chắc muốn xóa cột "${columnData.columnName}" không?`,
                function () {
                    columnRef.current = column;
                    const newTasks = tasks.filter(
                        (task) => task.column !== column
                    );
                    const newData = handleChangeData(newTasks);
                    dispatch(deleteTodoData(newData));
                },
                function () {
                    alertify.error("Đã hủy!");
                }
            )
            .set("labels", { ok: "Đồng ý", cancel: "Hủy" });
    };
    const handleDoubleClick = (e) => {
        setEditMouse(true);
    };
    const handleEditColumns = (e) => {
        const newColumns = columns.map((col) => {
            if (col._id === columnData._id) {
                return { ...col, columnName: e.target.value };
            }
            return col;
        });
        dispatch(sortColumnsData(newColumns));
    };
    const handleBlur = (e) => {
        if (
            e.target.value.trim() !== "" &&
            e.target.value.trim() !== columnData.columnName
        ) {
            handleEditColumns(e);
        }
        setEditMouse(false);
    };
    const handleInputOnKeyDown = (e) => {
        if (e.code === "Enter") {
            if (
                e.target.value.trim() !== "" &&
                e.target.value.trim() !== columnData.columnName
            ) {
                handleEditColumns(e);
            }
            setEditMouse(false);
        }
    };
    const handleAddTask = (e) => {
        e.target.disabled = true;
        const tasksColumnLen = tasks.length;
        const newTask = {
            columnName: columnData.columnName,
            content: `Task ${tasksColumnLen + 1}`,
            column: columnData.column,
        };
        let newTasks = handleChangeData(tasks);
        dispatch(
            sortTasksData(
                tasks.toSpliced(tasks.length, 0, {
                    ...newTask,
                    _id: `taskId-${tasks.length + 1}`,
                })
            )
        );
        newTasks = newTasks.toSpliced(newTasks.length, 0, newTask);
        dispatch(editTodoData(newTasks));
        isClickRef.current = true;
        listTaskRef.current = e?.target;
    };
    useEffect(() => {
        if (isDeleteColumn && columnRef.current !== "") {
            const newColumns = columns.filter(
                (col) => col.column !== columnRef.current
            );
            dispatch(deleteColumn(newColumns));
            columnRef.current = "";
        }
    }, [isDeleteColumn]);
    useEffect(() => {
        if (editMouse) {
            inputRef.current.focus();
            inputRef.current.value = columnData.columnName;
        }
    }, [editMouse]);
    useLayoutEffect(() => {
        if (isClickRef.current && listTaskRef.current) {
            const lastElement =
                listTaskRef.current?.previousElementSibling?.children[0]
                    ?.children[
                    listTaskRef.current?.previousElementSibling?.children[0]
                        ?.children.length - 1
                ];
            lastElement?.scrollIntoView({ behavior: "smooth" });

            isClickRef.current = null;
        }
    }, [isClickRef.current, tasks]);
    useEffect(() => {
        if (status === "success" && listTaskRef.current) {
            listTaskRef.current.disabled = false;
            listTaskRef.current = null;
        }
    }, [status]);

    return (
        <div className="column" style={style} ref={setNodeRef} {...attributes}>
            <div
                className="column-title"
                {...(!editMouse ? listeners : {})}
                onDoubleClick={handleDoubleClick}
                onBlur={handleBlur}
            >
                {editMouse ? (
                    <input
                        className="input"
                        ref={inputRef}
                        onKeyDown={handleInputOnKeyDown}
                    />
                ) : (
                    <p>{htmlScript(columnData.columnName)}</p>
                )}

                <span
                    className="icon"
                    onClick={(e) => handleDeleteColumn(columnData.column)}
                >
                    <i className="bx bx-trash"></i>
                </span>
                <hr />
            </div>
            <div className="column-content">
                <ListTask column={columnData.column} />
            </div>
            <button onClick={handleAddTask}>
                <span className="text">Add task</span>
                <i className="bx bx-plus-circle"></i>
            </button>
        </div>
    );
}
