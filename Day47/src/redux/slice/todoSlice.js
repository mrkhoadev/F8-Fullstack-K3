import { createSlice } from "@reduxjs/toolkit";
import { getApiKey } from "../middlewares/loginMiddlewares";
import { client } from "../../utils/clientUtils";
import {
    deleteTodoData,
    editTodoData,
    getTasks,
    postTodoData,
} from "../middlewares/tasksMiddlewares";
import isLocalStorageJSON from "../../helper/localStorage";
import alertify from "alertifyjs";

const apiKey = localStorage.getItem("apiKey") || "";
if (apiKey) {
    client.setApiKey(apiKey);
}

const isLogin = localStorage.getItem("apiKey") ? true : false;

const initialState = {
    columns: [],
    tasks: [],
    isLogin,
    apiKey,
    status: "idle",
    isDeleteColumn: false,
};
export const todoSlice = createSlice({
    name: "todo",
    initialState,
    reducers: {
        sortColumnsData: (state, action) => {
            state.columns = action.payload;
            localStorage.setItem("columns", JSON.stringify(action.payload));
        },
        sortTasksData: (state, action) => {
            state.tasks = action.payload;
            localStorage.setItem("tasks", JSON.stringify(action.payload));
        },
        deleteColumn: (state, action) => {
            state.columns = action.payload;
            localStorage.setItem("columns", JSON.stringify(action.payload));
            state.isDeleteColumn = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getApiKey.fulfilled, (state, action) => {
                if (action.payload.status_code === "SUCCESS") {
                    state.isLogin = true;
                    state.apiKey = action.payload.data.apiKey;
                    client.setApiKey(action.payload.data.apiKey);
                    localStorage.setItem("apiKey", action.payload.data.apiKey);
                } else {
                    localStorage.removeItem("apiKey");
                    window.location.reload();
                }

                state.status = "success";
            })
            .addCase(getApiKey.pending, (state, action) => {
                state.status = "pending";
            })
            .addCase(getApiKey.rejected, (state, action) => {
                state.status = "error";
            })
            .addCase(getTasks.fulfilled, (state, action) => {
                const { status_code, data } = action.payload;
                let columnsData = [];
                if (status_code === "SUCCESS") {
                    const { columns, tasks } = data;
                    if (isLocalStorageJSON("columns")) {
                        const localStorageColumns =
                            isLocalStorageJSON("columns");
                        columnsData = localStorageColumns.map((col) => {
                            const data = columns.find(
                                (c) => c.column === col.column
                            );
                            if (data && data._id !== col._id) {
                                return data;
                            }
                            return col;
                        });
                        columnsData.push(
                            ...columns.filter((col) => {
                                return !localStorageColumns.some(
                                    (localStorageCol) =>
                                        localStorageCol?.column === col.column
                                );
                            })
                        );
                        columnsData = columnsData.filter((c) => c);
                    } else {
                        columnsData = columns;
                    }
                    state.columns = columnsData;
                    localStorage.setItem(
                        "columns",
                        JSON.stringify(columnsData)
                    );
                    state.tasks = tasks;
                    localStorage.setItem("tasks", JSON.stringify(tasks));
                    state.status = "success";
                } else {
                    localStorage.removeItem("apiKey");
                    window.location.reload();
                }
            })
            .addCase(getTasks.pending, (state, action) => {
                state.status = "pending";
            })
            .addCase(getTasks.rejected, (state, action) => {
                state.status = "error";
            })
            .addCase(postTodoData.fulfilled, (state, action) => {
                if (action.payload.code === 401) {
                    alertify.error(
                        "Đã xảy ra lỗi, hãy đăng nhập lại để tiếp tục!"
                    );
                    setTimeout(() => {
                        localStorage.removeItem("apiKey");
                        window.location.reload();
                    }, 1500);
                } else if (action.payload.code > 300) {
                    alertify.error("Đã xảy ra lỗi, hãy thử lại!");
                }
                // localStorage.setItem(
                //     "columns",
                //     JSON.stringify(action.payload?.data?.columns)
                // );
                state.status = "success";
            })
            .addCase(postTodoData.pending, (state, action) => {
                state.status = "pendingDrag";
            })
            .addCase(postTodoData.rejected, (state, action) => {
                state.status = "error";
            })
            .addCase(deleteTodoData.fulfilled, (state, action) => {
                if (action.payload.code === 401) {
                    alertify.error(
                        "Đã xảy ra lỗi, hãy đăng nhập lại để tiếp tục!"
                    );
                    setTimeout(() => {
                        localStorage.removeItem("apiKey");
                        window.location.reload();
                    }, 1500);
                } else if (action.payload.code > 300) {
                    alertify.error("Đã xảy ra lỗi, hãy thử lại!");
                } else {
                    state.tasks = action.payload.data.tasks;
                    state.isDeleteColumn = true;
                    alertify.success("Xóa thành công!");
                }
                state.status = "success";
            })
            .addCase(deleteTodoData.pending, (state, action) => {
                state.status = "pendingDrag";
            })
            .addCase(deleteTodoData.rejected, (state, action) => {
                state.status = "error";
            })
            .addCase(editTodoData.fulfilled, (state, action) => {
                if (action.payload.code === 401) {
                    alertify.error(
                        "Đã xảy ra lỗi, hãy đăng nhập lại để tiếp tục!"
                    );
                    setTimeout(() => {
                        localStorage.removeItem("apiKey");
                        window.location.reload();
                    }, 1500);
                } else if (action.payload.code > 300) {
                    alertify.error("Đã xảy ra lỗi, hãy thử lại!");
                } else {
                    const { columns, tasks } = action.payload.data;
                    if (isLocalStorageJSON("tasks")) {
                        const newTasks = tasks?.map((task) => {
                            const find = isLocalStorageJSON("tasks").find(
                                (t) => t.content === task.content
                            );
                            if (find && find.content === task.content) {
                                return {
                                    _id: task._id,
                                    content: task.content,
                                    column: find.column,
                                };
                            }
                            return task;
                        });
                        localStorage.setItem("tasks", JSON.stringify(newTasks));
                    }
                    state.tasks = tasks;
                }
                state.status = "success";
            })
            .addCase(editTodoData.pending, (state, action) => {
                state.status = "pendingDrag";
            })
            .addCase(editTodoData.rejected, (state, action) => {
                state.status = "error";
            });
    },
});

export const { sortColumnsData, sortTasksData, deleteColumn, setIsEditTask } =
    todoSlice.actions;
