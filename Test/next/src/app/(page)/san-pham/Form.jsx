"use client";

import { useRouter } from "next/navigation";

export default function Form() {
    const router = useRouter();
    const handleSubmit = (e) => {
        e.preventDefault();
        const status = e.target.status.value;
        const keywords = e.target.keywords.value;

        const searchParams = new URLSearchParams({
            status,
            keywords,
        });
        router.push("/san-pham?" + searchParams);
        e.target.reset();
    };
    return (
        <form onSubmit={handleSubmit}>
            <select name="status">
                <option value="all">tat ca trang thai</option>
                <option value="1">trang thai 1</option>
                <option value="2">trang thai 2</option>
            </select>
            <input type="search" name="keywords" placeholder="tu khoa" />
            <button>tim kiem</button>
        </form>
    );
}
