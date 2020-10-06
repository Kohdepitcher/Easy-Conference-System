if(sessionStorage.getItem("Role") != "admin") {
    var org = document.getElementById("organisationsButton");
    org.parentNode.removeChild(org);
}

//Entities
function Organisation(organisationID, organisationName) {
    this.organisationID = organisationID;
    this.organisationName = organisationName;
}

function Conferece(conferenceID, conferenceName, conferenceDate, conferenceDeadLine, organisationID) {
    this.conferenceID = conferenceID;
    this.conferenceName = conferenceName;
    this.conferenceDate = conferenceDate;
    this.conferenceDeadLine = conferenceDeadLine;
    this.organisationID = organisationID;
}

function Topic(topicID, topicName) {
    this.topicID = topicID;
    this.topicName = topicName;
}

//refereces to dom elements
const conferenceTable = document.querySelector(".conference-table");
const conferenceTableRow = document.querySelector(".conference-table-row");
const conferenceTableBody = document.querySelector(".conferece-table-body");

//referece the required new paper fields
var paperNameField = document.getElementById("newPaperNameField");
var paperPubField = document.getElementById("newPaperPublisherField");
var inputTopic = document.getElementById("newPaperTopicSelector");

const loadingSpinner = document.getElementById("loadingSpinner");

const createConferenceButton = document.getElementById("createConferenceButton");

//create form elements
const newConfOrganSelector = document.getElementById("newConferenceOrganisation");

//style consts
const tdLeftStyle = "td-left";
const tdRestStyle = "td-rest";

//array to store all conferences
var conferences = [];

//array to store all the organisations
var organisations = []

//array to track all the topics
var topics = []

//track the selectedConference
var selectedConference = null;

function showSpinner(shouldShow) {
    if (shouldShow == true) {
        loadingSpinner.style.cssText = "display: flex !important"

    } else {
        loadingSpinner.style.cssText = "display: none !important"
    }
}

//load all the organisations
const loadOrganisations = async () => {
    await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/organisations", {
        method: "GET",
        headers: new Headers({
            Authorization: sessionStorage.getItem("BearerAuth"),
            cache: "no-cache"
        })
    }).then(response => response.json()).then(res => {
        console.log(res)
        
        //populate the topics array
        if (res.length != 0) {

            //for each element in the reponse array, loop and push
            for (var organisationResponse in res) {

                //create a new instance of organisation and fill it with the required data
                var newOrganisationn = new Organisation(res[organisationResponse]["organisationID"], res[organisationResponse]["organisationName"]);

                //puah the organisation onto the organisations array
                organisations.push(newOrganisationn)
            }

            


            // populate the organisations options list
            for (var i in organisations) {

                //populate new modal organisation selector
                var topicFromIndex = organisations[i]
                var option = document.createElement("option")

                    option.textContent = topicFromIndex.organisationName;
                    option.value = topicFromIndex.organisationID;
                    
                newConfOrganSelector.appendChild(option);


                var editOption = document.createElement("option");
                    editOption.textContent = topicFromIndex.organisationName;
                    editOption.value = topicFromIndex.organisationID;

                document.getElementById("editConferenceOrganisation").appendChild(editOption);


            }

        }


        
    })
}

