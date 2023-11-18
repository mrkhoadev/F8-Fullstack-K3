import React from "react";
import clsx from "clsx";
import style from "./Home.module.scss";
import Products from "./products/Products";
import Pagination from "./pagination/Pagination";

export default function Home() {
    return (
        <div className={clsx(style["app-home"])}>
            <div className={clsx(style["home-title"])}>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <h2>PRODUCTS</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className={clsx(style["app-content"])}>
                <div className="container">
                    <Products />
                    <Pagination />
                </div>
            </div>
        </div>
    );
}
