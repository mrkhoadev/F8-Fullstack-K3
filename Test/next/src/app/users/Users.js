"use client";
import React from "react";
import useSWR from "swr";
export const userApi = `http://localhost:3005/users`;
const fetcher = (url) => {
    return fetch(url).then((response) => response.json());
};
export default function Users() {
    const {
        data: users,
        isLoading,
        error,
    } = useSWR(userApi, fetcher, {
        fallbackData: [],
    });
    if (isLoading) {
        return <h1>Loading...</h1>;
    }
    if (error) {
        return <h1>Error</h1>;
    }

    return (
        <div>
            {users?.map(({ id, name }) => (
                <h3 key={id}>{name}</h3>
            ))}
        </div>
    );
}
