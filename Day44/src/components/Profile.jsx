import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import emailjs from "emailjs-com";
import alertify from "alertifyjs";
const Profile = ({ handleSetLoading }) => {
    const { user, isLoading } = useAuth0();

    const handleSubmit = (e, name) => {
        e.preventDefault();
        handleSetLoading(false);
        const currentUrl = window.location.href;
        const options = {
            form_name: "Anh Khoa",
            to_email: e.target.email.value,
            reply: "mr.khoacoding@gmail.com",
            name: name,
            link: currentUrl,
            message: e.target.message.value,
        };
        const serviceId = import.meta.env.SERVICE_ID;
        const templateId = "template_uevja1s";
        const userId = "36YVM9HzQD8FDBkBz";
        emailjs
            .send(serviceId, templateId, options, userId)
            .then(() => {
                alertify.success("Gửi email thành công!");
            })
            .catch(() => {
                alertify.error("Gửi email thất bại! Hãy thử lại!");
            })
            .finally(() => {
                handleSetLoading(true);
            });
    };
    if (isLoading) {
        return <div>Loading ...</div>;
    }
    return (
        <div className="profile">
            <div className="images">
                <img src={user.picture} alt={user.name} />
            </div>
            <h6>
                Xin chào <b>{user.name}</b>!
            </h6>
            <p>Vị trí: {user.locale === "vi" ? "Tiếng Việt" : user.locale}</p>
            <p>
                Email: <a href={"mailto:" + user.email}>{user.email}</a>
            </p>
            <form onSubmit={(e) => handleSubmit(e, user.name)}>
                <div className="input-box">
                    <input
                        type="text"
                        id="email"
                        name="email"
                        required
                        defaultValue={user.email}
                        placeholder=" "
                    />
                    <label htmlFor="email">Email của bạn *</label>
                </div>
                <div className="input-box">
                    <textarea
                        placeholder=" "
                        type="text"
                        id="message"
                        name="message"
                        required
                        defaultValue="Tôi cần trợ giúp bài tập về nhà!"
                    ></textarea>
                    <label htmlFor="message">Tin nhắn *</label>
                </div>
                <button>Yêu cầu hỗ trợ</button>
            </form>
        </div>
    );
};

export default Profile;
