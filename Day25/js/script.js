//Tạo các element
var carousel = document.querySelector(".carousel");
var carouselInner = carousel.querySelector(".carousel-inner");
var nextBtn = carousel.querySelector(".next");
var prevBtn = carousel.querySelector(".prev");

//Lấy kích thước của 1 item
var itemWidth = carouselInner.clientWidth;
var itemHeight = carouselInner.clientHeight;

//Lấy tất cả items
var items = carouselInner.children;

// Tính tổng kích thước các items
var totalWidth = items.length * itemWidth;
// Cập nhật CSS cho carousel inner
carouselInner.style.width = `${totalWidth}px`;

//Phân trang slide
var pagination = document.createElement("div");

pagination.classList.add("pagination");

carousel.appendChild(pagination);

var isFirstDot = true;
for (let i = 1; i <= items.length; i++) {
    var dots = document.createElement("span");
    dots.classList.add("dots");
    if (isFirstDot) {
        dots.classList.add("dots-active");
        isFirstDot = false;
    }
    pagination.appendChild(dots);
}
var dotsActive = pagination.querySelector(".dots-active");
let position = 0;
//chuyền các giá trị position vào mảng mới
arrPosition = [position];
for (let i = 0; i < items.length - 1; i++) {
    if (Math.abs(position) < totalWidth - itemWidth) {
        position -= itemWidth;
        arrPosition.push(position);
    }
}

position = 0;
var cloneArr = [];
cloneArr.push(
    items[0].cloneNode(true),
    items[items.length - 1].cloneNode(true)
);
cloneArr.forEach((item, i) => {
    item.style.position = "absolute";
    item.style.width = `${itemWidth}px`;
    item.style.top = "0";
    if (i === 0) {
        item.style.right = "0";
        item.style.translate = `${itemWidth}px`;
        carouselInner.appendChild(item);
    } else if (i === 1) {
        item.style.left = "0";
        item.style.translate = `${-itemWidth}px`;
        carouselInner.prepend(item);
    }
});

const images = document.querySelectorAll(".item img");
// Ngăn chặn sự kiện kéo ảnh
images.forEach((image) => {
    image.addEventListener("dragstart", (e) => {
        e.preventDefault();
    });
});

var itemsLength = items.length - 2

//Button next and prev
var handleUpdateDots = function (callback) {
    // arrPosition.forEach((item, i) => {
    //     if (position === item) {
    //         dots[i].classList.add("dots-active");
    //     } else {
    //         dots[i].classList.remove("dots-active");
    //     }
    // });
    dots[previousIndex].classList.remove("dots-active");
    callback();
    dots[previousIndex].classList.add("dots-active");
};
// hàm giả lướt slide vòng tròn
var isAnimating = true;
const transitionDuration = parseFloat(getComputedStyle(carouselInner).transitionDuration) * 1000;
var handleSlick = function (callback) {
    isAnimating = false;
    requestAnimationFrame(function () {
        setTimeout(function () {
            carouselInner.style.transition = `translate 0s ease-in-out`;
            callback();
            carouselInner.style.translate = `${position}px`;
            setTimeout(function () {
                isAnimating = true;
                carouselInner.style.transition = "";
            }, 5);
        }, transitionDuration * 1.2);
    });
};

var handleNextBtn = function () {
    if (isAnimating) {
        if (previousIndex < itemsLength - 1) {
            handleUpdateDots(function () {
                return ++previousIndex;
            });
        } else if (previousIndex >= itemsLength - 1) {
            handleUpdateDots(function () {
                previousIndex = 0;
            });
        }
        if (Math.abs(position) < totalWidth - itemWidth) {
            position -= itemWidth;
        } else if (Math.abs(position) === totalWidth - itemWidth) {
            position -= itemWidth;
            handleSlick(function () {
                return (position = 0);
            });
        }
        carouselInner.style.translate = `${position}px`;
    }
};

var handlePrevBtn = function () {
    if (isAnimating) {
        if (previousIndex > 0) {
            handleUpdateDots(function () {
                return --previousIndex;
            });
        } else if (previousIndex === 0) {
            handleUpdateDots(function () {
                previousIndex = itemsLength - 1;
            });
        }
        if (Math.abs(position) > 0) {
            position += itemWidth;
            carouselInner.style.translate = `${position}px`;
        } else if (Math.abs(position) === 0) {
            position += itemWidth;
            handleSlick(function () {
                return (position = -totalWidth + itemWidth);
            });
            carouselInner.style.translate = `${position}px`;
        }
    }
    
};

var dots = pagination.querySelectorAll(".dots");
let previousIndex = 0;

dots.forEach((element, index) => {
    element.addEventListener("click", function (e) {
        handleUpdateDots(function () {
            return previousIndex = index;
        });
        //lấy các giá trị trong mảng mới tương ứng để phân trang
        carouselInner.style.translate = `${arrPosition[index]}px`;
    });
    element.addEventListener("mousedown", function (e) {
        if (e.which === 1) {
            position = arrPosition[index];
        }
    })
});

var checkMouse = false;
let clientX = 0;
let offsetX = 0;
let difference = 0;
let previousTranslateX = 0;
let slideThreshold = 300;
var handleMouse = function (e, position) {
    let clientX = e.clientX;
    let translateX = clientX - offsetX - 10;
    difference = position + translateX;
    if (translateX > 0) {
        if (
            Math.abs(difference) <= Math.abs(position + slideThreshold) &&
            Math.abs(position) <= totalWidth - itemWidth &&
            Math.abs(position) >= 0
        ) {
            handlePrevBtn();
            difference += -translateX + itemWidth;
            checkMouse = false;
        }
    } else {
        if (
            Math.abs(difference) >= Math.abs(position - slideThreshold) &&
            Math.abs(position) <= totalWidth - itemWidth
        ) {
            handleNextBtn();
            difference -= translateX + itemWidth;
            carouselInner.style.transition = `translate 0.4s ease-in-out`;
            checkMouse = false;
        }
    }
    if (!checkMouse) {
        carouselInner.style.transition = `translate 0.4s ease-in-out`;
    } else {
        carouselInner.style.transition = `none`;
    }
    carouselInner.style.translate = `${difference}px`;
};

//Phần click chuột
carouselInner.addEventListener("mousedown", function (e) {
    if (e.which === 1 && isAnimating) {
        checkMouse = true;
        offsetX = e.clientX;
        carouselInner.style.cursor = "grabbing";
    }
});
carouselInner.addEventListener("mouseup", function (e) {
    if (e.which === 1) {
        checkMouse = false;
        carouselInner.style.cursor = "grab";
    }
});
carouselInner.addEventListener("mousemove", function (e) {
    if (!checkMouse) {
        carouselInner.style.cursor = "grab";
    } else {
        carouselInner.style.cursor = "grabbing";
    }
});
// xử lý kéo thả
var backPrevSlide = function () {
    checkMouse = false;
    difference = position;
    carouselInner.style.translate = `${difference}px`;
    carouselInner.style.transition = `translate 0.4s ease-in-out`;
};
carouselInner.addEventListener("mouseleave", function () {
    backPrevSlide();
});

carousel.addEventListener("mouseup", function () {
    backPrevSlide();
});

carousel.addEventListener("mousemove", function (e) {
    if (checkMouse) {
        handleMouse(e, position);
    }
});
//button
nextBtn.addEventListener("click", function () {
    handleNextBtn(function (position) {
        handleMouse(e, position);
    });
});
prevBtn.addEventListener("click", function () {
    handlePrevBtn(function (position) {
        handleMouse(e, position);
    });
});

setInterval(function () {
    handleNextBtn();
}, 5000);