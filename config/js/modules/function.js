const handleFileFunction = function () {
    var menu = document.getElementById("main");

    const sectionContent = document.querySelector("#section .content");
    const contentElement = sectionContent.children;

    let i = 0

    var menuList = document.getElementById("menuList");
    let textListHTML = ''
    Array.from(contentElement).forEach((element, index) => {
        ++i
        var menuItem = document.createElement("li");
        
        if (i === 13) {
            textListHTML = "Projects (scss)";
            i = i + 1;
        } else {
            if (i < 10) {
                textListHTML = "Bài về nhà buổi 0" + i;
            } else {
                textListHTML = "Bài về nhà buổi " + i;
            }
        } 
        if (i === 14) {
            i = i + 1;
        }
        if (i === 37) {
            i = i + 2;
        }
        if (i === 41) {
            i = i + 1;
        }
        if (i === 51) {//test
            textListHTML = "Projects (Nextjs)";
            i = i + 1;
        }
        menuItem.innerHTML = `<label class="label-${i}" for="Day-${i}" tabindex="${i}">
                <span class="icon">
                    <i class="bx bxs-send" ></i>
                </span>
                ${textListHTML}
            </label>`;
        menuList.append(menuItem);
    })

    var content = document.querySelectorAll(".content div");
    var menuItem = menuList.querySelectorAll("li label");

    let previousIndex = 0;
    var handleUpdateDots = function (callback) {
        menuItem[previousIndex].classList.remove("active-label");
        content[previousIndex].classList.remove("active-content");
        callback();
        menuItem[previousIndex].classList.add("active-label");
        content[previousIndex].classList.add("active-content");
    };
    menuItem.forEach((element, index) => {
        let contentItem = content[index];
        if (index === menuItem.length - 1) {
            element.classList.add("active-label");
            contentItem.classList.add("active-content");
        }
        element.addEventListener("click", function (e) {
            menuItem[menuItem.length - 1].classList.remove("active-label");
            content[menuItem.length - 1].classList.remove("active-content");
            handleUpdateDots(function () {
                return (previousIndex = index);
            });
        });
    });
}

export { handleFileFunction };