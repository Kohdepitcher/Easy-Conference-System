//entities
// function Conferece(presentationID, conferenceName, conferenceDate, conferenceDeadLine, organisationID) {

// }

function Topic(topicID, topicName) {
    this.topicID = topicID;
    this.topicName = topicName;
}

function TopicPaper(topicID, paperID, sessionID, presentationID) {
    this.topicID = topicID;
    this.paperID = paperID;
    this.sessionID = sessionID;
    this.presentationID = presentationID;
}

function Session(sessionID, sessionName) {
    this.sessionID = sessionID;
    this.sessionName = sessionName;
}

//refereces to dom elements
const conferenceTable = document.querySelector(".presentation-table");
const conferenceTableRow = document.querySelector(".presentation-table-row");
const conferenceTableBody = document.querySelector(".presentation-table-body");

const sessionTable = document.querySelector(".session-table");
const sessionTableRow = document.querySelector(".session-table-row");
const sessionTableBody = document.querySelector(".session-table-body");

const loadingSpinner = document.getElementById("loadingSpinner");
const sessionLoadingSpinner = document.getElementById("sessionLoadingSpinner");

const createConferenceButton = document.getElementById("createConferenceButton");

//create form elements
var inputTopic = document.getElementById("patchPaperTopicSelector");
var inputSession = document.getElementById("patchPaperSessionSelector");

//style consts
const tdLeftStyle = "td-left";
const tdRestStyle = "td-rest";

//array to store all topics
var topics = [];

var paperTopics = [];

var sessions = [];

//track the selected paper
var selectedPaper = null;

//track the selected organistion for edit
var organisationID = null;

//track the selected presentation for edit
var selectedPresentation = null;


//track the selectedConference
var selectedConference = null;

function showSpinner(shouldShow, spinner) {
    if (shouldShow == true) {
        spinner.style.cssText = "display: flex !important"

    } else {
        spinner.style.cssText = "display: none !important"
    }
}

//fetches the topics for an organisation
const loadTopics = async (organisationID) => {

    await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/topics-for-organisation/" + organisationID, {
        method: "GET",
        headers: new Headers({
            Authorization: sessionStorage.getItem("BearerAuth"),
            cache: "no-cache"
        })
    }).then(response  => {

        //if the response != ok
        if(!response === "200") {

            

            //throw and error
            throw Error(response["message"]);
        }

        return response;

    }).then(response => response.json()).then(res => {
        console.log(res)
        
        //populate the topics array
        if (res.length != 0) {

            //for each element in the reponse array, loop and push
            for (var topicResponse in res) {

                //create a new instance of topic and fill it with the required data
                var newTopic = new Topic(res[topicResponse]["topicID"], res[topicResponse]["topicName"]);

                //puah the topic onto the Topics array
                topics.push(newTopic)
            }

            // console.log(topics)


            //populate the topic options list
            for (var i in topics) {

                var topicFromIndex = topics[i]
                var option = document.createElement("option")

                    option.textContent = topicFromIndex.topicName;
                    option.value = topicFromIndex.topicID;
                    
                inputTopic.appendChild(option)

            }

        }


        
    }).catch(e => {
        alert(e.message)
    })

}

//fetches the specific conferece for an select conf
const loadSpecificConference = async () => {

    await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/conferences/" + sessionStorage.getItem("SelectedConferenceForEdit"), {
        method: "GET",
        headers: new Headers({
            Authorization: sessionStorage.getItem("BearerAuth"),
            cache: "no-cache"
        })
    }).then(response  => {

        //if the response != ok
        if(!response === "200") {

            

            //throw and error
            throw Error(response["message"]);
        }

        return response;

    }).then(response => response.json()).then(res => {
        console.log(res)
    
        loadTopics(res["organisation"]["organisationID"])
        
    }).catch(e => {
        alert(e.message)
    })

}

