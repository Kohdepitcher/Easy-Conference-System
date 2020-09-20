var signUpButton = document.getElementById("signUpButton");
var signInButton = document.getElementById("signInButton");

signUpButton.addEventListener("click", () => {
    var email = document.getElementById("enterEmail").value;
    var user = document.getElementById("enterUser").value;
    var pass = document.getElementById("enterPass").value;
    var confirmPass = document.getElementById("enterConfirmPass").value;

    if (email.length == 0 || pass.length == 0 || user.length == 0 || confirmPass.length == 0) {
        var message = "Please do not leave details blank"
        document.querySelector(".message").innerHTML = message
        console.log("create user fail: empty");
    }
    else if (pass != confirmPass) {
        var message = "Please make sure password is the same"
        document.querySelector(".message").innerHTML = message
        console.log("create user fail: different password");
    }
    else {
        console.log(email)
        console.log(pass)

        var message = ""
        document.querySelector(".message").innerHTML = message

        //firebaseCreate(email, pass);
        //firebaseLogin(email, pass);
        //do username thingy
    }
})

signInButton.addEventListener("click", () => {
    window.location.replace("index.html");
    checkIfLogged()
})
