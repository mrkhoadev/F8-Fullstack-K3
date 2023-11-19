import React, { Component, useState, useContext, useRef } from "react";
import Content from "./Content";
import { color } from "../libs/color";

const Counter = () => {
    const [count, setCount] = useState(0);
    const countRef = useRef(0);
    console.log(countRef);

    return (
        <div
            className="counter"
        >
            <h1>Count: {count}</h1>
            <button onClick={(e) => {
                setCount(count + 1)
            }}>+</button>
            <Content></Content>
        </div>
    );
};

export default color(Counter);
