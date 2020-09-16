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
                pNode.innerHTML = "p length "
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
const loadCurrentGroups = async () => {
    document.querySelector(".current-groupings-presenter-text").innerHTML = "";
    fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/presentations-for-user/" + sessionStorage.getItem("userID"), {
                method: "GET",
                headers: new Headers({
                    Authorization: sessionStorage.getItem("BearerAuth"),
                    cache: "no-cache"
                })
            }).then(response1 => response1.json()).then(res1 => {
            console.log(res1)
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

            cNode.innerHTML = res[x]["conferenceName"]
            sNode.innerHTML = "Unknown (For Now)"
            pNode.innerHTML = res1.length
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

        if(x + 1 == res.length) {
            document.querySelector(".loading-box").style.display = "none"
        }
    }).catch(e => {
        console.log(e);
    })
}

if(sessionStorage.getItem("Role") == "Admin") {
    loadActiveConferences();
}
else {
    loadCurrentGroups();
}

