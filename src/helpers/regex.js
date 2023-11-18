export const HtmlScript = (html) => {
    return html.replace(/(<([^>]+)>)/gi, "");
};
export const numberRegex = (value) => {
    return value.replace(/[^0-9]/gi, "");
};
export function removeAccents(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-").toLowerCase();
}