// load all active conferences for the admin
const loadActiveConferences = async () => {
    // document.querySelector(".current-groupings-admin-text").innerHTML = "";
    // document.querySelector(".loading-box").style.display = "block"
    // Call all conferences
    await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/conferences", {
        method: "GET",
        headers: new Headers({
            Authorization: sessionStorage.getItem("BearerAuth"),
            cache: "no-cache"
        })
     }).then(response => response.json()).then(res => {
        console.log(res);

        showSpinner(false);
        
        // For every conference, call all the presentations associated with it
        for (var x in res) {

            var newConf = new Conferece(res[x]["conferenceID"],res[x]["conferenceName"],res[x]["conferenceDate"],res[x]["conferenceSubmissionDeadline"], res[x]["organisation"]["organisationID"])
            conferences.push(newConf)

            console.log(res[x]["conferenceName"])

            //create table row data
            var tableRow = conferenceTable.insertRow(-1)//document.createElement("<tr></tr>")
                tableRow.className = "material-tr"

            var conferenceNameTableData = tableRow.insertCell(0)//document.createElement("<td></td>");
            var organisationTableData = tableRow.insertCell(1)//document.createElement("<td></td>");
            var conferenceDateTableData = tableRow.insertCell(2)//document.createElement("<td></td>");
            var conferenceSubDeadlineTableData = tableRow.insertCell(3)//document.createElement("<td></td>");
            var conferenceActionsTableData = tableRow.insertCell(4)

            //assign class names to table row data
            conferenceNameTableData.className = "material-td " + tdLeftStyle;
            organisationTableData.className = "material-td " + tdRestStyle;
            conferenceDateTableData.className = "material-td " + tdRestStyle;
            conferenceSubDeadlineTableData.className = "material-td " + tdRestStyle;
            conferenceActionsTableData.className = "material-td " + tdRestStyle;

            //assign IDs
            

            //populate table row with data
            conferenceNameTableData.innerHTML = res[x]["conferenceName"]
            organisationTableData.innerHTML = res[x]["organisation"]["organisationName"]
            conferenceDateTableData.innerHTML = moment( new Date(res[x]["conferenceDate"]).toString()).format("DD/MM/YYYYY");
            conferenceSubDeadlineTableData.innerHTML = new Date(res[x]["conferenceSubmissionDeadline"]).toLocaleString()

            
            
            //create each action button
            
            var nominateButton = document.createElement("button");
                nominateButton.className = "button button-action"
                nominateButton.innerHTML = "Nominate"

                //assign the conference id to the button
                nominateButton.id = res[x]["conferenceID"]

                //assign on click method to the button
                nominateButton.onclick = (event) => {
                    console.log(event.target.id)
                    sessionStorage.setItem("confID", event.target.id);

                    //get the organisation of the selected conf
                    desiredConf = conferences.find(o => o.conferenceID == event.target.id)

                    //track the selected id
                    selectedConference = desiredConf.conferenceID

                    //clear the topics array incase a different organisation id
                    topics.length = 0;

                    //populate the topic list with the org's topics
                    loadTopics(desiredConf.organisationID)

                    
                    
                    
                    // window.location.replace("indiv-conference.html");

                    //show the create new paper modal
                    $('#createPaperModal').modal({ show: true})




                }

                //check if past the deadline
                if (new Date(res[x]["conferenceSubmissionDeadline"]) < new Date) {
                    nominateButton.disabled = true;
                }

            //create edit button        
            var editButton = document.createElement("button");
                editButton.className = "button button-action-2"
                editButton.innerHTML = "Edit"
                editButton.id = res[x]["conferenceID"]
                editButton.onclick = (event) => {

                    
                    //get the conference from the array that matched the same id as the button
                    desiredConf = conferences.find(o => o.conferenceID == event.target.id)
                    
                    //set the name and organisation selector values from conference
                    document.getElementById("editConferenceName").value = desiredConf.conferenceName
                    document.getElementById("editConferenceOrganisation").value = desiredConf.organisationID

                    //set the date pickers to the conference date and deadline
                    var conferenceDatePicker = $('#editConferenceDatePicker').datetimepicker('date', moment(desiredConf.conferenceDate));
                    var submissionDeadLinePicker = $('#editSubmissionDeadLinePicker').datetimepicker('date', moment(desiredConf.conferenceDeadLine));

                    selectedConference = desiredConf.conferenceID

                    //show the edit modal
                    $('#editModal').modal({ show: true})

                }

            //create edit button        
            var editPresentationsButton = document.createElement("button");
                editPresentationsButton.className = "button button-action"
                editPresentationsButton.innerHTML = "Edit Presentations"
                editPresentationsButton.id = res[x]["conferenceID"]
                editPresentationsButton.onclick = (event) => {

                    
                    //get the conference from the array that matched the same id as the button
                    desiredConf = conferences.find(o => o.conferenceID == event.target.id)

                    sessionStorage.setItem("SelectedConferenceForEdit", desiredConf.conferenceID)
                    
                    
                    window.location.replace("presentations-for-conference.html");
                    
                }

            //create delete button
            var deleteButton = document.createElement("button")
                deleteButton.className = "button button-warning"
                deleteButton.innerHTML = "Delete"
                deleteButton.id = res[x]["conferenceID"]
                
                deleteButton.onclick = (event) => {

                    //get the conference from the array that matched the same id as the button
                    desiredConf = conferences.find(o => o.conferenceID == event.target.id)

                    selectedConference = desiredConf.conferenceID

                    //show the edit modal
                    $('#deleteModal').modal({ show: true})
                }


            //if an admin, only show edit and delete buttons
            if(sessionStorage.getItem("Role") == "admin") {
                conferenceActionsTableData.appendChild(editButton);
                conferenceActionsTableData.appendChild(editPresentationsButton);
                conferenceActionsTableData.appendChild(deleteButton);
            } 
            
            //otherwise only show nominate button for presenter
            else {
                conferenceActionsTableData.appendChild(nominateButton);
            }

            //add table data to row
            tableRow.appendChild(conferenceNameTableData);
            tableRow.appendChild(organisationTableData);
            tableRow.appendChild(conferenceDateTableData);
            tableRow.appendChild(conferenceSubDeadlineTableData);
            tableRow.appendChild(conferenceActionsTableData);

            //add row to table
            conferenceTableBody.appendChild(tableRow); 
                
            }

            
        }).catch(e => {
            console.log(e);

            // alert(e)
        })
}

