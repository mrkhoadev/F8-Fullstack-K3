import ReactDOM from "react-dom/client";
import React from "react";
import App from "./App";

const rootEL = document.querySelector("#root");
ReactDOM.createRoot(rootEL).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
