import React from "react";
import error404Img from "../../assets/image/error/error_404.jpg";
import "./Error.scss";

export default function Error404() {
    return (
        <div className="error">
            <img src={error404Img} alt="error 404" />
        </div>
    );
}
