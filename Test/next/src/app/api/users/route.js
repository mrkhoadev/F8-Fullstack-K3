import { NextResponse } from "next/server";

export const GET = (request) => {
    const user = {
        name: "Hoàng An",
        email: "hoangan.web@gmail.com",
    };
    // return Response.json(user);
    return NextResponse.json(user, { status: 404 });
};

export const POST = async (request) => {
    return NextResponse.json({ status: "ok", body: await request.json() });
};