const loadSessionsForConference = async () => {

    await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/sessions-for-conferece/" + sessionStorage.getItem("SelectedConferenceForEdit"), {
        method: "GET",
        headers: new Headers({
            Authorization: sessionStorage.getItem("BearerAuth"),
            cache: "no-cache"
        })
    }).then(response  => {

        //if the response != ok
        if(!response === "200") {
            //throw and error
            throw Error(response["message"]);
        }

        return response;

    }).then(response => response.json()).then(res => {
        console.log(res)

        showSpinner(false, sessionLoadingSpinner);
    

            // For every conference, call all the presentations associated with it
        for (var x in res) {

            var fetchedSession = new Session(res[x]["sessionID"], res[x]["sessionName"])
            sessions.push(fetchedSession)


            //create table row data
            var tableRow = sessionTable.insertRow(-1)
                tableRow.className = "material-tr"

            var sessionNameTableData = tableRow.insertCell(0)
            var dateTableData = tableRow.insertCell(1)
            var startTimeTableData = tableRow.insertCell(2)
            var endTimeTableData = tableRow.insertCell(3)


            var ActionsTableData = tableRow.insertCell(4)

            //assign class names to table row data
            sessionNameTableData.className = "material-td " + tdLeftStyle;

            dateTableData.className = "material-td " + tdRestStyle;
            startTimeTableData.className = "material-td " + tdRestStyle;
            endTimeTableData.className = "material-td " + tdRestStyle;


            ActionsTableData.className = "material-td " + tdRestStyle;

            //assign IDs
            

            //populate table row with data
            sessionNameTableData.innerHTML = res[x]["sessionName"]
            dateTableData.innerHTML = new Date(res[x]["date"]).toLocaleString()
            startTimeTableData.innerHTML = new Date(res[x]["startTime"]).toLocaleString()
            endTimeTableData.innerHTML = new Date(res[x]["endTime"]).toLocaleString()
            

            

            
            
            //create each action button
            
            // var nominateButton = document.createElement("button");
            //     nominateButton.className = "button button-action"
            //     nominateButton.innerHTML = "Nominate"

            //     //assign the conference id to the button
            //     nominateButton.id = res[x]["conferenceID"]

            //     //assign on click method to the button
            //     nominateButton.onclick = (event) => {
            //         console.log(event.target.id)
            //         sessionStorage.setItem("confID", event.target.id);
            //         window.location.replace("indiv-conference.html");
            //     }

            //     //check if past the deadline
            //     if (new Date(res[x]["conferenceSubmissionDeadline"]) < new Date) {
            //         nominateButton.disabled = true;
            //     }

            //create edit button        
            var editButton = document.createElement("button");
                editButton.className = "button button-action-2"
                editButton.innerHTML = "Edit"
                editButton.id = res[x]["sessionID"]
            //     editButton.onclick = (event) => {

                    
            //         //get the conference from the array that matched the same id as the button
            //         desiredConf = paperTopics.find(o => o.paperID == event.target.id)
                    
            //         inputTopic.value = desiredConf.topicID

            //         selectedPaper = desiredConf.paperID

            //         //show the edit modal
            //         $('#editPaperTopic').modal({ show: true})

            //     }

            // //create delete button
            var deleteButton = document.createElement("button")
                deleteButton.className = "button button-warning"
                deleteButton.innerHTML = "Delete"
                deleteButton.id = res[x]["sessionID"]
                
            //     deleteButton.onclick = (event) => {

            //         //get the conference from the array that matched the same id as the button
            //         desiredConf = conferences.find(o => o.conferenceID == event.target.id)

            //         selectedConference = desiredConf.conferenceID

            //         //show the edit modal
            //         $('#deleteModal').modal({ show: true})
            //     }


            //if an admin, only show edit and delete buttons
            if(sessionStorage.getItem("Role") == "admin") {
                ActionsTableData.appendChild(editButton);
                ActionsTableData.appendChild(deleteButton);
            } 
            
            // //otherwise only show nominate button for presenter
            // else {
            //     conferenceActionsTableData.appendChild(nominateButton);
            // }

            sessionNameTableData.className = "material-td " + tdLeftStyle;

            dateTableData.className = "material-td " + tdRestStyle;
            startTimeTableData.className = "material-td " + tdRestStyle;
            endTimeTableData.className = "material-td " + tdRestStyle;
            

            ActionsTableData.className = "material-td " + tdRestStyle;

            //add table data to row
            tableRow.appendChild(sessionNameTableData);
            tableRow.appendChild(dateTableData);
            tableRow.appendChild(startTimeTableData);
            tableRow.appendChild(endTimeTableData);

            tableRow.appendChild(ActionsTableData);
            

            //add row to table
            sessionTableBody.appendChild(tableRow); 
                
        }

        //populate the session options list
        // for (var i in sessions) {

        //     var sessionFromIndex = sessions[i]
        //     var option = document.createElement("option")

        //         option.textContent = sessionFromIndex.sessionName;
        //         option.value = sessionFromIndex.sessionID;
                
        //     inputSession.appendChild(option)

        //     console.log(sessionFromIndex)

        // }


        
    }).then(() => {

        // //populate the session options list
        for (var i in sessions) {

            var sessionFromIndex = sessions[i]
            var option = document.createElement("option")

                option.textContent = sessionFromIndex.sessionName;
                option.value = sessionFromIndex.sessionID;
                
            inputSession.appendChild(option)

        }

    }).catch(e => {
        console.log(e);

        alert(e.message)
    })

}


