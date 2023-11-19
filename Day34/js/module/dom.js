import { getData } from "./fetch.js";
import {
    handleTaskBoxBtn
} from "./event.js";

const formEditHtml = `
    <form class="edit-form">
        <div class="input-box">
            <input type="text" name="addInput" id="add-input" placeholder="Edit Todos" for="search-btn">
        </div>
        <div class="button-box">
            <button type="submit" class="save-btn">Save</button>
            <button type="button" class="cancel-btn">Cancel</button>
        </div>
    </form>
`;
let TaskListId = []
const renderTaskHTML = async (data) => {
    
    let count = 0
    const getTasks = await data;
    const todoTask = document.querySelector(".todo-tasks");
    const fragment = document.createDocumentFragment();
    if (getTasks.length > 0) {
        getTasks.forEach((taskData, index) => {
            if (taskData.status === 1) {
                ++count;
                return 0;
            }

            const taskBox = RenderHtml(taskData.work);
            TaskListId.push(taskData.id);
            fragment.appendChild(taskBox);
        });

        const completedBtn = document.querySelector("#todo-completed__btn");
        todoTask.insertBefore(fragment, completedBtn);
        const span = completedBtn.querySelector("span");
        // Tạo một TextNode chứa giá trị của count
        const countTextNode = document.createTextNode(`Completed Todos ${count}`);

        // Xóa nội dung hiện tại của span (nếu có)
        while (span.firstChild) {
            span.removeChild(span.firstChild);
        }

        // Thêm TextNode mới vào span
        span.appendChild(countTextNode);

        handleTaskBoxBtn(TaskListId);
    }
};
const RenderHtml = (text) => {
    const taskBox = document.createElement("div");
    taskBox.classList.add("task-box");

    const textTask = document.createElement("span");
    textTask.classList.add("text-task");
    textTask.textContent = text;

    const html = `
        <div class="task-btn" >
            <button type="button" class="btn-delete"><i class='bx bx-trash'></i></button>
            <button type="button" class="btn-edit"><i class='bx bxs-edit'></i></button>
            <button type="button" class="btn-checkbox"><i class='bx bxs-calendar-check'></i></button>
        </div>
    `;
    taskBox.appendChild(textTask);
    taskBox.insertAdjacentHTML("beforeend", html);
    return taskBox;
};

export { renderTaskHTML, formEditHtml, RenderHtml, TaskListId };










// const renderTaskHTML = async (data) => {
//     let TaskListId = [];
//     let count = 0;
//     const todoTask = document.createElement("div");
//     todoTask.classList.add("todo-tasks");
//     const getTasks = await data;
//     console.log(getTasks);
//     if (getTasks.length > 0) {
//         getTasks.forEach((taskData, index) => {
//             if (taskData.status === 1) {
//                 ++count;
//                 return 0;
//             }
//             const taskBox = document.createElement("div");
//             taskBox.classList.add("task-box");

//             const textTask = document.createElement("span");
//             textTask.classList.add("text-task");
//             textTask.textContent = taskData.work;

//             const taskBtn = document.createElement("div");
//             taskBtn.classList.add("task-btn");

//             const deleteBtn = document.createElement("button");
//             deleteBtn.type = "button";
//             deleteBtn.classList.add("btn-delete");
//             deleteBtn.innerHTML = "<i class='bx bx-trash'></i>";

//             const editBtn = document.createElement("button");
//             editBtn.type = "button";
//             editBtn.classList.add("btn-edit");
//             editBtn.innerHTML = "<i class='bx bxs-edit'></i>";

//             const checkboxBtn = document.createElement("button");
//             checkboxBtn.type = "button";
//             checkboxBtn.classList.add(`btn-checkbox`);
//             checkboxBtn.innerHTML = "<i class='bx bxs-calendar-check'></i>";

//             taskBtn.appendChild(deleteBtn);
//             taskBtn.appendChild(editBtn);
//             taskBtn.appendChild(checkboxBtn);

//             taskBox.appendChild(textTask);
//             taskBox.appendChild(taskBtn);

//             todoTask.appendChild(taskBox);

//             TaskListId.push(taskData.id);
//         });
//         const completedBtn = document.createElement("button");
//         completedBtn.type = "button";
//         completedBtn.classList.add("todo-completed__btn");

//         const text = document.createTextNode("Completed Todos 0");
//         completedBtn.appendChild(text);

//         const icon = document.createElement("i");
//         icon.className = "bx bx-right-arrow-circle";
//         completedBtn.appendChild(icon);

//         console.log(count);
//         todoTask.appendChild(completedBtn);
//         todo.appendChild(todoTask);

//         handleDeleteTask(TaskListId);
//         handleEditTask(TaskListId);
//         handleCheckboxTask(TaskListId);
//     }
// };