import { client } from "./client.js";
import { requestRefresh } from "./token.js";

let page = 1;
let isScroll = false;

window.addEventListener("beforeunload", function () {
    window.scrollTo(0, 0);
});
document.addEventListener("DOMContentLoaded", function () {
    const root = document.querySelector("#root");
    root.innerHTML = `
        <div class="circ">
            <div class="load">Loading . . . </div>
            <div class="hands"></div>
            <div class="body"></div>
            <div class="head">
                <div class="eye"></div>
            </div>
        </div>`;
});
const eventClick = new Event("click");

const regexHandlers = {
    numberPhoneRe: {
        regex: /^((\+)?(0|84)\d{9}|(1900)\d{3}\d)/,
        replacement: function (match) {
            const phone = match.match(this.regex)[1];
            return `<a href="tel:${phone}" class='link' target='_blank'>${phone}</a> `;
        },
    },
    emailRe: {
        regex: /^[a-z][a-zA-Z0-9\._%+-]*@[a-zA-Z0-9]+\.[a-zA-z\.]{2,}$/,
        replacement: (match) =>
            `<a href="mailto:${match}" class='link' target='_blank'>${match}</a>`,
    },
    linkRe: {
        regex: /^(?:https?:\/\/)?(?:www\.)?(?!youtu\.be\/[a-zA-Z0-9]*(\?)?)([a-z][a-zA-Z0-9\.-]+\.[a-zA-Z0-9_]{2,}|localhost\:[0-9]{4})(\/|\s)?((\?)?(?!watch\?v=)[a-zA-Z0-9=-\?-_\/\.]+)?\/?$/,
        replacement: function (match) {
            let link = match.match(this.regex)[1];
            let html;
            if (match.match(/^(https?:\/\/)(www\.)?/)) {
                html = `<a href="${match}" class='link' target='_blank'>${match}</a>`;
            } else {
                if (link !== undefined) {
                    html = `<a href="https://${link}" class='link' target='_blank'>${link}</a>`;
                } else {
                    html = `<a href="https://${match}" class='link' target='_blank'>${match}</a>`;
                }
            }
            return html;
        },
    },
    embedYtbRe: {
        regex: /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)?|youtu\.be\/)([a-zA-Z0-9_\-=]*(\?)?)(?:(?:(?:\?|\/|&)[a-zA-Z0-9-_=&%]+)?)\/?$/,
        replacement: function (match) {
            const videoId = match.match(this.regex)[1];
            return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title='YouTube video player'  frameborder="0" allowfullscreen></iframe>`;
        },
    },
};

const app = {
    stripHtml: (html) => {
        return html.replace(/(<([^>]+)>)/gi, "");
    },
    htmlText: function (data) {
        const text = data
            .map((item) => {
                const date = this.handleChangeDate(item.createdAt);
                const textAvt = item.userId.name.split(" ").pop().at(0);
                let content = this.stripHtml(item.content)
                    .replace(/\n+/g, "\n");
                content = content.replace(/\n/g, " \n ");
                
                let words = content.split(" ");
                for (let index = 0; index < words.length; index++) {
                    if (words[index] !== '') {
                        let firstChar = '';
                        let lastChar = '';
                        if (
                            words[index].match(/^(?!\+|\s|đ|<([^>]+)>|\d)[^a-zA-Z0-9]/) &&
                            words[index].length > 3
                        ) {
                            firstChar = words[index][0];
                            words[index] = words[index].slice(1);
                        }
                        if (
                            words[index].match(
                                /(?!\+|đ|<([^>]+)>|\s|\d)[^a-zA-Z0-9]$/
                            ) &&
                            words[index].length > 3
                        ) {
                            lastChar = words[index][words[index].length - 1];
                            words[index] = words[index].slice(0, -1);
                        }
                        for (const key in regexHandlers) {
                            const handler = regexHandlers[key];
                            if (words[index].match(handler.regex)) {
                                
                                const replacement = handler.replacement(
                                    words[index]
                                );
                                words[index] = `${firstChar} ${words[
                                    index
                                ].replace(
                                    handler.regex,
                                    replacement
                                )}${lastChar}`;
                            }
                        }
                        if (words[index] === '\n') {
                            words[index] = "<br>";
                        }
                    }
                }
                content = words.join(" ");
                const currentTime = new Date();
                const dateData = new Date(item.createdAt);
                const timeDifference = currentTime - dateData;

                // Tính các đơn vị thời gian
                const year = Math.floor(
                    timeDifference / (365 * 24 * 60 * 60 * 1000)
                );
                const month = Math.floor(
                    timeDifference / (30 * 24 * 60 * 60 * 1000)
                );
                const day = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
                const hours = Math.floor(timeDifference / (60 * 60 * 1000));
                const minutes = Math.floor(timeDifference / (60 * 1000));
                const seconds = Math.floor(timeDifference / 1000);
                const milliseconds = timeDifference;
                
                return `
                    <div class="blogs">
                        <div class="blogs-name">
                            <div class="avata">${textAvt}</div>
                            ${this.stripHtml(item.userId.name)}
                        </div>
                        <div class="blogs-title">${this.stripHtml(
                            item.title
                        )}</div>
                        <div class="blogs-content">${content}</div>
                        <div class="blogs-date">
                            <div class='blogs-date__left'>${date.year}-${
                    date.month
                }-${date.day} || ${date.hours}:${date.minutes}
                            </div>
                            <div class='blogs-date__right'>${
                                year <= 0
                                    ? month > 0 ? month + ' tháng trước' : 
                                    day > 0 ? day + ' ngày trước': 
                                    hours > 0 ? hours + " giờ trước": 
                                    minutes > 0 ? minutes + " phút trước": 'vừa xong'
                                    : `${date.year}-${date.month}-${date.day}`
                            }</div>
                        </div>
                    </div>
                    <hr>
                `;
            })
            .join("");
        return text;
    },
    render: async function () {
        const root = document.querySelector("#root");
        window.addEventListener("load", () => {});
        const blogs = await this.getBlogs({
            page: page,
        });
        let commentHtml = "";
        if (blogs) {
            commentHtml = this.htmlText(blogs);
            this.eventScroll(root);
        } else {
            commentHtml = "Không có dữ liệu???";
        }
        if (this.isLogin()) {
            root.innerHTML = `
            <div class="container">
                <h2>Chào mừng bạn đã quay trở lại</h2>
                <hr/>
                <ul class="profile">
                <li>Chào bạn: <b class="name">Loading...</b></li>
                <li><a href="#" class="logout">Đăng xuất</a></li>
                </ul>
                <div class="post-comment">
                    <form id="comment-form">
                        <div class='input-box'>
                            <input type="text" placeholder="Bạn đang nghĩ gì?">
                        </div>
                        <div class='input-box'>
                            <label for="postDateTime">Chọn ngày và giờ đăng bài:</label>
                            <input type="datetime-local" id="postDateTime" name="postDateTime">
                        </div>
                        <div class='input-box'>
                            <textarea type="text" placeholder="Nội dung..." cols='100' rows='10'></textarea>
                        </div>
                        <button class='btn' type='submit' id='post-blogs'>Đăng bài</button>
                        <div class='msg'></div>
                    </form>
                </div>
                ${commentHtml}
            </div>`;
            const profileName = document.querySelector(".profile .name");
            this.getProfile(profileName);
            this.eventLogout();
            this.eventBlogs();
        } else {
            const LoginSectionHtml = `
                <div id="loginSection-container">
                    <div class="login-section">
                        <div class="login-section__inner">
                            <div class="form-box" id="login-form">
                                <form method="post">
                                    <h2 class="form-title">
                                        Đăng nhập
                                    </h2>
                                    <div class="input-box">
                                        <input type="email" name="email-login" id="email-login" placeholder=" " autocomplete="off" required>
                                        <label for="email-login">Tài Khoản</label>
                                        <span class="icon-form">
                                            <i class='bx bxs-envelope'></i>
                                        </span>
                                    </div>
                                    <div class="input-box">
                                        <input type="password" name="password-login" id="password-login" placeholder=" " autocomplete="off" required>
                                        <label for="password-login">Mật Khẩu</label>
                                        <span class="icon-form">
                                            <i class='bx bxs-lock-alt'></i>
                                        </span>
                                    </div>
                                    <div class="msg"></div>
                                    <div class="remember-password">
                                        <div class="remember-checkbox">
                                            <input type="checkbox" id="remember-me" name="remember-me" hidden>
                                            <label for="remember-me">Nhớ Mật Khẩu</label>
                                        </div>
                                        <a href="#" class="forget-link">Quên mật khẩu?</a>
                                    </div>
                                    <button class="btn" id="btn-login" type="submit">Đăng Nhập</button>
                                    <div class="create-account">
                                        <p>
                                            Tạo tài khoản? <a href="#!" class="register-link" role="button">Đăng Ký</a>
                                        </p>
                                        <a href="#!" class="home-link" role="button" style="display: block; margin-top: 20px;cursor: pointer;">Quay lại trang chủ</a>
                                    </div>
                                </form>
                            </div>

                            <div class="form-box" id="register-form">
                                <form method="post">
                                    <h2 class="form-title">
                                        Đăng ký
                                    </h2>
                                    <div class="input-box">
                                        <input type="text" name="name-register" id="name-register" placeholder=" " autocomplete="off" required>
                                        <label for="name-register">Full Name</label>
                                        <span class="icon-form">
                                            <i class='bx bxs-user'></i>
                                        </span>
                                    </div>
                                    <div class="input-box">
                                        <input type="email" name="email-register" id="email-register" placeholder=" " autocomplete="off" required>
                                        <label for="email-register">Tài Khoản</label>
                                        <span class="icon-form">
                                            <i class='bx bxs-envelope'></i>
                                        </span>
                                    </div>
                                    <div class="input-box">
                                        <input type="password" name="password-register" id="password-register" placeholder=" " autocomplete="off" required>
                                        <label for="password-register">Mật Khẩu</label>
                                        <span class="icon-form">
                                            <i class='bx bxs-lock-alt'></i>
                                        </span>
                                    </div>
                                    <div class="msg"></div>
                                    <button class="btn" id="btn-register" type="submit">Đăng Ký</button>
                                    <div class="create-account">
                                        <p>
                                            Bạn đã có tài khoản? <a href="#!" class="login-link" role="button">Đăng nhập</a>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                        
                    </div>
                </div>
            `;
            root.innerHTML = `
                ${LoginSectionHtml}
                <header>
                    <button class="btn-loginSection">Đăng nhập</button>
                </header>
                <main>
                    <div class="container">
                        ${commentHtml}
                    </div>
                </main>    
            `;
            const btnLoginSection = document.querySelector(".btn-loginSection");
            const loginSection = document.querySelector(
                "#loginSection-container"
            );
            this.eventFormCSS();
            this.eventLogin(loginSection);
            this.eventRegister();

            btnLoginSection.addEventListener("click", async () => {
                loginSection.style.transform = "translateX(-100vw)";
                const emailLogin = document.querySelector(
                    "#login-form input[type='email']"
                );
                setTimeout(() => {
                    emailLogin.focus();
                }, 400);
            });
        }
    },
    isLogin: function () {
        if (localStorage.getItem("login_tokens")) {
            return true;
        }
        return false;
    },
    getBlogs: async function (query = {}) {
        const queryString = new URLSearchParams(query).toString();
        const { response, data: blogs } = await client.get(
            `/blogs?` + queryString
        );
        if (response.status >= 500) {
            alertify.error(
                "Đã xảy ra lỗi máy chủ, hãy tải lại trang hoặc quay lại sau!"
            );
        } else if (response.ok) {
            return blogs.data;
        } else {
            alertify.error("Đã xảy ra lỗi: ", response.status);
        }
    },
    getProfile: async function (el) {
        let loginTokens = localStorage.getItem("login_tokens");
        loginTokens = JSON.parse(loginTokens);

        const { accessToken, refreshToken } = loginTokens;

        // //Thêm token vào request header
        client.setToken(accessToken);

        const { response, data } = await client.get(`/users/profile`);

        if (response.ok) {
            el.innerText = data.data.name;
        } else {
            //Gọi request refresh token
            const newToken = await requestRefresh(refreshToken);
            //Không lấy được token mới -> Đăng xuất
            if (!newToken) {
                //Xử lý logout
                this.handleLogout();
            } else {
                //Cập nhật token mới vào localStorage
                localStorage.setItem(
                    "login_tokens",
                    JSON.stringify(newToken.data.token)
                );
                //Render
                this.render();
            }
        }
    },
    handlePostBlog: async function (data, msg, btnSubmit, timeUpValue) {
        msg.innerText = "";
        const textBtn = this.addLoading(btnSubmit);
        const currentDate = new Date();
        let selectedDate = new Date(timeUpValue);
        let remainingTime = "",
            textTime;
        let year, month, day, hours, minutes, seconds, milliSeconds;
        if (selectedDate > currentDate) {
            remainingTime = selectedDate - currentDate;
            const getTime = this.handleChangeDate(remainingTime);
            year = +getTime.year - 1970;
            month = +getTime.month - 1;
            day = +getTime.day - 1;
            hours = +getTime.hours - 8;
            minutes = +getTime.minutes;
            seconds = +getTime.seconds;
            milliSeconds = +getTime.milliseconds;
            textTime =
                (year > 0 ? `${year} năm ` : "") +
                (month > 0 ? `${month} tháng ` : "") +
                (day > 0 ? `${day} ngày ` : "") +
                (hours > 0 ? `${hours} giờ ` : "") +
                (minutes > 0 ? `${minutes} phút ` : "") +
                (seconds > 0 ? `${seconds} giây ` : "");
        } else if (selectedDate < currentDate) {
            remainingTime = "error";
            selectedDate = null;
        } else {
            selectedDate = null;
        }

        if (selectedDate !== null) {
            data.timeUp = selectedDate;
        }

        if (remainingTime === "error") {
            msg.innerText =
                "Thời gian đã trôi qua, hãy đặt lại thời gian mới và thử lại";
        } else {
            const { response, data: blogs } = await client.post("/blogs", data);
            
            if (response.ok) {
                if (selectedDate === null) {
                    page = 1;
                    this.render();
                } else {
                    msg.innerText = `Bài đăng của bạn sẽ được thực hiện sau: ${textTime}`;
                }
            } else {
                if (response.status === 401) {
                    let loginTokens = localStorage.getItem("login_tokens");
                    loginTokens = JSON.parse(loginTokens);

                    const { refreshToken } = loginTokens;

                    const newToken = await requestRefresh(refreshToken);

                    if (!newToken) {
                        this.handleLogout();
                        alertify.success(
                            `Bạn đã bị đá, hãy đăng nhập lại để tiếp tục đăng bài!`
                        );
                    } else {
                        localStorage.setItem(
                            "login_tokens",
                            JSON.stringify(newToken.data.token)
                        );
                        await this.render();

                        const btnSubmitNew = document.querySelector(
                            "#comment-form #post-blogs"
                        );
                        btnSubmitNew.textContent = textBtn;
                        const msgPostBlog =
                            document.querySelector("#comment-form .msg");

                        this.handlePostBlog(
                            data,
                            msgPostBlog,
                            btnSubmitNew,
                            timeUpValue
                        );
                    }
                } else {
                    msg.innerText = "Lỗi không thể đăng bài, hãy thử lại!";
                }
            }
        }
        this.removeLoading(btnSubmit, textBtn);
    },
    handleLogin: async function (data, msg, btnSubmit) {
        msg.innerText = "";
        const textBtn = this.addLoading(btnSubmit);
        let login;
        try {
            login = await client.post(`/auth/login`, data);
        } catch {
            msg.innerText = "Lỗi server, hãy thử lại sau it phút!";
        }
        this.removeLoading(btnSubmit, textBtn);
        if (login !== undefined) {
            const { data: tokens, response } = login;
            if (!response.ok) {
                msg.innerText = "Email hoặc mật khẩu không chính xác";
            } else {
                localStorage.setItem(
                    "login_tokens",
                    JSON.stringify(tokens.data)
                );
                this.render();
            }
        }
    },
    handleChangeDate: function (text) {
        const dateObject = new Date(text);
        const year = dateObject.getFullYear();
        const month = dateObject.getMonth() + 1;
        const day = dateObject.getDate();
        const hours = dateObject.getHours();
        const minutes = dateObject.getMinutes();
        const seconds = dateObject.getSeconds();
        const milliseconds = dateObject.getMilliseconds();
        return {
            year,
            month,
            day,
            hours: hours < 10 ? "0" + hours : hours,
            minutes: minutes < 10 ? "0" + minutes : minutes,
            seconds: seconds < 10 ? "0" + seconds : seconds,
            milliseconds: milliseconds < 10 ? "0" + milliseconds : milliseconds,
        };
    },
    handleRegister: async function (data, msg, btnSubmit) {
        msg.innerText = "";
        const textBtn = this.addLoading(btnSubmit);
        let register;
        try {
            register = await client.post(`/auth/register`, data);
        } catch {
            const commentForm = document.querySelector("#comment-form");
            const titleEl = commentForm.querySelector("input[type='text']");
            const contentEl = commentForm.querySelector(
                "textarea[type='text']"
            );
            titleEl.value = '';
            contentEl.value = '';
            msg.innerText = "Lỗi server, hãy thử lại sau it phút!";
        }
        this.removeLoading(btnSubmit, textBtn);
        if (register !== undefined) {
            const { data: tokens, response } = register;

            if (response.status === 400) {
                msg.innerText = "Tài khoản đã tồn tại!";
            } else if (!response.ok) {
                msg.innerText = "Đăng ký thất bại!";
            } else {
                alertify.success("Bạn đã đăng ký thành công!");
                const loginLink = document.querySelector(
                    "#register-form .login-link"
                );
                const loginForm = document.querySelector("#login-form");
                const emailEl = loginForm.querySelector(`#email-login`);
                const passwordEl = loginForm.querySelector(`#password-login`);
                emailEl.value = data.email;
                passwordEl.focus();
                loginLink.dispatchEvent(eventClick);
            }
        }
    },
    handleLogout: async function () {
        localStorage.removeItem("login_tokens");
        this.render();
    },
    addLoading: function (btnSubmit) {
        const btnTextOld = this.stripHtml(btnSubmit.textContent);
        btnSubmit.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-circle"></div>
                <div class="typing-circle"></div>
                <div class="typing-circle"></div>
                <div class="typing-shadow"></div>
                <div class="typing-shadow"></div>
                <div class="typing-shadow"></div>
            </div>
        `;
        btnSubmit.disabled = true;
        return btnTextOld;
    },
    removeLoading: function (btnSubmit, text) {
        btnSubmit.textContent = text;
        btnSubmit.disabled = false;
    },
    eventScroll: function (root) {
        window.addEventListener("scroll", async () => {
            const scrollHeight = document.documentElement.scrollHeight;
            const threshold = scrollHeight - 1500;
            if (window.scrollY > threshold && !isScroll) {
                isScroll = true;
                ++page;
                const blogs = await this.getBlogs({
                    page: page,
                });
                if (blogs) {
                    const container = root.querySelector(".container");
                    const htmlString = this.htmlText(blogs);
                    container.innerHTML += htmlString;
                    isScroll = false;
                }
            }
        });
    },
    eventBlogs: function () {
        const commentForm = document.querySelector("#comment-form");
        const titleEl = commentForm.querySelector("input[type='text']");
        const contentEl = commentForm.querySelector("textarea[type='text']");
        const msg = commentForm.querySelector(".msg");
        const btn = commentForm.querySelector("button[type='submit']");
        const dateInput = commentForm.querySelector("#postDateTime");

        commentForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const title = titleEl.value.trim();
            const content = contentEl.value.trim();
            if (title === "" || content === "") {
                msg.innerText = "Hãy nhập đầy đủ thông tin!";
            } else {
                this.handlePostBlog({ title, content }, msg, btn, dateInput.value);
            }
        });
    },
    eventFormCSS: function () {
        const loginSection = document.querySelector(".login-section");
        const loginSectionInner = loginSection.querySelector(
            ".login-section__inner"
        );
        const loginSectionInnerWidth = loginSectionInner.clientWidth / 2;
        loginSection.style.width = loginSectionInnerWidth + "px";
        this.formWidth = loginSectionInnerWidth;
    },
    eventLogin: function (loginSection) {
        const loginForm = document.querySelector("#login-form");
        const form = loginForm.querySelector("form");
        const msg = loginForm.querySelector(".msg");
        const btnSubmit = loginForm.querySelector(".btn");
        const emailEl = loginForm.querySelector("input[type='email']");
        const passwordEl = loginForm.querySelector("input[type='password']");

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = emailEl.value;
            const password = passwordEl.value;

            this.handleLogin({ email, password }, msg, btnSubmit);
        });

        const loginSectionInner = loginForm.parentElement;
        const registerLink = loginForm.querySelector(".register-link");
        registerLink.addEventListener("click", (e) => {
            e.preventDefault();
            msg.textContent = "";
            emailEl.value = "";
            passwordEl.value = "";
            loginSectionInner.style.transform = `translateX(-${this.formWidth}px)`;
        });

        const homeLink = loginForm.querySelector(".home-link");
        homeLink.addEventListener("click", (e) => {
            e.preventDefault();
            loginSection.style.transform = "translateX(0)";
        });
    },
    eventRegister: function () {
        const registerForm = document.querySelector("#register-form");
        const form = registerForm.querySelector("form");
        const msg = registerForm.querySelector(".msg");
        const btnSubmit = registerForm.querySelector(".btn");
        const nameEl = registerForm.querySelector("input[type='text']");
        const emailEl = registerForm.querySelector("input[type='email']");
        const passwordEl = registerForm.querySelector("input[type='password']");

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = nameEl.value.trim();
            const email = emailEl.value.trim();
            const password = passwordEl.value.trim();
            if (password.length < 8) {
                msg.textContent = "Mật khẩu phải nhiều hơn 8 ký tự";
            } else {
                this.handleRegister({ name, email, password }, msg, btnSubmit);
            }
        });

        const loginSectionInner = registerForm.parentElement;
        const loginLink = registerForm.querySelector(".login-link");
        loginLink.addEventListener("click", (e) => {
            e.preventDefault();
            nameEl.value = "";
            emailEl.value = "";
            passwordEl.value = "";
            msg.textContent = "";
            loginSectionInner.style.transform = `translateX(0px)`;
        });
    },
    eventLogout: function () {
        const logout = document.querySelector(".profile .logout");
        logout.addEventListener("click", (e) => {
            e.preventDefault();
            this.handleLogout();
        });
    },
};
window.addEventListener("load", async function () {
    app.render();
});
