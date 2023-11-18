import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { numberRegex } from "../../helpers/regex";
import { getValue, editCart } from "../../redux/slice/productSlice";

export default function QuantityInput({ isPages, data }) {
    const inputValue = useSelector((state) => state.products.inputValue);
    const dispatch = useDispatch();
    const [value, setValue] = useState(1);

    const handleChangeValue = (e) => {
        const input = numberRegex(e.target.value);
        setValue(+input);
    };
    const handleBlur = () => {
        if (value < 1 || value === "") {
            setValue(1);
        }
    };
    const handleDecrement = () => {
        if (value > 1) {
            setValue(value - 1);
        }
    };
    const handleIncrement = () => {
        if (value < 999) {
            setValue(value + 1);
        }
    };
    useEffect(() => {
        if (isPages === "cart") {
            setValue(data.quantity);
        } else if (isPages === 'details') {
            setValue(inputValue);
        }
    }, []);
    useEffect(() => {
        if (value > 0 && value !== "") { 
            if (isPages === "cart") {
                dispatch(editCart({ ...data, quantity: value }));
            } else if (isPages === "details") {
                dispatch(getValue(value));
            }
        }
    }, [value]);
    return (
        <>
            <button onClick={handleDecrement}>-</button>
            <input
                type="text"
                value={value}
                onChange={handleChangeValue}
                onBlur={handleBlur}
            />
            <button onClick={handleIncrement}>+</button>
        </>
    );
}
