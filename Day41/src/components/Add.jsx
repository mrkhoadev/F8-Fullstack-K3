import React, { Component } from "react";
import { Client } from "../api/Client";
import alertify from "alertifyjs";
import Cookies from "js-cookie";

export default class Add extends Component {
    constructor() {
        super();
        this.state = {
            form: {
                todo: "",
            },
            error: "",
        };
    }
    async postWork(data = {}) {
        const { response, data: work } = await Client.post(`/todos`, data);

        if (response.status === 401) {
            Cookies.remove("apiKey");
            Cookies.remove("userEmail");
            alertify.error("Bạn phải đăng nhập thì mới có thể sử dụng!");
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else if (response.ok) {
            return work;
        } else {
            return null;
        }
    }
    handleSubmit = async (e) => {
        e.preventDefault();
        const value = this.state.form.todo;
        if (value.length > 3 && this.props.isLogin) {
            const submitButton = e.target.querySelector(
                'button[type="submit"]'
            );
            this.props.addLoading(submitButton);
            const work = await this.postWork({ todo: value });
            this.props.removeLoading(submitButton);
            if (work) {
                alertify.message(work.message);
                e.target.todo.value = "";
                this.props.handleSetState((prevState) => ({
                    data: [work.data, ...prevState.data],
                }));
            } else if (work === null) {
                alertify.error(`Đã xảy ra lỗi, hãy thử lại!`);
            }
        } else if (!this.props.isLogin) {
            Cookies.remove("apiKey");
            Cookies.remove("userEmail");
            alertify.error("Hãy đăng nhập để có thể thêm việc cần làm!");
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            alertify.message("Nhập ít thế thì cần gì lưu? Tự nhớ đi!");
        }
    };
    handleChangeValue = (e) => {
        this.props.isSearch &&
            this.props.handleSetState({
                inputText: e.target.value,
            });
        this.setState({
            form: { ...this.state.form, [e.target.name]: e.target.value },
        });
    };
    render() {
        return (
            <form className="todo-AddForm" onSubmit={this.handleSubmit}>
                <div className="input-box">
                    <input
                        type="text"
                        name="todo"
                        placeholder="Thêm một việc làm mới!"
                        autoComplete="off"
                        onChange={this.handleChangeValue}
                    />
                </div>
                <button type="submit">Thêm mới</button>
            </form>
        );
    }
}
