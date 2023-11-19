const limitPosition = 7;
import getRandomNumber from "../helpers/random";
export const initialState = {
    theme: !localStorage.getItem("theme")
        ? "light"
        : localStorage.getItem("theme"),
    rangeNumber: localStorage.getItem("RANGE_NUMBER")
        ? localStorage.getItem("RANGE_NUMBER")
        : 0,
    maxTime: 7,
    randomNumber: 0,
    data: localStorage.getItem("data")
        ? JSON.parse(localStorage.getItem("data"))
        : [],
    blood: 0,
};
export const rootReducer = (state, action) => {
    switch (action.type) {
        case "theme": {
            if (state.theme === "dark") {
                localStorage.setItem("theme", "light");
                return { ...state, theme: "light" };
            }
            localStorage.setItem("theme", "dark");
            return { ...state, theme: "dark" };
        }
        case "changeRangeNumber": {
            localStorage.setItem("RANGE_NUMBER", action.rangeNumber);
            let MAX_TIME = action.rangeNumber;
            let random;
            if (MAX_TIME) {
                MAX_TIME = Math.ceil(Math.log2(MAX_TIME));
                random = getRandomNumber(action.rangeNumber);
            }
            return {
                ...state,
                rangeNumber: action.rangeNumber,
                maxTime: MAX_TIME,
                randomNumber: random,
                blood: MAX_TIME,
            };
        }
        case "addData": {
            const newData = action.data;
            const currentState = state.data || [];
            const newState = [newData, ...currentState];
            localStorage.setItem("data", JSON.stringify(newState));
            return {
                ...state,
                data: newState,
                randomNumber: getRandomNumber(action.rangeNumber),
            };
        }
        case "exceptBlood": {
            return { ...state, blood: state.blood - 1 };
        }
        case "setBlood": {
            return { ...state, blood: action.maxTime };
        }
        case "clearData": {
            localStorage.removeItem("data");
            return { ...state, data: [] };
        }
        default: {
            return state;
        }
    }
};
