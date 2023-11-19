import {
    postData,
    getData,
    deleteData,
    editData,
    statusData,
} from "./fetch.js";
import { renderTaskHTML, formEditHtml, RenderHtml, TaskListId } from "./dom.js";

const popup = document.querySelector(".popup");
const popupWrap = popup.querySelector(".popup-wrap");

const eventClick = new Event("click");

let hasClicked = false;

const handleAddData = async () => {
    const newData = await getData();
    const todoTasks = document.querySelector(".todo-tasks");
    const completedBtn = document.querySelector("#todo-completed__btn");
    const taskBox = RenderHtml(newData[newData.length - 1].work);
    todoTasks.insertBefore(taskBox, completedBtn);
    TaskListId.push(newData[newData.length - 1].id);
};

const handleCancelClick = async () => {
    const cancelBtn = popupWrap.querySelector(".cancel-btn");
    cancelBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        popup.dispatchEvent(eventClick);
    });
};

const handleUploadData = async (id, index) => {
    const newData = await getData();
    const indexText = newData.find((item) => item.id === id);
    const taskBox = document.querySelectorAll(".task-box");
    taskBox[index].children[0].textContent = indexText.work;
};

const handleSubmit = async (data, id, index) => {
    const formAdd = popupWrap.querySelector("form");
    const inputText = formAdd.querySelector("input");

    formAdd.addEventListener("submit", async function (e) {
        e.preventDefault();
        const value = inputText.value.trim();
        if (value !== "") {
            popup.dispatchEvent(eventClick);
            if (id === undefined) {
                await data(value);
                await handleAddData();
                hasClicked = false;
                handleTaskBoxBtn();
            } else {
                try {
                    await alertify.confirm(
                        "Bạn có chắc chắn muốn sửa?",
                        async function () {
                            await data(value, id);
                            await handleUploadData(id, index);
                        },
                        async function () {
                            alertify.error("Đã hủy!");
                        }
                    );
                } catch (error) {
                    console.error("Lỗi: ", error);
                }
            }
        } else {
            alertify.error("Không được bỏ trống value!");
        }
    });
};

const handleTaskBoxBtn = () => {
    if (!hasClicked) {
        const todoTasks = document.querySelector(".todo-tasks");
        const taskBox = todoTasks.querySelectorAll(".task-box");
        taskBox.forEach((element, index) => {
            element.addEventListener("click", async (e) => {
                const icon = e.target;
                const button = e.target.parentNode;
                const indexId = TaskListId[index];
                const data = await getData();
                if (
                    icon.classList.contains("btn-delete") ||
                    button.classList.contains("btn-delete")
                ) {
                    alertify.confirm(
                        "Bạn có chắc chắn muốn xóa?",
                        async function () {
                            const indexToDelete = data.find(
                                (item) => item.id === indexId
                            );
                            handleDeleteClick(
                                TaskListId,
                                indexId,
                                todoTasks,
                                element,
                                indexToDelete.id
                            );
                            hasClicked = false;
                        },
                        async function () {
                            alertify.error("Đã hủy!");
                        }
                    );
                } else if (
                    icon.classList.contains("btn-edit") ||
                    button.classList.contains("btn-edit")
                ) {
                    handleEditClick(data, indexId, index);
                } else if (
                    icon.classList.contains("btn-checkbox") ||
                    button.classList.contains("btn-checkbox")
                ) {
                    const itemToEdit = data.find((item) => item.id === indexId);
                    if (itemToEdit.status === 1) {
                        await statusData(0, itemToEdit.id);
                    } else {
                        await statusData(1, itemToEdit.id);
                    }
                    todoTasks.removeChild(element);
                    const newData = await getData();
                    const count = newData.reduce(
                        (accumulator, currentValue) => {
                            if (currentValue.status === 1) {
                                return accumulator + 1;
                            }
                            return accumulator;
                        },
                        0
                    );
                    console.log(count);
                    const completedBtn = document.querySelector(
                        "#todo-completed__btn"
                    );
                    const span = completedBtn.querySelector("span");
                    // Tạo một TextNode chứa giá trị của count
                    const countTextNode = document.createTextNode(
                        `Completed Todos ${count}`
                    );
                    span.removeChild(span.firstChild);
                    span.appendChild(countTextNode);
                }
            });
        });
        hasClicked = true;
    }
};
const handleDeleteClick = async (
    TaskListId,
    indexId,
    todoTasks,
    element,
    id
) => {
    const deleteElement = await deleteData(id);

    if (deleteElement) {
        const indexElement = TaskListId.indexOf(indexId);
        TaskListId.splice(indexElement, 1);
        todoTasks.removeChild(element);
    }
};
const handleEditClick = async (data, indexId, indexElement) => {
    const itemToEdit = data.find((item) => item.id === indexId);
    if (itemToEdit) {
        popupWrap.innerHTML = `
            <form class="edit-form">
                <div class="input-box">
                    <input type="text" name="addInput" id="add-input" placeholder="Edit Todos" value="${itemToEdit.work}">
                </div>
                <div class="button-box">
                    <button type="submit" class="save-btn">Save</button>
                    <button type="button" class="cancel-btn">Cancel</button>
                </div>
            </form>
        `;

        popup.classList.add("active");
        popupWrap.classList.add("active");
        await handleSubmit(editData, itemToEdit.id, indexElement);
        handleCancelClick();
    }
};

const handleCheckboxData = (TaskListId) => {};

export { handleCancelClick, handleTaskBoxBtn, handleSubmit, handleAddData };
