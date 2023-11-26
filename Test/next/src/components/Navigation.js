"use client";
import React from "react";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import '@/assets/style.scss';

export default function Navigation() {
    const pathname = usePathname(); 
    return (
        <nav>
            <ul className="menu">
                <li className={clsx(pathname === "/" && "active")}>
                    <Link href="/">Trang chủ</Link>
                </li>
                <li className={clsx(pathname === "/about" && "active")}>
                    <Link href="/about">Giới thiệu</Link>
                </li>
                <li>
                    <Link href="/san-pham">Sản phẩm</Link>
                </li>
            </ul>
        </nav>
    );
}
