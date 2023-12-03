"use server";
import { todoApi } from "@/app/todo/page";
import { revalidatePath, revalidateTag } from "next/cache";

const handleAddTodo = async (formData) => {
    const name = formData.get("name");
    const response = await fetch(todoApi, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
    });
    if (response.ok) {
        // revalidatePath("/sdfgsdgs");
        revalidatePath("/todo");
    }
};
export default handleAddTodo;
