var input = document.getElementById("input");
var btn = document.getElementById("btn");
var text = document.getElementById("text");
btn.addEventListener("click", () => {
    const inputArr = input.value.split(",")
    function del(arr, index) {
        for (let i = index + 1; i < arr.length; i++) {
            arr[i - 1] = arr[i]
        }
        arr.pop();
    }
    function delDuplicate(arr) {
        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[i] === arr[j]) {
                    del(arr, j)
                    i--
                    break
                }
            }
        }
    }
    delDuplicate(inputArr);
    text.innerText = `[${inputArr}]`;
});
