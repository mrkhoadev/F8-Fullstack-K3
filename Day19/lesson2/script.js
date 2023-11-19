var input = document.getElementById("input");
var btn = document.getElementById("btn");
var text = document.getElementById("text");
btn.addEventListener("click", function () {
    const inputArr = input.value.split(",").map(str => parseFloat(str))
    function isPrime(number) {
        if (number % 1 === 0) {
            if (number <= 1) {
                return false;
            }
            if (number === 2 || number === 3) {
                return true;
            }
            if (number % 2 === 0 || number % 3 === 0) {
                return false;
            }
            for (var i = 5; i * i <= number; i += 6) {
                if (number % i === 0 || n % (i + 2) === 0) {
                    return false;
                }
            }
            return true;
        }
    }
    const numberInt = inputArr.some(function (number) {
        return isPrime(number);
    })
    if (numberInt) {
        let sum = 0
        let count = 0
        for (let i = 0; i < inputArr.length; i++) {
            if (isPrime(inputArr[i])) {
                sum += inputArr[i];
                count++
            }
        }
        text.innerText = sum / count
    } else {
        text.innerText = "Không có số nguyên tố";
    }
});
