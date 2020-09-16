var sessionsList = document.querySelector(".listing-sessions");
var countdownAndTitle = document.querySelector(".deadline-countdown")
var conferenceNameSection = document.querySelector(".conf-title")
var countdownTimer = document.querySelector(".time-til-dead-timer")

var addPaperButton = document.querySelector("#addPaperButton")
var arrangeButton = document.querySelector("#arrangeButton")
var closeCreateButton = document.querySelector(".close-create-button")
var paperNameField = document.querySelector("#paperNameField")
var paperPubField = document.querySelector("#paperPubField")
var inputTopic = document.querySelector("#inputTopic")
var subimtCreateButton = document.querySelector("#submitCreateButton")

var sessions = []
var presentations = []
var unassignedPresentations = []

paperNameField.value = ""
paperPubField.value = ""
inputTopic.selectedIndex = "0"

const loadSessions = async () => {
    document.querySelector(".loading-box").style.display = "block"
    await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/presentations-for-user/" + sessionStorage.getItem("confID"), {
                method: "GET",
                headers: new Headers({
                    Authorization: sessionStorage.getItem("BearerAuth"),
                    cache: "no-cache"
                })
    }).then(response => response.json()).then(res => {
        console.log(res)
        if(res.length != 0) {
            
        }
        conferenceNameSection.innerHTML = res[0]["conference"]["conferenceName"]
        var deadlineDate = new Date(res[0]["conference"]["conferenceSubmissionDeadline"])
        var deadlineMoment = moment(deadlineDate.toString())
        countdownTimer.innerHTML = countdown(deadlineMoment.format("DD/MM/YYYY HH:mm"))
        for(var x in res) {
            if(res[x]["session"] != null) {
               sessions.push(res[x]["session"])
               presentations.push(res[x])
            }
            else {
                unassignedPresentations.push(res[x])
            }
            
        }

        for(var z in sessions) {
                var sessionNode = document.createElement("div")
                var sessionDate = document.createElement("div")
                var sessionStart = document.createElement("div")
                var sessionEnd = document.createElement("div")
                var sessionPresentations = document.createElement("div")
                var sessionListingArea = document.createElement("div")
        
                sessionNode.className = "indiv-session"
                sessionDate.className = "indiv-session-section"
                sessionStart.className = "indiv-session-section"
                sessionEnd.className = "indiv-session-section"
                sessionPresentations.className = "indiv-session-section"
        
                sessionStart.id = sessions[z]["sessionID"]
                sessionDate.id = sessions[z]["sessionID"]
                sessionPresentations.id = sessions[z]["sessionID"]
                sessionEnd.id = sessions[z]["sessionID"]
        
                sessionDate.innerHTML = moment(new Date(sessions[z]["date"]).toString()).format("DD/MM/YYYY")
                sessionStart.innerHTML = moment(new Date(sessions[z]["startTime"]).toString()).format("HH:mm")
                sessionEnd.innerHTML = moment(new Date(sessions[z]["endTime"]).toString()).format("HH:mm")
                sessionPresentations.innerHTML = "Unknown (For now)"
        
                sessionListingArea.className = "indiv-session-list-area disable-scrolls"
                sessionListingArea.id = "s" + sessions[z]["sessionID"]
                
                sessionNode.onclick = (event) => {
                    if(document.getElementById("s" + event.target.id).style.height == "50%") {
                        document.getElementById("s" + event.target.id).style.height = "0%"
                        document.getElementById("s" + event.target.id).style.opacity = "0"
                        document.getElementById("s" + event.target.id).innerHTML = ""
                    }
                    else {
                        document.getElementById("s" + event.target.id).style.height = "50%"
                        document.getElementById("s" + event.target.id).style.opacity = "1"

                        for(var y in presentations) {
                            if(presentations[y]["session"]["sessionID"] == sessions[parseInt(event.target.id) - 1]["sessionID"]) {
                                var presentationsNode = document.createElement("div")
                                var presentationsTime = document.createElement("div")
                                var presentationsTopic = document.createElement("div")
                                var presentationsAuthor = document.createElement("div")
            
                                presentationsTime.innerHTML = "Unknown Time"
                                presentationsAuthor.innerHTML = presentations[y]["paper"]["paperPublisher"]
                                presentationsTopic.innerHTML = presentations[y]["paper"]["paperTitle"]
                                    
                                presentationsNode.className = "indiv-pres"
                                presentationsTime.className = "indiv-pres-section"
                                presentationsAuthor.className = "indiv-pres-section"
                                presentationsTopic.className = "indiv-pres-section"
            
                                presentationsNode.append(presentationsTime)
                                presentationsNode.append(presentationsTopic)
                                presentationsNode.append(presentationsAuthor)
                                    
                                document.getElementById("s" + event.target.id).appendChild(presentationsNode)
                            }
                            
                        }
                    }
                    
                }
        
            sessionNode.appendChild(sessionDate)
            sessionNode.appendChild(sessionStart)
            sessionNode.appendChild(sessionEnd)
            sessionNode.appendChild(sessionPresentations)
        
            document.querySelector(".listing-sessions").appendChild(sessionNode)
            document.querySelector(".listing-sessions").appendChild(sessionListingArea)

            if(z + 1 == sessions.length) {
                showUnassignedPresentations()
                document.querySelector(".loading-box").style.display = "none"
            }
        }
    })
}

