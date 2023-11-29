import { createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../../utils/clientUtils";

export const getTasks = createAsyncThunk("todo/getTasks", async () => {
    const { data } = await client.get(`/tasks`);
    return data;
}) 
export const postTodoData = createAsyncThunk("todo/postTodoData", async (body) => {
    const { data } = await client.post(`/tasks`, body);
    return data;
}); 
export const deleteTodoData = createAsyncThunk("todo/deleteTodoData", async (body, test) => {
    const { data } = await client.post(`/tasks`, body);
    return data;
}); 
export const editTodoData = createAsyncThunk("todo/editTodoData", async (body) => {
    const { data } = await client.post(`/tasks`, body);
    return data;
}); 
export const getData = createAsyncThunk("todo/getData", async () => {
    const { data } = await client.get(`/tasks`);
    return data;
}); 