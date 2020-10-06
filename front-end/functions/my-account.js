var accountIcon = document.querySelector(".account-icon");

accountIcon.innerHTML = sessionStorage.getItem("Username")[0];

//dom elements
const nameField = document.getElementById("nameField");
const emailField = document.getElementById("emailField");
const countryField = document.getElementById("countryField")

if(sessionStorage.getItem("Role") != "admin") {
    var org = document.getElementById("organisationsButton");
    org.parentNode.removeChild(org);
}

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
                var passed = false;

                if (deadlineMoment < Date.now()) {
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
                    // Do nothing
                }
            }
             
            if (!passed) {
                var message = "Haven't been in any conferences yet :("
                document.querySelector(".past-groupings-presenter-text").innerHTML = message
            }
            
    }).catch(e => {
        console.log(e);
    })
}

// Loading the user information
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
        nameField.value = res["db"]["name"];

        emailField.value = res["db"]["email"];

        countryField.value = res["db"]["country"]

        sessionStorage.setItem("email", res["db"]["email"]);

    }).catch(e => {
        console.log(e)

        alert(e.message)
    })
}

// Send password recovery email with firebase
async function sendPasswordRecoveryEmail() {
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

// Checks if the user is an admin or a presenter, and renders past conferences if the user is a presenter
if(sessionStorage.getItem("Role") == "admin") {
    //hide the past group table
    hidePastConferences();
}
else {
    //populate the past group table
    loadPastGroups();
}

// hides past conferences
function hidePastConferences() {
    var hide = document.getElementById("past-conferences");
    hide.style.display = "none";
}

// Changing user details based on the new details provided in the fields
async function updateUser() {

    await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/users/" + sessionStorage.getItem("UserID"), {
        method: "PATCH",
        headers: new Headers({
            Authorization: sessionStorage.getItem("BearerAuth"),
            cache: "no-cache",
            'Accept': 'application/json',
            'Content-Type': 'application/json'

        }),
        body: JSON.stringify({
            "displayName": nameField.value, 
            "email": emailField.value, 
            "country": countryField.value,
            "timeZone": (new Date().getTimezoneOffset()) / 60
        })

    }).then(response => response.json()).then(res => {
        // Do nothing
    }).catch(e => {
        console.log(e)
    })

}