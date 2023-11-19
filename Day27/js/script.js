var productData = [
    {
        id: "001",
        product: "Sản phẩm 1",
        price: "1000",
    },
    {
        id: "002",
        product: "Sản phẩm 2",
        price: "2000",
    },
    {
        id: "003",
        product: "Sản phẩm 3",
        price: "3000",
    },
    {
        id: "004",
        product: "Sản phẩm 4",
        price: "4000",
    },
];

var formatCurrency = function (number) {
    var formattedNumber = number.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });
    if (formattedNumber.indexOf(".") !== -1) {
        var decimalPart = formattedNumber.split(".")[1];
        if (decimalPart === "00") {
            formattedNumber = formattedNumber.split(".")[0];
        }
    }
    return formattedNumber;
};

function sum(arr) {
    var total = 0;
    for (var i = 0; i < arr.length; i++) {
        total += arr[i];
    }
    return total;
}

var productHTML = `
<h3>DANH SÁCH SẢN PHẨM</h3>
<table id="product-table" class="product-table">
    <thead>
        <tr>
            <th>STT</th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Thêm vào giỏ</th>
        </tr>
    </thead>
    ${productData
        .map((data, index) => {
            return `
            <tbody>
                <tr>
                    <td>${index + 1}</td>
                    <td>${data.product}</td>
                    <td>${formatCurrency(parseFloat(data.price))}</td>
                    <td>
                        <input type="number" id="quantity_${
                            index + 1
                        }" value="1">
                        <button type="button" style='width:100%' id="add_to_cart_${
                            index + 1
                        }">Thêm vào giỏ</button>
                    </td>
                </tr>
            </tbody>
            `;
        })
        .join("")}
</table>
<h3>Giỏ Hàng</h3>
<div id="cart_data"></div>
`;
document.write(productHTML);

var cartHTML = `
<table id="cart-table">
    <thead>
        <tr>
            <th>STT</th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
            <th>Xoá</th>
        </tr>
    </thead>
</table>
<hr>
<button type="button" id="update_cart">Cập nhật giỏ hàng</button>
<button type="button" id="delete_cart">Xoá giỏ hàng</button>
`;

var cart = document.querySelector("#cart_data");
var cartData = localStorage.getItem("cartData")
    ? JSON.parse(localStorage.getItem("cartData"))
    : [];//nếu trong localStorage có dữ liệu thì sẽ trả về true và ngược lại
var productTable = document.querySelector("#product-table");
var buttons = productTable.querySelectorAll('button[id^="add_to_cart_"]');

var handleUploadData = function (data) {
    localStorage.setItem("cartData", JSON.stringify(data));
};

var handleDeleteCart = function () {
    var deleteAlert = confirm("Bạn có chắc muốn xóa tất cả các sản phẩm trong giỏ hàng không?");
    if (!deleteAlert) {
        return alert("Đã hủy bỏ xóa.");
    }
    cartData = [];
    handleUploadData(cartData);
    updateCart();
    renderCart();
    alert("Đã xóa!");
};

var handleAddCartBtn = function (e, index) {
    var input = e.target.parentNode.querySelector("input");
    var inputValue = input.value;
    var containsE = /e/i.test(inputValue);
    if (inputValue < 1) {
        return alert("Thêm tối thiểu 1 sản phẩm!");
    }
    inputValue = parseFloat(input.value);
    // Kiểm tra xem productData[index] đã tồn tại trong cartData hay chưa
    var existingProduct = cartData.find((item) => item.id === productData[index].id);
    if (existingProduct) {
        // Nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật quantity và totalMoney
        existingProduct.quantity += inputValue;
        existingProduct.totalMoney += inputValue * productData[index].price;
    } else {
        // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới vào giỏ hàng
        cartData.push({
            ...productData[index],
            quantity: inputValue,
            totalMoney: inputValue * productData[index].price,
        });
    }
    handleUploadData(cartData);
    updateCart();
    renderCart();
};
var handleUpdateCartBtn = function () {
    var input = document.querySelectorAll(
        "#cart-table tbody tr td input.quantity"
    );
    var newQuantity = [];
    var newTotalMoney = [];
    input.forEach((item, index) => {
        var inputValue = item.value;
        var containsE = /e/i.test(inputValue);
        if (inputValue < 1) {
            alert("Vì bạn nhập số lượng nhỏ hơn 1 / sai định dạng, tôi sẽ xóa sản phẩm của bạn! (╯°□°)╯︵ ┻━┻");
            cartData.splice(index, 1);
            handleUploadData(cartData);
            updateCart();
            renderCart();
            return;
        }
        inputValue = parseFloat(item.value);
        if (index < cartData.length - 1) {
            cartData[index].totalMoney = inputValue * cartData[index].price;
            cartData[index].quantity = inputValue;
        }
        newQuantity.push(inputValue);
        newTotalMoney.push(cartData[index].totalMoney);
    });
    var resultQuantity = sum(newQuantity);
    var resultTotalMoney = sum(newTotalMoney);
    cartData[cartData.length - 1].total = resultQuantity;
    cartData[cartData.length - 1].totalAmount = resultTotalMoney;
    handleUploadData(cartData);
    updateCart();
    renderCart();
    alert("Cập nhập giỏ hàng thành công!");
}

