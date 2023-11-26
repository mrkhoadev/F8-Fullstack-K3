import React from "react";


export default function Auth({ children }) {
    return (
        <div className="auth-page">
            <h1>Authentication</h1>
            {children}
        </div>
    );
}
