import React, { Component } from "react";
import Add from "./Add";
import Search from "./Search";
import TodoList from "./todoList";
import Login from "./Login";
import Cookies from "js-cookie";
import alertify from "alertifyjs";
import { Client } from "../api/Client";

export default class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLogin:
                Cookies.get("apiKey") && Cookies.get("userEmail")
                    ? true
                    : false,
            apiKeyCookie: Cookies.get("apiKey") ? Cookies.get("apiKey") : "",
            usersEmailCookie: Cookies.get("userEmail")
                ? Cookies.get("userEmail")
                : "",
            form: {
                email: "",
            },
            success: (text) => {
                text = text.split("@")[0];
                return this.state.usersEmailCookie
                    ? `Chào mừng <span>${text}</span> đến với TodoList :D`
                    : "";
            },
            error: "Hãy nhập email để có thể sử dụng TodoList",
            inputText: "",
            isSearch: false,
        };
    }
    handleSetState = (callback) => {
        this.setState(callback);
    };
    handleLogin = (boolean) => {
        this.setState({
            isLogin: boolean,
        });
    };
    handleToggleSearch = (boolean) => {
        this.setState({
            isSearch: boolean,
        });
    };
    componentDidMount = () => {
        if (this.state.apiKeyCookie && this.state.usersEmailCookie) {
            alertify.success(this.state.success(Cookies.get("userEmail")));
        } else {
            alertify.error(this.state.error);
        }
    };
    render() {
        if (this.state.apiKeyCookie && this.state.usersEmailCookie) {
            Client.setApiKey(this.state.apiKeyCookie);
        }
        return (
            <>
                {!this.state.isLogin && (
                    <Login
                        handleLogin={this.handleLogin}
                        addLoading={this.props.addLoading}
                        removeLoading={this.props.removeLoading}
                        handleLoading={this.props.handleLoading}
                    />
                )}
                <div className="todo">
                    <div className="containers">
                        <h1 className="todo-title">Welcome to Todo App!</h1>
                        <div className="todo-top">
                            <Add
                                addLoading={this.props.addLoading}
                                removeLoading={this.props.removeLoading}
                                handleLoading={this.props.handleLoading}
                                handleSetState={this.handleSetState}
                                isLogin={this.state.isLogin}
                                isSearch={this.state.isSearch}
                            />
                            <Search
                                isLogin={this.state.isLogin}
                                handleToggleSearch={this.handleToggleSearch}
                                isSearch={this.state.isSearch}
                                inputText={this.state.inputText}
                                handleLoading={this.props.handleLoading}
                                handleSetState={this.handleSetState}
                            />
                        </div>

                        {this.state.isLogin ? (
                            <TodoList
                                addLoading={this.props.addLoading}
                                removeLoading={this.props.removeLoading}
                                handleLoading={this.props.handleLoading}
                                handleSetState={this.handleSetState}
                                data={this.state.data}
                            />
                        ) : (
                            <ul className="todo-list">
                                <li className="todo-work">
                                    <div className="input-box">
                                        <input
                                            type="text"
                                            value="Hãy đăng nhập để có thể trải nghiệm dịch vụ :D"
                                            readOnly
                                        />
                                    </div>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </>
        );
    }
}
