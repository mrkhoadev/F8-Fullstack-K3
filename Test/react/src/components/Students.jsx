import React, { useState, startTransition, useTransition } from "react";
import students from "./db.json";

export default function Students() {
    const [keyWork, setKeyWork] = useState("");
    const [pending, handleTranslate] = useTransition(); 
    const handleSearch = (e) => {
        startTransition(() => {
            setKeyWork(e.target.value);
        });
    };

    return (
        <div>
            <input
                type="search"
                placeholder="Từ Khóa"
                onChange={handleSearch}
            />
            <h2>Danh sách sinh viên</h2>
            {students.map(({ id, fullName }) => {
                const position = fullName
                    .toLowerCase()
                    .indexOf(keyWork.toLowerCase());
                if (keyWork.length && position !== -1) {
                    console.log(position);
                    return (
                        <h4 key={id}>
                            {fullName.slice(0, position)}
                            <span style={{ background: "yellow" }}>
                                {fullName.slice(
                                    position,
                                    position + keyWork.length
                                )}
                            </span>
                            {fullName.slice(position + keyWork.length)}
                        </h4>
                    );
                }
                return <h4 key={id}>{fullName}</h4>;
            })}
        </div>
    );
}
