import FormTodo2 from "@/components/FormTodo2";
import React from "react";
export const todoApi = `http://localhost:3005/todos`;
const getTodos = async () => {
    const response = await fetch(todoApi, {
        // cache: "no-cache",
        next: {
            // revalidate: 5,
            tags: ["todo"],
        },
    });
    return await response.json();
};
export default async function TodoPage() {
    const todoList = await getTodos();
    return (
        <div>
            <h1>Todo App</h1>
            {todoList.map((t) => (
                <h4 key={t.id}>{t.name}</h4>
            ))}
            {/* <FormTodo /> */}
            <FormTodo2 />
        </div>
    );
}