function showUnassignedPresentations() {
    var sessionNode = document.createElement("div")
    var sessionDate = document.createElement("div")
    var sessionListingArea = document.createElement("div")

    sessionNode.className = "indiv-session"
    sessionDate.className = "indiv-session-section"

    sessionDate.id = "unassigned"

    sessionDate.innerHTML = "Unassigned Presentations"

    sessionListingArea.className = "indiv-session-list-area disable-scrolls"
    sessionListingArea.id = "sunassigned"
        
    sessionNode.onclick = (event) => {
        if(document.getElementById("s" + event.target.id).style.height == "50%") {
            document.getElementById("s" + event.target.id).style.height = "0%"
            document.getElementById("s" + event.target.id).style.opacity = "0"
            document.getElementById("s" + event.target.id).innerHTML = ""
        }
        else {
            document.getElementById("s" + event.target.id).style.height = "50%"
            document.getElementById("s" + event.target.id).style.opacity = "1"

            for(var y in unassignedPresentations) {
                var presentationsNode = document.createElement("div")
                var presentationsTime = document.createElement("div")
                var presentationsTopic = document.createElement("div")
                var presentationsAuthor = document.createElement("div")
    
                presentationsTime.innerHTML = "Unknown Time"
                presentationsAuthor.innerHTML = unassignedPresentations[y]["paper"]["paperPublisher"]
                presentationsTopic.innerHTML = unassignedPresentations[y]["paper"]["paperTitle"]
                        
                presentationsNode.className = "indiv-pres"
                presentationsTime.className = "indiv-pres-section"
                presentationsAuthor.className = "indiv-pres-section"
                presentationsTopic.className = "indiv-pres-section"
    
                presentationsNode.append(presentationsTime)
                presentationsNode.append(presentationsTopic)
                presentationsNode.append(presentationsAuthor)
                            
                document.getElementById("s" + event.target.id).appendChild(presentationsNode)                    
            }
        }
            
    }

    sessionNode.appendChild(sessionDate)

    document.querySelector(".listing-sessions").appendChild(sessionNode)
    document.querySelector(".listing-sessions").appendChild(sessionListingArea)
}

const sendNewPaper = async (name, pub, topic) => {
    await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/presentations", {
        method: "POST",
        headers: new Headers({
            Authorization: sessionStorage.getItem("BearerAuth"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            "paperName": name,
            "paperPublisher": pub,
            "topicID": 1,
            "conferenceID": parseInt(sessionStorage.getItem("confID")),
            "userID": 1
        })
    }).then(response => response.json()).then(res => {
        console.log(res)
    }).catch(e => {
        console.log(e)
    })
}

addPaperButton.addEventListener("click", () => {
    document.querySelector(".create-box").style.display = "block"
    document.querySelector(".create-backing").style.display = "block"
})

closeCreateButton.addEventListener("click", () => {
    document.querySelector(".create-box").style.display = "none"
    document.querySelector(".create-backing").style.display = "none"
})

subimtCreateButton.addEventListener("click", () => {
    if(paperNameField.value != "" && paperPubField.value != "" && inputTopic.selectedIndex != "0") {
        sendNewPaper(paperNameField.value, paperPubField.value, inputTopic.value)
    }
})

loadSessions()

