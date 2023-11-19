import { client } from "./client.js";
import { config } from "./config.js";
const { PAGE_LIMIT } = config;

const audioTrue = new Audio("./assets/audio/dung.mp3");
const audioFalse = new Audio("./assets/audio/sai.mp3");
const countdownTime = 10;

let isCounting = false;
let countdownStartTime,
    countdownEndTime,
    countdownAnimation,
    remainingTime,
    remainingTimeShow,
    correctIndexes;

let totalQuestion = 0,
    correctAnswerCount = 0,
    bonusPoints = 0,
    totalPoints = 0,
    correctAnswers = 0, // Số câu trả lời đúng
    wrongAnswers = 0; // Số câu trả lời sai

let Streak = 0;//Không reset


//xử lý đếm ngược
const countdownFrame = function (timestamp) {
    const questionTime = document.querySelector(".quizGame-top__timer-total");
    const questionTimeProgress = questionTime?.querySelector(
        ".quizGame-top__timer-progress"
    );
    const currentTime = timestamp / 1000;
    remainingTime = countdownEndTime - currentTime;
    remainingTimeShow = (remainingTime * 100) / countdownTime;
    if (remainingTime <= 0) {
        remainingTime = 0;
        remainingTimeShow = 0;
        onCountdownEnd();
    } else {
        if (parseInt(currentTime) === parseInt(countdownStartTime)) {
            countdownStartTime += 1;
        }
        let color = "green";
        if (remainingTimeShow < 100 / 4) {
            color = "red";
        } else if (remainingTimeShow < (100 / 4) * 2) {
            color = "#db5b24";
        } else if (remainingTimeShow < (100 / 4) * 3) {
            color = "yellow";
        }
        questionTimeProgress.style.background = color;
        questionTimeProgress.style.width = `${remainingTimeShow}%`;
        if (isCounting) {
            countdownAnimation = requestAnimationFrame(countdownFrame);
        } 
    }
};
//xử lý khi hết thời gian
const onCountdownEnd = function () {
    rerender();
};
//Gọi hàm tính thời gian
const startCountdown = function (seconds) {
    isCounting = true;
    countdownStartTime = performance.now() / 1000;
    countdownEndTime = countdownStartTime + seconds;
    countdownAnimation = requestAnimationFrame(countdownFrame);
};

const getQuestion = async function (query = {}) {
    const queryString = new URLSearchParams(query).toString();
    const { data: question, response } = await client.get(
        `/quizGame?` + queryString
    );
    totalQuestion = response.headers.get("x-total-count");
    return { isQuestion: response.ok, data: question[0] };
};

const container = document.querySelector(".container");
let countTimeStart,
    page;

const handleStartBtn = async function () {
    countTimeStart = 3,
        page = 1;
    const questions = await getQuestion({
        _page: page,
        _limit: PAGE_LIMIT,
    });
    if (!questions.isQuestion)
        return alertify.error("Lỗi: Không thể lấy được dữ liệu từ máy chủ!");
    const quizGameStart = document.querySelector(".quizGame-start");
    const startBtn = document.querySelector("#start-btn");
    startBtn.addEventListener("click", async function () {console.log(1);
        quizGameStart.innerHTML = `
            <div class="quizGame-start__timer"><p>${countTimeStart}</p></div>
        `;
        const startTime = document.querySelector(".quizGame-start__timer p");
        await new Promise((resolve) => setTimeout(resolve, 10));

        startTime.style.transition = "transform .4s";
        startTime.style.transform = "scale(3)";
        countTimeStart--;

        const countdown = setInterval(() => {
            startTime.textContent = countTimeStart;
            if (countTimeStart === 0) {
                startTime.textContent = "GO!";
                clearInterval(countdown);
                setTimeout(async () => {
                    renderQuizGame(questions);
                }, 1000);
            } else {
                --countTimeStart;
            }
        }, 1000);
    });
} 
handleStartBtn()

