var loginButton = document.querySelector("#signInButton")
var usernameText = document.querySelector("#usernameText")
var passwordText = document.querySelector("#passText")

usernameText.value = ""
passwordText.value = ""

loginButton.addEventListener("click", () => {
    alert("Thank for logging in, " + usernameText.value + ",\nYour password is: " + passwordText.value)
})