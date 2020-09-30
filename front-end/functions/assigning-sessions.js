// Currently works by grouping according to timezone and paper title
// Needs to be reworked to go back through and double check distances between timezones in sessions that only 
// have 1 or 2 presentations, and then add them together


const loadSessionsAndPresentations = async (conferenceID) => {
    var sessions = []
    var presentations = []

    await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/sessions-for-conferece/" + conferenceID, {
        method: "GET",
        headers: new Headers({
            Authorization: sessionStorage.getItem("BearerAuth"),
            cache: "no-cache"
        })}).then(response => response.json()).then(res => {

        sessions = res

        fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/presentations-for-conference/" + conferenceID, {
            method: "GET",
            headers: new Headers({
                Authorization: sessionStorage.getItem("BearerAuth"),
                cache: "no-cache"
            })}).then(response1 => response1.json()).then(res1 => {
            
            presentations = res1

            addPresentationsToSessions(sessions, presentations)
        }).catch(e => {
            console.log(e)
        })
    }).catch(e => {
        console.log(e)
    })
}

function createNewSession(name, date, start, end, confID) {
    fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/sessions", {
            method: "POST",
            headers: new Headers({
                Authorization: sessionStorage.getItem("BearerAuth"),
                cache: "no-cache"
            }),
            body: JSON.stringify({
                "sessionName": name,
                "date": date,
                "startTime": start,
                "endTime": end,
                "conferenceID": confID
            })
        }).then(response1 => response1.json()).then(res1 => {
            // Do nothing
            
        }).catch(e => {
            console.log(e)
        })
}

// Main logic function, other functions are for loading data
function addPresentationsToSessions(sessions, presentations) {
    var averageTimezone = 0
    var totalTimezone = 0
    var sessionlessPresentations = [] // List of presentations that dont have a session
    var unfullSessions = [] // List of sessions that aren't already full

    // Filtering out presentations that are already assigned to a session
    for(var y in presentations) {
        if(presentations[y]["session"] == null) {
            sessionlessPresentations.push(presentations[y])
        }
    }

    // Filtering out sessions that are already full
    for(var x in sessions) {
        if(sessions[x]["presentations"].length < 6) {
            unfullSessions.push(sessions[x])
        }
    }

    for(var a in sessionlessPresentations) {
        var zone = sessionlessPresentations[a]["user"]["timeZone"]
        console.log(zone)

        for(var b in unfullSessions) {
            var totalTimezone = 0
            for(var c in unfullSessions[b]["presentations"]) {
                totalTimezone += unfullSessions[b]["presentations"][c]["user"]["timeZone"]

                if(parseInt(c) + 1 == unfullSessions[b]["presentations"].length) {
                    averageTimezone = Math.round(totalTimezone / unfullSessions[b]["presentations"].length)
                    
                    if(zone >= averageTimezone - 3 && zone <= averageTimezone + 3) {
                        unfullSessions[b]["presentations"].push(sessionlessPresentations[a]) // Update session to include the new presentation
                        sessionlessPresentations.splice(a, 1) // remove presentation from sessionlessPresentations array
                    }
                }
            }

            if(unfullSessions[b]["presentations"].length == 6) {
                unfullSessions.splice(b, 1)
            }
        }
    }

    if(unfullSessions.length == 0 && sessionlessPresentations.length != 0) {
        // Create a new session
        // Fill the session with the rest of the presentations in the sessionlessPresentations array
        // If the new session presentations length grows bigger than 6, make a new session, repeat
    }

    console.log(sessionlessPresentations)
    console.log(unfullSessions)
    console.log(sessions)
}

loadSessionsAndPresentations(1)

// function groupSessionsToTimezone(presentations, days) {
//     var usedTopics = []

//     for(var x in presentations) {
//         if(!usedTopics.includes(presentations[x]["paper"]["topic"]["topicName"])) {
//             usedTopics.push(presentations[x]["paper"]["topic"]["topicName"])
//         }
//     }

//     var sortedPres = presentations.sort((a,b) => {
//         return a.user.timeZone - b.user.timeZone
//     })

//     var arrangedSessions = []

//     // Works 
//     var range = sortedPres[sortedPres.length - 1]["user"]["timeZone"] - sortedPres[0]["user"]["timeZone"]

//     // Works
//     var splits = Math.ceil(range / days)

//     console.log(range)

//     // Works
//     var hourDiff = Math.ceil(range / splits)

//     for(var w in usedTopics) {
//         var currentTopic = usedTopics[w]
//         for(var x = 0; x < splits; x++) {
//             var newSession = []
//             var splitStart = 0
    
//             if(x == 0) {
//                 splitStart = sortedPres[0]["user"]["timeZone"]
//             }
//             else {
//                 splitStart = sortedPres[0]["user"]["timeZone"] + (hourDiff * x) + 1
//             }
    
//             var splitIncrease = hourDiff
//             var splitLimit = sortedPres[0]["user"]["timeZone"] + (hourDiff * x) + splitIncrease
    
//             newSession = sortedPres.filter(sess => sess["user"]["timeZone"] <= splitLimit && sess["user"]["timeZone"] >= splitStart && sess["paper"]["topic"]["topicName"] == currentTopic);
//             var numberOfSessions = Math.ceil(newSession.length / 6)
//             console.log(newSession)
    
//             for(var z = 0; z < numberOfSessions; z++) {
//                 var addableSession = newSession.splice(0, 6);
//                 arrangedSessions.push(addableSession);
//             }
//         }
//     }

//     arrangedSessions = reshuffleSessions(arrangedSessions, hourDiff)

//     console.log(arrangedSessions)
// }

// // Get presentations table for a specific conference (call conference ID)
// const loadPresentations = async () => {
//     var presList = []
//     await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/presentations-for-conference/1", {
//         method: "GET",
//         headers: new Headers({
//             Authorization: sessionStorage.getItem("BearerAuth"),
//             cache: "no-cache"
//         })
//     }).then(response => response.json()).then(res => {
//         // console.log(res)

//         // Still need maximums, minimums and durations
//         for(var x in res) {
//             if(res[x]["session"] == null) {
//                 presList.push(res[x])
//             }
//         }
        
//         // Needs to be patched so that it works out how many days there are between the start of the conference and the end
//         groupSessionsToTimezone(presList, 3)
//     }).catch(e => {
//         console.log(e)
//     })
// }

// function reshuffleSessions(sessions, gapSize) {
//     var lengths = []
//     var onesOrTwos = []
//     var reshuffled = sessions

//     console.log(sessions)

//     for(var x in sessions) {
//         lengths.push(sessions[x].length)
//     }

//     for(var y in sessions) {
//         if(sessions[y].length <= 2) {
//             onesOrTwos.push(sessions[y])
//             var removedElement = sessions.splice(parseInt(y), 1)
//         }
//         else {
//             while(sessions[y].length >= 3 && sessions[y].length < 6) {
//                 sessions[y].push(onesOrTwos[onesOrTwos.length - 1])
//                 onesOrTwos.pop()
//             }
//         }
//     }

//     var newArray = []

//     for(var z in onesOrTwos) {
//         console.log(onesOrTwos[z])
//         newArray.push(onesOrTwos[z][0])
        
//         if(newArray.length == 6) {
//             sessions.push(newArray)
//             newArray = []
//         }
//     }

//     if(newArray != []) {
//         sessions.push(newArray)
//     }

//     console.log(sessions)
//     return sessions
// }

// loadPresentations();

// Group(SessionTimezones, How Many Days in the Conference)