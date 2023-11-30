function isValidJSONString(str) {
    try {
        JSON.parse(str)
    } catch (e) {
        localStorage.removeItem(key);
        return false;
    }
    return JSON.parse(str)?.filter((arr) => arr);
}
export default function isLocalStorageJSON(key) {
    const value = localStorage.getItem(key);
    if (!value) {
        localStorage.removeItem(key);
        return false;
    }
    return isValidJSONString(value);
}