import React from "react";
import clsx from "clsx";
import style from "./OrderBtn.module.scss";
import { addCart } from "../../redux/slice/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkoutCart } from "../../redux/slice/productSlice";

export default function OrderBtn({ isPages, data, sale }) {
    const inputValue = useSelector((state) => state.products.inputValue);
    const cartList = useSelector((state) => state.products.cartList);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleAddCart = () => {
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
        navigate("/cart");
    };
    const handleOrder = () => {
        dispatch(checkoutCart());
    }
    return (
        <button className={clsx(style["order-btn"])} onClick={isPages === 'details' ? handleAddCart : handleOrder}>
            <span>{isPages === "details" ? "Mua ngay" : "Thanh toán"}</span>
        </button>
    );
}
