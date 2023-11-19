import { router } from "./Utils/router";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Product } from "./pages/Product";
import { ProductDetail } from "./pages/ProductDetail";
import { DefaultLayout } from "./Layout/Default";

export const App = () => {
    return router(
        [
            {
                path: "/",
                component: Home,
            },
            {
                path: "/gioi-thieu",
                component: About,
            },
            {
                path: "/san-pham",
                component: Product,
            },
            {
                path: "/san-pham/:id",
                component: ProductDetail,
            },
        ],
        DefaultLayout
    );
}