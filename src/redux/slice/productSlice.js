import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "../../api/client";
import alertify from "alertifyjs";

const initialState = {
    productList: [],
    cartList: localStorage.getItem("cart")
        ? JSON.parse(localStorage.getItem("cart"))
        : [],
    productDetails: null,
    status: "idle",
    inputValue: 1,
    totalPage: 0
};
export const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        getValue: (state, action) => {
            state.inputValue = action.payload;
        },
        addCart: (state, action) => {
            const prevStateCart = JSON.parse(JSON.stringify(state.cartList));
            const product = action.payload;
            const find = prevStateCart.find((item) => item._id === product._id);
            if (find) {
                state.cartList = prevStateCart.map((item) =>
                    item._id === find._id
                        ? {
                              ...item,
                              quantity: item.quantity + action.payload.quantity,
                              sale: action.payload.sale,
                          }
                        : item
                );
            } else {
                state.cartList = [action.payload, ...state.cartList];
            }
            state.inputValue = 1;
            localStorage.setItem("cart", JSON.stringify(state.cartList));
            alertify.success(
                `Đã thêm <span>"${action.payload.name}"</span> vào giỏ hàng!`
            );
        },
        editCart: (state, action) => {
            const prevStateCart = JSON.parse(JSON.stringify(state.cartList));
            const product = action.payload;
            const find = prevStateCart.find((item) => item._id === product._id);
            if (find) {
                state.cartList = prevStateCart.map((item) =>
                    item._id === find._id
                        ? {
                              ...item,
                              quantity: action.payload.quantity,
                          }
                        : item
                );
            }
            localStorage.setItem("cart", JSON.stringify(state.cartList));
        },
        checkoutCart: (state) => {
            state.cartList = [];
            localStorage.removeItem("cart");
            alertify.alert("Bạn đã thanh thoán thành công!", function () {
                alertify.message("Thanks you!");
            });
        },
        deleteProduct: (state, action) => {
            const prevStateCart = JSON.parse(JSON.stringify(state.cartList));
            const itemIndex = prevStateCart.findIndex(
                (item) => item._id === action.payload._id
            );
            prevStateCart.splice(itemIndex, 1);
            state.cartList = prevStateCart;
            localStorage.setItem("cart", JSON.stringify(state.cartList));
            alertify.success(`Đã xóa <span>"${action.payload.name}"</span>!`);
        },
    },
    extraReducers: (builder) => {
        builder
            //getProducts
            .addCase(getProducts.fulfilled, (state, action) => {
                state.productList = action.payload.data.listProduct;
                state.totalPage = action.payload.data.totalPage
                state.status = "success";
            })
            .addCase(getProducts.pending, (state) => {
                state.status = "pending";
            })
            .addCase(getProducts.rejected, (state) => {
                state.status = "error";
            })

            //getProductDetails
            .addCase(getProductDetails.fulfilled, (state, action) => {
                state.productDetails = action.payload.data;
                state.status = "success";
            })
            .addCase(getProductDetails.pending, (state) => {
                state.status = "pending";
            })
            .addCase(getProductDetails.rejected, (state) => {
                state.status = "error";
            });
    },
});
export const { getValue, addCart, editCart, checkoutCart, deleteProduct } =
    productSlice.actions;

export const getProducts = createAsyncThunk(
    "products/getProducts",
    async (query = {}) => {
        const queryString = new URLSearchParams(query).toString();
        const { data } = await client.get(`/products?${queryString}`);
        return data;
    }
);
export const getProductDetails = createAsyncThunk(
    "products/getProductDetails",
    async (id) => {
        const { data } = await client.get(`/products/` + id);
        return data;
    }
);
