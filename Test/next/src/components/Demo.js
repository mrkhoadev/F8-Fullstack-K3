"use client";
import React, { useState } from "react";

export default function Demo({ children }) {
    const [show, setShow] = useState(true);

    return (
        <div>
            <button onClick={() => setShow(!show)}>asdf</button>{" "}
            {show && children}{" "}
        </div>
    );
}
