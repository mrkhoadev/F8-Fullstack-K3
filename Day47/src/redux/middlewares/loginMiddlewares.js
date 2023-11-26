import { createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../../utils/clientUtils";

export const getApiKey = createAsyncThunk("todo/getApiKey", async (query = {}) => {
    const queryString = new URLSearchParams(query).toString();
    const { data } = await client.get(`/api-key?${queryString}`);
    return data;
});