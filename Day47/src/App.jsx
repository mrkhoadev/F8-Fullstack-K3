import { useSelector } from "react-redux";
import "./assets/scss/style.scss";
import Login from "./layout/AuthLayout/Login";
import DefaultLayout from "./layout/defaultLayout/DefaultLayout";
import { useEffect, useState } from "react";
function App() {
    const isLogin = useSelector((state) => state.todo.isLogin);
    const [prevIsLogin, setPrevIsLogin] = useState();
    useEffect(() => {
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
