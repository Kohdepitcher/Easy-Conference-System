var homeButton = document.getElementById("homeButton");
var conferencesButton = document.getElementById("conferencesButton");
var accountButton = document.getElementById("accountButton");
var signOutButton = document.getElementById("signOutButton");

checkIfLogged();

function checkIfLogged() {
    if(sessionStorage.getItem("Username") == null && sessionStorage.getItem("Role") == null) {
        window.location.replace("index.html");
    }
}

homeButton.addEventListener("click", () => {
    if(sessionStorage.getItem("Role") == "Admin") {
        window.location.replace("admin-home.html");
    }
    else {
        checkIfLogged()
        window.location.replace("presenter-home.html");
    }
})

conferencesButton.addEventListener("click", () => {
    window.location.replace("conferences.html");
    checkIfLogged()
})

accountButton.addEventListener("click", () => {
    window.location.replace("my-account.html");
    checkIfLogged()
})

signOutButton.addEventListener("click", () => {
    sessionStorage.removeItem("Username");
    sessionStorage.removeItem("Role");
    checkIfLogged();
})