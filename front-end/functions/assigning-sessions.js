function groupSessionsToTimezone(sessions, days) {
    var createdSessions = []
    var sortedSessions = sessions.sort((a, b) => {
        return a - b
    })
    
    var range = sortedSessions[sortedSessions.length - 1] - sortedSessions[0]
    var numberOfSplits = Math.ceil(range / days)
    var sizeOfSplits = Math.ceil(range / numberOfSplits)

    console.log(sortedSessions)
    console.log("Range: " + range)
    console.log("Number of Splits: " + numberOfSplits)
    console.log("Size of splits: " + sizeOfSplits)

    for(var x = 0; x < numberOfSplits; x++) {
        var singleSession = []
        for(var y in sortedSessions) {
            var startingValue = 0
            if(x == 0) {
                startingValue = sortedSessions[0]
            }
            else {
                startingValue = sortedSessions[0] + (sizeOfSplits * (x)) + 1
            }
            
            var increaseAmount = sizeOfSplits
            var increasedVar = startingValue + increaseAmount

            console.log("start: " + startingValue)
            console.log("Increase: " + increasedVar)
            console.log("Number: " + sortedSessions[y])

            if(sortedSessions[y] >= startingValue && sortedSessions[y] <= increasedVar) {
                singleSession.push(sortedSessions[y])
                // var removed = sortedSessions.splice(y, 0)
                var result = removeFromArray(sortedSessions, sortedSessions[y])
                console.log(result)

                if(singleSession.length == 6) {
                    createdSessions.push(singleSession)
                    singleSession = []
                }
            }
        }

        if(singleSession.length >= 1) {
            createdSessions.push(singleSession)
        }
        
    }
    console.log("created: ")
    console.log(createdSessions)
} 

function removeFromArray(arr, value) {
    return arr.filter(ele => ele != value)
}

groupSessionsToTimezone([-3, -4, 10, 10, 5, 6, -1, -7, 4, 10, 10, 10, 10, 9, 8, 9, 10, 11], 3)
// Group(SessionTimezones, How Many Days in the Conference)