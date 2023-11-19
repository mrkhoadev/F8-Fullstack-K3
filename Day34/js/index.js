import { postData, getData, deleteData, editData } from "./module/fetch.js";
import { handleSubmit, handleCancelClick } from "./module/event.js";
import { renderTaskHTML, RenderHtml } from "./module/dom.js";
const dataTanks = getData();

const popup = document.querySelector(".popup");
const popupWrap = popup.querySelector(".popup-wrap");

const todoWrap = document.querySelector(".todo-wrap");
const btnAddForm = todoWrap.querySelector("#todo-add");

const formAddHtml = `
    <form class="add-form">
        <div class="input-box">
            <input type="text" name="addInput" id="add-input" placeholder="Add Todos" for="search-btn">
        </div>
        <div class="button-box">
            <button type="submit" class="save-btn">Save</button>
            <button type="button" class="cancel-btn">Cancel</button>
        </div>
    </form>
`;

popup.addEventListener("click", function (e) {
    if (popup.classList.contains("active")) {
        popup.classList.remove("active");
        popupWrap.classList.remove("active");
    }
});

btnAddForm.addEventListener("click", async function () {
    popupWrap.innerHTML = formAddHtml;
    popup.classList.add("active");
    popupWrap.classList.add("active");

    handleCancelClick();
    handleSubmit(postData);
});

popupWrap.addEventListener("click", function (e) {
    e.stopPropagation();
});

renderTaskHTML(dataTanks);

const completedBtn = document.querySelector("#todo-completed__btn");
const todoTasks = document.querySelector(".todo-tasks");
completedBtn.addEventListener("click", async function (e) {
    const todoTasks = document.querySelector(".todo-tasks"); // Chọn thẻ cha
    const index = Array.from(todoTasks.children).indexOf(completedBtn); // Tìm vị trí của completedBtn

    // Kiểm tra nếu có class "active" trước khi thực hiện các thay đổi
    if (completedBtn.classList.contains("active")) {
        // Lấy danh sách các thẻ con sau completedBtn
        const elementsToRemove = Array.from(todoTasks.children).slice(
            index + 1
        );

        // Xóa các thẻ con sau completedBtn
        elementsToRemove.forEach((element) => {
            todoTasks.removeChild(element);
        });

        // Loại bỏ class "active" khỏi completedBtn
        completedBtn.classList.remove("active");
    } else {
        completedBtn.classList.add("active");

        // Tạo fragment để lưu trữ các thẻ con mới
        const fragment = document.createDocumentFragment();

        // Lấy dữ liệu từ API hoặc bất kỳ nguồn dữ liệu nào bạn có
        const data = await getData();

        // Lặp qua dữ liệu và thêm các thẻ con đã hoàn thành vào fragment
        data.forEach((task) => {
            if (task.status === 1) {
                const taskBox = RenderHtml(task.work);
                fragment.appendChild(taskBox);
            }
        });

        // Xóa tất cả các thẻ con hiện có sau completedBtn
        while (todoTasks.children.length > index + 1) {
            todoTasks.removeChild(todoTasks.children[index + 1]);
        }

        // Thêm các thẻ con mới từ fragment
        todoTasks.appendChild(fragment);
    }
});

