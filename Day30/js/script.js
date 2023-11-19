var controls = document.querySelector(".controls");

var dropDown = controls.querySelector(".dropdown");

var dropDownBtn = dropDown.querySelector(".btn");
var newDropDownBtn = dropDown.querySelector("#new-btn");
var textDropDownBtn = dropDown.querySelector("#txt-btn");
var pdfDropDownBtn = dropDown.querySelector("#pdf-btn");

var menuDropDown = dropDown.querySelector(".dropdown-menu");
var inputDropDown = dropDown.querySelector("input");

var boldControlBtn = controls.querySelector("#bold-btn");
var underlineControlBtn = controls.querySelector("#underline-btn");
var italicControlBtn = controls.querySelector("#italic-btn");
var inputControlBtn = controls.querySelector("#color-btn");

var content = document.querySelector("#content");

var charCount = document.querySelector("#char-count");
var wordCount = document.querySelector("#word-count");

var removeClass = new Event("click");

//fix lỗi không thể thực hiện các sự kiện khi lần đầu vào trang
window.addEventListener("load", function () {
    content.focus();
});

var handleClassRemove = function () {
    dropDownBtn.classList.remove("active");
    menuDropDown.classList.remove("active");
};

dropDownBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    this.classList.toggle("active");
    menuDropDown.classList.toggle("active");
});
menuDropDown.addEventListener("click", function (e) {
    e.stopPropagation();
});

newDropDownBtn.addEventListener("click", function () {
    content.innerHTML = "";
    inputDropDown.value = "untitled";
    document.dispatchEvent(removeClass);
});
function containsForbiddenCharacters(filename) {
    // Sử dụng biểu thức chính quy để kiểm tra
    const forbiddenCharacters = /[/\\:*?"<>|]/;
    return forbiddenCharacters.test(filename);
}
textDropDownBtn.addEventListener("click", function () {
    if (containsForbiddenCharacters(inputDropDown.value)) {
        return alert("Tên tệp tin chứa ký tự không đúng!");
    }
    const textToSave = content.textContent;

    // Tạo một đối tượng Blob để lưu trữ nội dung
    const blob = new Blob([textToSave], { type: "text/plain" });

    // Tạo một đường dẫn URL từ Blob
    const url = window.URL.createObjectURL(blob);

    // Tạo một phần tử <a> để tạo và tải xuống tệp tin
    const a = document.createElement("a");
    a.href = url;
    a.download = `${inputDropDown.value}.txt`; // Tên tệp tin mặc định
    document.body.appendChild(a);
    a.click();

    // Giải phóng đường dẫn URL và loại bỏ phần tử <a>
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    document.dispatchEvent(removeClass);
});
pdfDropDownBtn.addEventListener("click", function () {
    if (containsForbiddenCharacters(inputDropDown.value)) {
        return alert("Tên tệp tin chứa ký tự không đúng!");
    }
    html2pdf().from(content).save();
    document.dispatchEvent(removeClass);
});

document.addEventListener("click", function () {
    if (
        dropDownBtn.classList.contains("active") ||
        menuDropDown.classList.contains("active")
    ) {
        dropDownBtn.classList.remove("active");
        menuDropDown.classList.remove("active");
    }
});

var handleChange = function (command) {
    document.execCommand(command, false, null);
    content.focus();
};

boldControlBtn.addEventListener("click", function (e) {
    handleChange("bold");
    this.classList.toggle("active");
});
underlineControlBtn.addEventListener("click", function () {
    handleChange("underline");
    this.classList.toggle("active");
});
italicControlBtn.addEventListener("click", function () {
    handleChange("italic");
    this.classList.toggle("active");
});
inputControlBtn.addEventListener("change", function () {
    document.execCommand("forecolor", false, this.value);
});
inputControlBtn.dispatchEvent(new Event("change"));

var handleCheckClassControl = function (e) {
    var targetElement = e.target;

    var selection = window.getSelection();

    if (selection.rangeCount > 0) {
        var range = selection.getRangeAt(0);

        var textRange = range.cloneRange();
        textRange.selectNodeContents(content);
        var uExists = Array.from(
            textRange.commonAncestorContainer.querySelectorAll("u")
        ).some(function (uElement) {
            return range.intersectsNode(uElement);
        });

        var bExists = Array.from(
            textRange.commonAncestorContainer.querySelectorAll("b")
        ).some(function (bElement) {
            return range.intersectsNode(bElement);
        });
        var iExists = Array.from(
            textRange.commonAncestorContainer.querySelectorAll("i")
        ).some(function (iElement) {
            return range.intersectsNode(iElement);
        });
        if (targetElement.textContent.trim() !== "") {
            if (targetElement === content) {
                boldControlBtn.classList.remove("active");
                underlineControlBtn.classList.remove("active");
                italicControlBtn.classList.remove("active");
            }

            if (bExists) {
                boldControlBtn.classList.add("active");
            } else {
                boldControlBtn.classList.remove("active");
            }
            if (uExists) {
                underlineControlBtn.classList.add("active");
            } else {
                underlineControlBtn.classList.remove("active");
            }
            if (iExists) {
                italicControlBtn.classList.add("active");
            } else {
                italicControlBtn.classList.remove("active");
            }
        }
        //Cho mình xin gợi ý làm sao để chuyển input color thành màu con trỏ chuột hiện tại khi mình click vào content
        // var computedStyle = window.getComputedStyle(targetElement);
        // var currentColor = computedStyle.color;
        // if (inputControlBtn.type === "color") {
        //     inputControlBtn.value = currentColor;
        // }
    }
}
content.addEventListener("click", function (e) {
    handleCheckClassControl(e)
});
content.addEventListener("input", function (e) {
    var text = content.innerText;
    var words = text.split(/\s+/).filter((word) => word !== "");
    if (content.innerHTML === '<br>') {
        charCount.textContent = 0;
    } else {
        charCount.textContent = text.length;
    }
    wordCount.textContent = words.length;
    // handleCheckClassControl(e)
});

content.addEventListener("input", function (e) {
    if (content.innerHTML === '<br>') {
        if (boldControlBtn.classList.contains("active")) {
            handleChange("bold");
        }
        if (underlineControlBtn.classList.contains("active")) {
            handleChange("underline");
        }
        if (italicControlBtn.classList.contains("active")) {
            handleChange("italic");
        }
    }
});