import React, {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    memo,
} from "react";
import { useDispatch, useSelector } from "../core/hooks";
import alertify from "alertifyjs";

const Header = memo(() => {
    const { theme, rangeNumber, maxTime, blood } = useSelector();
    const [isDrag, setIsDrag] = useState(false);

    const maxNumber = 2048;
    const dispatch = useDispatch();
    const progressBarRef = useRef(null);
    const progressRef = useRef(null);
    const progressSpanRef = useRef(null);
    const bloodElRef = useRef(null)
    const initialClientX = useRef(0);
    const initialOffsetX = useRef(0);
    const current = useRef(0);
    const currentWidth = useRef();
    const gameNumber = useRef(0);
    const valuePopupRef = useRef(null)
    const valueElRef = useRef([
        { element: null, number: 100 },
        { element: null, number: 512 },
        { element: null, number: 1024 },
        { element: null, number: 1536 },
        { element: null, number: 2048 },
    ]);

    const handleChangeTheme = () => {
        dispatch({
            type: "theme",
        });
    };

    const handleChangeValue = (width) => {
        currentWidth.current = width;
        var value = (width * 100) / progressBarRef.current.clientWidth;
        value = Math.max(0, Math.min(value, 100));
        progressRef.current.style.width = `${value}%`;
        valuePopupRef.current.style.left = `${value}%`;
        gameNumber.current = (value * maxNumber) / 100;
        dispatch({
            type: "changeRangeNumber",
            rangeNumber: Math.ceil(gameNumber.current),
        });
    };
    const handleRenderProgress = (number) => {
        const value = (number * 100) / maxNumber;
        const width = (value * progressBarRef.current.clientWidth) / 100;
        current.current = width;
        handleChangeValue(width);
    };
    //<============= ProgressBar ===============>
    const handleMouseDownProgress = (e) => {
        if (e.button === 0) {
            progressSpanRef.current.classList.add("active");
            handleChangeValue(e.nativeEvent.offsetX);
            setIsDrag(true);
            current.current = e.nativeEvent.offsetX;
            initialClientX.current = e.nativeEvent.clientX;
        }
    };

    const handleMouseMoveProgress = (e) => {
        if (isDrag) {
            const moveWidth = e.nativeEvent.clientX - initialClientX.current;
            handleChangeValue(current.current + moveWidth);
            initialOffsetX.current = e.nativeEvent.offsetX;
        }
    };

    //<============= ProgressSpan ===============>
    const handleMouseDownProgressSpan = (e) => {
        e.stopPropagation();
        if (e.button === 0) {
            let progressSpanWidth = progressSpanRef.current.clientWidth;
            setIsDrag(true);
            initialOffsetX.current =
                e.nativeEvent.offsetX <= progressSpanWidth / 2
                    ? progressSpanWidth / 2 - e.nativeEvent.offsetX
                    : e.nativeEvent.offsetX - progressSpanWidth / 2;

            if (e.nativeEvent.offsetX <= progressSpanWidth / 2) {
                initialClientX.current =
                    e.nativeEvent.clientX + initialOffsetX.current;
            } else {
                initialClientX.current =
                    e.nativeEvent.clientX - initialOffsetX.current;
            }
            const moveWidth = e.nativeEvent.clientX - initialClientX.current;
            handleChangeValue(current.current + moveWidth);
        }
    };

    const handleMouseMoveProgressSpan = (e) => {
        if (!isDrag) {
            e.stopPropagation();
        }
    };

    //<============= document ===============>
    const handleMouseMove = (e) => {
        if (isDrag) {
            const moveWidth = e.clientX - initialClientX.current;
            handleChangeValue(current.current + moveWidth);
        }
    };

    const handleMouseUp = (e) => {
        if (e.button === 0 && isDrag) {
            progressSpanRef.current.classList.remove("active");
            current.current = currentWidth.current;
            setIsDrag(false);
            // alertify.message("Chào mừng bạn đến với trò chơi!");
        }
    };
    useEffect(() => {
        if (isDrag) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        } else {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDrag]);
    //Kiểm tra localStorage và render lại trang theo localStorage
    useLayoutEffect(() => {
        
        const RANGE_NUMBER = localStorage.getItem("RANGE_NUMBER");
        if (RANGE_NUMBER) {
            handleRenderProgress(RANGE_NUMBER);
        }
        if (!localStorage.getItem("theme")) {
            localStorage.setItem("theme", "light");
        }
        valueElRef.current.forEach(({ element, number }) => {
            element.style.left = `${(number * 100) / maxNumber}%`;
            element.addEventListener("click", () => {
                handleRenderProgress(number);
                dispatch({
                    type: "changeRangeNumber",
                    rangeNumber: number,
                });
            });
        });
        return () => {
            alertify.message("Chào mừng bạn đến với trò chơi!");
            return () => {
                valueElRef.current.forEach(({ element, number }) => {
                    element.removeEventListener("click", () => {
                        handleRenderProgress(number);
                    });
                });
            };
        };
    }, []);
    return (
        <div className="game-header">
            <hr className="game-header__blood" ref={bloodElRef} style={{width: `${blood / maxTime * 100}%`}} />
            <button
                className={"theme-btn" + (theme === "light" ? "" : " active")}
                onClick={handleChangeTheme}
            >
                {theme === "light" ? (
                    <i className="bx bxs-moon"></i>
                ) : (
                    <i className="bx bxs-sun"></i>
                )}
            </button>
            <h2 className="green-colors-500">
                Chào mừng đến với trò chơi đoán số!
            </h2>
            <h2 className="green-colors-600">Còn { blood }/{maxTime} lần</h2>
            <h2 className="green-colors-700">
                Bạn cần tìm kiếm số từ 1 đến {rangeNumber}
            </h2>
            <div className="game-header__progressWrap">
                <div
                    className="game-header__progressBar"
                    onMouseDown={handleMouseDownProgress}
                    onMouseMove={handleMouseMoveProgress}
                    ref={progressBarRef}
                >
                    <div className="game-header__progress" ref={progressRef}>
                        <span
                            onMouseDown={handleMouseDownProgressSpan}
                            onMouseMove={handleMouseMoveProgressSpan}
                            ref={progressSpanRef}
                        ></span>
                    </div>
                    <span
                        className={isDrag ? "active" : ""}
                        ref={valuePopupRef}
                    >
                        {Math.ceil(gameNumber.current)}
                    </span>
                </div>

                {valueElRef.current.map(({ number }, index) => (
                    <div
                        className="game-header__value"
                        ref={(el) => (valueElRef.current[index].element = el)}
                        key={index}
                    >
                        {number}
                    </div>
                ))}
            </div>
        </div>
    );
});

export default Header;
