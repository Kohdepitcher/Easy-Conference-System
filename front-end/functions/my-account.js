var accountIcon = document.querySelector(".account-icon");

accountIcon.innerHTML = sessionStorage.getItem("Username")[0];

// Load past groups for presenter
const loadPastGroups = async () => {
    document.querySelector(".past-groupings-presenter-text").innerHTML = "";
    fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/presentations-for-user/" + sessionStorage.getItem("UserID"), {
                method: "GET",
                headers: new Headers({
                    Authorization: sessionStorage.getItem("BearerAuth"),
                    cache: "no-cache"
                })
            }).then(response1 => response1.json()).then(res1 => {
            console.log(res1)

            for(var x in res1) {
                //Check if date has passed
                var date = res1[x]["session"]["startTime"]
                var passed = false;

                if (date < Date.now()) {
                    console.log("date has passed")

                    passed = true; //TEST THIS

                    var tableNode = document.createElement("div")
                    var cNode = document.createElement("div")
                    var sNode = document.createElement("div")
                    var pNode = document.createElement("div")
                    var tNode = document.createElement("div")

                    tableNode.className = "indiv-report-entry"
                    cNode.className = "indiv-report-part"
                    sNode.className = "indiv-report-part"
                    pNode.className = "indiv-report-part"
                    tNode.className = "indiv-report-part"

                    tableNode.id = res1[x]["conferenceID"]
                    cNode.id = res1[x]["conferenceID"]
                    sNode.id = res1[x]["conferenceID"]
                    pNode.id = res1[x]["conferenceID"]
                    tNode.id = res1[x]["conferenceID"]

                    cNode.innerHTML = res1[x]["conference"]["conferenceName"]
                    sNode.innerHTML = res1[x]["session"]["sessionName"]
                    pNode.innerHTML = res1.length
                    tNode.innerHTML = res1[x]["paper"]["paperTitle"]

                    tableNode.onclick = (event) => {
                        console.log(event.target.id)
                        sessionStorage.setItem("confID", event.target.id);
                        window.location.replace("indiv-conference.html");
                    }

                    tableNode.appendChild(cNode)
                    tableNode.appendChild(sNode)
                    tableNode.appendChild(pNode)
                    tableNode.appendChild(tNode)

                    document.querySelector(".current-groupings-presenter-text").appendChild(tableNode)

                    if(x + 1 == res1.length) {
                        document.querySelector(".loading-box").style.display = "none"
                    }
                } 
                else {
                    console.log("date has not passed")
                }
            }
             
            if (passed == false) {
                //insert code to say "No conferences yet :("
                //and fix formatting
            }
            
    }).catch(e => {
        console.log(e);
    })
}