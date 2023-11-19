const mapKeywords = ["chỉ đường", "chỉ đường tới", "tới", "đường tới"];
const musicKeywords = [
    "tìm nhạc",
    "mở nhạc",
    "nghe nhạc",
    "tìm bản nhạc",
    "bài hát",
    "mở bài hát",
    "nghe bài hát",
];
const videoKeywords = ["video", "mở video", "xem video", "tìm video"];

const handleKeywordSearch = function (text, keywords) {
    for (const keyword of keywords) {
        if (text.includes(keyword)) {
            return true
        }
    }
    return false
};

const handleChangeKeyword = function (text, keywords) {
    for (const keyword of keywords) {
        const regex = new RegExp(`.*${keyword}\\s*(.*)`);
        const match = text.match(regex);

        if (match && match.length > 1) {
            text = match[1].trim(); // Cập nhật văn bản sau keyword
        }
    }
    return text;
};


const handleDataResults = function (recognizedText) {
    let link = '';
    let result = "";
    switch (recognizedText) {
        case "mở google":
        case "google":
            link = `https://www.google.com/`;
            break;
        case "mở facebook":
        case "facebook":
            link = `https://www.facebook.com/`;
            break;
        case "mở youtube":
        case "youtube":
            link = `https://www.youtube.com/`;
            break;
        case "mở google drive":
        case "google drive":
            link = `https://drive.google.com/`;
            break;
        case "mở google maps":
        case "google maps":
            link = `https://www.google.com/maps`;
            break;
        default:
            const checkAccess = (text) => {
                if (handleKeywordSearch(text, mapKeywords)) {
                        result = handleChangeKeyword(
                        recognizedText,
                        mapKeywords
                    );
                    if (result !== "") {
                        link = `https://www.google.com/maps/place/${result}`;
                    } else {
                        link = "";
                    }
                } else if (handleKeywordSearch(text, musicKeywords)) {
                        result = handleChangeKeyword(
                        recognizedText,
                        musicKeywords
                    );
                    if (result !== "") {
                        link = `https://zingmp3.vn/tim-kiem/tat-ca?q=${result}`;
                    } else {
                        link = "";
                    }
                } else if (handleKeywordSearch(text, videoKeywords)) {
                        result = handleChangeKeyword(
                        recognizedText,
                        videoKeywords
                    );
                    if (result !== "") {
                        link = `https://www.youtube.com/results?search_query=${result}`;
                    } else {
                        link = "";
                    }
                } else {
                    link = "";
                }
            };
            checkAccess(recognizedText);
            break;
    }
    return {links: link, request: result};
};

export {
    handleDataResults,
    mapKeywords,
    musicKeywords,
    videoKeywords,
    handleKeywordSearch,
};
