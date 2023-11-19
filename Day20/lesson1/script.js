var inputArr1 = document.getElementById("arr1");
var inputArr2 = document.getElementById("arr2");
var btn = document.getElementById("btn");
var output = document.getElementById("text");
btn.addEventListener("click", () => {
    const arr1 = inputArr1.value.split(",").map((str) => parseFloat(str));
    const arr2 = inputArr2.value.split(",").map((str) => parseFloat(str));
    // var diff = arr1.reduce((index, arr) => {
    //     if (arr2.includes(arr)) {
    //         index.push(arr)
    //     }
    //     return index
    // }, [])
    // output.innerText = diff
    let newArr = [];
    arr1.forEach((arr1) => {
        arr2.forEach((arr2) => {
            if (arr1 === arr2) {
                newArr[newArr.length] = arr1;
            }
        });
    });
    const result = newArr.sort();
    output.innerText = result;
});
