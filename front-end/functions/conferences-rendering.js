//Entities
function Organisation(organisationID, organisationName) {
    this.organisationID = organisationID;
    this.organisationName = organisationName;
}

//refereces to dom elements
const conferenceTable = document.querySelector(".conference-table");
const conferenceTableRow = document.querySelector(".conference-table-row");
const conferenceTableBody = document.querySelector(".conferece-table-body");

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

                var topicFromIndex = organisations[i]
                var option = document.createElement("option")

                    option.textContent = topicFromIndex.organisationName;
                    option.value = topicFromIndex.organisationID;
                    
                newConfOrganSelector.appendChild(option)

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
            conferenceDateTableData.innerHTML = new Date(res[x]["conferenceDate"]).toLocaleString()
            conferenceSubDeadlineTableData.innerHTML = new Date(res[x]["conferenceSubmissionDeadline"]).toLocaleString()

            
            
            //create each action button
            //create edit button
            var nominateButton = document.createElement("button");
                nominateButton.className = "button button-action"
                nominateButton.innerHTML = "Nominate"

                //assign the conference id to the button
                nominateButton.id = res[x]["conferenceID"]

                //assign on click method to the button
                nominateButton.onclick = (event) => {
                    console.log(event.target.id)
                    sessionStorage.setItem("confID", event.target.id);
                    window.location.replace("indiv-conference.html");
                }

                //check if past the deadline
                if (new Date(res[x]["conferenceSubmissionDeadline"]) < new Date) {
                    nominateButton.disabled = true;
                }


            var editButton = document.createElement("button");
                editButton.className = "button button-action-2"
                editButton.innerHTML = "Edit"

            var deleteButton = document.createElement("button")
                deleteButton.className = "button button-warning"
                deleteButton.innerHTML = "Delete"
            // <button class="button button-action">Nominate</button>
            // <button class="button button-action-2">Edit</button>
            // <button class="button button-warning">Delete</button>"

            //if an admin, only show edit and delete buttons
            if(sessionStorage.getItem("Role") == "admin") {
                conferenceActionsTableData.appendChild(editButton);
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

    // console.log(conferenceDatePicker.date())
    

    //validation
    if (conferenceName.value != "" && organisation.selectedIndex != "0") {

        //convert the dates to utc
        var date = new moment(conferenceDatePicker).seconds(0).milliseconds(0).utc();
            

        var deadLine = new moment(submissionDeadLinePicker).seconds(0).milliseconds(0).utc();
            

        const result = await sendNewConferece(conferenceName.value, date.format(), deadLine.format(), organisation.value)

    }

    

    // alert("test")

    //submit the form
    document.getElementById("newConferenceForm").submit()
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

//call the render conferences func
loadActiveConferences();
loadOrganisations();

//hide elements if not admin
if(sessionStorage.getItem("Role") == "admin") {
    
} else {
    createConferenceButton.style.display = "none";
}