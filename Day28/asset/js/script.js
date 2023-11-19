var playBtn = document.querySelector(".play-btn");
var progressBar = document.querySelector(".progress-bar");
var timePopup = progressBar.querySelector(".time-popup");
var progress = progressBar.querySelector(".progress");
var progressSpan = progress.querySelector("span");

var progressWidth = progressBar.clientWidth;
var progressSpanWidth = progressSpan.clientWidth;
var initialClientX = 0;
var initialOffsetX = 0;
var isDrag = false;
var current = 0;
var currentWidth;

var audio = new Audio("./asset/music/EmDauODay.mp3");
var durationEl = progressBar.nextElementSibling;
var currentTimeEl = progressBar.previousElementSibling;

var pauseIcon = `<i class='bx bx-pause-circle'></i>`;
var playIcon = `<i class='bx bx-play-circle'></i>`;
var timeUpdate = 0;

var isPlayingBeforeDrag = false;
var isAudioState = !audio.paused;

var offsetYKaraoke = 0;
var checkMouseKaraoke = false;
var checkValueKaraoke = "";
var saveValueOldKaraoke = 0;
var check = false;

var getTime = function (seconds) {
    var mins = Math.floor(seconds / 60);
    seconds = Math.floor(seconds - mins * 60);
    return `${mins < 10 ? "0" + mins : mins}:${
        seconds < 10 ? "0" + seconds : seconds
    }`;
};

var handleChange = function (width) {
    currentWidth = width;
    var value = (width * 100) / progressWidth;
    if (value < 0) {
        value = 0;
    } else if (value > 100) {
        value = 100;
    }
    progress.style.width = `${value}%`;
    timePopup.style.left = `${value}%`;
};

var handleUpdateTime = function (width) {
    var value = (width / progressWidth) * audio.duration;
    if (value < 0) {
        value = 0;
    } else if (value > audio.duration) {
        value = audio.duration;
    }
    audio.currentTime = value;
};

var handlePlayBtn = function () {
    if (audio.paused) {
        audio.play();
        playBtn.innerHTML = pauseIcon;
        isAudioState = !audio.paused;
    } else {
        audio.pause();
        playBtn.innerHTML = playIcon;
        isAudioState = !audio.paused;
    }
};

var handleDragKaraoke = function (e) {
    var offsetYDocument = e.clientY;
    var value = offsetYDocument - offsetYKaraoke - 10;
    karaoke.style.transition = `none`;
    checkValueKaraoke = false;
    if (value < 0) {
        value = 0;
    } else if (value > 0 && value < 250) {
        saveValueOldKaraoke = value;
        check = true;
    } else if (value >= 250) {
        check = false;
        value = 100;
        checkValueKaraoke = true;
        checkMouseKaraoke = false;
        karaoke.style.transition = `translate 0.4s`;
    }
    karaoke.style.translate = `0 ${checkValueKaraoke ? value + "vh" : value + "px"}`;
}

//<=========================================================>
var checkKeyAudio = false;
document.addEventListener("mouseup", function () {
    if (currentWidth !== undefined) {
        current = currentWidth;
    }
    timePopup.style.opacity = 0;
    if (isDrag) {
        handleUpdateTime(current);
        if (isPlayingBeforeDrag) {
            audio.play();
            playBtn.innerHTML = pauseIcon;
        }
    }
    isDrag = false;
    checkMouseKaraoke = false;
    karaoke.style.transition = `translate 0.4s`;
    if (check && !checkValueKaraoke && saveValueOldKaraoke < 250) {
        saveValueOldKaraoke = 0;
        karaoke.style.translate = `0 0`;
        check = false;
    }
});
document.addEventListener("mousemove", function (e) {
    if (isDrag) {
        var moveWidth = e.clientX - initialClientX;
        handleChange(current + moveWidth);
        timePopup.style.opacity = 1;
        var value = ((current + moveWidth) / progressWidth) * audio.duration;
        if (value < 0) {
            value = 0;
        } else if (value > audio.duration) {
            value = audio.duration;
        }
        timePopup.innerText = getTime(value);
    }
    if (checkMouseKaraoke) {
        handleDragKaraoke(e)
    }
});
document.addEventListener("keyup", function (e) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        if (isAudioState) {
            audio.play();
            playBtn.innerHTML = pauseIcon;
        }
    }
});
document.addEventListener("keydown", function (e) {
    if (audio.currentTime < 0) {
        audio.currentTime = 0;
    } else if (audio.currentTime >= audio.duration) {
        audio.currentTime = audio.duration;
    }
    if (e.key === "ArrowRight") {
        audio.currentTime += 5;
        if (isAudioState) {
            audio.pause();
            playBtn.innerHTML = playIcon;
        }
    } else if (e.key === "ArrowLeft") {
        audio.currentTime -= 5;
        if (isAudioState) {
            audio.pause();
            playBtn.innerHTML = playIcon;
        }
    } else if (e.code === "Space") {
        handlePlayBtn();
    }
});

//<=========================================================>

progressBar.addEventListener("mousedown", function (e) {
    if (e.which === 1) {
        handleChange(e.offsetX);
        initialClientX = e.clientX;
        isDrag = true;
        current = e.offsetX;
        handleUpdateTime(e.offsetX);
        timePopup.style.opacity = 1;
        if (audio.paused) {
            isPlayingBeforeDrag = false;
        } else {
            isPlayingBeforeDrag = true;
        }
        audio.pause();
        playBtn.innerHTML = playIcon;
    }
});

