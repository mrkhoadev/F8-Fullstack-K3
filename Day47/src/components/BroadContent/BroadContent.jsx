import {
    DndContext,
    DragOverlay,
    MouseSensor,
    TouchSensor,
    closestCenter,
    defaultDropAnimationSideEffects,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import React, { useState } from "react";
import ListColumn from "./ListColumn/ListColumn";
import Column from "./ListColumn/Column/Column";
import Task from "./ListColumn/Column/ListTask/Task/Task";
import { useDispatch, useSelector } from "react-redux";
import { sortColumnsData, sortTasksData } from "../../redux/slice/todoSlice";
import { arrayMove } from "@dnd-kit/sortable";
import { cloneDeep, debounce } from "lodash";

//Dùng để kiểm tra trạng đang kéo column hay task.
const ACTIVE_DRAG_ITEM_TYPE = {
    COLUMN: "ACTIVE_DRAG_ITEM_TYPE_COLUMN",
    TASK: "ACTIVE_DRAG_ITEM_TYPE_TASK",
};

export default function BroadContent() {
    const dispatch = useDispatch();
    const columns = useSelector((state) => state.todo.columns);
    const tasks = useSelector((state) => state.todo.tasks);
    const [columnsState, setColumnsState] = useState(columns);
    const [tasksState, setTasksState] = useState(tasks);
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
    const [oldColumnDraggingTask, setOldColumnDraggingTask] = useState(null);

    const debouncedSortTasks = debounce((newTasks) => {
        dispatch(sortTasksData(newTasks));
    }, 10);
    const handleDragStart = (e) => {
        setActiveDragItemId(e?.active?.id);
        setActiveDragItemType(
            e?.active?.data?.current?.isColumn
                ? ACTIVE_DRAG_ITEM_TYPE.COLUMN
                : ACTIVE_DRAG_ITEM_TYPE.TASK
        );
        setActiveDragItemData(e?.active?.data?.current);
        if (e?.active?.data?.current?.isTask) {
            setOldColumnDraggingTask(e?.active?.data?.current?.column);
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
            if (
                activeColumn !== overColumn ||
                oldColumnDraggingTask !== activeColumn
            ) {
                const overTaskIndex = tasks.findIndex(
                    (task) => task._id === overTaskId
                );
                const activeTaskIndex = tasks.findIndex(
                    (task) => task._id === activeDraggingTaskId
                );
                let newTaskIndex;
                const isBelowOverItem =
                    active.rect.current.translated &&
                    active.rect.current.translated.top >
                        over.rect.top + over.rect.height;
                const modifier = isBelowOverItem ? 1 : 0;
                newTaskIndex =
                    overTaskIndex >= 0
                        ? overTaskIndex + modifier
                        : tasks.length;
                const newTasks = tasks.filter(
                    (task) => task._id !== activeDraggingTaskId
                );
                const newObj = { ...activeDragItemData, column: overColumn };
                delete newObj.sortable;
                newTasks.splice(newTaskIndex, 0, newObj);
                debouncedSortTasks(newTasks);
            }
        }
    };
    const handleDragEnd = (e) => {
        const { active, over } = e;
        if (!active || !over) return;
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
            if (oldColumnDraggingTask === overColumn) {
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
        if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
            if (!over.data.current.isColumn) return;
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

        setActiveDragItemId(null);
        setActiveDragItemType(null);
        setActiveDragItemData(null);
        setOldColumnDraggingTask(null);
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
    return (
        <DndContext
            collisionDetection={closestCenter}
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
