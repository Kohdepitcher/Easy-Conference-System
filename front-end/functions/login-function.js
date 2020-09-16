var loginButton = document.querySelector("#signInButton")
var usernameText = document.querySelector("#usernameText")
var passwordText = document.querySelector("#passText")

usernameText.value = ""
passwordText.value = ""

usernameTouched = false;
passwordTouched = false;

checkIfLogged();

const loadConferences = async () => {

    await fetch("http://localhost:3000/viewconferences").then(response => response.json()).then(res => {
        for(var x in res) {
            var tableNode = document.createElement("div")
            var cNode = document.createElement("div")
            var gNode = document.createElement("div")
            var dNode = document.createElement("div")
            var paNode = document.createElement("div")
        
            tableNode.className = "indiv-report-entry"
            cNode.className = "indiv-report-part"
            gNode.className = "indiv-report-part"
            dNode.className = "indiv-report-part"
            paNode.className = "indiv-report-part"
        
            cNode.innerHTML = res[x]["Conference"]
            gNode.innerHTML = res[x]["Group"]
            dNode.innerHTML = res[x]["Date"]
            paNode.innerHTML = res[x]["Paper"]
        
            tableNode.appendChild(cNode)
            tableNode.appendChild(gNode)
            tableNode.appendChild(dNode)
            tableNode.appendChild(paNode)
            document.querySelector(".report-box-entry-list").appendChild(tableNode)
        }
    }).catch(e => {
        console.log(e);
    })
}

const login = async () => {
    await fetch("http://localhost:3000/usercheck?user=" + usernameText.value + "&pass=" + passwordText.value).then(response => response.json()).then(res => {
        console.log(res)    
        if(res["username"] == usernameText.value) {
            sessionStorage.setItem("Username", usernameText.value)
            sessionStorage.setItem("Role", res["role"])

            checkIfLogged();
        }
    }).catch(e => {
        alert("Please enter valid login details.")
    })
}

function checkIfLogged() {
    if(sessionStorage.getItem("Username") != null && sessionStorage.getItem("Role") != null) {
        if(sessionStorage.getItem("Role") == "Admin") {
            window.location.replace("admin-home.html");
        }
        else {
            window.location.replace("presenter-home.html");
        }
    }
}

const firebaseCreate = async (email, password) => {
    await firebase.auth().createUserWithEmailAndPassword(email, password).then(response => {
        console.log(response)
    }).catch(error => {
        var errorCode = error.code
        var errorMessage = error.errorMessage

        console.log(error)
        console.log(errorCode + " - " + errorMessage)
    })
}

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
    })
}

loadConferences();

loginButton.addEventListener("click", () => {
    // login();
    firebaseLogin(usernameText.value, passwordText.value);
})

usernameText.addEventListener("focus", () => {
    usernameTouched = true;

    if(usernameTouched && passwordTouched) {
        document.addEventListener("keydown", (event) => {
            if(event.keyCode == 13) {
                // login();
                firebaseLogin(usernameText.value, passwordText.value);
            }
        })
    }
})

passwordText.addEventListener("focus", () => {
    passwordTouched = true;

    if(usernameTouched && passwordTouched) {
        document.addEventListener("keydown", (event) => {
            if(event.keyCode == 13) {
                // login();
                firebaseLogin(usernameText.value, passwordText.value);
            }
        })
    }
})
