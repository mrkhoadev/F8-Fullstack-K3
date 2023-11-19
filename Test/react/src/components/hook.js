import { useContext } from "react";
import { providerContext } from "./provider";
export const useSelector = () => {
    const { state } = useContext(providerContext);
    return state;
}
export const useDispatch = () => {
    const { dispatch } = useContext(providerContext);
    return dispatch;
}