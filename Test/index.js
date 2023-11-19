import { App } from "./src/App";
import dotenv from "dotenv";
dotenv.config()
const root = document.querySelector("#root");
root.innerHTML = App()