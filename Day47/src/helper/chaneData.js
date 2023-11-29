import isLocalStorageJSON from "./localStorage";
export const handleChangeData = (data) => {
    const tasks = data ? data : [];
    const columns = isLocalStorageJSON("columns")
        ? isLocalStorageJSON("columns")
        : [];
    const newTasks = tasks?.map((task) => {
        const column = columns?.find((col) => col.column === task.column);
        if (column && column?.column === task.column) {
            return {
                columnName: column.columnName,
                content: task.content,
                column: task.column,
            };
        }
        return null;
    });
    const filteredNewTasks = newTasks.filter((task) => task);
    return filteredNewTasks;
};
