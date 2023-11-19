import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "../core/hooks";
import getRandomNumber from "../helpers/random";
import alertify from "alertifyjs";
let text = "";
export default function Content() {
    const { rangeNumber, randomNumber, data, maxTime } = useSelector();
    const dispatch = useDispatch();
    const [isInput, setIsInput] = useState(false);
    const valueRef = useRef('');
    const inputRef = useRef(null);
    const resetBtnRef = useRef(null);
    const tableElRef = useRef(null);
    const randomArr = useRef([]);
    const handleRandomClick = () => {
        const value = getRandomNumber(rangeNumber);
        inputRef.current.value = value;
        valueRef.current = value;
    };
    const handleResetClick = () => {
        setIsInput(false);
        dispatch({
            type: "setBlood",
            maxTime,
        });
    };
    const handleChangeInput = (e) => {
        const inputValue = e.target.value;
        let maxNumberLen = rangeNumber.toString().split("").length;
        const numericValue = inputValue.replace(/[^0-9]/g, "");
        if (numericValue.length > maxNumberLen) {
            e.target.value = numericValue.slice(0, maxNumberLen);
        } else {
            e.target.value = numericValue;
        }
        valueRef.current = e.target.value;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const currentValue = valueRef.current
            ? +valueRef.current
            : valueRef.current;
        if (typeof currentValue === "number" && currentValue <= rangeNumber) {
            const test = randomArr.current.find(
                ({ number }) => currentValue === number
            );
            if (test) {
                return alertify.warning("Bạn đã nhập số này!");
            }

            const newNumber = { number: currentValue };
            if (randomArr.current.length === 0) {
                newNumber.maxTime = maxTime;
            }
            if (currentValue === randomNumber) {
                newNumber.right = true;
            }
            randomArr.current.push(newNumber);
            inputRef.current.placeholder = currentValue;

            if (currentValue === randomNumber) {
                alertify.success("Chúc mừng bạn đã trúng 1 tỷ gói mè!");
                dispatch({
                    type: "addData",
                    data: randomArr.current,
                    rangeNumber,
                });
                valueRef.current = "";
                randomArr.current = [];
                setIsInput(true);
            } else if (randomArr.current.length === maxTime) {
                alertify.warning(
                    `Aiz! ${text} một chút là bạn được 1 tỷ gói mè rồi! :v`
                );
                dispatch({
                    type: "addData",
                    data: randomArr.current,
                    rangeNumber,
                });
                dispatch({
                    type: "exceptBlood",
                });
                randomArr.current = [];
                valueRef.current = "";
                setIsInput(true);
            } else {
                if (currentValue > randomNumber) {
                    text = "giảm xuống";
                }
                if (currentValue < randomNumber) {
                    text = "tăng lên";
                }
                dispatch({
                    type: "exceptBlood",
                });
                alertify.message(`Aiz chết tịt, bạn phải ${text} 1 chút`);
            }
        } else if (currentValue > rangeNumber) {
            alertify.warning("Số bạn nhập vượt quá giới hạn!");
        } else {
            alertify.warning("Bạn hãy nhập số để bắt đầu chơi!");
        }
    };
    const handleKeyupClick = (e) => {
        if (e.key === "Enter") {
            if (inputRef.current) {
                inputRef.current.focus();
            } else if (resetBtnRef.current) {
                resetBtnRef.current.focus();
            }
        } else if (e.key === "ArrowUp") {
            if (inputRef.current) {
                inputRef.current.focus();
                valueRef.current =
                    valueRef.current < rangeNumber
                        ? +valueRef.current + 1
                        : valueRef.current;
                inputRef.current.value = valueRef.current;
            }
        } else if (e.key === "ArrowDown") {
            if (inputRef.current) {
                inputRef.current.focus();
                valueRef.current =
                    valueRef.current > 0
                        ? +valueRef.current - 1
                        : valueRef.current;
                inputRef.current.value = valueRef.current;
            }
        } else if (e.key === "ArrowLeft") {
            if (tableElRef.current) {
                tableElRef.current.focus();
            }
        } else if (e.key === "ArrowRight") {
            if (tableElRef.current) {
                tableElRef.current.focus();
            }
        }
    };
    const handleDeleteData = (e) => {
        alertify.confirm(
            "Bạn có chắc chắn muốn xóa lịch sử không?",
            function () {
                dispatch({
                    type: "clearData",
                });
                alertify.success("Đã xóa thành công!");
            },
            function () {
                alertify.error("Cancel");
            }
        );
    };
    useEffect(() => {
        randomArr.current = [];
    }, [maxTime]);
    useEffect(() => {
        document.addEventListener("keydown", handleKeyupClick);
        return () => {
            document.removeEventListener("keydown", handleKeyupClick);
        };
    }, [rangeNumber]);
    return (
        <div className="game-content">
            <form className="game-content__form" onSubmit={handleSubmit}>
                {!isInput ? (
                    <>
                        <div className="input-box">
                            <label htmlFor="game-input">
                                Hãy nhập một số mà bạn muốn
                            </label>
                            <input
                                type="text"
                                id="game-input"
                                name="gameInput"
                                placeholder="Nhập số của bạn!"
                                onChange={handleChangeInput}
                                ref={inputRef}
                                autoCorrect="off"
                                autoComplete="off"
                            />
                        </div>
                        <button
                            type="button"
                            className="random-btn"
                            onClick={handleRandomClick}
                        >
                            Random
                        </button>{" "}
                    </>
                ) : (
                    <button
                        type="button"
                        className="reset-btn"
                        onClick={handleResetClick}
                        ref={resetBtnRef}
                    >
                        Chơi lại
                    </button>
                )}
            </form>
            {data.length > 0 && (
                <button className="delete-btn" onClick={handleDeleteData}>
                    <i className="bx bx-trash"></i>
                </button>
            )}
            <div className="game-content__table" ref={tableElRef} tabIndex="0">
                {data.length > 0 ? (
                    <>
                        {data.map((item, index) => {
                            return (
                                <table key={index}>
                                    <thead>
                                        <tr>
                                            <th>Số lần nhập</th>
                                            <th>Số bạn đã nhập</th>
                                        </tr>
                                    </thead>
                                    <tbody className="tbody">
                                        {item.map((el, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>
                                                        <p>{i + 1}</p>
                                                    </td>
                                                    <td>
                                                        <p>{el.number}</p>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan="2">
                                                Lần chơi thứ {item.length}/
                                                {item[0].maxTime}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2">
                                                Số lần nhập tối đa:{" "}
                                                {item.length}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2">
                                                Tỷ lệ trúng:{" "}
                                                {"right" in
                                                item[item.length - 1]
                                                    ? (((item[0].maxTime -
                                                          item.length + 1) /
                                                          item[0].maxTime) *
                                                      100).toFixed(1)
                                                    : 0}
                                                %
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            );
                        })}
                    </>
                ) : (
                    ""
                )}
            </div>
        </div>
    );
}
