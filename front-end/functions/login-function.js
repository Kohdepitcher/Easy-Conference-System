var loginButton = document.querySelector("#signInButton")
var usernameText = document.querySelector("#usernameText")
var passwordText = document.querySelector("#passText")

var signUpButton = document.getElementById("signUpButton");

usernameText.value = ""
passwordText.value = ""

usernameTouched = false;
passwordTouched = false;

var page = location.href.split('/').pop()
console.log(page)
if (page != "sign-up.html") {
    checkIfLogged();
}

// Login button processing
loginButton.addEventListener("click", () => {
    // login();
    var user = document.getElementById("usernameText").value;
    var pass = document.getElementById("passText").value;
    if (user.length == 0 || pass.length == 0) {
        var message = "Please do not leave details blank"
        document.querySelector(".message").innerHTML = message
    }
    else {
        firebaseLogin(usernameText.value, passwordText.value);
    }
})

// checking to see if the username field has been touched
// Implementing the gobal enter key to login
usernameText.addEventListener("focus", () => {
    usernameTouched = true;

    if(usernameTouched && passwordTouched) {
        document.addEventListener("keydown", (event) => {
            if(event.keyCode == 13) {
                // login();
                var user = document.getElementById("usernameText").value;
                var pass = document.getElementById("passText").value;
                if (user.length == 0 || pass.length == 0) {
                    var message = "Please do not leave details blank"
                    document.querySelector(".message").innerHTML = message
                }
                else {
                    firebaseLogin(usernameText.value, passwordText.value);
                }
            }
        })
    }
})

// Checking to see if the password text field has been touched
// Implementing the enter key to login
passwordText.addEventListener("focus", () => {
    passwordTouched = true;

    if(usernameTouched && passwordTouched) {
        document.addEventListener("keydown", (event) => {
            if(event.keyCode == 13) {
                // login();
                var user = document.getElementById("usernameText").value;
                var pass = document.getElementById("passText").value;
                if (user.length == 0 || pass.length == 0) {
                    var message = "Please do not leave details blank"
                    document.querySelector(".message").innerHTML = message
                }
                else {
                    firebaseLogin(usernameText.value, passwordText.value);
                }
            }
        })
    }
})

// Sign up button functionality
signUpButton.addEventListener("click", () => {
    window.location.replace("sign-up.html");
    checkIfLogged()
})


// const login = async () => {
//     await fetch("http://localhost:3000/usercheck?user=" + usernameText.value + "&pass=" + passwordText.value).then(response => response.json()).then(res => {
//         console.log(res)    
//         if(res["username"] == usernameText.value) {
//             sessionStorage.setItem("Username", usernameText.value)
//             sessionStorage.setItem("Role", res["role"])

//             checkIfLogged();
//         }
//     }).catch(e => {
//         alert("Please enter valid login details.")
//     })
// }

// Checking if the user is already logged in, and if they, redirect to the home page that suits their role
function checkIfLogged() {
    if(sessionStorage.getItem("Username") != null && sessionStorage.getItem("Role") != null) {
        if(sessionStorage.getItem("Role") == "admin") {
            window.location.replace("admin-home.html");
        }
        else {
            window.location.replace("presenter-home.html");
        }
    }
}

// Creating a new account with firebase
// const firebaseCreate = async (email, password) => {
//     await firebase.auth().createUserWithEmailAndPassword(email, password).then(response => {
//         console.log(response)
//     }).catch(error => {
//         var errorCode = error.code
//         var errorMessage = error.errorMessage

//         console.log(error)
//         console.log(errorCode + " - " + errorMessage)
//     })
// }

// function that handles login through the client side and the backend, using fireAuth
const firebaseLogin = async (email, password) => {
    document.querySelector(".loading-box").style.display = "block"
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
                document.querySelector(".loading-box").style.display = "none"
                console.log(res)
                sessionStorage.setItem("Username", res["user"]["displayName"])
                sessionStorage.setItem("Role", res["user"]["role"])
                sessionStorage.setItem("BearerAuth", bearerAuth)
                sessionStorage.setItem("UserID", res["user"]["uid"])
                checkIfLogged();
            }
        })
    }).catch((error) => {
        var errorCode = error.code
        var errorMessage = error.errorMessage

        console.log(error)
        console.log(errorCode + " - " + errorMessage)

        var message = "Please enter valid login details"
        document.querySelector(".message").innerHTML = message
        document.querySelector(".loading-box").style.display = "none"
    })
}

// loadConferences();


