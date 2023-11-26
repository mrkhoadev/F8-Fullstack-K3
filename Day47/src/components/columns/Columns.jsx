// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Tasks from "./tasks/Tasks";
// import "./Columns.scss";
// import {
//     DndContext,
//     closestCenter,
//     // PointerSensor,
//     useSensor,
//     useSensors,
//     MouseSensor,
//     TouchSensor,
//     DragOverlay,
//     defaultDropAnimationSideEffects,
// } from "@dnd-kit/core";
// import {
//     arrayMove,
//     SortableContext,
//     horizontalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import SortableItem from "../SortableItem";
// import { sortColumnsData, sortTasksData } from "../../redux/slice/todoSlice";
// import { debounce } from "lodash";

// const ACTIVE_DRAG_ITEM_TYPE = {
//     COLUMN: "ACTIVE_DRAG_ITEM_TYPE_COLUMN",
//     TASK: "ACTIVE_DRAG_ITEM_TYPE_TASK",
// };
// export default function Columns() {
//     const dispatch = useDispatch();
//     const columns = useSelector((state) => state.todo.columns);
//     const tasks = useSelector((state) => state.todo.tasks);
//     const [data, setData] = useState(tasks);
//     // const pointer = useSensor(PointerSensor, {
//     //     activationConstraint: { distance: 10 },
//     // });
//     const mouse = useSensor(MouseSensor, {
//         activationConstraint: { distance: 10 },
//     });
//     const touch = useSensor(TouchSensor, {
//         activationConstraint: { delay: 250, tolerance: 500 },
//     });
//     const sensors = useSensors(mouse, touch);
//     const [activeDragItemId, setActiveDragItemId] = useState(null);
//     const [activeDragItemType, setActiveDragItemType] = useState(null);
//     const [activeDragItemData, setActiveDragItemData] = useState(null);
//     const [oldColumnDraggingTask, setOldColumnDraggingTask] = useState(null);

//     // const debouncedSortTasks = debounce((newTasks) => {
//     //     dispatch(sortTasksData(newTasks));
//     // }, 10);

//     const handleDragStart = (event) => {
//         setActiveDragItemId(event?.active?.id);
//         setActiveDragItemType(
//             event?.active?.data?.current?.content
//                 ? ACTIVE_DRAG_ITEM_TYPE.TASK
//                 : ACTIVE_DRAG_ITEM_TYPE.COLUMN
//         );
//         setActiveDragItemData(event?.active?.data?.current);
//         if (event?.active?.data?.current?.content) {
//             setOldColumnDraggingTask(event?.active?.data?.current?.column);
//         }
//     };
//     const handleDragOver = (event) => {
//         if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return;
//         const { active, over } = event;
//         if (!active || !over) return;
//         const {
//             id: activeDraggingTaskId,
//             data: { current: activeDraggingTaskData },
//         } = active;
//         const {
//             id: overTaskId,
//             data: { current: overDraggingTaskData },
//         } = over;
//         const activeColumn = activeDraggingTaskData.column;
//         const overColumn = overDraggingTaskData.column;
//         if (!activeColumn || !overColumn) return;
//         if (activeColumn !== overColumn) {
//             const overTaskIndex = tasks.findIndex(
//                 (task) => task._id === overTaskId
//             );
//             const activeTaskIndex = tasks.findIndex(
//                 (task) => task._id === activeDraggingTaskId
//             );
//             let newTaskIndex;
//             const isBelowOverItem =
//                 active.rect.current.translated &&
//                 active.rect.current.translated.top > over.rect.top;
//             const modifier = isBelowOverItem ? 1 : 0;
//             newTaskIndex =
//                 overTaskIndex >= 0
//                     ? overTaskIndex + modifier
//                     : tasks.length;
//             if (activeTaskIndex < overTaskIndex) newTaskIndex -= 1;
//             const newTasks = tasks.filter(
//                 (task) => task._id !== activeDraggingTaskId
//             );
//             const newObj = { ...activeDragItemData, column: overColumn };
//             delete newObj.sortable;
//             newTasks.splice(newTaskIndex, 0, newObj);
//             // debouncedSortTasks(newTasks);log
//             dispatch(sortTasksData(newTasks));
//         }
//     };
//     const handleDragEnd = (event) => {
//         const { active, over } = event;
//         if (!active || !over) return;
//         if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.TASK) {
//             const {
//                 id: activeDraggingTaskId,
//                 data: { current: activeDraggingTaskData },
//             } = active;
//             const {
//                 id: overTaskId,
//                 data: { current: overDraggingTaskData },
//             } = over;
//             const activeColumn = activeDraggingTaskData.column;
//             const overColumn = overDraggingTaskData.column;
//             if (!activeColumn || !overColumn) return;
//             if (activeColumn !== overColumn) {
//                 console.log(1);
//             } else {
//                 console.log(2);
//             }
//         }
//         if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
//             if (active.id !== over.id) {
//                 const oldIndex = columns.findIndex(
//                     (item) => item._id === active.id
//                 );
//                 const newIndex = columns.findIndex(
//                     (item) => item._id === over.id
//                 );
//                 if (newIndex >= 0) {
//                     const newColumns = arrayMove(columns, oldIndex, newIndex);
//                     dispatch(sortColumnsData(newColumns));
//                 }
//             }
//         }

//         setActiveDragItemId(null);
//         setActiveDragItemType(null);
//         setActiveDragItemData(null);
//         setOldColumnDraggingTask(null);
//     };
//     const dropAnimation = {
//         sideEffects: defaultDropAnimationSideEffects({
//             styles: {
//                 active: {
//                     opacity: "0.5",
//                 },
//             },
//         }),
//     };
//     console.log(1);
//     return (
//         <>
//             <DndContext
//                 collisionDetection={closestCenter}
//                 onDragStart={handleDragStart}
//                 onDragEnd={handleDragEnd}
//                 sensors={sensors}
//                 onDragOver={handleDragOver}
//             >
//                 <SortableContext
//                     items={columns ? columns.map((col) => col._id) : []}
//                     strategy={horizontalListSortingStrategy}
//                 >
//                     {columns.map((col) => (
//                         <SortableItem key={col._id} data={col} classEL="column">
//                             <div className="column-title">
//                                 <p>{col.columnName}</p>
//                                 <span className="icon">
//                                     <i className="bx bx-trash"></i>
//                                 </span>
//                                 <hr />
//                             </div>
//                             <div className="column-content">
//                                 <Tasks column={col.column} />
//                             </div>
//                             <button>
//                                 <span className="text">Add task</span>
//                                 <i className="bx bx-plus-circle"></i>
//                             </button>
//                         </SortableItem>
//                     ))}
//                 </SortableContext>
//                 <DragOverlay dropAnimation={dropAnimation}>
//                     {!activeDragItemType && null}
//                     {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
//                         <div className="column">
//                             <div className="column-title">
//                                 <p>{activeDragItemData.columnName}</p>
//                                 <span className="icon">
//                                     <i className="bx bx-trash"></i>
//                                 </span>
//                                 <hr />
//                             </div>
//                             <div className="column-content">
//                                 <Tasks column={activeDragItemData.column} />
//                             </div>
//                             <button className="noselect">
//                                 <span className="text">Add task</span>
//                                 <i className="bx bx-plus-circle"></i>
//                             </button>
//                         </div>
//                     )}
//                     {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.TASK && (
//                         <div className="task-item">
//                             {activeDragItemData.content}
//                         </div>
//                     )}
//                 </DragOverlay>
//             </DndContext>
//         </>
//     );
// }
