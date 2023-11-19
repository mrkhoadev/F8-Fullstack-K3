Array.prototype.reduce2 = function (prev, current) {
    if (typeof prev !== "function") {
        return "prev phải là một hàm";
    }
    let result = current !== undefined ? current : this[0] 
    const begin = current !== undefined ? 0 : 1 // vị trí trong mảng
    for (let i = begin; i < this.length; i++) {
        result = prev(result, this[i], i, this)
    }
    return result
}
var test = [1, 2, 3, 4, 5];
console.log(test.reduce2(function (prev, current) {
    console.log(prev, current);
    return prev + current 
}));