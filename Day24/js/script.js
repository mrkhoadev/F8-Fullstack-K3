var formBox = document.querySelector(".form-box");
var form = document.querySelector(".form");
var btnInput = form.querySelector(".btn-input");
var input = form.querySelector(".input");

function innerContent(addContent, inputValue) {
    var text = document.createElement("p");
    text.className = "text";
    text.innerText = inputValue;
    text.style.userSelect = "none";

    var btnContent = document.createElement("div");
    btnContent.className = "btn-content";

    var edit = document.createElement("span");
    edit.innerHTML = "<i class='bx bx-edit'></i>";
    edit.className = "edit";

    var remove = document.createElement("span");
    remove.innerHTML = "<i class='bx bxs-trash-alt'></i>";
    remove.className = "remove";
    remove.style.paddingLeft = "5px";

    addContent.innerHTML = "";
    addContent.appendChild(text);
    addContent.appendChild(btnContent);
    btnContent.appendChild(edit);
    btnContent.appendChild(remove);

    textContent(text);
    editContent(addContent, edit, inputValue);
    deleteContent(addContent, remove);
    input.value = "";
}

function textContent(text) {
    text.addEventListener("click", function () {
        if (this.style.textDecoration === "") {
            this.style.textDecoration = "line-through";
            this.style.color = "#c5aeff";
        } else {
            this.style.textDecoration = "";
            this.style.color = "inherit";
        }
    });
}
function editContent(addContent, edit, inputValue) {
    edit.addEventListener("click", function () {
        var addForm = document.createElement("form");
        addForm.action = form.action;
        addForm.method = form.method;
        addForm.className = form.className;

        var input = document.createElement("input");
        input.type = "text";
        input.className = "input";
        input.value = inputValue;
        input.placeholder = "Update task";

        var btnInput = document.createElement("button");
        btnInput.type = "button";
        btnInput.className = "btn-input";
        btnInput.innerText = "Add Task";

        addForm.appendChild(input);
        addForm.appendChild(btnInput);
        addContent.parentNode.replaceChild(addForm, addContent);

        var newInput = addForm.querySelector(".input");
        newInput.focus();
        newInput.addEventListener("keydown", function (e) {
            var inputValue = newInput.value.trim();
            if (e.key === "Enter") {
                handleInputKeyDown(e);
                addForm.parentNode.replaceChild(addContent, addForm);
                innerContent(addContent, inputValue);
            }
        });
        btnInput.addEventListener("click", function (e) {
            var inputValue = newInput.value.trim();
            addForm.parentNode.replaceChild(addContent, addForm);
            innerContent(addContent, inputValue);
        });
    });
}
function deleteContent(addContent, remove) {
    remove.addEventListener("click", function () {
        addContent.remove();
    });
}

function handleDrag(e) {
    var inputValue = input.value.trim();
    if (inputValue === "") {
        return;
    }
    var addContent = document.createElement("div");
    addContent.classList.add("box");
    var boxStyle = {
        alignItems: "center",
        borderRadius: "5px",
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "1rem",
        padding: "0.75rem 1rem",
        background: "#8758ff",
        color: "#fff",
        cursor: "pointer",
    };

    Object.assign(addContent.style, boxStyle);
    formBox.appendChild(addContent);
    innerContent(addContent, inputValue);
}

function handleInputKeyDown(e) {
    e.preventDefault();
    e.target.focus();
    handleDrag(e);
}

btnInput.addEventListener("click", function (e) {
    handleDrag(e);
});
input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        handleInputKeyDown(e);
    }
});
