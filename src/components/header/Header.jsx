import React, { useEffect, useRef, useState } from "react";
import style from "./header.module.scss";
import clsx from "clsx";
import CartButton from "./cart/CartButton";
import { Link } from "react-router-dom";
import logo from '../../assets/image/logo/logo-full.png'

export default function Header() {
    const headerInnerElRef = useRef(null);
    const [headerHeight, setHeaderHeight] = useState(0)
    const handleSubmit = (e) => {
        e.preventDefault();
    };
    useEffect(() => {
        setHeaderHeight(headerInnerElRef.current.clientHeight);
    }, [])
    return (
        <header
            className={clsx(style.header)}
            style={{ height: `${headerHeight}px` }}
        >
            <div className={clsx(style["header-inner"])} ref={headerInnerElRef}>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <nav className={clsx(style.navbar)}>
                                <div className={clsx(style["navbar-left"])}>
                                    <ul>
                                        <li>Kênh Người Bán</li>
                                        <li>Trở thành người bán</li>
                                        <li>Tải ứng dụng</li>
                                        <li>
                                            Kết nối{" "}
                                            <span>
                                                <i className="bx bxl-facebook-circle"></i>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <div className={clsx(style["navbar-right"])}>
                                    <ul>
                                        <li>
                                            <span>
                                                <i className="bx bx-bell"></i>
                                            </span>
                                            Thông báo
                                        </li>
                                        <li>
                                            <span>
                                                <i className="bx bx-help-circle"></i>
                                            </span>
                                            Hỗ trợ
                                        </li>
                                        <li>Tiếng việt</li>
                                    </ul>
                                </div>
                            </nav>
                            <div className={clsx(style.search)}>
                                <div className="row justify-content-between">
                                    <div className="col-3">
                                        <Link to={"/"}>
                                            <div className={clsx(style.logo)}>
                                                <img src={logo} alt="logo" />
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="col-7">
                                        <form
                                            action=""
                                            className={clsx(
                                                style["search-form"]
                                            )}
                                            onSubmit={handleSubmit}
                                        >
                                            <div
                                                className={clsx(
                                                    style["input-box"]
                                                )}
                                            >
                                                <input
                                                    type="text"
                                                    placeholder="Tìm kiếm..."
                                                />
                                            </div>
                                            <button>
                                                <i className="bx bx-search-alt"></i>
                                            </button>
                                        </form>
                                    </div>
                                    <div className="col-2">
                                        <CartButton />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