const renderQuizGame = async function (questions) {
    const answers = questions.data.answers;
    shuffleArray(answers);
    correctIndexes = answers
        .map((text, index) => {
            if (text.correct === true) {
                return index;
            }
        })
        .filter((index) => index !== undefined);

    container.innerHTML = `
        <div id="quizGame">
            <div class="row">
                <div class="col-12 quizGame-top">
                    <div class="quizGame-top__inner">
                        <div class="quizGame-top__timer">
                            <div class="quizGame-top__timer-total">
                                <div class="quizGame-top__timer-progress"></div>
                            </div>
                        </div>
                        <div class="quizGame-top__box">
                            <div class="quizGame-top__inner-left">
                                <div class="quizGame-top__step">
                                    <span id="current">1</span><span id="total">/${totalQuestion}</span>
                                </div>
                                <div class="quizGame-streak">
                                    <p>Streak</p>
                                    <div class="quizGame-streak__status"></div>
                                </div>
                                <span></span>
                            </div>
                            <div class="quizGame-top__inner-right">
                                <div class="quizGame-top__score">Điểm: 0</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 quizGame-main">
                    <div class="row">
                        <div class="col-12">
                            <div class="quizGame-question">
                                <h3 class="question-text">${
                                    questions.data.question
                                }</h3>
                                <h4 class="question-note"><em>${
                                    correctIndexes.length >= 2
                                        ? `Chọn ${correctIndexes.length} đáp án`
                                        : ""
                                }</em></h4>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="quizGame-answers">
                                <div class="row">
                                    ${answers
                                        .map(
                                            (text, index) => `
                                            <div class="col-3">
                                                <div class="quizGame-answers__text" data-id="${index}">
                                                    ${text.answer}
                                                </div>
                                            </div>`
                                        )
                                        .join("")}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 quizGame-result"></div>
            </div>
        </div>
    `;

    await new Promise((resolve) => setTimeout(resolve, 10));
    const quizGame = document.querySelector("#quizGame");
    quizGame.style.transform = "translateY(0)";
    await new Promise((resolve) => setTimeout(resolve, 10));
    startCountdown(countdownTime);
    handleAnswersBtn(answers);
};


const rerender = async function () {
    ++page;
    if (page > totalQuestion) {
        renderStat()
        return 0;
    }
    const questions = await getQuestion({
        _page: page,
        _limit: PAGE_LIMIT,
    });
    if (!questions.isQuestion)
        return alertify.error("Lỗi: Không thể lấy được dữ liệu từ máy chủ!");
    const answers = questions.data.answers;
    shuffleArray(answers);

    correctIndexes = answers
        .map((text, index) => {
            if (text.correct === true) {
                return index;
            }
        })
        .filter((index) => index !== undefined);
    
    document.querySelector("#current").textContent = page;
    document.querySelector(".question-text").textContent = questions.data.question;
    document.querySelector(".question-note").textContent =
        correctIndexes.length >= 2
            ? `Chọn ${correctIndexes.length} đáp án`
            : "";
    
    const quizGameAnswers = document.querySelector(".quizGame-answers .row");
    quizGameAnswers.innerHTML = answers.map((text, index) => `
        <div class="col-3">
            <div class="quizGame-answers__text" data-id="${index}">
                ${text.answer}
            </div>
        </div>`).join("");
    
    handleAnswersBtn(answers);
    startCountdown(countdownTime);
}

