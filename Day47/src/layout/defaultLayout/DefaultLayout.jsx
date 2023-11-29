import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTasks } from "../../redux/middlewares/tasksMiddlewares";
import "./DefaultLayout.scss";
import Error from "../../pages/error/Error";
import Loading from "../../components/loading/Loading";
import BroadContent from "../../components/BroadContent/BroadContent";

export default function DefaultLayout({ prevIsLogin }) {
    const dispatch = useDispatch();
    const status = useSelector((state) => state.todo.status);

    useEffect(() => {
        if (prevIsLogin) {
            dispatch(getTasks());
        }
    }, [prevIsLogin]);
    if (status === "pending") {
        return <Loading />;
    } else if (status === "error") {
        return <Error />;
    }
    return (
        <main>
            <div className="todo">
                <BroadContent />
            </div>
            {status === "pendingDrag" && (
                <div className="alert">Đang đồng bộ với server...</div>
            )}
        </main>
    );
}
