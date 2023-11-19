import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "../core/hooks";
import { client } from "../services/api/client";
import reloadPages from "../services/helpers/reloadPages";
import alertify from "alertifyjs";
import Cookies from "js-cookie";
import { formatCurrency } from "../services/helpers/formatCurrency";

export default function Cart() {
    const { isCart, carts, isLogin, products } = useSelector();
    const dispatch = useDispatch();
    const handleClick = () => {
        dispatch({
            type: "shop/toggleCart",
        });
    };
    const postCarts = async (body = []) => {
        const { data, response } = await client.post(`/orders`, body);
        if (response.status === 401) {
            reloadPages();
        }
        if (response.ok) {
            return data;
        } else {
            alertify.error(data.message);
        }
    };
    const handleOrderCart = async () => {
        if (!Cookies.get("userEmail") || !Cookies.get("apiKey")) {
            Cookies.remove("apiKey");
            Cookies.remove("userEmail");
            return reloadPages();
        }
        const orders = carts.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
        }));
        if (orders.length >= 1) {
            dispatch({
                type: "loading",
            });
            const data = await postCarts(orders);
            if (data) {
                alertify.success(data.message);
                dispatch({
                    type: "shop/clearCart",
                    products: data,
                });
            }
            dispatch({
                type: "loading",
            });
            dispatch({
                type: "shop/toggleCart",
            });
        } else {
            alertify.error("Không thể thanh toán do chưa có đơn hàng nào!");
        }
    };
    useEffect(() => {
        const storedCarts = JSON.parse(localStorage.getItem("carts"));
        if (isLogin && storedCarts) {
            const remaining = storedCarts.map((item) => {
                const arrFind = products.find((e) => e._id === item.productId);
                if (arrFind && arrFind.quantity !== item.remaining) {
                    item.remaining = arrFind.quantity;
                }
                return item;
            });
            dispatch({
                type: "shop/setCart",
                carts: remaining,
                cartsLen: storedCarts.length,
            });
        }
    }, [isLogin, products]);
    return (
        <>
            <div
                className={"overlay" + (isCart ? " active" : "")}
                onClick={handleClick}
            ></div>
            <div className={"cart" + (isCart ? " active" : "")}>
                <div className="cart-inner">
                    <table className="cart-table">
                        <thead>
                            <tr>
                                <th>TÊN SẢN PHẨN</th>
                                <th>SỐ LƯỢNG</th>
                                <th>CÒN LẠI</th>
                                <th>TỔNG TIỀN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carts.length >= 1 ? (
                                carts.map(
                                    ({
                                        productId,
                                        name,
                                        quantity,
                                        remaining,
                                        price,
                                    }) => {
                                        if (productId) {
                                            return (
                                                <tr key={productId}>
                                                    <td>{name}</td>
                                                    <td>{quantity}</td>
                                                    <td>{remaining}</td>
                                                    <td>
                                                        {formatCurrency(price)}
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    }
                                )
                            ) : (
                                <tr>
                                    <td colSpan={4}>Không có đơn hàng nào!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="cart-inner__btn">
                        <button type="button" onClick={handleOrderCart}>
                            Thanh toán
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
//  colSpan = "4";
