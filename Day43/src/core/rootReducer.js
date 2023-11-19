import Cookies from "js-cookie";
import { client } from "../services/api/client";
import reloadPages from "../services/helpers/reloadPages";

export const initialState = {
    products: [],
    carts: [],
    isLogin: false,
    isLoading: false,
    reloadRequired: false,
    isCart: false,
    cartLen: 0,
    apiKey: "",
    userEmail: "",
};
export const rootReducer = (state, action) => {
    switch (action.type) {
        case "login": {
            client.setApiKey(action.apiKey);
            return {
                ...state,
                isLogin: true,
                apiKey: action.apiKey,
                userEmail: action.userEmail,
            };
        }
        case "reloadPages": {
            return { ...state, reloadRequired: true };
        }
        case "loading": {
            return { ...state, isLoading: !state.isLoading };
        }
        case "shop/products": {
            return { ...state, products: action.products };
        }
        case "shop/AddCarts": {
            const updatedCarts = state.carts.map((item) => {
                if (item.productId === action.carts.productId) {
                    const newQuantity = item.quantity + action.carts.quantity;
                    return {
                        ...item,
                        remaining: item.remaining - action.carts.quantity,
                        price: newQuantity * action.carts.price,
                        quantity: newQuantity,
                    };
                } else {
                    return item;
                }
            });
            const isNewId = !updatedCarts.some(
                (item) => item.productId === action.carts.productId
            );
            if (isNewId) {
                updatedCarts.push({
                    ...action.carts,
                    remaining: action.carts.remaining - action.carts.quantity,
                });
            }
            localStorage.setItem("carts", JSON.stringify(updatedCarts));
            return {
                ...state,
                carts: updatedCarts,
                cartLen: updatedCarts.length,
            };
        }
        case "shop/toggleCart": {
            return { ...state, isCart: !state.isCart };
        }
        case "shop/clearCart": {
            localStorage.removeItem("carts");
            return {
                ...state,
                products: state.products.map((item) => {
                    const update = action.products.data.find((u) => {
                        return u.productId === item._id;
                    });
                    if (update) {
                        return {
                            ...item,
                            quantity: item.quantity - update.quantity,
                        };
                    }
                    return item;
                }),
                carts: [],
                cartLen: 0,
            };
        }
        case "shop/setCart": {
            localStorage.setItem('carts', JSON.stringify(action.carts))
            return {
                ...state,
                carts: [...action.carts],
                cartLen: action.cartsLen,
            };
        }

        default: {
            return state;
        }
    }
};
