import React, { useState, useEffect } from "react";
import { emailRegex } from "../services/helpers/regex";
import alertify from "alertifyjs";
import { useDispatch } from "../core/hooks";
import { client } from "../services/api/client";
import Cookies from "js-cookie";

export default function Login() {
    const dispatch = useDispatch();

    const handleClick = (e) => {
        if (!e.target.classList.contains("popup")) {
            e.stopPropagation();
            const popupElement = e.target.closest(".popup");
            if (e.target.classList.contains("close")) {
                popupElement.classList.remove("active");
            }
        } else {
            e.target.classList.remove("active");
        }
    };
    const getAPI = async (query = {}) => {
        const queryString = new URLSearchParams(query).toString();
        const { data, response } = await client.get(`/api-key?` + queryString);
        if (response.ok) {
            return data.data;
        } else {
            alertify.error(`Đã xảy ra lỗi ${response.status}`);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const value = e.target.email.value;
        if (value && emailRegex(value)) {
            dispatch({ type: "loading" });
            const data = await getAPI({
                email: value,
            });
            if (data) {
                Cookies.set(`apiKey`, data.apiKey);
                Cookies.set(`userEmail`, value);
                dispatch({
                    type: "login",
                    apiKey: data.apiKey,
                    userEmail: value,
                });
            }
            dispatch({ type: "loading" });
        } else {
            alertify.error(
                `Vui lòng nhập đúng định dạng <span>Email</span> và không được để trống!`
            );
        }
    };
    return (
        <div className="popup active" onClick={handleClick}>
            <form
                className="login-form"
                onSubmit={(e) => {
                    handleSubmit(e);
                }}
            >
                <div className="input-box">
                    <input
                        type="text"
                        name="email"
                        placeholder="Email đã đăng ký học ở F8"
                    />
                </div>
                <div className="button-box">
                    <button
                        className="close"
                        type="button"
                        onClick={handleClick}
                    >
                        Close
                    </button>
                    <button className="submit" type="submit">
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
}
