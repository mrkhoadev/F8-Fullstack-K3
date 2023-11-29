function isValidJSONString(str) {
    try {
        return JSON.parse(str).filter((arr) => arr);
    } catch (e) {
        localStorage.removeItem(key);
        return false;
    }
}
export default function isLocalStorageJSON(key) {
    const value = localStorage.getItem(key);

    if (value === null) {
        return false;
    }

    return isValidJSONString(value);
}