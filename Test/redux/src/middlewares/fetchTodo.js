export const fetchTodo = () => {
    return async (dispatch, getState) => {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/todos"
        );
        const todo = await response.json();
        dispatch({
            type: "todo/fetch",
            payload: todo,
        });
    };
};
