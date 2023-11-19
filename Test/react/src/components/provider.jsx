import { createContext } from "react";
export const providerContext = createContext();
import { initialState, rootReducer } from "./rootReducer";
export const Provider = ({ children }) => {
    const [state, dispatch] = rootReducer(rootReducer, initialState)
    return (
        <providerContext.Provider
            value={{
                state,
            }}
        >
            {children}
        </providerContext.Provider>
    );
};
