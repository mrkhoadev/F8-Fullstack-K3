var input = document.getElementById("input");
var btn = document.getElementById("btn");
var textMax = document.getElementById("max");
var textMin = document.getElementById("min");
btn.addEventListener("click", function () {
    const inputArr = input.value.split(",").map((str) => parseFloat(str));
    const numberInt = inputArr.every(function (number) {
        if (number % 1 === 0) {
            return true;
        } else {
            return false;
        }
    });
    if (numberInt) {
        var result = inputArr.reduce(
            function (index, num, count) {
                if (num > index.max) {
                    index.max = num
                    index.mapMax = [count + 1]
                } else if (num === index.max) {
                    index.mapMax.push(count + 1);
                }
                if (num < index.min) {
                    index.min = num
                    index.mapMin = [count + 1]
                } else if (num === index.min) {
                    index.mapMin.push(count + 1);
                }
                return index
            },
            { max: -Infinity, min: Infinity, mapMax: [], mapMin: [] }
        );
        textMax.innerText = result.max + " ở vị trí thứ: " + result.mapMax;
        textMin.innerText = result.min + " ở vị trí thứ: " + result.mapMin;
    } else {
        text.innerText = "Vì bạn nhập sai nên tôi không kiểm tra cho bạn!";
    }
});
