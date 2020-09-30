var editAccountButton = document.getElementById("editMyAccountButton");
const editTopicsAndOrganisationsButton = document.getElementById("editTopicsAndOrganisationsButton");

var accountIcon = document.querySelector(".account-icon")
var welcomeMessage = document.querySelector(".welcome-label")

if(sessionStorage.getItem("Role") == "Admin") {
    var organisationsButton = document.getElementById("organisationsButton");

    organisationsButton.addEventListener("click", () => {
        window.location.replace("presentations-for-conference.html");
    })
}


editAccountButton.addEventListener("click", () => {
    window.location.replace("my-account.html");
})

//will be null for presenter so check if not null to add click event for admin
if (editTopicsAndOrganisationsButton != null) {
    editTopicsAndOrganisationsButton.addEventListener("click", () => {
        window.location.replace("topics-organisations.html");
    })
}



accountIcon.innerHTML = sessionStorage.getItem("Username")[0];
welcomeMessage.innerHTML = "Welcome " + sessionStorage.getItem("Username");

if(sessionStorage.getItem("confID") != null) {
    sessionStorage.removeItem("confID")
}

//return conference length
const returnConferenceLength = async () => {
    // Call all conferences
    await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/conferences", {
        method: "GET",
        headers: new Headers({
            Authorization: sessionStorage.getItem("BearerAuth"),
            cache: "no-cache"
        })
     }).then(response => response.json()).then(res => {
            console.log(res);
            loadActiveConferences(res);

        }).catch(e => {
            console.log(e);
        })
}

// load all active conferences for the admin
const loadActiveConferences = async (confArray) => {
    
    document.querySelector(".current-groupings-admin-text").innerHTML = "";
    document.querySelector(".loading-box").style.display = "block"
    // Call all conferences
    for (var y in confArray) {
        console.log(confArray[y]["conferenceName"])

        var tableNode = document.createElement("div")
        var cNode = document.createElement("div")
        var dNode = document.createElement("div")

        tableNode.className = "indiv-report-entry"
        cNode.className = "indiv-report-part"
        dNode.className = "indiv-report-part"

        tableNode.id = confArray[y]["conferenceID"]
        cNode.id = confArray[y]["conferenceID"]
        dNode.id = confArray[y]["conferenceID"]

        console.log(confArray[y]["conferenceName"])
        cNode.innerHTML = confArray[y]["conferenceName"]
        var deadlineDate = new Date(confArray[y]["conferenceSubmissionDeadline"])
        var deadlineMoment = moment(deadlineDate.toString())
        dNode.innerHTML = deadlineMoment.format("DD/MM/YYYY HH:mm")

        tableNode.onclick = (event) => {
            console.log(event.target.id)
            sessionStorage.setItem("SelectedConferenceForEdit", event.target.id);
            window.location.href = "presentations-for-conference.html";
        }

        tableNode.appendChild(cNode)
        tableNode.appendChild(dNode)

        document.querySelector(".current-groupings-admin-text").appendChild(tableNode)

        if(parseInt(y) + 1 == confArray.length) {
            document.querySelector(".loading-box").style.display = "none"
        }
    }
}

// Load current groups for presenter
// Needs to be pretty much rebuilt, as its acting like the active conferences function
// Need to check presenter's paper id to then show the paper id's group

