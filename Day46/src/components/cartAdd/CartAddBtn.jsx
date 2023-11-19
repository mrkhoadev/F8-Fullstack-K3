import React from "react";
import clsx from "clsx";
import style from "./CartAddBtn.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { addCart } from "../../redux/slice/productSlice";

export default function CartAddBtn({ data, sale }) {
    const inputValue = useSelector((state) => state.products.inputValue);
    const dispatch = useDispatch();
    const handleClick = (e) => {
        e.preventDefault();
        const product = {
            _id: data._id,
            category: data.category,
            name: data.name,
            brand: data.brand,
            image: data.image,
            price: data.price,
            amount: data.quantity,
            quantity: inputValue,
            updatedAt: data.updatedAt,
            sale: sale,
        };
        dispatch(addCart(product));
    };
    return (
        <button
            className={clsx(style["cart-add"])}
            onClick={handleClick}
            type="button"
        >
            <span className={clsx(style["icon"])}>
                <i className="bx bxs-cart-add"></i>
            </span>
            <span>Thêm vào giỏ hàng</span>
        </button>
    );
}
