var homeButton = document.getElementById("homeButton");
var conferencesButton = document.getElementById("conferencesButton");
var accountButton = document.getElementById("accountButton");
var signOutButton = document.getElementById("signOutButton");

// Calling check if logged function
checkIfLogged();

// Check if the user is admin, then change rendering options
if(sessionStorage.getItem("Role") == "admin") {
    var organisationsButton = document.getElementById("organisationsButton");

    organisationsButton.addEventListener("click", () => {
        window.location.replace("topics-organisations.html");
    })
}

// If a user isn't logged in, return them back to the login page
function checkIfLogged() {
    if(sessionStorage.getItem("Username") == null && sessionStorage.getItem("Role") == null) {
        window.location.replace("index.html")
    }
}

// Handles the user being an admin or a presenter on the homepage
homeButton.addEventListener("click", () => {
    if(sessionStorage.getItem("Role") == "admin") {
        window.location.href = "admin-home.html";
    }
    else {
        checkIfLogged()
        window.location.href = "presenter-home.html";
    }
})

// Moves to the conferences page when the nav button is clicked, but only if they're logged in
conferencesButton.addEventListener("click", () => {
    window.location.href = "conferences.html"
    checkIfLogged()
})

if (accountButton != null) {
    accountButton.addEventListener("click", () => {
        window.location.href = "my-account.html";
        checkIfLogged()
    })
}

if(sessionStorage.getItem("Role") == "admin") {
    var organisationsButton = document.getElementById("organisationsButton");

    organisationsButton.addEventListener("click", () => {
        window.location.replace("topics-organisations.html");
    })
}

// Handles the sign out functionality of the user
signOutButton.addEventListener("click", () => {
    sessionStorage.removeItem("Username");
    sessionStorage.removeItem("Role");
    checkIfLogged();
})