import React, { Component } from "react";
import { Client } from "../api/Client";
import alertify from "alertifyjs";
import { HtmlScript } from "./HtmlScript";
import Cookies from "js-cookie";
import { emailRegex } from "../helper/Regex";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiKeyCookie: Cookies.get("apiKey") ? Cookies.get("apiKey") : "",
            usersEmailCookie: Cookies.get("userEmail")
                ? Cookies.get("userEmail")
                : "",
            form: {
                email: "",
            },
            error: "Hãy nhập email để có thể sử dụng TodoList",
        };
    }
    msgSuccess(text) {
        if (text) {
            text = text.split("@")[0]
            return `Chào mừng <span>${text}</span> đến với TodoList :D`;
        } else {
            return `Đã xảy ra lỗi!`
        }
    }
    async getEmail(query = {}) {
        const queryString = new URLSearchParams(query).toString();
        const { response, data } = await Client.get(`/api-key?` + queryString);
        if (response.status >= 500) {
            return alertify.error(
                "Đã xảy ra lỗi máy chủ, hãy tải lại trang hoặc quay lại sau!"
            );
        } else if (response.ok) {
            return data.data;
        } else {
            return null;
        }
    }
    async handleSubmit(e) {
        e.preventDefault();
        const value = e.target.email.value.toString();
        if (value && emailRegex(value)) {
            this.props.addLoading()
            const data = await this.getEmail({
                email: value,
            });
            if (data) {
                Cookies.set("apiKey", data.apiKey);
                Cookies.set("userEmail", value);
                e.target.email.value = "";
                this.props.handleLogin(true);
                Client.setApiKey(data.apiKey);
            } else {
                alertify.error(`Email chưa được đăng ký!`);
                this.props.removeLoading();
            }
        } else {
            alertify.error("Vui lòng không bỏ trống và nhập đúng định dạng Email!");
        }
    }
    eventClick(e) {
        if (!e.target.classList.contains("popup")) {
            e.stopPropagation();
            const popupElement = e.target.closest(".popup");
            if (e.target.classList.contains("close")) {
                popupElement.classList.remove("active");
            }
        } else {
            e.target.classList.remove("active");
        }
    }
    componentWillUnmount() {
        alertify.success(this.msgSuccess(Cookies.get("userEmail")));
    }
    render() {
        return (
            <div
                className={`popup active`}
                onClick={this.eventClick}
            >
                <form
                    className="login-form"
                    onSubmit={(e) => {
                        this.handleSubmit(e);
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
                            onClick={this.handleClick}
                        >
                            Close
                        </button>
                        <button className="save" type="submit">
                            Login
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}