var updateCart = function () {
    if (cartData.length <= 1) {
        cart.innerHTML = "";
        var textNode = document.createTextNode("Giỏ hàng không có sản phẩm");
        cart.appendChild(textNode);
    } else {
        cart.innerHTML = ""; 
        cart.insertAdjacentHTML("beforeend", cartHTML);

        var updateCartBtn = document.querySelector("#update_cart");
        updateCartBtn?.addEventListener("click", handleUpdateCartBtn);

        var removeCartBtn = document.querySelector("#delete_cart");
        removeCartBtn?.addEventListener("click", handleDeleteCart);
    }
};

var renderCart = function () {
    var cartTable = cart.querySelector("#cart-table");
    var totalItem = {
        id: "total",
        total: 0,
        totalAmount: 0,
    };
    cartData = cartData.filter((item) => item.id !== "total");
    for (var j = 0; j < cartData.length; j++) {
        totalItem.total += cartData[j].quantity;
        totalItem.totalAmount += cartData[j].totalMoney;
    }
    cartData.push(totalItem);
    cartData.forEach((data, index) => {
        let tbody = document.createElement("tbody");
        let tr = document.createElement("tr");
        for (let i = 0; i < Object.keys(data).length; i++) {
            let td = document.createElement("td");
            tr.appendChild(td);
        }
        if (index < cartData.length - 1) {
            let td = document.createElement("td");
            tr.appendChild(td);
            tr.querySelector("td:nth-child(1)").textContent = index + 1;
            tr.querySelector("td:nth-child(2)").textContent = data.product;
            tr.querySelector("td:nth-child(3)").textContent = formatCurrency(
                parseFloat(data.price)
            );
            //=========================
            var input = document.createElement("input");
            input.type = "number";
            input.value = data.quantity;
            input.classList.add("quantity");
            input.style.border = "none";
            input.style.width = "100%";
            tr.querySelector("td:nth-child(4)").appendChild(input);
            //=========================
            tr.querySelector("td:nth-child(5)").textContent = formatCurrency(
                parseFloat(data.totalMoney)
            );
            var deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Xóa";
            deleteBtn.type = "button";
            deleteBtn.style.width = "95%";
            deleteBtn.classList.add("delete-item");
            tr.querySelector("td:nth-child(6)").appendChild(deleteBtn);
            tr.querySelector("td:nth-child(6)").style.textAlign = "center"
        }
        if (index === cartData.length - 1) {
            tr.querySelector("td:nth-child(1)").colSpan = 3;
            tr.querySelector("td:nth-child(1)").textContent = "Tổng";

            tr.querySelector("td:nth-child(2)").textContent =
                cartData[cartData.length - 1].total;

            tr.querySelector("td:nth-child(3)").colSpan = 2;
            tr.querySelector("td:nth-child(3)").textContent = formatCurrency(
                parseFloat(cartData[cartData.length - 1].totalAmount)
            );
        }
        tbody.appendChild(tr);
        cartTable?.appendChild(tbody);
    });
    // xử lý phần button xóa của giỏ
    var deleteItem = cartTable?.querySelectorAll(".delete-item");
    deleteItem?.forEach((element) => {
        element.addEventListener("click", function (e) {
            var deleteAlert = confirm("Bạn có chắc muốn xóa sản phẩm này?");
            if (!deleteAlert) {
                return alert("Đã hủy bỏ xóa.");
            }
            var row = e.target.parentNode.parentNode.parentNode;
            var rowIndex = row.rowIndex;
            cartData.splice(rowIndex - 1, 1);
            var sttUpdate = cartTable.querySelectorAll(
                `tbody tr td:first-child`
            );
            sttUpdate.forEach((item, index) => {
                item.textContent = index + 1;
            });
            alert("Xóa rồi có làm thế nào cũng không lấy lại được đâu!");
            handleUploadData(cartData);
            updateCart();
            renderCart();
        });
    });
};

buttons.forEach((button, index) => {
    button.addEventListener("click", function (e) {
        handleAddCartBtn(e, index);
    });
});

updateCart();
renderCart();
