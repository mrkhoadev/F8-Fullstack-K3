class CustomElements extends HTMLElement {
    constructor(template, data) {//1
        super();
        this.computedHTML = template;
        this.state = data;
        this.nodeTexts = [];
        this.templateNode = document.createElement("template");
    }
    /**
     * Xử lý việc render lại component.
     * @param {string} code - Mã code
     */
    handleReRender(code) {//7
        // Lặp qua this.state, lấy các key đã thay đổi dựa theo "code"
        Object.keys(this.state).forEach((key) => {
            // cộng chuỗi để thành key của nodeTexts với key giống của nodeTexts
            const elementState = ("element-" + key); 
            // Nếu có một key giống với elementState => key của nodeTexts cần thay đổi
            if (elementState.startsWith("element-" + key)) {
                // Xử lý chuỗi để cắt ra key của nodeTexts cần thiết
                this.nodeTexts[elementState]?.forEach((element) => {
                    element.textContent = this.state[key];
                });
                
            }
        });
    }
    /**
     * Xử lý sự kiện thay đổi.
     * @param {HTMLElement} element - Phần tử HTML
     * @param {string} event - Tên sự kiện
     * @param {string} code - Mã code
     */
    handleChange(element, event, code) {//6
        //   lấy ra các đoạn code cắt theo dấy ';' để lấy được nhiều đoạn code
        const codes = [code];
        // Element, gán sự kiện
        element.addEventListener(event, () => {
            codes.forEach((code) => {
                code = code.trim();
                // Nối chuỗi với this.state để cập nhật lại state
                const newCode = `this.state.${code}`
                // sử dụng hàm eval để chạy đoạn code bằng String
                eval(newCode);
                // Xử lý việc render lại component bằng đoạn code viết trong giá trị attr
                this.handleReRender(code);
            });
        });
    }
    /**
     * Thêm sự kiện cho các phần tử con.
     */
    addElementEvent() {//5
        // Lấy tất cả phần tử con
        Array.from(this.templateNode.children).forEach((child) => {
            // Lặp qua tất cả element, tìm thuộc tính
            [...child.attributes].forEach((attribute) => {
                // Tìm xem phần tử con nào có thuộc tính bắt đầu bằng "v-on"
                if (attribute.name.startsWith("v-on")) {
                    // Sử dụng regex cắt ra các phần cần thiết
                    // [0]: Toàn bộ định dạng, [1]: event, [2]: value(code)
                    const regex = /v-on:(\w+)="(\w+.*?)"/;
                    // Định dạng bên HTML
                    const nodeAttr = child.outerHTML;
                    const match = nodeAttr.match(regex);
                    if (match) {
                        const event = match[1];
                        const action = match[2];
                        // Gọi hàm this.handleChange để thêm các sự kiện change
                        this.handleChange(child, event, action);
                    }
                }
            });
        });
    }
    /**
     * Khởi tạo giá trị ban đầu.
     * @param {string} value - Giá trị
     */
    initialGetValue(value) {//4
        // regex để lấy ra state key
        const regex = new RegExp(`{{\\s*${value}\\s*\\}}`, "gi");
        const match = this.computedHTML.match(regex);
        // Lặp qua các mẫu tìm thấy
        match?.forEach((cutRegex) => {
            Array.from(this.templateNode.children).forEach((child) => {
                if (child.innerHTML.includes(cutRegex)) {
                    // Tách các phần từ HTML theo regex
                    const parts = child.innerHTML.split(cutRegex);
                    const fragment = document.createDocumentFragment();
                    // Lặp qua các phần tử đã tách
                    parts.forEach((text, index) => {
                        fragment.appendChild(document.createTextNode(text));
                        if (index < parts.length - 1) {
                            // Tạo nút text và thêm vào fragment với giá trị là key của state
                            const variableNode = document.createTextNode(
                                this.state[value]
                            );
                            // Cập nhật trạng thái, ghi các nodeText vào this.nodeTexts để xử lý re-render
                            if (!this.nodeTexts["element-" + value]) {
                                this.nodeTexts["element-" + value] = [variableNode];
                            } else {
                                this.nodeTexts["element-" + value].push(variableNode);
                            }
                            fragment.append(variableNode);
                        }
                    });
                    // Xóa nội dung ban đầu của child và thêm fragment vào
                    child.innerHTML = "";
                    child.appendChild(fragment);
                }
            });
        });
    }
    /**
     * Được gọi khi component được kết nối vào DOM.
     */
    connectedCallback() {//2
        // Xử lý innerHTML vào thẻ template
        this.templateNode.innerHTML = this.computedHTML;
        // Clone template, đưa lại vào templateNode để sử dụng
        this.templateNode = this.templateNode.content.cloneNode(true);
        // Xử lý lại templateNode để thay thế định dạng {{variable}}
        Object.keys(this.state).forEach((key) => this.initialGetValue(key));
        // Gọi hàm render để hiển thị
        this.render();
    }
    /**
     * Render component.
     */
    render() {//3
        // Xử lý các element của templateNode, thêm sự kiện
        this.addElementEvent();
        // append vào customElement 
        this.appendChild(this.templateNode);
    }
}
class F8 {
    static component(nameEl, { ...args }) {
        if (args.hasOwnProperty("template")) {
            customElements.define(nameEl,
                class extends CustomElements {
                    constructor() {
                        super(args.template, args.data ? args.data() : "");
                    }
                }
            )
        }
    }
}