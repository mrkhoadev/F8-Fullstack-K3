import React from "react";
import "./login.scss";
import { emailRegex } from "../../helper/regex";
import { useDispatch } from "react-redux";
import { getApiKey } from "../../redux/middlewares/loginMiddlewares";

export default function Login() {
    const dispatch = useDispatch();
    const handleSubmit = (e) => {
        e.preventDefault();
        const value = e.target.loginValue.value;
        if (value && emailRegex(value)) {
            dispatch(getApiKey({ email: value }));
        }
    }
    return (
        <div className="login">
            <form className="login-form" onSubmit={handleSubmit}>
                <h3>Nhập "Email" và bấm "Enter" để đăng nhập!</h3>
                <div className="input-box">
                    <input
                        type="text"
                        name="loginValue"
                        placeholder="Email..."
                    />
                </div>
            </form>
        </div>
    );
}
