var editAccountButton = document.querySelector(".account-button");
var accountIcon = document.querySelector(".account-icon")
var welcomeMessage = document.querySelector(".welcome-label")


editAccountButton.addEventListener("click", () => {
    window.location.replace("my-account.html");
})

accountIcon.innerHTML = sessionStorage.getItem("Username")[0];
welcomeMessage.innerHTML = "Welcome " + sessionStorage.getItem("Username");

if(sessionStorage.getItem("confID") != null) {
    sessionStorage.removeItem("confID")
}

// load all active conferences for the admin
const loadActiveConferences = async () => {
    document.querySelector(".current-groupings-admin-text").innerHTML = "";
    document.querySelector(".loading-box").style.display = "block"
    // Call all conferences
    await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/conferences", {
        method: "GET",
        headers: new Headers({
            Authorization: sessionStorage.getItem("BearerAuth"),
            cache: "no-cache"
        })
     }).then(response => response.json()).then(res => {
        console.log(res);
        
        // For every conference, call all the presentations associated with it
        for (var x in res) {
            console.log(res[x]["conferenceName"])
            conferenceData.push(res[x])
                var tableNode = document.createElement("div")
                var cNode = document.createElement("div")
                var sNode = document.createElement("div")
                var pNode = document.createElement("div")
                var dNode = document.createElement("div")

                tableNode.className = "indiv-report-entry"
                cNode.className = "indiv-report-part"
                sNode.className = "indiv-report-part"
                pNode.className = "indiv-report-part"
                dNode.className = "indiv-report-part"

                tableNode.id = res[x]["conferenceID"]
                cNode.id = res[x]["conferenceID"]
                sNode.id = res[x]["conferenceID"]
                pNode.id = res[x]["conferenceID"]
                dNode.id = res[x]["conferenceID"]

                console.log(res[x]["conferenceName"])
                cNode.innerHTML = res[x]["conferenceName"]
                sNode.innerHTML = "Unknown (For Now)"
                pNode.innerHTML = res.length
                var deadlineDate = new Date(res[x]["conferenceSubmissionDeadline"])
                var deadlineMoment = moment(deadlineDate.toString())
                dNode.innerHTML = deadlineMoment.format("DD/MM/YYYY HH:mm")

                tableNode.onclick = (event) => {
                    console.log(event.target.id)
                    sessionStorage.setItem("confID", event.target.id);
                    window.location.replace("indiv-conference.html");
                }

                tableNode.appendChild(cNode)
                tableNode.appendChild(sNode)
                tableNode.appendChild(pNode)
                tableNode.appendChild(dNode)

                document.querySelector(".current-groupings-admin-text").appendChild(tableNode)

                if(parseInt(x) + 1 == res.length) {
                    document.querySelector(".loading-box").style.display = "none"
                }


            // fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/presentations-for-user/" + res[x]["conferenceID"], {
            //     method: "GET",
            //     headers: new Headers({
            //         Authorization: sessionStorage.getItem("BearerAuth"),
            //         cache: "no-cache"
            //     })
            // }).then(response1 => response1.json()).then(res1 => {
                
            // })    
                
            }
        }).catch(e => {
            console.log(e);
        })
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

            for(var x in res1) {

                //Check if date has passed for each session
                var date = res1[x]["session_startTime"]

                if (date < Date.now()) {
                    console.log("date has passed")
                } 
                else {
                    console.log("date has not passed")
                
                    //create a table row node
                    var tableNode = document.createElement("div")
                    // var cNode = document.createElement("div")
                    // var sNode = document.createElement("div")
                    // var pNode = document.createElement("div")
                    // var tNode = document.createElement("div")

                    //create each column for the new row
                    var conferenceNode = document.createElement("div")
                    var sessionNode = document.createElement("div")
                    var dateNode = document.createElement("div")
                    var startTimeNode = document.createElement("div")
                    var endTimeNode = document.createElement("div")
                    var paperNode = document.createElement("div")

                    //set the CSS classes on the new table row elements
                    tableNode.className = "indiv-report-entry"
                    // cNode.className = "indiv-report-part"
                    // sNode.className = "indiv-report-part"
                    // pNode.className = "indiv-report-part"
                    // tNode.className = "indiv-report-part"

                    conferenceNode.className = "indiv-report-part"
                    sessionNode.className = "indiv-report-part"
                    dateNode.className = "indiv-report-part"
                    startTimeNode.className = "indiv-report-part"
                    endTimeNode.className = "indiv-report-part"
                    paperNode.className = "indiv-report-part"

                    //set the ids on the nodes
                    tableNode.id = res1[x]["Conference_conferenceID"]

                    conferenceNode.id = res1[x]["Conference_conferenceID"]
                    sessionNode.id = res1[x]["session_sessionID"]
                    dateNode.id = res1[x]["Conference_conferenceID"]
                    startTimeNode.id = res1[x]["Conference_conferenceID"]
                    endTimeNode.id = res1[x]["Conference_conferenceID"]
                    paperNode.id = res1[x]["Paper_paperID"]
                    // cNode.id = res1[x]["conferenceID"]
                    // sNode.id = res1[x]["conferenceID"]
                    // pNode.id = res1[x]["conferenceID"]
                    // tNode.id = res1[x]["conferenceID"]
                    

                    //set the inner contents of the new row elements
                    conferenceNode.innerHTML = res1[x]["Conference_conferenceName"]
                    sessionNode.innerHTML = res1[x]["session_sessionName"]
                    dateNode.innerHTML = new Date(res1[x]["session_date"]).toDateString()
                    startTimeNode.innerHTML = new Date(res1[x]["session_startTime"]).toLocaleTimeString()
                    endTimeNode.innerHTML = new Date(res1[x]["session_endTime"]).toLocaleTimeString()
                    paperNode.innerHTML = res1[x]["Paper_paperTitle"]

                    // cNode.innerHTML = res1[x]["conference"]["conferenceName"]
                    // sNode.innerHTML = res1[x]["session"]["sessionName"]
                    // pNode.innerHTML = res1.length
                    // tNode.innerHTML = res1[x]["paper"]["paperTitle"]

                    // tableNode.onclick = (event) => {
                    //     console.log(event.target.id)
                    //     sessionStorage.setItem("confID", event.target.id);
                    //     window.location.replace("indiv-conference.html");
                    // }

                    //set the new nodes to the table
                    tableNode.appendChild(conferenceNode)
                    tableNode.appendChild(sessionNode)
                    tableNode.appendChild(dateNode)
                    tableNode.appendChild(startTimeNode)
                    tableNode.appendChild(endTimeNode)
                    tableNode.appendChild(paperNode)
                    // tableNode.appendChild(cNode)
                    // tableNode.appendChild(sNode)
                    // tableNode.appendChild(pNode)
                    // tableNode.appendChild(tNode)

                    document.querySelector(".current-groupings-presenter-text").appendChild(tableNode)

                    if(x + 1 == res1.length) {
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
                        sessionNode.innerHTML = "Waiting Assignment"
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
                    

                    document.querySelector(".presentations-missing-sessions").appendChild(tableNode)

                    if(x + 1 == res1.length) {
                        document.querySelector(".loading-box").style.display = "none"
                    }
                
            }
            
    }).catch(e => {
        console.log(e);
    })
}

if(sessionStorage.getItem("Role") == "admin") {
    loadActiveConferences();
}
else {

    //populate the session table
    loadCurrentGroups();

    //populate the unassigned session table
    loadUnassignedSessions();
}