// load all active conferences for the admin
const loadPresentationsForConferece = async () => {
    // document.querySelector(".current-groupings-admin-text").innerHTML = "";
    // document.querySelector(".loading-box").style.display = "block"
    // Call all conferences
    await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/presentations-for-conference/" + sessionStorage.getItem("SelectedConferenceForEdit"), {
        method: "GET",
        headers: new Headers({
            Authorization: sessionStorage.getItem("BearerAuth"),
            cache: "no-cache"
        })
     }).then(response  => {

        //if the response != ok
        if(!response === "200") {

            //throw and error
            throw Error(response["message"]);
        }

        return response;

    }).then(response => response.json()).then(res => {
        console.log(res);

        showSpinner(false, loadingSpinner);
        
        // For every conference, call all the presentations associated with it
        for (var x in res) {

            //safely get the session
            var session = res[x]["session"]

            if (session != null || session != undefined) {
                var newTopicPaper = new TopicPaper(res[x]["paper"]["topic"]["topicID"], res[x]["paper"]["paperID"], res[x]["session"]["sessionID"], res[x]['presentationID'])
                paperTopics.push(newTopicPaper)
            } else {
                var newTopicPaper = new TopicPaper(res[x]["paper"]["topic"]["topicID"], res[x]["paper"]["paperID"], "", res[x]['presentationID'])
                paperTopics.push(newTopicPaper)
            }

            

            

            // console.log(res[x]["conferenceName"])

            //create table row data
            var tableRow = conferenceTable.insertRow(-1)
                tableRow.className = "material-tr"

            var sessionNameTableData = tableRow.insertCell(0)
            var dateTableData = tableRow.insertCell(1)
            var startTimeTableData = tableRow.insertCell(2)
            var endTimeTableData = tableRow.insertCell(3)

            var paperNameTableData = tableRow.insertCell(4)
            var publisherTableData = tableRow.insertCell(5)
            var topicTableData = tableRow.insertCell(6)

            var AuthorTableData = tableRow.insertCell(7)

            var ActionsTableData = tableRow.insertCell(8)

            //assign class names to table row data
            sessionNameTableData.className = "material-td " + tdLeftStyle;

            dateTableData.className = "material-td " + tdRestStyle;
            startTimeTableData.className = "material-td " + tdRestStyle;
            endTimeTableData.className = "material-td " + tdRestStyle;
            
            paperNameTableData.className = "material-td " + tdRestStyle;
            publisherTableData.className = "material-td " + tdRestStyle;
            topicTableData.className = "material-td " + tdRestStyle;

            AuthorTableData.className = "material-td " + tdRestStyle;

            ActionsTableData.className = "material-td " + tdRestStyle;

            //assign IDs
            

            //populate table row with data
            

            var sessionName = res[x]["session"]

            if(sessionName == null || sessionName == undefined) {
                sessionNameTableData.innerHTML = "No Session Assigned"
                dateTableData.innerHTML = "NA"
                startTimeTableData.innerHTML = "NA"
                endTimeTableData.innerHTML = "NA"
            } else {
                sessionNameTableData.innerHTML = sessionName["sessionName"]
                dateTableData.innerHTML = new Date(sessionName["date"]).toLocaleString()
                startTimeTableData.innerHTML = new Date(sessionName["startTime"]).toLocaleString()
                endTimeTableData.innerHTML = new Date(sessionName["endTime"]).toLocaleString()
            }

            

            paperNameTableData.innerHTML = res[x]["paper"]["paperTitle"]
            publisherTableData.innerHTML = res[x]["paper"]["paperPublisher"]
            topicTableData.innerHTML = res[x]["paper"]["topic"]["topicName"]

            AuthorTableData.innerHTML = res[x]["user"]["name"]

            
            
            //create each action button

            //create edit button        
            var editButton = document.createElement("button");
                editButton.className = "button button-action-2"
                editButton.innerHTML = "Edit"
                editButton.id = res[x]["paper"]["paperID"]
                editButton.onclick = (event) => {

                    console.log(paperTopics)
                    
                    //get the conference from the array that matched the same id as the button
                    desiredPaper = paperTopics.find(o => o.paperID == event.target.id)
                    
                    inputTopic.value = desiredPaper.topicID
                    inputSession.value = desiredPaper.sessionID
                    

                    selectedPaper = desiredPaper.paperID
                    selectedPresentation = desiredPaper.presentationID

                    //show the edit modal
                    $('#editPaperTopic').modal({ show: true})

                }

            // //create delete button
            var deleteButton = document.createElement("button")
                deleteButton.className = "button button-warning"
                deleteButton.innerHTML = "Delete"
                deleteButton.id = res[x]["presentationID"]
                
            //     deleteButton.onclick = (event) => {

            //         //get the conference from the array that matched the same id as the button
            //         desiredConf = conferences.find(o => o.conferenceID == event.target.id)

            //         selectedConference = desiredConf.conferenceID

            //         //show the edit modal
            //         $('#deleteModal').modal({ show: true})
            //     }


            // //if an admin, only show edit and delete buttons
            if(sessionStorage.getItem("Role") == "admin") {
                ActionsTableData.appendChild(editButton);
                ActionsTableData.appendChild(deleteButton);
            } 
            
            // //otherwise only show nominate button for presenter
            // else {
            //     conferenceActionsTableData.appendChild(nominateButton);
            // }

            //add table data to row
            tableRow.appendChild(sessionNameTableData);
            tableRow.appendChild(dateTableData);
            tableRow.appendChild(startTimeTableData);
            tableRow.appendChild(endTimeTableData);

            tableRow.appendChild(paperNameTableData);
            tableRow.appendChild(publisherTableData);
            tableRow.appendChild(topicTableData);

            tableRow.appendChild(AuthorTableData);

            tableRow.appendChild(ActionsTableData);
            

            //add row to table
            conferenceTableBody.appendChild(tableRow); 
                
            }

            
        }).catch(e => {
            console.log(e);

            alert(e.message)
        })
}

