var signUpButton = document.getElementById("signUpButton");
var signInButton = document.getElementById("signInButton");

async function getUserToken() {
    return await firebase.auth().currentUser.getIdToken(true);
}


signUpButton.addEventListener("click", async () => {
    var email = document.getElementById("enterEmail").value;
    var user = document.getElementById("enterUser").value;
    var pass = document.getElementById("enterPass").value;
    var confirmPass = document.getElementById("enterConfirmPass").value;
    var countryDropDown = document.querySelector('#country-dropdown'); 
    var country = countryDropDown.value; 
    var timezone = (new Date().getTimezoneOffset()) / 60;

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
        window.location.replace("index.html");

    }
})

signInButton.addEventListener("click", () => {
     window.location.replace("presenter-home.html");
 })

 //patches the firebase user with the rest of their data
 async function patchUser(user, email, country, timezone, userID, bearerAuth) {

    console.log(JSON.stringify({
        "displayName": user, 
        "email": email, 
        "country": country,
        "timeZone": timezone
    }))
    
    await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/user-for-signup/" + userID, {
        method: "PATCH",
        headers: new Headers({
            Authorization: bearerAuth,
            cache: "no-cache",
            'Accept': 'application/json',
            'Content-Type': 'application/json'

        }),
        body: JSON.stringify({
            "displayName": user, 
            "email": email, 
            "country": country,
            "timeZone": timezone
        })

    }).then(response => response.json()).then(res => {
        // console.log(res)
    }).catch(e => {
        console.log(e)
    })

    //after the user has finished patching, fill out session storage with the required data
    prefillSessionStorage()
}

//creates the firebase user
const firebaseCreate = async (email, password, country, timezone, user) => {

    //create users in fireauth
    await firebase.auth().createUserWithEmailAndPassword(email, password).then(response => {
              
        console.log(response)

    }).catch(error => {
        var errorCode = error.code
        var errorMessage = error.errorMessage

        console.log(error)
        console.log(errorCode + " - " + errorMessage)
    })

    // //get user's token
    // var userToken = await getUserToken()
    // console.log("Auth token fetched: " + userToken)


    const userUID = firebase.auth().currentUser.uid
    var bearerAuth

    // force a new token for user from fireauth as setting account information deems a "major change" which revokes previous token
    await fetch("https://securetoken.googleapis.com/v1/token?key=AIzaSyC3skpOyi2I7PdtmlpOWcANOldmToW_xys", {
        method: "POST",

        //fill out body
        body: JSON.stringify({
            "grant_type": "refresh_token",
            "refresh_token": firebase.auth().currentUser.refreshToken
        })
    }).then(response => response.json()).then(res => {
        

        bearerAuth = "Bearer " + res["id_token"]//response["user"]["$"]["B"]["b"]["b"]["firebase:authUser:AIzaSyC3skpOyi2I7PdtmlpOWcANOldmToW_xys:[DEFAULT]"]["stsTokenManager"]["accessToken"]
        

        

    }).catch(e => {
        console.log(e)
    })

    //patch the user in the backend
    await patchUser(user, email, country, timezone, userUID, bearerAuth)

}

//this is reponsible for pre filling the session storage with the required user data from backend
const prefillSessionStorage = async() => {

    //get the user's newest token
    var userToken = await getUserToken();

    var bearerAuth = "Bearer " + userToken//+ response["user"]["$"]["B"]["b"]["b"]["firebase:authUser:AIzaSyC3skpOyi2I7PdtmlpOWcANOldmToW_xys:[DEFAULT]"]["stsTokenManager"]["accessToken"]
        await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/users/" + firebase.auth().currentUser.uid, {
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
                // console.log(res)

                //fill the session storage with data
                sessionStorage.setItem("Username", res["user"]["displayName"])
                sessionStorage.setItem("Role", res["user"]["role"])
                sessionStorage.setItem("BearerAuth", bearerAuth)
                sessionStorage.setItem("UserID", res["user"]["uid"])

                //redirect to the presenter home
                window.location.replace("presenter-home.html");
            
            }
        })
    
}

// const firebaseLogin = async (email, password) => {

//     var userToken = await getUserToken();

//     await firebase.auth().signInWithEmailAndPassword(email, password).then(response => {
//         console.log(response)
        
        

//         var bearerAuth = "Bearer " + userToken//+ response["user"]["$"]["B"]["b"]["b"]["firebase:authUser:AIzaSyC3skpOyi2I7PdtmlpOWcANOldmToW_xys:[DEFAULT]"]["stsTokenManager"]["accessToken"]
//         fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/users/" + firebase.auth().currentUser.uid, {
//             method: "GET",
//             headers: new Headers({
//                 Authorization: bearerAuth,
//                 cache: "no-cache"
//             })
//          }).then(res1 => res1.json()).then(res => {
//             if(res["message"] == "Unauthorized") {
//                 console.log("Not the correct access token for this user.")
//             }
//             else {
//                 console.log(res)

//                 //firebase.user().email;

//                 sessionStorage.setItem("Username", res["user"]["displayName"])
//                 sessionStorage.setItem("Role", res["user"]["role"])
//                 sessionStorage.setItem("BearerAuth", bearerAuth)
//                 sessionStorage.setItem("UserID", res["user"]["uid"])
//                 // console.log(res["user"]["uid"])
//                 // patchUser(user, email, country, timezone, res["user"]["uid"]);
//             }
//         })
//     }).catch((error) => {
//         var errorCode = error.code
//         var errorMessage = error.errorMessage

//         console.log(error)
//         console.log(errorCode + " - " + errorMessage)
//     })
// }