//submit new conference
async function createConference() {

    
    const conferenceName = document.getElementById("newConferenceName");
    const organisation = document.getElementById("newConferenceOrganisation");
    
    var conferenceDatePicker = $('#conferenceDatePicker').datetimepicker('viewDate');
    var submissionDeadLinePicker = $('#submissionDeadLinePicker').datetimepicker('viewDate');

    //validation
    if (conferenceName.value != "" && organisation.selectedIndex != "0") {

        //convert the dates to utc
        var date = new moment(conferenceDatePicker).seconds(0).milliseconds(0).utc();
        var deadLine = new moment(submissionDeadLinePicker).seconds(0).milliseconds(0).utc();
            
        //patch the edited conference
        const result = await sendNewConferece(conferenceName.value, date.format(), deadLine.format(), organisation.value).then(result => {
            
            //submit the form - will refresh the page and show the new conf
            document.getElementById("newConferenceForm").submit()

        })
    }

    
}

//edit conference
async function updateSelectedConference() {

    //get the name and organisation selector values from conference
    const conferenceName = document.getElementById("editConferenceName")
    const organisation = document.getElementById("editConferenceOrganisation")

    //get the date pickers to the conference date and deadline
    var conferenceDatePicker = $('#editConferenceDatePicker').datetimepicker('viewDate');
    var submissionDeadLinePicker = $('#editSubmissionDeadLinePicker').datetimepicker('viewDate');

    console.log(selectedConference)

    //validation
    if (conferenceName.value != "" && organisation.selectedIndex != "0" && selectedConference != null) {

        //convert the dates to utc
        var date = new moment(conferenceDatePicker).seconds(0).milliseconds(0).utc();
        var deadLine = new moment(submissionDeadLinePicker).seconds(0).milliseconds(0).utc();
            
        
            await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/conferences/" + selectedConference, {
            method: "PATCH",
            headers: new Headers({
                Authorization: sessionStorage.getItem("BearerAuth"),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "name": conferenceName.value,
                "organisationID": organisation.value,
                "date": date.format(),
                "submissionDeadline": deadLine.format()
            })
        }).then(response => response.json()).then(res => {
            // console.log(res)

            //set the selected conference back to null
            selectedConference = null;

            //submit the form - will refresh the page and show the new conf
            document.getElementById("editConferenceForm").submit()

        }).catch(e => {
            console.log(e)

            alert(e.message)
        })
    }

    
}

