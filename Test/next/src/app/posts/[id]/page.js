import React from "react";
import Button from "@/components/Button";
const getPosts = async (id) => {
    const response = await fetch(`${process.env.SERVER_API}/posts/${id}`);
    return response.json();
};

export default async function PostsDetail({ params }) {
    const { id } = params;
    const post = await getPosts(id);
    return (
        <div>
            <h1>{post.title}</h1>
            <Button text={post.body} />
        </div>
    );
}
