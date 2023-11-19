//hiển thị form đăng nhập (popup) và lớp overlay
var btn = document.querySelector(".btn");
var popup = document.querySelector(".popup");
var overlay = document.querySelector(".overlay");

var inputs = document.querySelectorAll("input");
var inputBoxs = document.querySelectorAll(".input-box");

var loginForm = document.querySelector(".form--login");
var registerForm = document.querySelector(".form--register");
var loginBtn = document.querySelector(".btn-login");
var registerBtn = document.querySelector(".btn-register");

btn.addEventListener("click", function () {
    popup.classList.toggle("actives");
    overlay.classList.toggle("actives");
});
//reset khi click vào overlay
overlay.addEventListener("click", function () {
    popup.classList.toggle("actives");
    overlay.classList.toggle("actives");

    registerBtn.classList.remove("active-title");
    loginBtn.classList.add("active-title");
    registerForm.classList.remove("form-active");
    loginForm.classList.add("form-active");
    inputs.forEach(function (input) {
        input.value = "";
    });
    //reset alert
    inputBoxs.forEach(function (inputBox) {
        var input = inputBox.querySelector("input");
        var error = inputBox.querySelector(".error");
        input.style.borderColor = "#ddd";
        error.classList.remove("active-error");
    });

    formBox.forEach(function (formBox) {
        var form = formBox.querySelector("form");
        var errors = form.querySelector(".error");
        errors.classList.remove("active-alert");
    });
});

//Chuyển form đăng nhập sang form đăng ký và ngược lại. Làm mới value và loại bỏ thông báo lỗi
registerBtn.addEventListener("click", function () {
    registerBtn.classList.add("active-title");
    loginBtn.classList.remove("active-title");
    registerForm.classList.add("form-active");
    loginForm.classList.remove("form-active");
    //reset value
    inputs.forEach(function (input) {
        input.value = "";
    });
    //reset alert
    inputBoxs.forEach(function (inputBox) {
        var input = inputBox.querySelector("input");
        var error = inputBox.querySelector(".error");
        input.style.borderColor = "#ddd";
        error.classList.remove("active-error");
    });

    formBox.forEach(function (formBox) {
        var form = formBox.querySelector("form");
        var errors = form.querySelector(".error");
        errors.classList.remove("active-alert");
    });
});

loginBtn.addEventListener("click", function () {
    registerBtn.classList.remove("active-title");
    loginBtn.classList.add("active-title");
    registerForm.classList.remove("form-active");
    loginForm.classList.add("form-active");
    //reset value
    inputs.forEach(function (input) {
        input.value = "";
    });
});

//hàm hiển thị thông báo khi click vào button form
function handleAlertError(input) {
    var error = input.parentElement.querySelector(".error");
    error.classList.remove("active-error");
    if (input.value === "") {
        input.style.borderColor = "#ef4444";
        error.classList.add("active-error");
    } else {
        input.style.borderColor = "#ddd";
    }
}
var formBox = document.querySelectorAll(".form-box");
formBox.forEach(function (formBox, index) {
    var form = formBox.querySelector("form");
    var errors = form.querySelector(".error");
    var formBtn = formBox.querySelector(".btn-form");
    var inputBox = formBox.querySelectorAll(".input-box");
    //check xem trong input có ký tự không và thông báo lỗi khi bấm button
    formBtn.addEventListener("click", function () {
        var check = 0;
        inputBox.forEach(function (inputBox, i) {
            var input = inputBox.querySelector("input");
            if (input) {
                if (input.value === "") {
                    handleAlertError(input);
                } else {
                    check = i;
                }
            }
        });
        errors.classList.remove("active-alert");
        if (
            (index === 0 && check === inputBox.length - 1) ||
            (index === 1 && check === inputBox.length - 1)
        ) {
            errors.classList.add("active-alert");
        }
    });
    //click ra ngoài input
    function handleInputBlur(input) {
        var error = input.parentElement.querySelector(".error");
        input.addEventListener("blur", function () {
            var inputs = formBox.querySelectorAll("input");
            var checkInput = Array.from(inputs).every(
                (input) => input.value === ""
            );
            //nếu tất cả input trong form rỗng thì chạy câu lệnh này
            if (checkInput) {
                inputs.forEach(function (input) {
                    var errors =
                        input.parentElement.querySelector(".input-box .error");
                    errors.classList.add("active-error");
                    input.style.borderColor = "#ef4444";
                });
            }
            error.classList.remove("active-error");
            if (input.value === "") {
                input.style.borderColor = "#ef4444";
                error.classList.add("active-error");
            } else {
                input.style.borderColor = "#ddd";
            }
        });
    }
    //sự kiện khi nhập value
    function handleInputInput(input) {
        input.addEventListener("input", function () {
            var error = input.parentElement.querySelector(".error");
            const value = input.value.trim();
            if (value !== "") {
                input.style.borderColor = "#ddd";
                error.classList.remove("active-error");
            } else {
                errors.classList.remove("active-alert");
                input.style.borderColor = "#ef4444";
                error.classList.add("active-error");
            }
        });
    }

    inputBox.forEach(function (inputBox) {
        var input = inputBox.querySelector("input");
        if (input) {
            handleInputBlur(input);
            handleInputInput(input);
        }
        //Hiển thị mật khẩu
        var inputBtn = inputBox.querySelectorAll(".btn-input");
        var password = inputBox.querySelector("input[type='password'");
        inputBtn.forEach(function (inputBtn) {
            inputBtn.addEventListener("click", function () {
                var showPass = inputBtn.querySelector(".show-pass");
                var hiddenPass = inputBtn.querySelector(".hidden-pass");
                if (password) {
                    if (password.type === "password") {
                        showPass.classList.remove("active-icon");
                        hiddenPass.classList.add("active-icon");
                        password.type = "text";
                    } else {
                        showPass.classList.add("active-icon");
                        hiddenPass.classList.remove("active-icon");
                        password.type = "password";
                    }
                }
            });
        });
    });
});
