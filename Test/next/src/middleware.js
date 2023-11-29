import { NextResponse } from "next/server";
import React from "react";

export default function middleware(request) {
    // const userAgent = request.headers.get("user-agent");
    const pathname = request.nextUrl.pathname;
    const username = request.cookies.get("username");

    // const urlLogin = new URL("/auth/login");
    // if (pathname.startsWith("/san-pham") && !isAuth) {
    //     return NextResponse.redirect(urlLogin);
    // }
    // const response = NextResponse.next();
    // response.headers.set("x-api-key", "1234");
    // response.cookies.set({
    //     name: "abc",
    //     value: "xyz",
    //     maxAge: 3600,
    //     httpOnly: true,
    // });
    // if (pathname.startsWith("/gioi-thieu")) {
    //     response.rewrite(new URL('/about', request.url))
    // }
    // return response;
}
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