//modified to fetch all sessions for user
const loadCurrentGroups = async () => {
    document.querySelector(".current-groupings-presenter-text").innerHTML = "";
    // fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/presentations-for-user/" + sessionStorage.getItem("UserID"), {
    fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/sessions/" + sessionStorage.getItem("UserID"), {
                method: "GET",
                headers: new Headers({
                    Authorization: sessionStorage.getItem("BearerAuth"),
                    cache: "no-cache"
                })
            }).then(response1 => response1.json()).then(res1 => {
            console.log(res1)
                var takenGroups = [];
                for(var x in res1) {
                    if(takenGroups.includes(res1[x])) {
                        // Do nothing
                        console.log("Already here")
                        console.log(takenGroups)
                    }
                    else {
                        takenGroups.push(res1[x])
                    }
                }
            for(var x in takenGroups) {
                //Check if date has passed for each session
                var date = takenGroups[x]["session_startTime"]

                if (date < Date.now()) {
                    console.log("date has passed")
                } 
                else {
                    console.log("date has not passed")
                
                    //create a table row node
                    var tableNode = document.createElement("div")

                    //create each column for the new row
                    var conferenceNode = document.createElement("div")
                    var sessionNode = document.createElement("div")
                    var dateNode = document.createElement("div")
                    var startTimeNode = document.createElement("div")
                    var endTimeNode = document.createElement("div")
                    var paperNode = document.createElement("div")

                    //set the CSS classes on the new table row elements
                    tableNode.className = "indiv-report-entry"
                    conferenceNode.className = "indiv-report-part"
                    sessionNode.className = "indiv-report-part"
                    dateNode.className = "indiv-report-part"
                    startTimeNode.className = "indiv-report-part"
                    endTimeNode.className = "indiv-report-part"
                    paperNode.className = "indiv-report-part"

                    //set the ids on the nodes
                    tableNode.id = takenGroups[x]["Conference_conferenceID"]

                    conferenceNode.id = takenGroups[x]["Conference_conferenceID"]
                    sessionNode.id = takenGroups[x]["session_sessionID"]
                    dateNode.id = takenGroups[x]["Conference_conferenceID"]
                    startTimeNode.id = takenGroups[x]["Conference_conferenceID"]
                    endTimeNode.id = takenGroups[x]["Conference_conferenceID"]
                    paperNode.id = takenGroups[x]["Paper_paperID"]

                    //set the inner contents of the new row elements
                    conferenceNode.innerHTML = takenGroups[x]["Conference_conferenceName"]
                    sessionNode.innerHTML = takenGroups[x]["session_sessionName"]
                    dateNode.innerHTML = new Date(takenGroups[x]["session_date"]).toLocaleDateString()
                    startTimeNode.innerHTML = new Date(takenGroups[x]["session_startTime"]).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})
                    endTimeNode.innerHTML = new Date(takenGroups[x]["session_endTime"]).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})
                    paperNode.innerHTML = takenGroups[x]["Paper_paperTitle"]

                    tableNode.onclick = (event) => {
                        console.log(event.target.id)
                        sessionStorage.setItem("sessID", event.target.id);
                        window.location.href = "indiv-session.html"
                    }

                    //set the new nodes to the table
                    tableNode.appendChild(conferenceNode)
                    tableNode.appendChild(sessionNode)
                    tableNode.appendChild(dateNode)
                    tableNode.appendChild(startTimeNode)
                    tableNode.appendChild(endTimeNode)
                    tableNode.appendChild(paperNode)

                    document.querySelector(".current-groupings-presenter-text").appendChild(tableNode)

                    if(x + 1 == takenGroups.length) {
                        document.querySelector(".loading-box").style.display = "none"
                    }
                }
            }
            
    }).catch(e => {
        console.log(e);
    })
}

//get unassigned sessions for user
const loadUnassignedSessions = async () => {
    document.querySelector(".current-groupings-presenter-text").innerHTML = "";
    fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/presentations-without-sessions-for-user/" + sessionStorage.getItem("UserID"), {
                method: "GET",
                headers: new Headers({
                    Authorization: sessionStorage.getItem("BearerAuth"),
                    cache: "no-cache"
                })
            }).then(response1 => response1.json()).then(res1 => {
            console.log(res1)

            for(var x in res1) {
                
                    //create a table row node
                    var tableNode = document.createElement("div")

                    //create each column for the new row
                    var conferenceNode = document.createElement("div")
                    var sessionNode = document.createElement("div")
                    var paperNode = document.createElement("div")

                    //set the CSS classes on the new table row elements
                    tableNode.className = "indiv-report-entry"


                    conferenceNode.className = "indiv-report-part"
                    paperNode.className = "indiv-report-part"
                    sessionNode.className = "indiv-report-part"

                    //set the ids on the nodes
                    tableNode.id = res1[x]["presentationID"]

                    conferenceNode.id = res1[x]["presentationID"]
                    sessionNode.id = res1[x]["presentationID"]
                    paperNode.id = res1[x]["presentationID"]

                    

                    //set the inner contents of the new row elements
                    conferenceNode.innerHTML = res1[x]["conference"]["conferenceName"]

                    if (res1[x]["session"] == null) {
                        sessionNode.innerHTML = new Date(res1[x]["conference"]["conferenceSubmissionDeadline"]).toLocaleDateString()
                    }

                    
                    paperNode.innerHTML = res1[x]["paper"]["paperTitle"]


                    // tableNode.onclick = (event) => {
                    //     console.log(event.target.id)
                    //     sessionStorage.setItem("confID", event.target.id);
                    //     window.location.replace("indiv-conference.html");
                    // }

                    //set the new nodes to the table
                    tableNode.appendChild(conferenceNode)
                    tableNode.appendChild(paperNode)
                    tableNode.appendChild(sessionNode)
                    

                    document.querySelector(".presentations-awaiting-text").appendChild(tableNode)

                    if(x + 1 == res1.length) {
                        document.querySelector(".loading-box").style.display = "none"
                    }
                
            }
            
    }).catch(e => {
        console.log(e);
    })
}

if(sessionStorage.getItem("Role") == "admin") {
    returnConferenceLength();
}
else {

    //populate the session table
    loadCurrentGroups();

    //populate the unassigned session table
    loadUnassignedSessions();
}

