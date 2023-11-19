import { useDispatch, useSelector } from "react-redux";
import { todoSlice } from "../redux/slice/todoSlice";
const { addTodo } = todoSlice.actions;

const Todo = () => {
    const dispatch = useDispatch();
    const todo = useSelector((state) => state.todo.todoList);
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addTodo(e.target.todo.value));
    };
    return (
        <div>
            <ul>
                {todo.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
            <form onSubmit={handleSubmit}>
                <input name="todo" type="text" placeholder="Name..." />
            </form>
        </div>
    );
};
export default Todo;
