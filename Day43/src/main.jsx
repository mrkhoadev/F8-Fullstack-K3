import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/style.scss";
import './assets/loading.css'
import Provider from "./core/Provider";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Provider>
            <App />
        </Provider>
    </React.StrictMode>
);
