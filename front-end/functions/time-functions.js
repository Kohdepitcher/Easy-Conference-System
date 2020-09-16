
//Check deadline, if true the deadline has not passed
function checkDeadline (timeNow, timeDeadline) {
    var text = timeDeadline.isAfter(timeNow);
    return text;
}

//Check time zone against GMT in hours
function checkTimeZone (date) {
    var text = date.getTimezoneOffset()/60;
    return text;
}

//Convert time zone
function convertTimeZone (timeZone1, timeZone2) {

    return text;
}

//var asiaTime = new Date("2020-09-09 18:00").toLocaleString("en-US", {timeZone: "Asia/Shanghai"});