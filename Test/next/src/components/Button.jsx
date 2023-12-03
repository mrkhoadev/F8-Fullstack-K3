"use client";
import React, { useState } from "react";

export default function Button({ text }) {
    const [state, setState] = useState(false);
    const handleClick = () => {
        setState((prevState) => {
            return !prevState;
        });
    };
    return (
        <>
            {!state && <p>{text}</p>}
            <button onClick={handleClick}>
                {!state ? "Thu gọn" : "Hiển thị"}
            </button>
        </>
    );
}
