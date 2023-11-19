var progressBar = document.querySelector(".progress-bar")
var progress = progressBar.querySelector(".progress")
var timePopup = progressBar.querySelector(".time-popup");
var progressSpan = progress.querySelector("span")

var progressWidth = progressBar.clientWidth
var progressSpanWidth = progressSpan.clientWidth;
var initialClientX = 0;
var initialOffsetX = 0;
var isDrag = false;
var current = 0;
var currentWidth;

var audio = new Audio("./asset/music/EmDauODay.mp3")
var playBtn = document.querySelector(".play-btn")
var durationEl = progressBar.nextElementSibling;

var pauseIcon = `<i class='bx bx-pause-circle'></i>`;
var playIcon = `<i class='bx bx-play-circle'></i>`;
var timeUpdate = 0;

var currentTimeEl = progressBar.previousElementSibling;

//<=========================================================>
var handleChange = function (width) {
    currentWidth = width;
    var value = (width * 100) / progressWidth;
    if (value < 0) {
        value = 0
    } else if (value > 100) {
        value = 100
    }
    progress.style.width = `${value}%`
    timePopup.style.left = `${value}%`;
}
var handleUpdateTime = function (width) {
    var value = (width / progressWidth) * audio.duration;
    if (value < 0) {
        value = 0;
    } else if (value > audio.duration) {
        value = audio.duration;
    }
    audio.currentTime = value;
};

var getTime = function (seconds) {
    var mins = Math.floor(seconds / 60);
    seconds = Math.floor(seconds - mins * 60);
    return `${mins < 10 ? "0" + mins : mins}:${seconds < 10 ? "0" + seconds : seconds}`
}

var handlePlayBtn = function () {
    if (audio.paused) {
        audio.play();
        playBtn.innerHTML = pauseIcon;
        audio.currentTime = timeUpdate;
        isAudioState = !audio.paused;
    } else {
        audio.pause();
        playBtn.innerHTML = playIcon;
        audio.currentTime = timeUpdate;
        isAudioState = !audio.paused;
    }
}

//<=========================================================>
var isPlayingBeforeDrag = false
var isAudioState = !audio.paused
progressBar.addEventListener("mousedown", function (e) {
    if (e.which === 1) {
        handleChange(e.offsetX);
        initialClientX = e.clientX;
        isDrag = true;
        current = e.offsetX;
        handleUpdateTime(e.offsetX);
        timePopup.style.opacity = 1
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
    initialOffsetX = e.offsetX
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
var checkKeyAudio = false
document.addEventListener("mouseup", function () {
    if (currentWidth !== undefined) {
        current = currentWidth
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
})
document.addEventListener("keyup", function (e) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        if (isAudioState) {
            audio.play();
            playBtn.innerHTML = pauseIcon;
        }
    }
})
document.addEventListener("keydown", function (e) {
    if (audio.currentTime < 0) {
        audio.currentTime = 0
    } else if (audio.currentTime >= audio.duration) {
        audio.currentTime = audio.duration;
    }
    if (e.key === "ArrowRight") {
        audio.currentTime += 5
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
        handlePlayBtn()
    }
});

//phần audio
//<=========================================================>
audio.addEventListener("loadeddata", function () {
    durationEl.innerText = getTime(audio.duration);
});

audio.addEventListener("timeupdate", function () {
    timeUpdate = audio.currentTime;
    currentTimeEl.innerText = getTime(audio.currentTime)
    var value = (audio.currentTime * 100) / audio.duration;
    if (!isDrag) {
        progress.style.width = `${value}%`;
        current = Math.ceil((value * progressWidth) / 100)
    } 
})

audio.addEventListener("ended", function () {
    if (isAudioState) {
        audio.pause();
        playBtn.innerHTML = playIcon;
        audio.currentTime = 0;
        isAudioState = !audio.paused
    }
});

//<=========================================================>
playBtn.addEventListener("click", handlePlayBtn);