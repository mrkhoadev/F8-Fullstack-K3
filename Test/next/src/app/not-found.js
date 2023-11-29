import React from "react";
import Link from "next/link";
import notFoundImage from '@/assets/image/error.png'
import Image from "next/image";

export default function NotFound() {
    return (
        <div>
            <h1>Page Not Found</h1>
            <h2>Lac asdifjs s df</h2>
            <Image src={notFoundImage} alt="404 not found" style={{maxWidth: '50%', height: 'auto'}}/>
            <Link href={"/"}>Ve trang chu</Link>
        </div>
    );
}
