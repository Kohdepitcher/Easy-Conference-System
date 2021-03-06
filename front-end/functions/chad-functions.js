var chadIcon = document.querySelector(".chad-icon")
var chadMessageArea = document.querySelector(".chad-message-area")
var sendMessageField = document.querySelector("#sendToChadField")
var sendMessageButton = document.querySelector("#sendMessageButton")

// Greetings that chad can fire off
var possibleGreetings = [
    "Hello",
    "Hi",
    "Greetings",
    "Hey"
]

// Greetings that change according to the time of day
var possibleTimeDependentGreetings = [
    "Good Morning",
    "Good Afternoon",
    "Good Evening"
]

// Different things that chad can ask a user, as well as relevant pages that can be redirected to if the user asks
var suggestions = [
    {
        "Text": "View My Sessions",
        "Extended": "This will allow you to view all of the sessions that you are going to be apart of when presenting any of your uploaded papers.",
        "RelevantPage": "presenter-home.html",
        "RedirectMessage": "Would you like me to redirect you to the home page to view your sessions?"
    },
    {
        "Text": "View All Conferences",
        "Extended": "This will allow you to view all of the conferences that are upcoming, and register to deliver a presentation with your paper to them.",
        "RelevantPage": "conferences.html",
        "RedirectMessage": "Would you like me to redirect you to the conferences page to view the conferences?"
    },
    {
        "Text": "Register a new paper for a conference",
        "Extended": "This will allow you to add a new paper for a conference, which will assigned to a session after the conference submission deadline. Simply click nominate and add paper once you're redirected.",
        "RelevantPage": "conferences.html",
        "RedirectMessage": "Would you like me to redirect you to the conferences page to view a list of conferences to nominate a paper for?"
    },
    {
        "Text": "Edit my account",
        "Extended": "This will allow you to edit and update your account details.",
        "RelevantPage": "my-account.html",
        "RedirectMessage": "Would you like me to redirect you to the my account page to edit your account?"
    }
]

// List of suggestions that an admin can ask chad to do, with relevant pages to redirect to
var suggestionsAdmin = [
    {
        "Text": "View Active Conferences",
        "Extended": "This will allow you to view all active conferences that you can click on for further details.",
        "RelevantPage": "admin-home.html",
        "RedirectMessage": "Would you like me to redirect you to the home page to view active conferences?"
    },
    {
        "Text": "View and edit All Conferences",
        "Extended": "This will allow you to view and edit all of the conferences that are upcoming, and register a paper to them.",
        "RelevantPage": "conferences.html",
        "RedirectMessage": "Would you like me to redirect you to the conferences page to view the conferences?"
    },
    {
        "Text": "Edit Organisations and their Topics",
        "Extended": "This will allow you to edit organisations and their topics.",
        "RelevantPage": "topics-organisations.html",
        "RedirectMessage": "Would you like me to redirect you to the organisation page to edit organisations and topics?"
    },
    {
        "Text": "Edit My Account",
        "Extended": "This will allow you to edit and update your account details.",
        "RelevantPage": "my-account.html",
        "RedirectMessage": "Would you like me to redirect you to the my account page to edit your account?"
    },
    {
        "Text": "Assign Presentations to Sessions",
        "Extended": "The conference page allows you to assign presentations to sessions by clicking the edit presentations button",
        "RelevantPage": "conferences.html",
        "RedirectMessage": "Would you like me to redirect you to the conference page to assign presentations?"
    }
]

var suggestionsAsked = false;
var questionAsked = false;
var answerNumber = []

var today = new Date();
var hour = today.getHours()

var userName = sessionStorage.getItem("Username")

// If statement that checks what time of day it is and renders a different greeting based on that
if(hour < 12) {
    chadSend(possibleTimeDependentGreetings[0] + ", " + userName)
}
else if(hour > 12 && hour < 18) {
    chadSend(possibleTimeDependentGreetings[1] + ", " + userName)
}
else {
    chadSend(possibleTimeDependentGreetings[2] + ", " + userName)
}

askAllSuggestions()

// Open/Close Chad message panel
chadIcon.addEventListener("click", () => {
    if(chadMessageArea.style.height == "100%") {
        chadMessageArea.style.height = 0
        chadMessageArea.style.width = 0
        chadMessageArea.style.opacity = 0
    }
    else {
        chadMessageArea.style.height = "100%"
        chadMessageArea.style.width = "19vw"
        chadMessageArea.style.opacity = 1
    }
})

// Registering when the enter key is pressed to end a message to chad
document.addEventListener("keydown", (event) => {
    if(event.key == "Enter" && sendMessageField.value != "") {
        sendToChad(sendMessageField.value)
    }
})

sendMessageButton.addEventListener("click", () => {
    sendToChad(sendMessageField.value)
})

// Function that involves a user sending a message to chad, which renders in the chat ui
function sendToChad(message) {
    var sentNode = document.createElement("div")
    var sentP = document.createElement("p")

    sentNode.className = "sent-message"
    sentP.innerHTML = message

    sentNode.append(sentP)
    document.querySelector(".message-bay").appendChild(sentNode)
    
    
    document.querySelector(".message-bay").scrollTop = document.querySelector(".message-bay").scrollHeight;

    //For admin
    if(sessionStorage.getItem("Role") == "admin") {
        if(suggestionsAsked) {
            if(questionAsked) {
                if(sendMessageField.value.toLowerCase().includes("yes")) {
                    window.location.href = suggestionsAdmin[answerNumber[0] - 1]["RelevantPage"]
                }
            }
            else {
                try {
                    answerNumber.push(parseInt(sendMessageField.value))
                    chadSend(suggestionsAdmin[answerNumber[0] - 1]["Extended"])
                    chadSend(suggestionsAdmin[answerNumber[0] - 1]["RedirectMessage"])
                    questionAsked = true
                }
                catch(e) {
                    console.log(e)
                }
            }
        }
    }
    else {
        //For presenter
        if(suggestionsAsked) {
            if(questionAsked) {
                if(sendMessageField.value.toLowerCase().includes("yes")) {
                    window.location.href = suggestions[answerNumber[0] - 1]["RelevantPage"]
                }
            }
            else {
                try {
                    answerNumber.push(parseInt(sendMessageField.value))
                    chadSend(suggestions[answerNumber[0] - 1]["Extended"])
                    chadSend(suggestions[answerNumber[0] - 1]["RedirectMessage"])
                    questionAsked = true
                }
                catch(e) {
                    console.log(e)
                }
            }
        }
    }
    sendMessageField.value = ""
}

// Function that handles chad sending a message to the user, which renders in the chat ui
function chadSend(message) {
    var recieveNode = document.createElement("div")
    var recieveP = document.createElement("p")

    recieveNode.className = "recieved-message"
    recieveP.innerHTML = message

    recieveNode.append(recieveP)
    document.querySelector(".message-bay").appendChild(recieveNode)
    document.querySelector(".message-bay").scrollTop = document.querySelector(".message-bay").scrollHeight;
}

// Function to handle chad asking all possible suggestions for a specific user role
function askAllSuggestions() {
    chadSend("What would you like help with? Please enter the corresponding number.")
    //For admin
    if(sessionStorage.getItem("Role") == "admin") {
        for(var x in suggestionsAdmin) {
            chadSend(parseInt(x) + 1 + "- " + suggestionsAdmin[x]["Text"])
        }
    }
    else {
        for(var x in suggestions) {
            chadSend(parseInt(x) + 1 + "- " + suggestions[x]["Text"])
        }
    }
    suggestionsAsked = true
}