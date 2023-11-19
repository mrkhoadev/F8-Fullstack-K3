const listData = [
    {
        module: [
            {
                title: "Nhập môn lập trình web",
                lessons: [
                    { title: "Giới thiệu khóa học" },
                    { title: "Nhập môn lập trình web - Phần 1" },
                    { title: "Nhập môn lập trình web - Phần 2" },
                    { title: "Công cụ - Phần mềm cần chuẩn bị" },
                ],
            },
        ],
    },
    {
        module: [
            {
                title: "Ngôn ngữ HTML",
                lessons: [
                    { title: "HTML cơ bản - Phần 1" },
                    { title: "HTML cơ bản - Phần 2" },
                ],
            },
        ],
    },
    {
        module: [
            {
                title: "Ngôn ngữ CSS",
                lessons: [
                    { title: "Giới thiệu ngôn ngữ CSS - Cách viết CSS" },
                    {
                        title: "Cấu trúc CSS - Bộ chọn (Selector) trong CSS - Phần 1",
                    },
                    {
                        title: "Bộ chọn CSS (Tiếp theo) - Các thuộc tính định dạng văn bản",
                    },
                    { title: "Chồng chéo Css và thứ tự ưu tiên trong CSS" },
                ],
            },
        ],
    },
];

const list = document.querySelector(".list");
let lessonCount = 0;
let elementTarget
listData.forEach((modules, index) => {
    const listModule = document.createElement("div");
    listModule.textContent = `Module ${index + 1} : ${modules.module[0].title}`;
    listModule.classList.add("active");
    listModule.classList.add("list-item");
    listModule.draggable = true;

    list.append(listModule);

    let lessonData = modules.module[0].lessons;
    lessonData.forEach((lesson) => {
        const listItem = document.createElement("div");
        listItem.classList.add("list-item");
        listItem.textContent = `Bài ${++lessonCount} : ${lesson.title}`;
        listItem.draggable = true;
        list.append(listItem);
    });
});


const listElement = document.querySelectorAll(".list-item");
listElement.forEach((element) => {
    element.addEventListener("dragstart", function () {
        this.classList.add("ghost");
        elementTarget = this
    });

    element.addEventListener("dragover", function (e) {
        e.preventDefault();
        const ghost = document.querySelector(".list-item.ghost");
        const notGhost = document.querySelectorAll(".list-item:not(.ghost)");
        const elementChange = Array.from(notGhost).find(function (item) {
            const middleY = item.getBoundingClientRect();
            return e.pageY <= middleY.top + middleY.height / 2;
        });
        list.insertBefore(ghost, elementChange);
    });

    element.addEventListener("dragend", function (e) {
        e.preventDefault();
        elementTarget.classList.remove("ghost");
        updateOrder()
        clearInterval(elementTarget);
    });
});

var updateOrder = function () {
    const listItem = list.querySelectorAll(".list-item");
    let moduleCount = 0;
    lessonCount = 0;
    listItem.forEach((text) => {
        const currentText = text.textContent;
        if (text.classList.contains("active")) {
            const startText = currentText.indexOf(":") - 1;
            const endText = currentText.length;
            let extractedSubstring = currentText.substring(startText, 0);
            let data = currentText.substring(startText, endText);
            extractedSubstring = `Module ${++moduleCount}`;
            text.textContent = extractedSubstring + data;
        } else {
            const startText = currentText.indexOf(":") - 1;
            const endText = currentText.length;
            let extractedSubstring = currentText.substring(startText, 0);
            let data = currentText.substring(startText, endText);
            extractedSubstring = `Bài ${++lessonCount}`;
            text.textContent = extractedSubstring + data;
        }
    });
};