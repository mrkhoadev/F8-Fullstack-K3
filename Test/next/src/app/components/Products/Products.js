import React from "react";
import clsx from "clsx";
import style from "./Products.module.scss";

export default function Products() {
    return (
        <div>
            <h2 className={clsx(style.title)}>Sản phẩm</h2>
            <p className="content">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Praesentium ratione dolor ab molestias eligendi quaerat nostrum
                excepturi dolore facere animi.
            </p>
        </div>
    );
}
