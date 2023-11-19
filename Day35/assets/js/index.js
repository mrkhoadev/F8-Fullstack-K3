import { client } from "./client.js";
import { config } from "./config.js";
const { PAGE_LIMIT } = config;

const footer = document.querySelector("footer")
const loadingHome = document.querySelector("#loading-home")
const loadingProduct = document.querySelector("#loading-product");
const footerHeight = footer.clientHeight

let isScroll = false
let page = 1;
let limit = 15;
let keyword = "";
let totalPages = 0

const getProduct = async (query = {}) => {
    const queryString = new URLSearchParams(query).toString();
    const { data: product, response } = await client.get(`/product?` + queryString);
    if (query.q !== undefined) {
        const listProduct = document.querySelector("#list-product");
        listProduct.innerHTML = ''
    }
    const totalPosts = response.headers.get("x-total-count");
    totalPages = Math.ceil(totalPosts / PAGE_LIMIT);
    render(product);
    return response.ok
}

const render = (product) => {
    const scriptHTML = (html) => {
        return html.replace(/(<([^>]+)>)/gi,"")
    }
    const listProduct = document.querySelector("#list-product");
    let productHtml = product
        .map(({ image, title, priceOld, priceNew, saled, origin }) => {
            const oldPrice = parseFloat(
                priceOld.replace("đ", "").replace(",", "")
            );
            const newPrice = parseFloat(
                priceNew.replace("đ", "").replace(",", "")
            );

            // Tính giảm giá
            const saleOff = Math.round(
                ((oldPrice - newPrice) / oldPrice) * 100
            );
            return `
            <div class="col l-2-4 m-3 c-6 home-product-item">
                <a class="home-product-item-link" href="#">
                    <div class="home-product-item__img"
                        style="background-image: url(${scriptHTML(image)});"></div>
                    <div class="home-product-item__info">
                        <h4 class="home-product-item__name">${scriptHTML(
                            title
                        )}</h4>
                        <div class="home-product-item__price">
                            <p class="home-product-item__price-old">${scriptHTML(
                                priceOld
                            )}</p>
                            <p class="home-product-item__price-new">${scriptHTML(
                                priceNew
                            )}</p>
                            <i class="home-product-item__ship fas fa-shipping-fast"></i>
                        </div>
                        <div class="home-product-item__footer">
                            <div class="home-product-item__save">
                                <input type="checkbox" name="save-check" id="heart-save">
                                <label for="heart-save" class="far fa-heart"></label>
                            </div>
                            <div class="home-product-item__rating-star">
                                <i class="star-checked far fa-star"></i>
                                <i class="star-checked far fa-star"></i>
                                <i class="star-checked far fa-star"></i>
                                <i class="star-checked far fa-star"></i>
                                <i class="star-checked far fa-star"></i>
                            </div>
                            <div class="home-product-item__saled">Đã bán ${scriptHTML(
                                saled
                            )}</div>
                        </div>
                        <div class="home-product-item__origin">${scriptHTML(
                            origin
                        )}</div>
                        <div class="home-product-item__favourite">
                            Yêu thích
                        </div>
                        <div class="home-product-item__sale-off">
                            <div class="home-product-item__sale-off-value">${saleOff}%</div>
                            <div class="home-product-item__sale-off-label">GIẢM</div>
                        </div>
                    </div>
                    <div class="home-product-item-footer">Tìm sản phẩm tương tự</div>
                </a>
            </div>
        `;
        })
        .join("");
    
    listProduct.innerHTML += productHtml;
}

window.addEventListener("scroll", async function () {
    const scrollHeight = document.documentElement.scrollHeight;
    const threshold = scrollHeight - (footerHeight + 500);
    if (window.scrollY > threshold && !isScroll) {
        isScroll = true
        
        loadingProduct.classList.add("active");
        if (page < totalPages) {
            ++page;
        } else {
            page = 1;
        } 
        const product = await getProduct({
            _page: page,
        });
        if (product) {
            window.scrollTo(0, threshold);
            loadingProduct.classList.remove("active");
            isScroll = false;
        } 
    }
});
window.addEventListener("beforeunload", function () {
    window.scrollTo(0, 0);
});

document.addEventListener("DOMContentLoaded", function () {
    loadingHome.classList.add("active");
});
window.addEventListener("load", async function () {
    await getProduct({
        _page: page,
        _limit: limit
    });
    loadingHome.classList.remove("active");
});
const searchHeader = document.querySelector("#header-search")
const searchForm = searchHeader.querySelector("form");
const searchInput = searchForm.querySelector("input");
searchForm.addEventListener("submit", function (e) {
    e.preventDefault()
    keyword = searchInput.value.trim();
    getProduct({
        q: keyword,
    });
    searchInput.value = "";
})

