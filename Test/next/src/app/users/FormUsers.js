"use client";
import React from "react";
import { userApi } from "./Users";
import { mutate } from "swr";

export default function FormUsers() {
    const postUser = async (data) => {
        const response = await fetch(userApi, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (response.ok) {
            mutate(userApi);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name } = Object.fromEntries([...new FormData(e.target)]);
        await postUser({ name });
    };
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input name="name" />
                <button>Add</button>
            </form>
        </div>
    );
}
