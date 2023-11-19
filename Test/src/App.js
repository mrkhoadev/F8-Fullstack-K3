import { Header } from "./components/header";
import { Footer } from "./components/footer";
import './assets/style.css'
import './assets/style.scss'
export const App = () => {
    console.log(process.env.SERVER_API);
    return `
        ${Header()}
        <h1>hello</h1>
        ${Footer()}
    `
}