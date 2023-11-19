import React, { Component } from "react";
import { Client } from "../api/Client";
import alertify from "alertifyjs";
import Cookies from "js-cookie";
import { HtmlScript } from "./HtmlScript";

export default class TodoList extends Component {
    constructor(props) {
        super(props);
        this.originalData = {};
        this.newCompleted = "";
        this.state = {
            editingId: null,
            inputText: "",
        };
    }
    reloadPage() {
        Cookies.remove("apiKey");
        Cookies.remove("userEmail");
        alertify.error(`Hãy đăng nhập lại để tiếp tục!`);
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
    getData = async () => {
        const { response, data: work } = await Client.get(`/todos`);
        if (response.status === 401) {
            this.reloadPage();
        } else if (response.ok) {
            return work.data;
        } else {
            return null;
        }
    };
    handleGetData = async () => {
        const data = await this.getData();
        if (data) {
            this.props.handleSetState((prevState) => ({
                data: data.listTodo,
            }));
        } else if (data === null) {
            alertify.error(
                `Lỗi không thể lấy được dữ liệu, hãy quay lại sau ít phút!`
            );
        }
    };
    handleInputChange(id, e) {
        const value = e.target.value;
        this.setState({
            inputText: value,
        });
    }
    handleChecked = (id) => {
        this.props.handleSetState({
            data: this.props.data.map((item) =>
                item._id === id
                    ? { ...item, isCompleted: !item.isCompleted }
                    : item
            ),
        });
        this.newCompleted = !this.newCompleted;
    };
    handleEditClick = (id, todo, isCompleted) => {
        this.originalData = {
            id,
            todo,
            isCompleted,
        };
        this.newCompleted = isCompleted;
        this.setState({
            editingId: id,
            inputText: todo,
        });
    };
    handleCannelClick = () => {
        const { id, isCompleted: oldCompleted } = this.originalData;
        this.props.handleSetState({
            data: this.props.data.map((item) =>
                item._id === id ? { ...item, isCompleted: oldCompleted } : item
            ),
        });
        this.setState({
            editingId: null,
        });
    };
    handleUpdateClick = async (id, e) => {
        this.props.addLoading(e.target);
        const { response, data } = await Client.patch(`/todos/${id}`, {
            todo: this.state.inputText,
            isCompleted: this.newCompleted,
        });
        if (response.status === 401) {
            this.reloadPage();
        } else if (response.ok) {
            this.props.handleSetState({
                data: this.props.data.map((item) =>
                    item._id === id ? { ...item, todo: data.data.todo } : item
                ),
            });
            this.setState({
                editingId: null,
            });
            alertify.message(data.message);
        } else {
            this.handleCannelClick();
            alertify.error("Đã xảy ra lỗi, hãy thử lại!");
        }
        this.props.removeLoading(e.target);
    };
    async handleDelete(id, e) {
        alertify.confirm(
            "Bạn có chắc chắn muốn xóa không?",
            async () => {
                this.props.addLoading(e.target);
                const { response, data } = await Client.delete(`/todos/` + id);
                if (response.status === 401) {
                    this.reloadPage();
                } else if (response.ok) {
                    alertify.message(data.message);
                    this.props.handleSetState({
                        data: this.props.data.filter((item) => item._id !== id),
                    });
                } else {
                    alertify.error("Đã xảy ra lỗi, hãy thử lại!");
                }
                this.props.removeLoading(e.target);
            },
            function () {
                alertify.error("Đã hủy!");
            }
        );
    }
    async componentDidMount() {
        this.props.addLoading();
        await this.handleGetData();
        this.props.removeLoading();
    }
    render() {
        const listItem = this.props.data.map(({ _id, todo, isCompleted }) => (
            <li className="todo-work" key={_id}>
                <div className="input-box">
                    {this.state.editingId === _id ? (
                        <input
                            type="text"
                            onChange={(e) => this.handleInputChange(_id, e)}
                            value={HtmlScript(this.state.inputText)}
                            style={
                                isCompleted
                                    ? { textDecoration: "line-through" }
                                    : {}
                            }
                        />
                    ) : (
                        <input
                            type="text"
                            value={HtmlScript(todo)}
                            style={
                                isCompleted
                                    ? { textDecoration: "line-through" }
                                    : {}
                            }
                            readOnly
                        />
                    )}
                </div>
                <div className="button-box">
                    {this.state.editingId === _id ? (
                        <>
                            <div className="button-box__left">
                                <input
                                    type="checkbox"
                                    id={_id}
                                    checked={isCompleted}
                                    onChange={() => this.handleChecked(_id)}
                                    hidden
                                />
                                <label htmlFor={_id}>Not Completed</label>
                            </div>
                            <div className="button-box__right">
                                <button
                                    className="cannel-btn"
                                    type="button"
                                    onClick={this.handleCannelClick}
                                >
                                    Thoát
                                </button>
                                <button
                                    className="update-btn"
                                    type="button"
                                    onClick={(e) =>
                                        this.handleUpdateClick(_id, e)
                                    }
                                >
                                    Update
                                </button>
                                <button
                                    className="delete-btn"
                                    type="button"
                                    onClick={(e) => this.handleDelete(_id, e)}
                                >
                                    Xóa
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <button
                                className="edit-btn"
                                onClick={() =>
                                    this.handleEditClick(_id, todo, isCompleted)
                                }
                            >
                                Sửa
                            </button>

                            <button
                                className="delete-btn"
                                type="button"
                                onClick={(e) => this.handleDelete(_id, e)}
                            >
                                Xóa
                            </button>
                        </>
                    )}
                </div>
            </li>
        ));
        return (
            <ul className="todo-list">
                {this.props.data.length > 0 ? (
                    listItem
                ) : (
                    <li className="todo-work">
                        <div className="input-box">
                            <input
                                type="text"
                                value="Không có dữ liệu."
                                readOnly
                            />
                        </div>
                    </li>
                )}
            </ul>
        );
    }
}
