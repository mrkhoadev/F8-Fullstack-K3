import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "./counterSlice";
import { todoSlice } from "./todoSlice";

export const store = configureStore({
    reducer: {
        counter: counterSlice.reducer,
        todo: todoSlice.reducer,
    }
})