//edit the presentation's paper topic and session id
async function updateSelectedPresentation() {

    //get the topic and session values from the drop down
    const topic = inputTopic.value;
    const session = inputSession.value

    //if neither the selected presentation or selected paper is null
    if (selectedPresentation != null && selectedPaper != null) {

        // console.log(selectedPaper)

        //validation - check that not the first option is select
        if (topic.selectedIndex != "0") {

            //call the patch api end ppoint and include the selected paper
            await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/just-topic-for-paper/" + selectedPaper, {
            method: "PATCH",
            headers: new Headers({
                Authorization: sessionStorage.getItem("BearerAuth"),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "topicID": topic
            })
        }).then(response  => {

            //if the response != ok
            if(!response === "200") {
                //throw and error
                throw Error(response["message"]);
            }

            return response;

        }).then(response => response.json()).then(res => {
            
            //TODO: error handle

        }).catch(e => {
            console.log(e)

            alert(e.message)
        })
    }

        // console.log(selectedPresentation)

        //validation - check that first option is not selected
        if (session.selectedIndex != "0") {
    
            //call the patch api endpoint and pass in the selected presentation id
            await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/presentations/" + selectedPresentation, {
            method: "PATCH",
            headers: new Headers({
                Authorization: sessionStorage.getItem("BearerAuth"),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "conferenceID": sessionStorage.getItem("SelectedConferenceForEdit"), 
                "paperID": selectedPaper,
                "sessionID": session,
                
            })
        }).then(response  => {

            //if the response != ok
            if(!response === "200") {

                

                //throw and error
                throw Error(response["message"]);
            }

            return response;

        }).then(response => response.json()).then(res => {
            // console.log(res)

            //set the selected paper and presetation back to null
            selectedPresentation = null;
            selectedPaper = null;

            //submit the form - will refresh the page and show the updated row
            document.getElementById("editPresentationForm").submit()

        }).catch(e => {
            console.log(e)

            alert(e.message)
        })
        }


    }



   

    
}

async function createSession() {
    const sessionName = document.getElementById("newSessionName");
    
    const sessionDate = $('#sessionDatePicker').datetimepicker('viewDate');
    
    const sessionStartTime = $('#startTimePicker').datetimepicker('viewDate');
    const sessionEndTime = $('#endTimePicker').datetimepicker('viewDate');

    //validation
    if (sessionName.value != "") {

        //convert the dates to utc
        var date = new moment(sessionDate).seconds(0).milliseconds(0).utc();
        var start = new moment(sessionStartTime).seconds(0).milliseconds(0).utc();
        var end = new moment(sessionEndTime).seconds(0).milliseconds(0).utc();

        console.log(date.format())
            
        //patch the edited conference
        await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/sessions", {
        method: "POST",
        headers: new Headers({
            Authorization: sessionStorage.getItem("BearerAuth"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            "sessionName": sessionName.value,
            "date": date.format(), 
            "startTime": start.format(), 
            "endTime": end.format(),
            "conferenceID": sessionStorage.getItem("SelectedConferenceForEdit")
        })
    }).then(response  => {

        //if the response != ok
        if(!response === "200") {

            

            //throw and error
            throw Error(response["message"]);
        }

        return response;

    }).then(response => response.json()).then(res => {
        console.log(res)

        document.getElementById("newSessionForm").submit()
    }).catch(e => {
        console.log(e)
        alert(e.message)
    })
            
    }
}


loadSessionsForConference()
loadSpecificConference()
loadPresentationsForConferece()