async function deleteConference() {

    //check if the selected conference id isnt null
    if (selectedConference != null ) {

        //delete the conference
        await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/conferences/" + selectedConference, {
            method: "DELETE",
            headers: new Headers({
                Authorization: sessionStorage.getItem("BearerAuth"),
                'Accept': 'application/json',
                // 'Content-Type': 'application/json'
            }),

            //format the response to json
        }).then(response => response.json()).then(res => {

            //if the response != ok
            if(!res.ok) {

                //throw and error
                throw Error(res["message"]);
            }

        }).then(response => response.json()).then(res => {
            console.log(res)

            //set the selected conference back to null
            selectedConference = null;

            //submit the form - will refresh the page and show the new conf
            document.getElementById("deleteConferenceForm").submit()

        }).catch(e => {
            console.log(e.message)

            alert(e.message)
        })

        //set the selected conference back to null
        selectedConference = null;

    }

}


//creates a new conference
const sendNewConferece = async (name, date, deadLine, organisationID) => {
    await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/conferences", {
        method: "POST",
        headers: new Headers({
            Authorization: sessionStorage.getItem("BearerAuth"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            "name": name,
            "organisationID": organisationID,
            "date": date,
            "submissionDeadline": deadLine
        })
    }).then(response => response.json()).then(res => {
        console.log(res)
    }).catch(e => {
        console.log(e)
    })
}

//updates a conference
const updateConferece = async (confID, name, date, deadLine, organisationID) => {
    await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/conferences/" + confID, {
        method: "PATCH",
        headers: new Headers({
            Authorization: sessionStorage.getItem("BearerAuth"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            "name": name,
            "organisationID": organisationID,
            "date": date,
            "submissionDeadline": deadLine
        })
    }).then(response => response.json()).then(res => {
        // console.log(res)

        //set the selected conference back to null
        selectedConference = null;

    }).catch(e => {
        console.log(e)
    })
}

//fetches the topics for an organisation
const loadTopics = async (organisationID) => {

    await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/topics-for-organisation/" + organisationID, {
        method: "GET",
        headers: new Headers({
            Authorization: sessionStorage.getItem("BearerAuth"),
            cache: "no-cache"
        })
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


        
    })

}

async function createPaperNomination() {

    if (paperNameField.value == "") {
        formMessage.innerHTML = "You must provide a name for the paper"
        
    } else if (paperPubField.value == "") {
        formMessage.innerHTML = "You must provide a publisher for the paper"
        
    } else if (inputTopic.selectedIndex == "0") {
        formMessage.innerHTML = "You must select a topic for the paper"
        
    }
        



    if(paperNameField.value != "" && paperPubField.value != "" && inputTopic.selectedIndex != "0") {

        await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/presentations", {
            method: "POST",
            headers: new Headers({
                Authorization: sessionStorage.getItem("BearerAuth"),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "paperName": paperNameField.value,
                "paperPublisher": paperPubField.value,
                "topicID": inputTopic.value,
                "conferenceID": parseInt(sessionStorage.getItem("confID")),
            })
        }).then(response  => {

            //if the response != ok
            if(!response === "200") {

                //throw and error
                throw Error(response["message"]);
            }

            return response;

        }).then(response => response.json()).then(res => {
            
                //submit the form - will refresh the page
                document.getElementById("newPaperForm").submit()

        }).catch(e => {
            console.log(e)

            alert(e.message)
        })

    }


}

//call the render conferences func
loadActiveConferences();
loadOrganisations();

//hide elements if not admin
if(sessionStorage.getItem("Role") == "admin") {
    
} else {
    createConferenceButton.style.display = "none";
}