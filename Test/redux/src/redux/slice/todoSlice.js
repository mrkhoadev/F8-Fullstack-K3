import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const initialState = {
    todoList: [],
};
export const todoSlice = createSlice({
    name: "todo",
    initialState,
    reducers: {
        addTodo: (state, action) => {
            state.todoList = [...state.todoList, action.payload];
        },
    },
});
// export const fetchPosts = () => {
//     return (dispatch) => {
//         console.log('fetch');
//     }
// }

export const fetchTodo = createAsyncThunk(('fetchTodo'), async () => { 
    const response = await fetch(``)
 })