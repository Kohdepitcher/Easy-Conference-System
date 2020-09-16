var conferenceData = [
    {
        "Conference": "MMDFE",
        "Group": "Group 1",
        "Participants": 1,
        "Paper": "Thesis 1"
    },
    {
        "Conference": "MMDFE",
        "Group": "Group 1",
        "Participants": 1,
        "Paper": "Thesis 1"
    },
    {
        "Conference": "MMDFE",
        "Group": "Group 1",
        "Participants": 1,
        "Paper": "Thesis 1"
    },
    {
        "Conference": "MMDFE",
        "Group": "Group 1",
        "Participants": 1,
        "Paper": "Thesis 1"
    },
    {
        "Conference": "MMDFE",
        "Group": "Group 1",
        "Participants": 1,
        "Paper": "Thesis 1"
    },
    {
        "Conference": "MMDFE",
        "Group": "Group 1",
        "Participants": 1,
        "Paper": "Thesis 1"
    },
    {
        "Conference": "MMDFE",
        "Group": "Group 1",
        "Participants": 1,
        "Paper": "Thesis 1"
    },
    {
        "Conference": "MMDFE",
        "Group": "Group 1",
        "Participants": 1,
        "Paper": "Thesis 1"
    },
    {
        "Conference": "MMDFE",
        "Group": "Group 1",
        "Participants": 1,
        "Paper": "Thesis 1"
    },
    {
        "Conference": "MMDFE",
        "Group": "Group 1",
        "Participants": 1,
        "Paper": "Thesis 1"
    },
]

for(var x in conferenceData) {
    var tableNode = document.createElement("div")
    var cNode = document.createElement("div")
    var gNode = document.createElement("div")
    var pNode = document.createElement("div")
    var paNode = document.createElement("div")

    tableNode.className = "indiv-report-entry"
    cNode.className = "indiv-report-part"
    gNode.className = "indiv-report-part"
    pNode.className = "indiv-report-part"
    paNode.className = "indiv-report-part"

    cNode.innerHTML = conferenceData[x]["Conference"]
    gNode.innerHTML = conferenceData[x]["Group"]
    pNode.innerHTML = conferenceData[x]["Participants"]
    paNode.innerHTML = conferenceData[x]["Paper"]

    tableNode.appendChild(cNode)
    tableNode.appendChild(gNode)
    tableNode.appendChild(pNode)
    tableNode.appendChild(paNode)
    document.querySelector(".report-box-entry-list").appendChild(tableNode)
}

// fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/topics/2?fbclid=IwAR2TK98wzUvvB5Hh8z8CF8eVSpLYR3I0BxCxJQLLyWVOU_m-zSNCjhqmKSM").then(response => response.json()).then(res => {
//     console.log(res)
// })