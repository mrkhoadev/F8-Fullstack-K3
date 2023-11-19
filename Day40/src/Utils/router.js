import Navigo from "navigo";
import { Error } from "../Error";
const rootPath =
    process.env.NODE_ENV === "development"
        ? "/"
        : "/F8-Fullstack-K3/Day40/build";
export const router = (objLink, layout) => {
    const appDiv = document.querySelector("#app");
    if (layout) {
        appDiv.innerHTML = layout();
    }
    
    const routers = new Navigo(rootPath, { linksSelector: "a" }, true);
    routers.notFound(() => {
        app.innerHTML = Error();
    });
    objLink.forEach((route) => {
        routers.on(route.path, async (match) => {
            appDiv.innerHTML = layout(route.component(match.data));
        });
    });
    routers.resolve();
    const navigate = (link) => {
        routers.navigate(link);
    };
    window.navigate = navigate;
}