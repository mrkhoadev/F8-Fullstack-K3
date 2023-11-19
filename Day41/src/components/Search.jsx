import React, { useState, useEffect } from "react";
import { Client } from "../api/Client";
import alertify from "alertifyjs";

export default function Search({
    handleToggleSearch,
    isSearch,
    inputText,
    isLogin,
    handleSetState,
    handleLoading,
}) {
    let checkAlert = true;
    const handleClick = (e) => {
        if (!isLogin) {
            alertify.error(`Hãy đăng nhập để bắt đầu tìm kiếm!`);
            setTimeout(() => {
                window.location.reload();
            }, 1500);
            return;
        }
        const input =
            e.target.previousElementSibling.querySelector("input[type='text']");
        if (!isSearch) {
            input.focus();
            alertify.message(`Đã sẵn sàng để tìm kiếm!`);
            handleToggleSearch(true);
            checkAlert = true;
            handleSetState({
                inputText: input.value,
            });
            inputText !== "" && handleSearchTodo(inputText);
        } else {
            alertify.message(`Đã kết thúc tìm kiếm!`);
            handleToggleSearch(false);
            checkAlert = false;
            if (inputText !== "") {
                handleSetState({
                    inputText: "",
                });
                handleSearchTodo("");
            }
        }
    };
    const getData = async (query = {}) => {
        const queryString = new URLSearchParams(query).toString();
        const { response, data } = await Client.get(`/todos?` + queryString);
        if (response.status === 401) {
            alertify.error(`Hãy đăng nhập lại để tiếp tục tìm kiếm!`);
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else if (response.ok) {
            return data.data;
        } else {
            return null;
        }
    };
    const handleSearchTodo = async (text) => {
        handleLoading(true);
        const data = await getData({
            q: text,
        });
        if (data) {
            handleSetState({
                data: data.listTodo,
            });
            if (data.listTodo.length > 0 && checkAlert) {
                alertify.message(`Đã tìm thấy ${data.listTodo.length} kết quả`);
            }
        } else if (data === null) {
            alertify.error(`Đã xảy ra lỗi không xác định!`);
        }
        handleLoading(false);
    };
    useEffect(() => {
        let timer;
        if (isSearch) {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                handleSearchTodo(inputText);
            }, 800);
            return () => {
                if (timer) {
                    clearTimeout(timer);
                }
            };
        }
    }, [inputText]);
    return (
        <button
            className={"search-btn" + (isSearch ? " active" : "")}
            onClick={handleClick}
        >
            Tìm kiếm
        </button>
    );
}
