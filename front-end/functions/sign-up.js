var signUpButton = document.getElementById("signUpButton");
var signInButton = document.getElementById("signInButton");

const setUsername = async (name, email, country, timezone, userID, bearerAuth) => {
    await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/users/" + userID, {
        method: "PATCH",
        headers: new Headers({
            Authorization: bearerAuth,
            cache: "no-cache"
        }),
        body: JSON.stringify({
            "displayName": name, 
            "email": email, 
            "country": country,
            "timeZone": timezone
        })
    }).then(response => response.json()).then(res => {
        console.log(res)
    }).catch(e => {
        console.log(e)
    })
}

signUpButton.addEventListener("click", async () => {
    var email = document.getElementById("enterEmail").value;
    var user = document.getElementById("enterUser").value;
    var pass = document.getElementById("enterPass").value;
    var confirmPass = document.getElementById("enterConfirmPass").value;
    var countryDropDown = document.querySelector('#country-dropdown'); 
    var country = countryDropDown.value; 
    var timezone = 10;

    // console.log(name)
    // console.log(country);
    // console.log(email);

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
        var message = ""
        document.querySelector(".message").innerHTML = message

        await firebaseCreate(email, pass, country, timezone, user);   
        //window.location.replace("index.html");

    }
})

signInButton.addEventListener("click", () => {
    window.location.replace("index.html");
})

const firebaseCreate = async (email, password, country, timezone, user) => {
    await firebase.auth().createUserWithEmailAndPassword(email, password).then(response => {
        console.log(response)
        var userID = response["user"]["$"]["B"]["b"]["b"]["firebase:authUser:AIzaSyC3skpOyi2I7PdtmlpOWcANOldmToW_xys:[DEFAULT]"]["uid"]
        var bearerAuth = "Bearer " + response["user"]["$"]["B"]["b"]["b"]["firebase:authUser:AIzaSyC3skpOyi2I7PdtmlpOWcANOldmToW_xys:[DEFAULT]"]["stsTokenManager"]["accessToken"]
        setTimeout(() => {
            firebaseLogin(email, password)
            setUsername(user, email, country, timezone, userID, bearerAuth)
        }, 5000);
    }).catch(error => {
        var errorCode = error.code
        var errorMessage = error.errorMessage

        console.log(error)
        console.log(errorCode + " - " + errorMessage)
    })
}

const firebaseLogin = async (email, password) => {
    await firebase.auth().signInWithEmailAndPassword(email, password).then(response => {
        console.log(response)
        var bearerAuth = "Bearer " + response["user"]["$"]["B"]["b"]["b"]["firebase:authUser:AIzaSyC3skpOyi2I7PdtmlpOWcANOldmToW_xys:[DEFAULT]"]["stsTokenManager"]["accessToken"]
        fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/users/" + response["user"]["uid"], {
            method: "GET",
            headers: new Headers({
                Authorization: bearerAuth,
                cache: "no-cache"
            })
         }).then(res1 => res1.json()).then(res => {
            if(res["message"] == "Unauthorized") {
                console.log("Not the correct access token for this user.")
            }
            else {
                console.log(res)
                // sessionStorage.setItem("Username", res["user"]["displayName"])
                // sessionStorage.setItem("Role", res["user"]["role"])
                // sessionStorage.setItem("BearerAuth", bearerAuth)
                // sessionStorage.setItem("UserID", res["user"]["uid"])
                // console.log(res["user"]["uid"])
                // setUsername(user, email, country, timezone, res["user"]["uid"]);
            }
        })
    }).catch((error) => {
        var errorCode = error.code
        var errorMessage = error.errorMessage

        console.log(error)
        console.log(errorCode + " - " + errorMessage)
    })
}