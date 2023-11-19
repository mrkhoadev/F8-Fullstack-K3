const customers = [
    { name: "Nguyễn Văn A", age: 11, address: "Ha Noi" },
    { name: "Nguyễn Văn B", age: 2, address: "Hai Phong" },
    { name: "Nguyễn Văn C", age: 12, address: "TP.HCM" },
];

function createCustomers(arr) {
    arr.sort((a, b) => a.age - b.age);
    arr.forEach(item => {
        let nameArr = item.name.split(" ")
        let lastName = nameArr.splice(0, 1)
        let newName = nameArr.splice(-1);
        let shortName = [lastName, newName].join(" ");
        item.shortName = shortName;
        //So với việc chuyển chuỗi thành mảng để tách họ, tên và việc không chuyển sang mảng để tách thì 
        // cái nào sẽ tốt hơn? (tốt hơn ý là làm cho trình duyệt xử lý nhanh hơn)
    });
    return arr
}

const result = createCustomers(customers);
console.log(result);
