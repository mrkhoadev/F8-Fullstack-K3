var input = document.getElementById("input");
var number = document.getElementById("number");
var btn = document.getElementById("btn");
var text = document.getElementById("text");
btn.addEventListener("click", () => {
    const inputArr = input.value.split(",").sort().map((str) => parseFloat(str))
    const numbers = parseFloat(number.value)
    function checkInt(number) {
        return number % 1 === 0;
    }
    function arrInt(arr) {
        for (let i = 0; i < arr.length; i++) {
            if (!checkInt(arr[i])) {
                return false;
            }
        }
        return true;
    }
    if (checkInt(numbers) && arrInt(inputArr)) {
        let count = 0;
        while (count < inputArr.length && inputArr[count] <= numbers) {
            count++;
        }
        inputArr.splice(count, 0, numbers);
        console.log(inputArr); 
        text.innerText = `[${inputArr}]`;
    } else if (checkInt(numbers) && !arrInt(inputArr)) {
        text.innerText = "Trong mảng tồn tại 1 số phần tử không phải là số nguyên!";
    } else if (!checkInt(numbers) && arrInt(inputArr)) {
        text.innerText = "Số cần chèn không phải là số nguyên!";
    } else {
        text.innerText = "Sai rồi! Nhập số nguyên mà?";
    }
    
});
