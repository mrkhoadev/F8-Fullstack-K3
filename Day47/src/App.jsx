import { useSelector } from "react-redux";
import "./assets/scss/style.scss";
import './assets/css/alertify.css'
import Login from "./layout/AuthLayout/Login";
import DefaultLayout from "./layout/defaultLayout/DefaultLayout";
import { useLayoutEffect, useState } from "react";
function App() {
    const isLogin = useSelector((state) => state.todo.isLogin);
    const [prevIsLogin, setPrevIsLogin] = useState();
    useLayoutEffect(() => {
        if (isLogin) {
            setPrevIsLogin(isLogin)
        }
    }, [isLogin]);
    return (
        <div className="app">
            {!isLogin ? <Login /> : <DefaultLayout prevIsLogin={prevIsLogin} />}
        </div>
    );
}

export default App;
