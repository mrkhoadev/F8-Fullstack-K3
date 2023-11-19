import React, { useRef, useEffect } from "react";
import "./assets/style.scss";
import alertify from "alertifyjs";
import "./assets/alertify.css";
import Header from "./components/Header";
import Content from "./components/Content";
import { useSelector } from "./core/hooks";

export default function App() {
    const { theme } = useSelector();
    return (
        <div className={"game" + (theme === "light" ? "" : " active")}>
            <div
                className={"overlay" + (theme === "light" ? "" : " active")}
            ></div>
            <Header />
            <Content />
        </div>
    );
}
