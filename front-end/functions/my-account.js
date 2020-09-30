var accountIcon = document.querySelector(".account-icon");

accountIcon.innerHTML = sessionStorage.getItem("Username")[0];

//dom elements
const nameField = document.getElementById("nameField");
const emailField = document.getElementById("emailField");


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

                var deadlineDate = new Date(date)
                var deadlineMoment = moment(deadlineDate.toString())
                console.log(deadlineMoment.format("DD/MM/YYYY")) // Printing Deadline
                console.log(moment(new Date().toString()).format("DD/MM/YYYY")) // Printing Today
                var passed = false;

                if (deadlineMoment < Date.now()) {
                    console.log("date has passed")

                    passed = true;

                    var tableNode = document.createElement("div")
                    var cNode = document.createElement("div")
                    var oNode = document.createElement("div")
                    var dNode = document.createElement("div")

                    tableNode.className = "indiv-report-entry"
                    cNode.className = "indiv-report-part"
                    oNode.className = "indiv-report-part"
                    dNode.className = "indiv-report-part"

                    tableNode.id = res1[x]["conferenceID"]
                    cNode.id = res1[x]["conferenceID"]
                    oNode.id = res1[x]["conferenceID"]
                    dNode.id = res1[x]["conferenceID"]

                    cNode.innerHTML = res1[x]["conferenceName"]
                    oNode.innerHTML = res1[x]["organisation"]["organisationName"]
                    dNode.innerHTML = deadlineMoment.format("YYYY")

                    tableNode.appendChild(cNode)
                    tableNode.appendChild(oNode)
                    tableNode.appendChild(dNode)

                    document.querySelector(".past-groupings-presenter-text").appendChild(tableNode)

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

const loadUser = async () => {

    await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/users/" + sessionStorage.getItem("UserID"), {
        method: "GET",
        headers: new Headers({
            Authorization: sessionStorage.getItem("BearerAuth"),
            'Accept': 'application/json',
        }),
    }).then(response  => {

        //if the response != ok
        if(!response === "200") {

            //throw and error
            throw Error(response["message"]);
        }

        return response;

    }).then(response1 => response1.json()).then(res => {

        console.log(res)

        nameField.value = res["db"]["name"];

        emailField.value = res["db"]["email"];

        sessionStorage.setItem("email", res["db"]["email"]);

    }).catch(e => {
        console.log(e)

        alert(e.message)
    })
}

async function sendPasswordRecoveryEmail() {

    // var actionCodeSettings = {
    //     url: 'https://www.example.com/?email=user@example.com',
    //     iOS: {
    //       bundleId: 'com.example.ios'
    //     },
    //     android: {
    //       packageName: 'com.example.android',
    //       installApp: true,
    //       minimumVersion: '12'
    //     },
    //     handleCodeInApp: true
    //   };
    
    await firebase.auth().sendPasswordResetEmail(sessionStorage.getItem("email"))
        .then(function() {
          // Password reset email sent.
        })
        .catch(function(error) {
          // Error occurred. Inspect error.code.

            alert(error)

        });
}

loadUser()

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