import React from "react";
import clsx from "clsx";
import style from "./Products.module.scss";
import CartAddBtn from "../../../components/cartAdd/CartAddBtn";
import { useSelector, useDispatch } from "react-redux";
import { formatCurrency } from "../../../helpers/formatCurrency";
import getRandomNumber from "../../../helpers/random";
import { Link } from "react-router-dom";
import { removeAccents } from "../../../helpers/regex";
import Loading from "../../../components/loading/Loading";
import Error from "../../error/Error";

export default function Products() {
    const productList = useSelector((state) => state.products.productList);
    const status = useSelector((state) => state.products.status);
    if (status === "error") {
        return <Error />;
    } else if (status === 'pending') {
        return <Loading />
    }
    return (
        <div className={clsx(style.products)}>
            {productList.map((product) => {
                const randomNumber = getRandomNumber(10, 50);
                return (
                    <div
                        className={clsx(style["products-item"])}
                        key={product._id}
                    >
                        <Link
                            to={`/details/name~${removeAccents(product.name)}/${
                                product._id
                            }`}
                        >
                            <div className={clsx(style["products-item__img"])}>
                                <img src={product.image} alt="" />
                            </div>
                            <div className={clsx(style["products-item__info"])}>
                                <h4
                                    className={clsx(
                                        style["products-item__name"]
                                    )}
                                >
                                    {product.name}
                                </h4>
                                <div
                                    className={clsx(
                                        style["products-item__price"]
                                    )}
                                >
                                    <p
                                        className={clsx(
                                            style["products-item__price-old"]
                                        )}
                                    >
                                        {formatCurrency(
                                            product.price +
                                                (product.price * randomNumber) /
                                                    100
                                        )}
                                    </p>
                                    <p
                                        className={clsx(
                                            style["products-item__price-new"]
                                        )}
                                    >
                                        {formatCurrency(product.price)}
                                    </p>
                                    <i className="bx bxs-truck"></i>
                                </div>
                                <div
                                    className={clsx(
                                        style["products-item__favourite"]
                                    )}
                                >
                                    Yêu thích
                                </div>
                                <div
                                    className={clsx(
                                        style["products-item__sale-off"]
                                    )}
                                >
                                    <p
                                        className={clsx(
                                            style[
                                                "products-item__sale-off-value"
                                            ]
                                        )}
                                    >
                                        {randomNumber}%
                                    </p>
                                    <p
                                        className={clsx(
                                            style[
                                                "products-item__sale-off-label"
                                            ]
                                        )}
                                    >
                                        Giảm
                                    </p>
                                </div>
                                <div
                                    className={clsx(
                                        style["products-item__info-btn"]
                                    )}
                                >
                                    <CartAddBtn data={product} sale={randomNumber} />
                                </div>
                            </div>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}
