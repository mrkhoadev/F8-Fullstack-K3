import React, { useRef } from "react";
import Image from "./image";

export default function Control() {
    const imageRef = useRef();
    const handleZoomIn = () => {
        imageRef.current.style.scale = '1.5';
    }
    return (
        <div>
            <Image ref={imageRef} />
            <button onClick={handleZoomIn}>ZoomIn</button>
            <button>ZoomOut</button>
        </div>
    );
}
