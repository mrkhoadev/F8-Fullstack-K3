import React from "react";
import Home from "../../pages/home/Home";
import { Routes, Route } from "react-router-dom";
import ProductDetails from "../../pages/productDetails/ProductDetails";
import Cart from "../../pages/cart/Cart";
import { useSelector } from "react-redux";
import Error from "../../pages/error/Error";

export default function Body() {
    return (
        <main className="app" style={{ paddingTop: "3px" }}>
            <Routes>
                <Route path="/" element={<Home />}>
                    <Route path="product/:page" element={<Home />} />
                </Route>
                <Route path="/details">
                    <Route path=":slug/:id" element={<ProductDetails />} />
                </Route>
                <Route path="/cart" element={<Cart />} />
                <Route path="*" element={<Error />} />
            </Routes>
        </main>
    );
}
