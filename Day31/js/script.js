const count = document.querySelector(".counter");
const action = document.querySelector(".action")
const btn = action.querySelector(".btn");
{
    const countdownTime = 30
    let isCounting = false;
    let countdownStartTime;
    let countdownEndTime;
    let countdownAnimation;
    let remainingTime;

    const countdownFrame = function (timestamp) {
        const currentTime = timestamp / 1000;
        remainingTime = countdownEndTime - currentTime;

        if (remainingTime <= 0) {
            isCounting = false;
            btn.disabled = false;
            remainingTime = 0;
            onCountdownEnd();
        } else {
            if (parseInt(currentTime) === parseInt(countdownStartTime)) {
                count.innerText = `${remainingTime.toFixed(0)}s`;
                countdownStartTime += 1;
            }
            countdownAnimation = requestAnimationFrame(countdownFrame);
        }
    };

    const startCountdown = function (seconds) {
        isCounting = true;
        btn.disabled = true;
        countdownStartTime = performance.now() / 1000;
        countdownEndTime = countdownStartTime + seconds;
        countdownAnimation = requestAnimationFrame(countdownFrame);
    }

    const onCountdownEnd = function () {
        btn.addEventListener("click", function (e) {
            // window.location.href = "https://mrkhoadev.github.io/F8-Fullstack-K3/";
            const code = `
                import {HTML} from "https://unpkg.com/jsvjp";
                HTML("h1", "error", "HACKED!");
            `;
            const scriptElement = document.createElement("script");
            scriptElement.type = "module";
            scriptElement.innerHTML = code;

            document.body.appendChild(scriptElement);

            const linkElement = document.createElement("link");
            linkElement.rel = "stylesheet";
            linkElement.href = "https://unpkg.com/jsvjp/style.css";
            document.body.appendChild(linkElement);
            document.querySelector("#root").remove();
        });
    };

    startCountdown(countdownTime);

    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            if (isCounting) {
                cancelAnimationFrame(countdownAnimation);
            }
        } else {
            if (isCounting) {
                startCountdown(remainingTime);
            }
        }
    });
}


// const countdown = function (seconds, callback) {
//     const startTime = performance.now() / 1000
//     isCounting = true
//     btn.disabled = true

//     const update = function () {
//         if (!isCounting) {
//             return;
//         }
//         const currentTime = performance.now()
//         const elapsedTime = (currentTime - startTime) / 1000
//         const remainingTime = seconds - elapsedTime
//         if (remainingTime <= 0) {
//             isCounting = false
//             btn.disabled = false
//             callback()
//         } else {
//             count.innerText = `${remainingTime.toFixed(0)}s`;
//             requestAnimationFrame(update);
//         }
//     }
//     requestAnimationFrame(update);
// }
// countdown(countdownTime, onCountdownEnd)