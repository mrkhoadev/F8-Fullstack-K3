function sum(...args) {
    let total = 0;
    for (let value of args) {
        value = parseFloat(value)
        if (
            typeof value !== "number" ||
            value === Infinity ||
            value === -Infinity ||
            Number.isNaN(value)
        ) {
            return "Tham số truyền vào không hợp lệ";
        } 
        total += value;
    }
    return total;
    
}
console.log(sum(10, 2, "10"));
console.log(sum(10, "not a number", "10"));
console.log(sum(10, 1000**1000, "10"));

