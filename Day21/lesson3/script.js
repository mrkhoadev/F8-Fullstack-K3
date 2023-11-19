const data = [];
function User(name, password, email) {
    (this.name = name),
    (this.password = password),
    (this.email = email),
    (this.role = "user");
}
var errors = {
    name: {
        required: "Vui lòng nhập họ tên",
    },
    email: {
        required: "Vui lòng nhập địa chỉ email",
    },
    password: {
        required: "Vui lòng nhập mật khẩu",
    },
};

User.prototype.register = function () {
    if (!this.name || !this.password || !this.email) {
        if (!this.name) {
            return errors.name.required;
        }
        if (!this.password) {
            return errors.password.required;
        }
        if (!this.email) {
            return errors.email.required;
        }
    } else {
        data.push(this);
        return this;
    }
};
/*
Muốn kiểm tra thông báo lỗi thì chỉ cần nhập "" là được. Cấm xóa luôn :v
*/
const dataRegister = new User(
    "Nguyen Van A",
    "123456",
    "nguyenvana@email.com"
).register();
const dataRegister2 = new User(
    "Nguyen Van B",
    "1234567",
    "nguyenvanb@email.com"
).register();
console.log(dataRegister);
console.log(dataRegister2);

User.prototype.login = function () {
    for (let i = 0; i < data.length; i++) {
        if (data[i].name === this.name && data[i].password === this.password) {
            return { ...data[i] };
        }
        return false;
    }
};

const dataLogin = new User("Nguyen Van A", "123456").login();

if (dataLogin) {
    console.log("Đăng nhập thành công:\n", dataLogin);
} else {
    console.log("Tên đăng nhập hoặc mật khẩu không đúng.");
}
