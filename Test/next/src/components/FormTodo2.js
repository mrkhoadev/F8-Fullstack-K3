"use client";

import handleAddTodo from "@/app/todo/action";
import { useRef } from "react";

export default function FormTodo2() {
    const formRef = useRef(null);
    return (
        <form
            action={async (formData) => {
                await handleAddTodo(formData);
                formRef.current.reset();
            }}
            ref={formRef}
        >
            <div className="input-box">
                <input type="text" name="name" placeholder="them..." />
            </div>
            <button>Add</button>
        </form>
    );
}
