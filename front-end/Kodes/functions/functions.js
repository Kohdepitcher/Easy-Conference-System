var homeButton = document.getElementById("homeButton");
var conferencesButton = document.getElementById("conferencesButton");
var accountButton = document.getElementById("accountButton");
var signOutButton = document.getElementById("signOutButton");

homeButton.addEventListener("click", () => {
    window.location.replace("presenter-home.html");
})

conferencesButton.addEventListener("click", () => {
    window.location.replace("conferences.html");
})

accountButton.addEventListener("click", () => {
    window.location.replace("my-account.html");
})

signOutButton.addEventListener("click", () => {
    console.log("Sign out!");
})