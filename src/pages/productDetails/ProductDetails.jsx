import React, { useEffect, useLayoutEffect } from "react";
import { Routes, Route, useParams, Link } from "react-router-dom";
import clsx from "clsx";
import style from "./details.module.scss";
import { useDispatch } from "react-redux";
import CartAddBtn from "../../components/cartAdd/CartAddBtn";
import OrderBtn from "../../components/order/OrderBtn";
import { useSelector } from "react-redux";
import { getProductDetails } from "../../redux/slice/productSlice";
import getRandomNumber from "../../helpers/random";
import { formatCurrency } from "../../helpers/formatCurrency";
import QuantityInput from "../../components/quantityInput/QuantityInput";
import Loading from "../../components/loading/Loading";
import Error404 from "../error/Error404";
import Error from "../error/Error";

const random = getRandomNumber(10, 50);
export default function ProductDetails() {
    const productDetails = useSelector(
        (state) => state.products.productDetails
    );
    const status = useSelector((state) => state.products.status);
    const { id } = useParams();
    const dispatch = useDispatch();
    useLayoutEffect(() => { 
        (async () => {
            await dispatch(getProductDetails(id));
        })();
    }, []);
    if (status === "error") {
        return <Error />;
    } else if (status === "pending") {
        return <Loading />;
    } else if (!productDetails) {
        return <Error404 />;
    }
    return (
        <div className={clsx(style.details)}>
            <div className={clsx(style["details-title"])}>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <h2>
                                <Link to="/">Home</Link>
                                <i className="bx bx-chevron-right"></i>
                                Chi tiết
                            </h2>
                        </div>
                    </div>
                    <div className={clsx(style["details-content"])}>
                        <div className="row">
                            <div className="col-5">
                                <div
                                    className={clsx(
                                        style["details-content__img"]
                                    )}
                                >
                                    <img
                                        src="https://picsum.photos/200?_id=90Gh68a1NeC985499pV56"
                                        alt=""
                                    />
                                </div>
                            </div>
                            <div className="col-7">
                                <div
                                    className={clsx(
                                        style["details-content__info"]
                                    )}
                                >
                                    <h3
                                        className={clsx(
                                            style["details-content__info-brand"]
                                        )}
                                    >
                                        {productDetails.brand}
                                    </h3>
                                    <h4
                                        className={clsx(
                                            style["details-content__info-title"]
                                        )}
                                    >
                                        {productDetails.name}
                                    </h4>
                                    <div
                                        className={clsx(
                                            style["details-content__info-price"]
                                        )}
                                    >
                                        <p
                                            className={clsx(
                                                style[
                                                    "details-content__info-price-old"
                                                ]
                                            )}
                                        >
                                            {formatCurrency(
                                                productDetails.price +
                                                    (productDetails.price *
                                                        100) /
                                                        100
                                            )}
                                        </p>
                                        <p
                                            className={clsx(
                                                style[
                                                    "details-content__info-price-new"
                                                ]
                                            )}
                                        >
                                            {formatCurrency(
                                                productDetails.price
                                            )}
                                        </p>
                                        <span
                                            className={clsx(
                                                style[
                                                    "details-content__info-price-sale"
                                                ]
                                            )}
                                        >
                                            {random}% GIẢM
                                        </span>
                                    </div>
                                    <div
                                        className={clsx(
                                            style[
                                                "details-content__info-category"
                                            ]
                                        )}
                                    >
                                        <div className="row">
                                            <div className="col-2">
                                                Danh mục
                                            </div>
                                            <div className="col-10">
                                                {productDetails.category}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={clsx(
                                            style[
                                                "details-content__info-description"
                                            ]
                                        )}
                                    >
                                        <div className="row">
                                            <div className="col-2">Mô tả</div>
                                            <div className="col-10">
                                                {productDetails.description}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={clsx(
                                            style[
                                                "details-content__info-quantity"
                                            ]
                                        )}
                                    >
                                        <div className="row">
                                            <div className="col-2">
                                                Số lượng
                                            </div>
                                            <div className="col-10">
                                                <div
                                                    className={clsx(
                                                        style[
                                                            "details-content__info-quantity-wrap"
                                                        ]
                                                    )}
                                                >
                                                    <div
                                                        className={clsx(
                                                            style[
                                                                "details-content__info-quantity-btn"
                                                            ]
                                                        )}
                                                    >
                                                        <QuantityInput
                                                            isPages="details"
                                                            data={
                                                                productDetails
                                                            }
                                                        />
                                                    </div>
                                                    <div
                                                        className={clsx(
                                                            style[
                                                                "details-content__info-quantity-text"
                                                            ]
                                                        )}
                                                    >
                                                        {
                                                            productDetails.quantity
                                                        }{" "}
                                                        sản phẩm có sẵn
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={clsx(
                                            style[
                                                "details-content__info-button"
                                            ]
                                        )}
                                    >
                                        <CartAddBtn
                                            data={productDetails}
                                            sale={random}
                                        />
                                        <OrderBtn
                                            isPages="details"
                                            data={productDetails}
                                            sale={random}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
