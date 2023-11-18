import React from "react";
import clsx from "clsx";
import style from "./CartButton.module.scss";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
export default function CartButton() {
    const cartList = useSelector((state) => state.products.cartList)
    const navigate = useNavigate();

    const handleCartButtonClick = () => {
        navigate("/cart");
    };
    return (
        <div className={clsx(style.cart)}>
            <button
                className={clsx(style["cart-btn"])}
                type="button"
                onClick={handleCartButtonClick}
            >
                <i className="bx bx-cart-alt"></i>
                {cartList.length > 0 && <span>{cartList.length}</span>}
            </button>
        </div>
    );
}
