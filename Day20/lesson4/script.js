const container = document.getElementById("container");
container.style.width = "1000px";
container.style.margin = "20px auto";

const itemsData = [
    {
        flexDirection: "row",
        borderBottom: true,
        title: "Tiêu đề bài viết 1",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    {
        flexDirection: "row-reverse",
        borderBottom: true,
        title: "Tiêu đề bài viết 2",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    {
        flexDirection: "row",
        borderBottom: false,
        title: "Tiêu đề bài viết 3",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
];

const items = itemsData.map((data) => {
    const item = document.createElement("div");
    const wrapImg = document.createElement("div");
    const image = document.createElement("img");
    const content = document.createElement("div");
    const title = document.createElement("h2");
    const text = document.createElement("p");

    item.style.display = "flex";
    item.style.columnGap = "20px";
    item.style.alignItems = "center";
    item.style.flexDirection = data.flexDirection;
    if (data.borderBottom) {
        item.style.borderBottom = "2px solid #ddd";
    }

    wrapImg.appendChild(image);
    image.src = "./img.png";

    content.classList.add("content");
    content.appendChild(title);
    title.innerText = data.title;
    content.appendChild(text);
    text.innerText = data.text;

    item.appendChild(wrapImg);
    item.appendChild(content);

    return item;
});

container.append(...items);
