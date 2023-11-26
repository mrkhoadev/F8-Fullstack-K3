import { createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../../utils/clientUtils";

export const getTasks = createAsyncThunk("todo/getTasks", async () => {
    const { data } = await client.get(`/tasks`);
    return data;
}) 