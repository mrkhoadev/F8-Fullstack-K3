import alertify from "alertifyjs";
import Cookies from "js-cookie";
export default function reloadPages() {
    Cookies.remove('apiKey');
    Cookies.remove('userEmail')
    alertify.error(`Đã xảy ra lỗi, hãy đăng nhập lại để tiếp tục!`);
    let timer;
    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(() => {
        window.location.reload();
    }, 1500);
}
