import {
    DndContext,
    DragOverlay,
    MouseSensor,
    TouchSensor,
    defaultDropAnimationSideEffects,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ListColumn from "./ListColumn/ListColumn";
import Column from "./ListColumn/Column/Column";
import Task from "./ListColumn/Column/ListTask/Task/Task";
import { useDispatch, useSelector } from "react-redux";
import { sortColumnsData, sortTasksData } from "../../redux/slice/todoSlice";
import { arrayMove } from "@dnd-kit/sortable";
import { debounce } from "lodash";
import { postTodoData } from "../../redux/middlewares/tasksMiddlewares";
import { handleChangeData } from "../../helper/chaneData";
import isLocalStorageJSON from "../../helper/localStorage";

//Dùng để kiểm tra trạng đang kéo column hay task.
const ACTIVE_DRAG_ITEM_TYPE = {
    COLUMN: "ACTIVE_DRAG_ITEM_TYPE_COLUMN",
    TASK: "ACTIVE_DRAG_ITEM_TYPE_TASK",
};

export default function BroadContent() {
    const dispatch = useDispatch();
    const columns = useSelector((state) => state.todo.columns);
    const tasks = useSelector((state) => state.todo.tasks);
    const isDragRef = useRef(false);
    const oldTaskItemDataRef = useRef(null);
    //xử lý phần kéo thả trên thiết bị di động.
    const mouse = useSensor(MouseSensor, {
        activationConstraint: { distance: 10 },
    });
    const touch = useSensor(TouchSensor, {
        activationConstraint: { delay: 250, tolerance: 500 },
    });
    const sensors = useSensors(mouse, touch);

    const [activeDragItemId, setActiveDragItemId] = useState(null);
    const [activeDragItemType, setActiveDragItemType] = useState(null);
    const [activeDragItemData, setActiveDragItemData] = useState(null);

    const debouncedSortTasks = debounce((newTasks) => {
        dispatch(sortTasksData(newTasks));
    }, 10);
    const handleSortData = (tasks) => {
        const columnMap = {};
        columns.forEach((col, index) => {
            columnMap[col.column] = index;
        });
        const newTasks = tasks
            .map((t) => {
                const find = columns.find((c) => c.column === t.column);
                if (find && find.column === t.column) {
                    return {
                        column: t.column,
                        columnName: find.columnName,
                        content: t.content,
                    };
                }
                return null;
            })
            .filter((t) => t);
        newTasks.sort((taskA, taskB) => {
            const positionA = columnMap[taskA.column];
            const positionB = columnMap[taskB.column];

            return positionA - positionB;
        });
        dispatch(postTodoData(newTasks));
    };
    const handleDragStart = (e) => {
        setActiveDragItemId(e?.active?.id);
        setActiveDragItemType(
            e?.active?.data?.current?.isColumn
                ? ACTIVE_DRAG_ITEM_TYPE.COLUMN
                : ACTIVE_DRAG_ITEM_TYPE.TASK
        );
        setActiveDragItemData(e?.active?.data?.current);
        if (e?.active?.data?.current?.isTask) {
            oldTaskItemDataRef.current = e.active.data.current;
        }
    };
    const handleDragOver = (e) => {
        const { active, over } = e;
        if (!active || !over) return;
        if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
            return;
        }
        if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.TASK) {
            const {
                id: activeDraggingTaskId,
                data: { current: activeDraggingTaskData },
            } = active;
            const {
                id: overTaskId,
                data: { current: overDraggingTaskData },
            } = over;

            const activeColumn = activeDraggingTaskData.column;
            const overColumn = overDraggingTaskData.column;
            if (!activeColumn || !overColumn) return;
            if (activeColumn === overColumn) return;
            const newTasks = tasks.filter(
                (task) => task._id !== activeDraggingTaskId
            );
            let overTaskIndex = newTasks.findIndex(
                (task) => task._id === overTaskId
            );
            let newTaskIndex;
            const isBelowOverItem =
                active.rect.current.translated &&
                active.rect.current.translated.top >
                    over.rect.top + over.rect.height;
            const modifier = isBelowOverItem ? 1 : 0;
            newTaskIndex =
                overTaskIndex >= 0 ? overTaskIndex + modifier : tasks.length;
            const newObj = { ...activeDragItemData, column: overColumn };
            delete newObj.sortable;
            newTasks.splice(newTaskIndex, 0, newObj);
            debouncedSortTasks(newTasks);
        }
    };
    const handleDragEnd = (e) => {
        const { active, over } = e;
        if (!active) return;
        if (over && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.TASK) {
            if (active.id !== over.id) {
                const {
                    data: { current: activeDraggingTaskData },
                } = active;
                const {
                    id: overTaskId,
                    data: { current: overDraggingTaskData },
                } = over;
                const activeColumn = activeDraggingTaskData.column;
                const overColumn = overDraggingTaskData.column;
                if (!activeColumn || !overColumn) return;
                if (activeColumn !== overColumn) return;
                const oldTaskIndex = tasks?.findIndex(
                    (item) => item._id === activeDragItemId
                );
                const newTaskIndex = tasks?.findIndex(
                    (item) => item._id === overTaskId
                );
                const newTasks = arrayMove(tasks, oldTaskIndex, newTaskIndex);
                dispatch(sortTasksData(newTasks));
            }
        }
        if (over && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
            if (active.id !== over.id) {
                const oldColumnIndex = columns.findIndex(
                    (item) => item._id === active.id
                );
                const newColumnIndex = columns.findIndex(
                    (item) => item._id === over.id
                );
                const newColumns = arrayMove(
                    columns,
                    oldColumnIndex,
                    newColumnIndex
                );
                dispatch(sortColumnsData(newColumns));
            }
        }
        if (isDragRef.current) {
            if (active.data.current.isTask) {
                if (
                    over &&
                    active.id === over.id &&
                    active.data.current.column ===
                        oldTaskItemDataRef.current.column
                ) {
                    return;
                }
                const newTasks = handleChangeData(isLocalStorageJSON("tasks"));
                handleSortData(newTasks);
                isDragRef.current = false;
            }
            if (active.data.current.isColumn && over) {
                if (over.id !== active.id) {
                    handleSortData(tasks);
                }
            }
        }
        setActiveDragItemId(null);
        setActiveDragItemType(null);
        setActiveDragItemData(null);
        oldTaskItemDataRef.current = null;
    };
    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: "0.5",
                },
            },
        }),
    };
    useEffect(() => {
        isDragRef.current = true;
    }, [tasks]);

    return (
        <DndContext
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            sensors={sensors}
        >
            <ListColumn />
            <DragOverlay dropAnimation={dropAnimation}>
                {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
                    <Column columnData={activeDragItemData} />
                )}
                {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.TASK && (
                    <Task taskData={activeDragItemData} />
                )}
            </DragOverlay>
        </DndContext>
    );
}
