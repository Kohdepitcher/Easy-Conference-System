var homeButton = document.getElementById("homeButton");
var conferencesButton = document.getElementById("conferencesButton");
var accountButton = document.getElementById("accountButton");
var signOutButton = document.getElementById("signOutButton");

checkIfLogged();

function checkIfLogged() {
    if(sessionStorage.getItem("Username") == null && sessionStorage.getItem("Role") == null) {
        window.location.href = "index.html";
    }
}

homeButton.addEventListener("click", () => {
    if(sessionStorage.getItem("Role") == "admin") {
        window.location.href = "admin-home.html";
    }
    else {
        checkIfLogged()
        window.location.href = "presenter-home.html";
    }
})

conferencesButton.addEventListener("click", () => {
    window.location.href = "conferences.html"
    checkIfLogged()
})

accountButton.addEventListener("click", () => {
    window.location.href = "my-account.html";
    checkIfLogged()
})

signOutButton.addEventListener("click", () => {
    sessionStorage.removeItem("Username");
    sessionStorage.removeItem("Role");
    checkIfLogged();
})