export const HtmlScript = (html) => {
    return html.replace(/(<([^>]+)>)/gi, "");
}