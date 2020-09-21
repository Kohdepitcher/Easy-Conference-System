var messageField = document.getElementById("messageField")
var sendButton = document.getElementById("sendButton")

var possibleGreetings = [
    "Hello",
    "Hi",
    "Greetings",
    "Hey"
]

var possibleTimeDependentGreetings = [
    "Good Morning",
    "Good Afternoon",
    "Good Evening"
]

var suggestions = []
var suggestionsAsked = false;
var typedIn = false;
var userName = "User"

var today = new Date();
var hour = today.getHours()

if(hour < 12) {
    console.log(possibleTimeDependentGreetings[0] + ", " + userName)
}
else if(hour > 12 && hour < 18) {
    console.log(possibleTimeDependentGreetings[1] + ", " + userName)
}
else {
    console.log(possibleTimeDependentGreetings[2] + ", " + userName)
}

addSuggestedOption("Buy Something")
addSuggestedOption("Sell Something")
addSuggestedOption("Manage Something")

function addSuggestedOption(message) {
    suggestions.push(message)
}

function askAllSuggestions() {
    console.log("What would you like help with?")
    for(var x in suggestions) {
        console.log(suggestions[x] + "\n")
    }
    suggestionsAsked = true;
}

function sendMessage() {
    var messageSent = messageField.value

    if(suggestionsAsked) {

        var result = suggestions.filter(suggestion => messageSent.toLowerCase().includes(suggestion.toLowerCase()));
        console.log(result)

    } 
    
    else {
        for(var x in possibleGreetings) {
            if(messageSent.toLowerCase().includes(possibleGreetings[x].toLowerCase())) {
                console.log(possibleGreetings[Math.floor(Math.random() * 3)])
                askAllSuggestions()
                messageField.value = ""
                break;
            }
        }
    } 
}

messageField.addEventListener("focus", () => {
    typedIn = true;

    if(typedIn = true) {
        document.addEventListener("keydown", (event) => {
            if(event.keyCode == 13) {
                sendMessage()
            }
        })
    }
})


sendButton.addEventListener("click", () => {
    sendMessage()
})