const handleAnswersBtn = function (answers) {
    const answersBtn = document.querySelectorAll(".quizGame-answers__text");
    const quizGameStreak = document.querySelector(".quizGame-streak");
    const quizGameStreakText = quizGameStreak.querySelector(".quizGame-streak p");
    const quizGameStreakStatus = quizGameStreak.querySelector(
        ".quizGame-streak__status"
    );
    const quizGameScore = document.querySelector(".quizGame-top__score");
    const quizGameResult = document.querySelector(".quizGame-result");
    let prevElement, background2 = 'green';
    let correctIndexLen = correctIndexes.length;
    let isPrevBtn = true, isCurrentBtn = true


    answersBtn.forEach((element) => {
        element.addEventListener("click", function (e) {
            if (isCounting) {
                const isCorrect = element.getAttribute("data-id");
                let background, color;
                    
                if (correctIndexLen > 1) {
                    prevElement = e.target;
                    isPrevBtn = answers[isCorrect].correct;
                    if (!isPrevBtn) {
                        background2 = "red";
                    }
                    e.target.style.pointerEvents = "none";
                } else {
                    isCurrentBtn = answers[isCorrect].correct;
                    if (isCurrentBtn) {
                        background = "green";
                    } else {
                        background = "red";
                        answersBtn[correctIndexes[0]].style.background =
                            "green";
                        answersBtn[correctIndexes[0]].style.color = "#fff";
                    }
                }
                correctIndexLen--;
                
                this.style.background = "#feef6e";
                this.style.color = "#08733b";
                
                if (correctIndexLen === 0) {
                    if (isPrevBtn && isCurrentBtn) {
                        correctAnswerCount =
                            correctAnswerCount < 3 ? ++correctAnswerCount : 3;
                        quizGameResult.style.background = 'green';
                        color = "#08733b";
                        quizGameResult.textContent = "Trả lời đúng: + 1 cốc!";
                        ++correctAnswers;

                        //tổng điểm số
                        totalPoints += remainingTimeShow * 10 + bonusPoints;
                        totalPoints = parseInt(totalPoints);
                        quizGameScore.textContent = `Điểm: ${totalPoints}`;
                        audioTrue.play(); 
                    } else {
                        correctAnswerCount = 0;
                        color = "#feef6e";
                        quizGameResult.textContent = "Trả lời sai: phạt 1 cốc!";
                        quizGameResult.style.background = "red";
                        ++wrongAnswers;
                        audioFalse.play(); 
                    }
                    if (prevElement !== undefined) {
                        prevElement.style.background = background2;
                        prevElement.style.color = "#fff";

                        correctIndexes.forEach((i) => {
                            answersBtn[i].style.background = "green";
                            answersBtn[i].style.color = "#fff";
                        });
                    } 

                    //Tô màu thanh Streak nếu trả lời đúng >= 1
                    const value = (100 / 3) * correctAnswerCount;
                    quizGameStreakStatus.style.width = `${value}%`;
                    quizGameStreakText.style.color = color;

                    //Hiển thị điểm thưởng
                    bonusPoints = 100 * correctAnswerCount;
                    quizGameStreak.nextElementSibling.textContent =
                        bonusPoints === 0 ? "" : `+ ${bonusPoints}`;
                    
                    //hiển thị màu của button đúng hay sai
                    this.style.background = background;
                    this.style.color = "#fff";
                    isCounting = false;

                    setTimeout(() => {
                        quizGameResult.textContent = "";
                        quizGameResult.style.background = "";
                        rerender();
                    }, 3000);
                }
            }
        });
    });
};

const shuffleArray = function (array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

const renderStat = () => {
    container.innerHTML = `
        <div class="quizGame-stat">
            <div class="quizGame-stat__inner">
                <h3>Kết quả</h3>
                <div class="quizGame-stat__accuracy">
                    <p>Tỷ lệ chính xác</p>
                    <div class="quizGame-stat__accuracy--total">
                        <div class="quizGame-stat__accuracy--progress">
                            <span>0%</span>
                        </div>
                    </div>
                </div> 
                <div class="quizGame-stat__accuracy--performance">
                    <div class="row">
                        <div class="col-6">
                            <div class="quizGame-stat__accuracy--performance-item">
                                <p class="number">${totalPoints}</p>
                                <p class="stat">Điểm</p>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="quizGame-stat__accuracy--performance-item">
                                <p class="number">${
                                    correctAnswers === totalQuestion
                                        ? ++Streak
                                        : Streak
                                }</p>
                                <p class="stat">Win</p>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="quizGame-stat__accuracy--performance-item">
                                <p class="number">${wrongAnswers}</p>
                                <p class="stat">Sai</p>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="quizGame-stat__accuracy--performance-item">
                                <p class="number">${correctAnswers}</p>
                                <p class="stat">Đúng</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="quizGame__stats--actions">
                    <button class="quizGame__stats--actions-reset">
                        Chơi lại
                    </button>
                </div>
            </div>
        </div>
    `;
    const statAccuracyProgress = document.querySelector(
        ".quizGame-stat__accuracy--progress"
    );
    const span = statAccuracyProgress.querySelector(
        "span"
    );
    const value = (correctAnswers * 100) / totalQuestion;
    statAccuracyProgress.style.width = `${value}%`
    span.textContent = `${value.toFixed(1)}%`;
    
    const statBtn = document.querySelector(".quizGame__stats--actions-reset");
    statBtn.addEventListener("click", async function () {
        (correctAnswerCount = 0),
            (bonusPoints = 0),
            (totalPoints = 0),
            (correctAnswers = 0),
            (wrongAnswers = 0);
        container.innerHTML = `
            <div class="quizGame-start">
                <button id="start-btn">
                    Start
                </button>
            </div>
        `;
        await new Promise((resolve) => setTimeout(resolve, 10));
        handleStartBtn();
    })
}
