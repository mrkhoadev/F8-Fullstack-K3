var inputArr = document.getElementById("arr");
var btn = document.getElementById("btn");
var output = document.getElementById("text");
btn.addEventListener("click", () => {
    const inputValue = inputArr.value;
    try {
        const arr = parseArray(inputValue);
        const check = checkArr(arr);
        output.innerText = `[${check}]`;
    } catch (error) {
        console.log("Không thể chuyển đổi thành mảng.");
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

    function parseArray(input) {
        const jsonArray = "[" + input + "]";
        return JSON.parse(jsonArray);
    }
});
