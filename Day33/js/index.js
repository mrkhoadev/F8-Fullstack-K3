import {
    handleDataResults,
    mapKeywords,
    musicKeywords,
    videoKeywords,
    handleKeywordSearch,
} from "./modules/data.js";

//khai báo các object (đối tượng) để sử dụng
var SpeechRecognition = SpeechRecognition || window.webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList;
var SpeechRecognitionEvent =
    SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

// Tạo một thể hiện mới của SpeechRecognition
const voiceSearchRecognition = new SpeechRecognition();
const activationRecognition = new SpeechRecognition();

// Đặt một số thuộc tính cho việc nhận diện
const setupVoiceSearchRecognition = function (
    recognition,
    continuous,
    lang,
    interimResults
) {
    recognition.continuous = continuous; //(true -> cho phép thu âm liên tục, false -> dừng thu âm ngay khi có dữ liệu)
    recognition.lang = lang; // Sử dụng thu âm
    recognition.interimResults = interimResults; // (true -> kiểm tra kết quả liên tục, false -> kiểm tra kết quả sau 1 khoảng thời gian)
    recognition.maxAlternatives = 1;
};
setupVoiceSearchRecognition(voiceSearchRecognition, true, "vi-VN", true);
setupVoiceSearchRecognition(
    activationRecognition,
    false,
    "vi-VN",
    false
);

const micBtn = document.querySelector(".mic");
const outputHTML = document.querySelector(".text");
const loading = document.querySelector(".pl");
const activeMicBtn = "mở tìm kiếm";
let isActivated = false;

const handleActiveMic = function () {
    micBtn.classList.add("active");
    loading.classList.add("active");
    isActivated = true;
    voiceSearchRecognition.stop();
};

const handleEndOfSearch = function () {
    micBtn.classList.remove("active");
    loading.classList.remove("active");
};
// Xử lý sự kiện kết quả để "kích hoạt" tìm kiếm bằng giọng nói
voiceSearchRecognition.onresult = (event) => {
    const lastResult = event.results[event.results.length - 1];
    const recognizedText = lastResult[0].transcript
        .toLowerCase()
        .replaceAll(/[.,?]/g, "")
        .trim();

    if (recognizedText.includes(activeMicBtn)) {
        handleActiveMic();
    }
};

voiceSearchRecognition.start();

// Xử lý khi kết thúc lắng nghe
const handleOnendVoiceSearch = () => {
    return new Promise((resolve) => {
        if (!isActivated) {
            handleEndOfSearch();
            voiceSearchRecognition.start();
        } else {
            activationRecognition.start();
            resolve();
        }
    });
};
voiceSearchRecognition.onend = function () {
    // Bắt đầu lắng nghe lại sau một khoảng thời gian
    (async () => await handleOnendVoiceSearch())();
};

voiceSearchRecognition.onerror = function (event) {
    // Bắt đầu lắng nghe lại sau một khoảng thời gian
    if (event.error !== "no-speech") {
        outputHTML.innerHTML = `<span style="color: red;">Đã xảy ra lỗi không mong muốn "${event.error}"</span>`;
    } 
    isActivated = false;
};

activationRecognition.onstart = (event) => {
    outputHTML.innerHTML =
        "Hãy nói theo cách của bạn, còn có ra kết quả không là việc của tôi 👌";
};

// Xử lý sự kiện kết quả để tìm kiếm bằng giọng nói
const getStatus = (recognizedText, textSearch) => {
    return new Promise((resolve) => {
        const request = handleDataResults(recognizedText).request
        const links = handleDataResults(recognizedText).links;
        if (request !== "" || links !== "") {
            let result = "";
            let check = true
            if (handleKeywordSearch(recognizedText, mapKeywords)) {
                result = `Đang mở địa điểm`;
            } else if (handleKeywordSearch(recognizedText, musicKeywords)) {
                result = `Đang mở bài hát`;
            } else if (handleKeywordSearch(recognizedText, videoKeywords)) {
                result = `Đang mở video`;
            } else {
                check = false
                outputHTML.innerHTML = `<span style="color: green;">Đang mở ${recognizedText}</span>`;
            }
            if (check) {
                outputHTML.innerHTML = `<span style="color: green;">${result} ${request}</span>`;
            } else {
                if (recognizedText.includes("mở")) {
                    outputHTML.innerHTML = `<span style="color: green;">Đang ${recognizedText}</span>`;
                } else {
                    outputHTML.innerHTML = `<span style="color: green;">Đang mở ${recognizedText}</span>`;
                }
            }
            micBtn.classList.remove("active");
            setTimeout(() => {
                window.open(links, "_blank");
                resolve();
            }, 3000);
            isActivated = false;
        } else {
            outputHTML.innerHTML = `<span style="color: blue;">Không thể tìm thấy "${textSearch}", hãy thử lại!</span>`;
            resolve();
        }
    });
};
activationRecognition.onresult = (event) => {
    if (isActivated) {
        const lastResult = event.results[event.results.length - 1];
        const recognizedText = lastResult[0].transcript
            .toLowerCase()
            .replaceAll(/[.,?]/g, "")
            .trim();
        
        let textSearch = event.results[0][0].transcript
        let firstChar = textSearch.charAt(0).toUpperCase();
        textSearch = firstChar + textSearch.slice(1).replace(/[.,?]/g, "");
        (async () => {
            await getStatus(recognizedText, textSearch);
            isActivated = false;
            handleEndOfSearch();
        })();
    }
};
const handleOnSpeechendActivationRecognition = () => {
    return new Promise((resolve) => {
        if (isActivated) {
            handleEndOfSearch();
        }
        voiceSearchRecognition.start();
        resolve();
    });
};
activationRecognition.onspeechend = () => {
    // Xử lý khi dừng thu âm
    (async () => await handleOnSpeechendActivationRecognition())();
};
activationRecognition.onend = () => {
    isActivated = false
}

micBtn.addEventListener("click", function () {
    handleActiveMic();
});

document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
        outputHTML.innerHTML =
            'Hãy nói "Mở tìm kiếm" hoặc bấm vô cái mic ở trên để tiếp tục 👌';
    }
});

// Xử lý lỗi nếu có
activationRecognition.onerror = function (event) {
    if (event.error === "no-speech") {
        outputHTML.innerHTML = `<span style="color: blue;">Nói gì đi chứ???</span>`;
        activationRecognition.stop()
    } else {
        outputHTML.innerHTML = `<span style="color: red;">Đã xảy ra lỗi không mong muốn "${event.error}"</span>`;
    }
    isActivated = false;
    handleEndOfSearch();
    setTimeout(() => {
        outputHTML.innerHTML =
            'Hãy nói "Mở tìm kiếm" hoặc bấm vô cái mic ở trên để tiếp tục 👌';
    }, 5000);
};

console.log("Lưu ý: ");
console.log("Chỉ có thể hoạt động tốt ở chrome và cốc cốc và edge!");
console.log("Kiểm tra xem có bật trang web nào sử dụng mic không, có thì tắt nó đi thì trang này mới chạy được :v");
