const root = document.querySelector("#root");
const datepicker = document.querySelector(".datepicker");
const datepickerBody = datepicker.querySelector(".datepicker-body");
const calendarMonth = datepickerBody.querySelector(".calendar-month");
const prevMonthBtn = datepicker.querySelector(
    ".datepicker-header__btn button:nth-child(1)"
);
const nextMonthBtn = datepicker.querySelector(
    ".datepicker-header__btn button:nth-child(2)"
);

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const yearList = Array.from(
    { length: 24 },
    (_, index) => currentYear - 4 + index
);
const monthList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
const dayList = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
let indexYear = 4;
let month = 1;

const printMonthCalendar = function (year, month) {
    const totalDaysInMonth = new Date(year, month, 0).getDate();
    month = month - 1;

    let firstDayOfMonth = new Date(year, month, 0).getDay(),
        lastMonthDays = new Date(year, month, 0).getDate();
    if (month <= 0) {
        firstDayOfMonth = new Date(year - 1, 12, 0).getDay();
        lastMonthDays = new Date(year - 1, 12, 0).getDate();
    }

    const dayArr = [];
    // Thêm các ngày của tháng trước vào khoảng trống ở đầu tháng
    for (let index = firstDayOfMonth; index > 0; index--) {
        dayArr.push(`
            <div class="calendar-days prev-month">
                <span>${lastMonthDays - index + 1}</span>
            </div>
        `);
    }
    // Thêm các ngày trong tháng
    for (let day = 1; day <= totalDaysInMonth; day++) {
        dayArr.push(`<div class="calendar-days">
            <span>${day}</span>
        </div>`);
    }
    // Thêm các ngày của tháng sau vào khoảng trống ở cuối tháng
    let daysInNextMonth = 7 - ((totalDaysInMonth + firstDayOfMonth) % 7);
    if (dayArr.length < 35) {
        daysInNextMonth += 7;
    }
    for (let index = 1; index <= daysInNextMonth; index++) {
        dayArr.push(`
            <div class="calendar-days next-month">
                <span>${index}</span>
            </div>
        `);
    }

    const weeksArray = [];
    for (let i = 0; i < Math.ceil(dayArr.length / 7); i++) {
        const weekDays = dayArr.slice(i * 7, (i + 1) * 7).join("");
        weeksArray.push(`<div class="calendar-week">${weekDays}</div>`);
    }

    const calendarHTML = weeksArray.join("");

    const weekdaysHTML = dayList
        .map(
            (day) => `
            <div class="calendar-days">
                <span>${day}</span>
            </div>
        `
        )
        .join("");

    return `
        <div class="calendar-week">
            ${weekdaysHTML}
        </div>
        ${calendarHTML}
    `;
};

const renderDatepicker = function (year, month) {

    const currentMonth = printMonthCalendar(year, month);
    let nextMonth = printMonthCalendar(year, month + 1);
    if (month === 12) {
        nextMonth = printMonthCalendar(year + 1, 1);
    }
    datepickerBody.innerHTML = `
        <div class="calendar-month">${currentMonth}</div>
        <div class="calendar-month">${nextMonth}</div>
    `;
    const datepickerHeader = document.querySelector(
            ".datepicker-header span"
        );
    datepickerHeader.textContent = `${monthList[month]} ${year}`;

};

renderDatepicker(yearList[indexYear], month);
nextMonthBtn.addEventListener("click", () => {
    ++month;
    if (month > 12) {
        month = 1;
        indexYear++;
    }
    if (indexYear > yearList.length - 1) {
        indexYear = 4;
    }
    renderDatepicker(yearList[indexYear], month);
});
prevMonthBtn.addEventListener("click", () => {
    --month;
    if (month < 1) {
        month = 12;
        --indexYear;
    }
    if (indexYear < 4) {
        indexYear = yearList.length - 1;
    }
    renderDatepicker(yearList[indexYear], month);
});
