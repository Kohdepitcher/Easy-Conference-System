// Countdown clock til conference deadline
function countdown(deadline) {
    var conferenceDeadline = moment(deadline, "DD/MM/YYYY HH:mm")
    var dateDiff = conferenceDeadline.diff(moment(), "days")
    var hoursDiff = conferenceDeadline.diff(moment(), "hours")
    var minsDiff = conferenceDeadline.diff(moment(), "minutes") - (60 * hoursDiff)

    if(dateDiff > 0) {
        hoursDiff = conferenceDeadline.diff(moment(), "hours") - (24 * dateDiff)
        minsDiff = conferenceDeadline.diff(moment(), "minutes") - (24 * 60 * dateDiff) - (60 * hoursDiff)
    }

    if(minsDiff < 0) {
        dateDiff = 0;
        hoursDiff = 0;
        minsDiff = 0;
    }

    return dateDiff + " days, " + hoursDiff + " hours, " + minsDiff + " mins"
}

// Checking timezones
function timezones() {
    var currentDate = new Date()
    var utcCurrent = currentDate.toUTCString()
    var ausDarwin = new Date("2020-09-09 18:00").toLocaleString("en-US", {timeZone: "Australia/Darwin"})
    var offsetTest = new Date("2020-09-09 18:00").toLocaleString("en-US")
}

// timezones()