var accountIcon = document.querySelector(".account-icon");

accountIcon.innerHTML = sessionStorage.getItem("Username")[0];

// Load past groups for presenter
const loadPastGroups = async () => {
    document.querySelector(".past-groupings-presenter-text").innerHTML = "";
    fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/past-conferences/", {
                method: "GET",
                headers: new Headers({
                    Authorization: sessionStorage.getItem("BearerAuth"),
                    cache: "no-cache"
                })
            }).then(response1 => response1.json()).then(res1 => {
            console.log(res1)

            for(var x in res1) {
                
                try {
                    //Check if date has passed
                    var date = res1[x]["conferenceSubmissionDeadline"]
                 }
                 catch {
                     var date = Date.now().toLocaleDateString();
                 }

                 console.log(date)
                 console.log(new Date(Date.now()).toLocaleDateString())
                 var passed = false;

                if (date < Date.now()) {
                    console.log("date has passed")

                    passed = true;

                    var tableNode = document.createElement("div")
                    var cNode = document.createElement("div")
                    var sNode = document.createElement("div")
                    var pNode = document.createElement("div")
                    var tNode = document.createElement("div")

                    tableNode.className = "indiv-report-entry"
                    cNode.className = "indiv-report-part"
                    oNode.className = "indiv-report-part"
                    dNode.className = "indiv-report-part"

                    tableNode.id = res1[x]["conferenceID"]
                    cNode.id = res1[x]["conferenceID"]
                    oNode.id = res1[x]["conferenceID"]
                    dNode.id = res1[x]["conferenceID"]

                    cNode.innerHTML = res1[x]["conference"]["conferenceName"]
                    oNode.innerHTML = res1[x]["organisation"]
                    dNode.innerHTML = res1[x]["conferenceSubmissionDeadline"]

                    tableNode.appendChild(cNode)
                    tableNode.appendChild(oNode)
                    tableNode.appendChild(dNode)

                    document.querySelector(".current-groupings-presenter-text").appendChild(tableNode)

                    if(x + 1 == res1.length) {
                        document.querySelector(".loading-box").style.display = "none"
                    }
                } 
                else {
                    console.log("date has not passed")
                }
            }
             
            if (!passed) {
                console.log("no conferences") 
                var message = "Haven't been in any conferences yet :("
                document.querySelector(".past-groupings-presenter-text").innerHTML = message
            }
            
    }).catch(e => {
        console.log(e);
    })
}

if(sessionStorage.getItem("Role") == "admin") {
    //hide the past group table
    hidePastConferences();
}
else {
    //populate the past group table
    loadPastGroups();
}

function hidePastConferences() {
    var hide = document.getElementById("past-conferences");
    hide.style.display = "none";
}