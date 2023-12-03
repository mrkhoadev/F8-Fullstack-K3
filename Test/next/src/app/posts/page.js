import React from "react";
import Link from "next/link";

const getPosts = async () => {
    const response = await fetch(`${process.env.SERVER_API}/posts`);
    return await response.json();
};

export default async function page() {
    const postList = await getPosts();

    return (
        <div>
            {postList.map(({ id, title }) => (
                <>
                    <h3 key={id}>{title}</h3>
                    <Link href={`/posts/${id}`}>Chi tiết</Link>
                </>
            ))}
        </div>
    );
}
