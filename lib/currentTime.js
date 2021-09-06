let date_ob = new Date();

// current date
// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);
let midDate = new String(date);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

// current hours
let hours = ("0" + (date_ob.getHours() + 1)).slice(-2);

// current minutes
let minutes = ("0" + (date_ob.getMinutes() + 1)).slice(-2);

// current seconds
let seconds = ("0" + (date_ob.getSeconds() + 1)).slice(-2);

// prints date in YYYY-MM-DD format
let currentDate = year + "-" + month + "-" + midDate

// prints date & time in YYYY-MM-DD HH:MM:SS format
let currentTime = year + "-" + month + "-" + midDate + " " + hours + ":" + minutes + ":" + seconds;

// prints time in HH:MM format
let currentHourAndMinute = hours + ":" + minutes;

var timePrint = function () {
    setInterval(function () {
        let date_ob_inner = new Date();
        let date1 = ("0" + date_ob_inner.getDate()).slice(-2);
        let month1 = ("0" + (date_ob_inner.getMonth() + 1)).slice(-2);
        let year1 = date_ob_inner.getFullYear();

        let hours1 = ("0" + date_ob_inner.getHours()).slice(-2);
        let minutes1 = ("0" + date_ob_inner.getMinutes()).slice(-2);
        let seconds1 = ("0" + date_ob_inner.getSeconds()).slice(-2);

        let currentTime1 = year1 + "-" + month1 + "-" + date1 + " " + hours1 + ":" + minutes1 + ":" + seconds1;

        console.log("[" + currentTime1 + "]" + "服务器正在运行，别关哟!");
    }, 1000);
}

exports.currentTime = currentTime;
exports.currentDate = currentDate;
exports.timePrint = timePrint;



