var inputArr = document.getElementById("arr");
var btn = document.getElementById("btn");
var output = document.getElementById("text");
btn.addEventListener("click", () => {
    const value = inputArr.value;
    try {
        const arr = parseArray(value);
        const check = checkArr(arr);
        const charArray = [];
        const numberArray = [];
        const booleanArray = [];
        check.forEach((item) => {
            if (typeof item === "string") {
                charArray.push(item);
            } else if (typeof item === "number") {
                numberArray.push(item);
            } else if (typeof item === "boolean") {
                booleanArray.push(item);
            }
        });
        const newArr = [];
        if (charArray.length !== 0) {
            newArr.push(charArray);
        }
        if (numberArray.length !== 0) {
            newArr.push(numberArray);
        }
        if (booleanArray.length !== 0) {
            newArr.push(booleanArray);
        }
        if (newArr.length !== 0) {
            var wrapArr = newArr.map((innerArr) => {
                return "[" + innerArr + "]";
            });
            output.innerText = `[${wrapArr}]`;
        } else {
            output.innerText = `Vui lòng nhập dữ liệu để tiến hành kiểm tra!`;
        }
    } catch (error) {
        output.innerText = "Lỗi không xác định!";
    }
    function parseArray(input) {
        const jsonArray = "[" + input + "]";
        return JSON.parse(jsonArray);
    }
    function checkArr(arr) {
        let result = [];
        function checkItem(item) {
            if (Array.isArray(item)) {
                item.forEach((index) => {
                    checkItem(index);
                });
            } else {
                result[result.length] = item;
            }
        }
        checkItem(arr);
        return result;
    }
});
