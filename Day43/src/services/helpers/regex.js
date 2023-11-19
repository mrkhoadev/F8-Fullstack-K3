export const emailRegex = (str) => {
    return /^(([^<>()[\]\.,;:\s@"]+(.[^<>()[\]\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/.test(
        str
    );
};
export const HtmlScript = (html) => {
    return html.replace(/(<([^>]+)>)/gi, "");
};