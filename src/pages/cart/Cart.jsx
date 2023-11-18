import React from "react";
import clsx from "clsx";
import style from "./Cart.module.scss";
import OrderBtn from "../../components/order/OrderBtn";
import { useSelector } from "react-redux";
import { formatCurrency } from "../../helpers/formatCurrency";
import QuantityInput from "../../components/quantityInput/QuantityInput";
import { Link } from "react-router-dom";
import DeleteBtn from "../../components/deleteBtn/DeleteBtn";

export default function Cart() {
    const cartList = useSelector((state) => state.products.cartList);
    const totalCart = cartList.reduce((total, item) => {
        return total + item.quantity * item.price;
    }, 0);
    if (cartList.length === 0) {
        return (
            <div className={clsx(style.hollow)}>
                <img
                    src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/9bdd8040b334d31946f49e36beaf32db.png"
                    alt=""
                />
                <p>Giỏ hàng của bạn còn trống</p>
                <Link to="/">Mua ngay</Link>
            </div>
        );
    }
    return (
        <div className={clsx(style.cart)}>
            <div className={clsx(style["cart-title"])}>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <h2>
                                <Link to="/">Home</Link>
                                <i className="bx bx-chevron-right"></i>
                                Giỏ hàng
                            </h2>
                        </div>
                    </div>
                    <div className={clsx(style["cart-content"])}>
                        <header className={clsx(style["cart-content__header"])}>
                            <div className="row">
                                <div className="col-4">
                                    <span className={clsx(style.product)}>
                                        Sản Phẩm
                                    </span>
                                </div>
                                <div className="col-2">
                                    <span>Đơn Giá</span>
                                </div>
                                <div className="col-2">
                                    <span>Số Lượng</span>
                                </div>
                                <div className="col-2">
                                    <span>Số Tiền</span>
                                </div>
                                <div className="col-2">
                                    <span>Thao Tác</span>
                                </div>
                            </div>
                        </header>
                        {cartList.map((item) => {
                            return (
                                <section
                                    className={clsx(
                                        style["cart-content__section"]
                                    )}
                                    key={item._id}
                                >
                                    <div
                                        className={clsx(
                                            style["cart-content__section-brand"]
                                        )}
                                    >
                                        <h4>{item.brand}</h4>
                                    </div>
                                    <div
                                        className={clsx(
                                            style[
                                                "cart-content__section-product"
                                            ]
                                        )}
                                    >
                                        <div className="row">
                                            <div className="col-4">
                                                <div
                                                    className={clsx(
                                                        style[
                                                            "cart-content__section-product-title"
                                                        ]
                                                    )}
                                                >
                                                    <div
                                                        className={clsx(
                                                            style[
                                                                "cart-content__section-product-img"
                                                            ]
                                                        )}
                                                    >
                                                        <a href="#!">
                                                            <img
                                                                src={item.image}
                                                                alt=""
                                                            />
                                                        </a>
                                                    </div>
                                                    <h4>{item.name}</h4>
                                                </div>
                                            </div>
                                            <div className="col-2">
                                                <div
                                                    className={clsx(
                                                        style[
                                                            "cart-content__section-product-price"
                                                        ]
                                                    )}
                                                >
                                                    <p
                                                        className={clsx(
                                                            style[
                                                                "cart-content__section-product-price-old"
                                                            ]
                                                        )}
                                                    >
                                                        {item.sale &&
                                                            formatCurrency(
                                                                item.price +
                                                                    (item.price *
                                                                        item.sale) /
                                                                        100
                                                            )}
                                                    </p>
                                                    <p
                                                        className={clsx(
                                                            style[
                                                                "cart-content__section-product-price-new"
                                                            ]
                                                        )}
                                                    >
                                                        {formatCurrency(
                                                            item.price
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="col-2">
                                                <div
                                                    className={clsx(
                                                        style[
                                                            "cart-content__section-product-quantity"
                                                        ]
                                                    )}
                                                >
                                                    <div
                                                        className={clsx(
                                                            style[
                                                                "cart-content__section-product-quantity-wrap"
                                                            ]
                                                        )}
                                                    >
                                                        <QuantityInput
                                                            isPages="cart"
                                                            data={item}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-2">
                                                <div
                                                    className={clsx(
                                                        style[
                                                            "cart-content__section-product-price-total"
                                                        ]
                                                    )}
                                                >
                                                    <span>
                                                        {formatCurrency(
                                                            item.price *
                                                                item.quantity
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-2">
                                                <div
                                                    className={clsx(
                                                        style[
                                                            "cart-content__section-product-delete"
                                                        ]
                                                    )}
                                                >
                                                    <DeleteBtn data={item} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            );
                        })}
                        <footer className={clsx(style["cart-content__footer"])}>
                            <p>
                                Tổng thanh toán ({cartList.length} Sản phẩm):{" "}
                                <span>{formatCurrency(totalCart)}</span>
                            </p>
                            <OrderBtn isPages="cart" />
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
}
