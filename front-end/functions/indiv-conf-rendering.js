// class topic {
//     constructor(topicID, topicName) {
//         this.topicID = topicID;
//         this.topicName = topicName;
//     }
// }

function Topic(topicID, topicName) {
    this.topicID = topicID;
    this.topicName = topicName;
}

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
var submitCreateButton = document.querySelector("#submitCreateButton")

var sessions = []
var unassignedPresentations = []
var topics = []

paperNameField.value = ""
paperPubField.value = ""
inputTopic.selectedIndex = "0"

const loadConference = async () => {
    await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/conferences/" + sessionStorage.getItem("confID"), {
        method: "GET",
        headers: new Headers({
            Authorization: sessionStorage.getItem("BearerAuth"),
            cache: "no-cache"
        })
    }).then(response => response.json()).then(res => {
        console.log(res)
        conferenceNameSection.innerHTML = res["conferenceName"]
        var deadlineDate = new Date(res["conferenceSubmissionDeadline"])
        var deadlineMoment = moment(deadlineDate.toString())
        countdownTimer.innerHTML = countdown(deadlineMoment.format("DD/MM/YYYY HH:mm"))

        //populate the topics array
        loadTopics(res["organisation"]["organisationID"])
    })
}

//fetches the topics for an organisation
const loadTopics = async (organisationID) => {

    await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/topics-for-organisation/" + organisationID, {
        method: "GET",
        headers: new Headers({
            Authorization: sessionStorage.getItem("BearerAuth"),
            cache: "no-cache"
        })
    }).then(response => response.json()).then(res => {
        console.log(res)
        
        //populate the topics array
        if (res.length != 0) {

            //for each element in the reponse array, loop and push
            for (var topicResponse in res) {

                //create a new instance of topic and fill it with the required data
                var newTopic = new Topic(res[topicResponse]["topicID"], res[topicResponse]["topicName"]);

                //puah the topic onto the Topics array
                topics.push(newTopic)
            }

            // console.log(topics)


            //populate the topic options list
            for (var i in topics) {

                var topicFromIndex = topics[i]
                var option = document.createElement("option")

                    option.textContent = topicFromIndex.topicName;
                    option.value = topicFromIndex.topicID;
                    
                inputTopic.appendChild(option)

            }

        }


        
    })

}

const loadSessions = async () => {
    document.querySelector(".loading-box").style.display = "block"
    loadConference()
    await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/sessions-for-conferece/" + sessionStorage.getItem("confID"), {
                method: "GET",
                headers: new Headers({
                    Authorization: sessionStorage.getItem("BearerAuth"),
                    cache: "no-cache"
                })
    }).then(response => response.json()).then(res => {
        console.log(res)
        if(res.length != 0) {
            for(var x in res) {
                sessions.push(res[x])
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
                    sessionPresentations.innerHTML = sessions[z]["presentations"].length
            
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

                            var presentations = sessions[z]["presentations"]
                            for(var y in presentations) {
                                var presentationsNode = document.createElement("div")
                                var presentationsTime = document.createElement("div")
                                var presentationsTopic = document.createElement("div")
                                var presentationsAuthor = document.createElement("div")
                
                                presentationsTime.innerHTML = "Unknown Time"
                                presentationsAuthor.innerHTML = presentations[y]["user"]["name"]
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
            
                sessionNode.appendChild(sessionDate)
                sessionNode.appendChild(sessionStart)
                sessionNode.appendChild(sessionEnd)
                sessionNode.appendChild(sessionPresentations)
            
                document.querySelector(".listing-sessions").appendChild(sessionNode)
                document.querySelector(".listing-sessions").appendChild(sessionListingArea)

                if(z + 1 == sessions.length) {
                    // showUnassignedPresentations()
                    document.querySelector(".loading-box").style.display = "none"
                }
            }
        }
        else {
            document.querySelector(".listing-sessions").innerHTML = "No sessions added to this conference."
            document.querySelector(".loading-box").style.display = "none"
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
            "topicID": topic,
            "conferenceID": parseInt(sessionStorage.getItem("confID")),
            //no longer needed "userID": 1
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

submitCreateButton.addEventListener("click", () => {
    if(paperNameField.value == "" || paperPubField.value == "" || inputTopic.selectedIndex == "0") {
        var message = "Please do not leave details blank"
        document.querySelector(".message").innerHTML = message
    }
    else {
        var message = ""
        document.querySelector(".message").innerHTML = message
        sendNewPaper(paperNameField.value, paperPubField.value, inputTopic.value)
        window.location.href("indiv-conference.html");
    }
})

loadSessions()

