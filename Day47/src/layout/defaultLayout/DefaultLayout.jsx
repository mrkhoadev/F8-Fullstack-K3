import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTasks } from "../../redux/middlewares/tasksMiddlewares";
import "./DefaultLayout.scss";
import Columns from "../../components/columns/Columns";
import Error from '../../pages/error/Error'
import Loading from '../../components/loading/Loading';

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
                <div className="todo-wrap">
                    <Columns />
                </div>
            </div>
        </main>
    );
}