progressBar.addEventListener("mousemove", function (e) {
    timePopup.style.opacity = 1;
    initialOffsetX = e.offsetX;
    timePopup.style.left = `${initialOffsetX}px`;
    var value = (e.offsetX / progressWidth) * audio.duration;
    timePopup.innerText = getTime(value);
});
progressBar.addEventListener("mouseleave", function () {
    timePopup.style.opacity = 0;
});

//<=========================================================>

progressSpan.addEventListener("mousedown", function (e) {
    e.stopPropagation();
    isDrag = true;

    initialOffsetX =
        e.offsetX <= progressSpanWidth / 2
            ? Math.ceil(progressSpanWidth / 2 - e.offsetX)
            : Math.ceil(e.offsetX - progressSpanWidth / 2);
    if (e.offsetX <= progressSpanWidth / 2) {
        initialClientX = e.clientX + initialOffsetX;
    } else {
        initialClientX = e.clientX - initialOffsetX;
    }
    var moveWidth = e.clientX - initialClientX;
    handleChange(current + moveWidth);
    if (audio.paused) {
        isPlayingBeforeDrag = false;
    } else {
        isPlayingBeforeDrag = true;
    }
});

progressSpan.addEventListener("mousemove", function (e) {
    timePopup.style.opacity = 1;
    if (!isDrag) {
        timePopup.style.opacity = 0;
        e.stopPropagation();
    }
});

//<=========================================================>

audio.addEventListener("loadeddata", function () {
    durationEl.innerText = getTime(audio.duration);
});

audio.addEventListener("timeupdate", function () {
    timeUpdate = audio.currentTime;
    currentTimeEl.innerText = getTime(audio.currentTime);
    var value = (audio.currentTime * 100) / audio.duration;
    if (!isDrag) {
        progress.style.width = `${value}%`;
        current = Math.ceil((value * progressWidth) / 100);
    }
});

audio.addEventListener("ended", function () {
    if (isAudioState) {
        audio.pause();
        playBtn.innerHTML = playIcon;
        audio.currentTime = 0;
        isAudioState = !audio.paused;
    }
});

//<=========================================================>

playBtn.addEventListener("click", handlePlayBtn);

//<=========================================================>
// Phần yêu cầu buổi 28
//<=========================================================>

var openKaraoke = document.querySelector(".open-karaoke");
var openKaraokeBtn = openKaraoke.querySelector("button");
var karaoke = document.querySelector(".karaoke");
var karaokeInner = karaoke.querySelector(".karaoke-inner");
var karaokeHidden = karaoke.querySelector("span");

openKaraokeBtn.addEventListener("click", function () {
    karaoke.style.translate = "0 0";
});
karaokeHidden.addEventListener("click", function () {
    karaoke.style.translate = "0 100vh";
});

var currentPairIndex = 0;
var lyricSentences = lyric.data.sentences;
const lyricPairs = [];

for (let i = 0; i < lyricSentences.length - 1; i += 2) {
    var pair = {};
    if (
        lyricSentences[i + 1].words[0].startTime -
            lyricSentences[i].words[lyricSentences[i].words.length - 1]
                .endTime <=
        200
    ) {
        pair = {
            startTime: lyricSentences[i].words[0].startTime,
            endTime:
                lyricSentences[i + 1].words[
                    lyricSentences[i + 1].words.length - 1
                ].endTime,
            lyric: [
                [lyricSentences[i].words.map((word) => word.data).join(" ")],
                [
                    lyricSentences[i + 1].words
                        .map((word) => word.data)
                        .join(" "),
                ],
            ],
        };
    } else {
        pair = {
            startTime: lyricSentences[i].words[0].startTime,
            endTime:
                lyricSentences[i].words[lyricSentences[i].words.length - 1]
                    .endTime,
            lyric: [
                [lyricSentences[i].words.map((word) => word.data).join(" ")],
            ],
        };
        i--;
    }
    lyricPairs.push(pair);
}

if (lyricSentences.length - (1 % 2) !== 0) {
    var itemLast = {
        startTime: lyricSentences[lyricSentences.length - 1].words[0].startTime,
        endTime:
            lyricSentences[lyricSentences.length - 1].words[
                lyricSentences[lyricSentences.length - 1].words.length - 1
            ].endTime,
        lyric: [
            [
                lyricSentences[lyricSentences.length - 1].words
                    .map((word) => word.data)
                    .join(" "),
            ],
        ],
    };
    lyricPairs.push(itemLast);
}

audio.addEventListener("timeupdate", function () {
    var currentTimeMS = Math.floor(audio.currentTime * 1000);
    var html = "";
    lyricPairs.forEach((item, index) => {
        var startTime = item.startTime;
        var endTime = item.endTime;
        var lyric = item.lyric;
        if (
            currentTimeMS >= startTime - 500 &&
            currentTimeMS <= endTime + 3000
        ) {
            if (lyric.length > 1) {
                html = `${lyric[0].join()}</br>${lyric[1].join()}`;
            } else {
                html = `${lyric[0].join()}`;
            }
        }
    });
    if (!html) {
        html = `Em Đau Ở Đây </br> Ca sĩ: Thương Thương`;
    }
    karaokeInner.innerHTML = html;
});

// Phần không liên quan đến bài tập
karaoke.addEventListener("mousedown", function (e) {
    if (e.which === 1) {
        offsetYKaraoke = e.clientY;
        checkMouseKaraoke = true;
    }
});
karaoke.addEventListener("mouseup", function (e) {
    if (e.which === 1) {
        checkMouseKaraoke = false;
    }
});
