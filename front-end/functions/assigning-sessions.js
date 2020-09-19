function groupSessionsToTimezone(sessions, days) {
    var sortedSessions = sessions.sort((a, b) => {
        return a - b
    })

    var arrangedSessions = []

    // Works 
    var range = sortedSessions[sortedSessions.length - 1] - sortedSessions[0]
    console.log("Range: " + range)

    // Works
    var splits = Math.ceil(range / days)
    console.log("Splits: " + splits)

    // Works
    var hourDiff = Math.ceil(range / splits)
    console.log("Hours Per Split: " + hourDiff)

    for(var x = 0; x < splits; x++) {
        var newSession = []
        var splitStart = 0

        if(x == 0) {
            splitStart = sortedSessions[0]
        }
        else {
            splitStart = sortedSessions[0] + (hourDiff * x) + 1
        }

        var splitIncrease = hourDiff
        var splitLimit = sortedSessions[0] + (hourDiff * x) + splitIncrease

        newSession = sortedSessions.filter(sess => sess <= splitLimit && sess >= splitStart);
        var numberOfSessions = Math.ceil(newSession.length / 6)

        for(var z = 0; z < numberOfSessions; z++) {
            var addableSession = newSession.splice(0, 6);
            arrangedSessions.push(addableSession);
        }
    }

    console.log("Sessions in number order: ")
    console.log(sortedSessions)
    console.log("Sessions split into timezones: ");
    console.log(arrangedSessions)
}

groupSessionsToTimezone([10, 10, 10, 4, 10, 10, 10], 3)
// Group(SessionTimezones, How Many Days in the Conference)