// Currently works by grouping according to timezone and paper title
// Needs to be reworked to go back through and double check distances between timezones in sessions that only 
// have 1 or 2 presentations, and then add them together

function groupSessionsToTimezone(presentations, days) {
    var usedTopics = []

    for(var x in presentations) {
        if(!usedTopics.includes(presentations[x]["paper"]["paperTitle"])) {
            usedTopics.push(presentations[x]["paper"]["paperTitle"])
        }
    }

    console.log(usedTopics)
    var sortedPres = presentations.sort((a,b) => {
        return a.user.timeZone - b.user.timeZone
    })

    var arrangedSessions = []

    // Works 
    var range = sortedPres[sortedPres.length - 1]["user"]["timeZone"] - sortedPres[0]["user"]["timeZone"]
    console.log("Range: " + range)

    // Works
    var splits = Math.ceil(range / days)
    console.log("Splits: " + splits)

    // Works
    var hourDiff = Math.ceil(range / splits)
    console.log("Hours Per Split: " + hourDiff)

    for(var w in usedTopics) {
        var currentTopic = usedTopics[w]

        for(var x = 0; x < splits; x++) {
            var newSession = []
            var splitStart = 0
    
            if(x == 0) {
                splitStart = sortedPres[0]["user"]["timeZone"]
            }
            else {
                splitStart = sortedPres[0]["user"]["timeZone"] + (hourDiff * x) + 1
            }
    
            var splitIncrease = hourDiff
            var splitLimit = sortedPres[0]["user"]["timeZone"] + (hourDiff * x) + splitIncrease
    
            newSession = sortedPres.filter(sess => sess["user"]["timeZone"] <= splitLimit && sess["user"]["timeZone"] >= splitStart && sess["paper"]["paperTitle"] == currentTopic);
            var numberOfSessions = Math.ceil(newSession.length / 6)
    
            for(var z = 0; z < numberOfSessions; z++) {
                var addableSession = newSession.splice(0, 6);
                arrangedSessions.push(addableSession);
            }
        }
    }
    

    console.log("Sessions in number order: ")
    console.log(sortedPres)
    console.log("Sessions split into timezones: ");
    console.log(arrangedSessions)
}

const loadPresentations = async () => {
    var presList = []
    await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/presentations-for-conference/1", {
        method: "GET",
        headers: new Headers({
            Authorization: sessionStorage.getItem("BearerAuth"),
            cache: "no-cache"
        })
    }).then(response => response.json()).then(res => {
        // console.log(res)

        // Still need maximums, minimums and durations
        for(var x in res) {
            presList.push(res[x])
        }

        presList.push({
            "paper": {
                "paperTitle": "Paper 2"
            },
            "user": {
                "UUID": 1,
                "country": "Australia",
                "createdAt": "2020-09-10T00:09:04:000Z",
                "email": "testuser@test.com",
                "modifiedAt": "2020-09-10T00:14:03.000Z",
                "name": "Presenter",
                "timeZone": 5,
                "userID": 4
            }
        })

        presList.push({
            "paper": {
                "paperTitle": "Paper 2"
            },
            "user": {
                "UUID": 1,
                "country": "Australia",
                "createdAt": "2020-09-10T00:09:04:000Z",
                "email": "testuser@test.com",
                "modifiedAt": "2020-09-10T00:14:03.000Z",
                "name": "Presenter",
                "timeZone": 2,
                "userID": 4
            }
        })

        presList.push({
            "paper": {
                "paperTitle": "Paper 3"
            },
            "user": {
                "UUID": 1,
                "country": "Australia",
                "createdAt": "2020-09-10T00:09:04:000Z",
                "email": "testuser@test.com",
                "modifiedAt": "2020-09-10T00:14:03.000Z",
                "name": "Presenter",
                "timeZone": 6,
                "userID": 8
            }
        })

        presList.push({
            "paper": {
                "paperTitle": "Paper 1"
            },
            "user": {
                "UUID": 1,
                "country": "Australia",
                "createdAt": "2020-09-10T00:09:04:000Z",
                "email": "testuser@test.com",
                "modifiedAt": "2020-09-10T00:14:03.000Z",
                "name": "Presenter",
                "timeZone": 8,
                "userID": 6
            }
        })

        presList.push({
            "paper": {
                "paperTitle": "test"
            },
            "user": {
                "UUID": 1,
                "country": "Australia",
                "createdAt": "2020-09-10T00:09:04:000Z",
                "email": "testuser@test.com",
                "modifiedAt": "2020-09-10T00:14:03.000Z",
                "name": "Presenter",
                "timeZone": 12,
                "userID": 4
            }
        })
        
        // Needs to be patched so that it works out how many days there are between the start of the conference and the end
        groupSessionsToTimezone(presList, 3)
    }).catch(e => {
        console.log(e)
    })
}

loadPresentations();

// Group(SessionTimezones, How Many Days in the Conference)