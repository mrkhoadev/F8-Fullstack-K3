"use client";
import { todoApi } from "@/app/todo/page";
import { useRouter } from "next/navigation";
import React from "react";

export default function FormTodo() {
    const router = useRouter();
    const postTodo = async (data) => {
        const response = await fetch(todoApi, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: data }),
        });
        if (response.ok) {
            router.refresh();
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = await postTodo(e.target.name.value);
    };
    return (
        <form action="" onSubmit={handleSubmit}>
            <div className="input-box">
                <input type="text" name="name" placeholder="them..." />
            </div>
            <button>Add</button>
        </form>
    );
}
