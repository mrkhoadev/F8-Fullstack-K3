Number.prototype.getCurrency = function (currencySymbol) {
    let number = parseFloat(this);
    if (isNaN(number) || !isFinite(number)) {
        return "Không phải số nên không thể chuyển thành kiểu dữ liệu tiền tệ!";
    }
    number = number.toString()
    let space = ""
    for (let i = number.length - 1; i >= 0; i--) {
        space = number.charAt(i) + space;
        if ((number.length - i) % 3 === 0 && i !== 0) {
            space = "," + space;
        }
    }
    return space.concat(` ${currencySymbol}`);
};  

var price = 1200000; 
price = parseFloat(price)
console.log(price.getCurrency("đ"));