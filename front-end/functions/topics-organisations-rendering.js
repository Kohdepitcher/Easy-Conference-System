//entities
function Organisation(organisationID, organisationName) {
    this.organisationID = organisationID;
    this.organisationName = organisationName;
}

function Topic(topicID, topicName) {
    this.topicID = topicID;
    this.topicName = topicName;
}

//array to store all the organisations
var organisations = []

//array to store all the topics for selected organisation
var topics = []

//track selected organisation id
var selectedOrganisationID = null;

//track selected topic id
var selectedTopicID = null;

//refereces to dom elements
const selectedOrganisationSelector = document.getElementById("selectedOrganisation");

const organisationTable = document.getElementById("organisation-table");
const organisationTableRow = document.getElementById("organisation-table-row");
const organisationTableBody = document.getElementById("organisation-table-body");

const createTopicButton = document.getElementById("createTopicButton");
const topicTable = document.getElementById("topic-table");
const topicTableRow = document.getElementById("topic-table-row");
const topicTableBody = document.getElementById("topic-table-body");

const loadingOrganisationsSpinner = document.getElementById("loadingOrganisationsSpinner");
const loadingTopicsSpinner = document.getElementById("loadingTopicsSpinner");

//buttons
const newOrgButton = document.getElementById("newOrgButton");
const editOrgButton = document.getElementById("editOrgButton");
const deleteOrgButton = document.getElementById("deleteOrgButton");

const newTopicButton = document.getElementById("newTopicButton");
const editTopicButton = document.getElementById("editTopicButton");
const deleteTopicButton = document.getElementById("deleteTopicButton");

//style consts
const tdLeftStyle = "td-left";
const tdRestStyle = "td-rest";

function showSpinner(shouldShow, spinner) {
    if (shouldShow == true) {
        spinner.style.cssText = "display: flex !important"

    } else {
        spinner.style.cssText = "display: none !important"
    }
}

function showSpinnerInButton(button, text, show) {

    if (show) {

        button.innerHTML = `
    
            <div class="spinner-border text-light" role="status">
                <span class="sr-only">Loading...</span>
            </div>

         `;
    } else {
        button.innerHTML = text;
    }

    
}

//populate the organisation Select List
function populateOrganisationSelectList() {
    
    // populate the organisations options list
    for (var i in organisations) {

        //populate new modal organisation selector
        var organisationFromIndex = organisations[i]

        var editOption = document.createElement("option");
            editOption.textContent = organisationFromIndex.organisationName;
            editOption.value = organisationFromIndex.organisationID;

        document.getElementById("selectedOrganisation").appendChild(editOption);

    }

}

function selectionDidChange() {
    console.log("selection changed: " + selectedOrganisationSelector.value)

    //clear the topics table body to remove old topics
    topicTableBody.innerHTML = "";

    //show the topics spinner
    showSpinner(true, loadingTopicsSpinner);

    //load the topics for the selected organisation
    loadTopicsForSelectedOrganisation(selectedOrganisationSelector.value)

    //enable create topic button
    createTopicButton.disabled = false;
}

//populate the organisation table
function populateOrganisationTable() {

    //hide the organisation spinner
    showSpinner(false, loadingOrganisationsSpinner);

    for ( var i in organisations) {

                //create new table row
                var tableRow = organisationTable.insertRow(-1)
                tableRow.className = "material-tr"
    
                var organisationNameTableData = tableRow.insertCell(0)
                var organisationActionsTableData = tableRow.insertCell(1)
    
                //assign class names to table row data
                organisationNameTableData.className = "material-td " + tdLeftStyle;
                organisationActionsTableData.className = "material-td " + tdRestStyle;
    
                //assign IDs
                
    
                //populate table row with data
                organisationNameTableData.innerHTML = organisations[i].organisationName;


                //create each action button    
                //create edit button        
                var editButton = document.createElement("button");
                    editButton.className = "button button-action-2"
                    editButton.innerHTML = "Edit"
                    editButton.id = organisations[i].organisationID;
                    editButton.onclick = (event) => {
    
                        
                        //get the organisation from the array that matched the same id as the button
                        desiredOrg = organisations.find(o => o.organisationID == event.target.id)
                        
                        //set the name and organisation selector values from conference
                        document.getElementById("editOrganisationName").value = desiredOrg.organisationName;
    
                        selectedOrganisationID = desiredOrg.organisationID;
    
                        //show the edit modal
                        $('#editOrganisationModal').modal({ show: true})
    
                    }
    
                //create delete button
                var deleteButton = document.createElement("button")
                    deleteButton.className = "button button-warning"
                    deleteButton.innerHTML = "Delete"
                    deleteButton.id = organisations[i].organisationID;
                    
                    deleteButton.onclick = (event) => {
    
                        //get the organisation from the array that matched the same id as the button
                        desiredOrg = organisations.find(o => o.organisationID == event.target.id)
    
                        selectedOrganisationID = desiredOrg.organisationID
    
                        //show the edit modal
                        $('#deleteOrgganisationModal').modal({ show: true})
                    }
    
    
                //if an admin, only show edit and delete buttons
                if(sessionStorage.getItem("Role") == "admin") {
                    organisationActionsTableData.appendChild(editButton);
                    organisationActionsTableData.appendChild(deleteButton);
                } 
                
                //otherwise only show nominate button for presenter
                else {
                    organisationActionsTableData.appendChild(nominateButton);
                }
    
                //add table data to row
                tableRow.appendChild(organisationNameTableData);
                tableRow.appendChild(organisationActionsTableData);
    
                //add row to table
                organisationTableBody.appendChild(tableRow); 

    }

}

function populateTopicsTable() {

    showSpinner(false, loadingTopicsSpinner);

    for ( var i in topics) {

        //create new table row
        var tableRow = topicTable.insertRow(-1)
        tableRow.className = "material-tr"

        var topicNameTableData = tableRow.insertCell(0)
        var topicActionsTableData = tableRow.insertCell(1)

        //assign class names to table row data
        topicNameTableData.className = "material-td " + tdLeftStyle;
        topicActionsTableData.className = "material-td " + tdRestStyle;

        //assign IDs
        

        //populate table row with data
        topicNameTableData.innerHTML = topics[i].topicName;


        //create each action button    
        //create edit button        
        var editButton = document.createElement("button");
            editButton.className = "button button-action-2"
            editButton.innerHTML = "Edit"
            editButton.id = topics[i].topicID;
            editButton.onclick = (event) => {

                
                //get the topic from the array that matched the same id as the button
                desiredTopic = topics.find(o => o.topicID == event.target.id)

                console.log(desiredTopic)
                
                //set the name and organisation selector values from conference
                document.getElementById("editTopicName").value = desiredTopic.topicName


                selectedTopicID = desiredTopic.topicID;

                //show the edit modal
                $('#editTopicModal').modal({ show: true})

            }

        //create delete button
        var deleteButton = document.createElement("button")
            deleteButton.className = "button button-warning"
            deleteButton.innerHTML = "Delete"
            deleteButton.id = topics[i].topicID;
            
            deleteButton.onclick = (event) => {

                //get the topic from the array that matched the same id as the button
                desiredTopic = topics.find(o => o.topicID == event.target.id)

                selectedTopicID = desiredTopic.topicID;


                //show the edit modal
                $('#deleteTopicModal').modal({ show: true})
            }


        //if an admin, only show edit and delete buttons
        if(sessionStorage.getItem("Role") == "admin") {
            topicActionsTableData.appendChild(editButton);
            topicActionsTableData.appendChild(deleteButton);
        } 
        
        //otherwise only show nominate button for presenter
        else {
            topicActionsTableData.appendChild(nominateButton);
        }

        //add table data to row
        tableRow.appendChild(topicNameTableData);
        tableRow.appendChild(topicActionsTableData);

        //add row to table
        topicTableBody.appendChild(tableRow); 

}

}


//load all the organisations and populate table and drop down selector
const loadOrganisations = async () => {
    await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/organisations", {
        method: "GET",
        headers: new Headers({
            Authorization: sessionStorage.getItem("BearerAuth"),
            cache: "no-cache"
        })
    }).then(response => response.json()).then(res => {
        console.log(res)
        
        
        if (res.length != 0) {

            //for each element in the reponse array, loop and push
            for (var organisationResponse in res) {

                //create a new instance of organisation and fill it with the required data
                var newOrganisationn = new Organisation(res[organisationResponse]["organisationID"], res[organisationResponse]["organisationName"]);

                //puah the organisation onto the organisations array
                organisations.push(newOrganisationn)
            }

        }

    }).then(() => {

        //populate the organisation Select List
        populateOrganisationSelectList()

        //populate the organisation table
        populateOrganisationTable()
    
    }).catch(e => {
        console.log(e);

        alert(e)
    })
}

//load topics for organisationID
const loadTopicsForSelectedOrganisation = async (organisationID) => {

    //empty the topics array to remove topics for other organisations
    topics.splice(0, topics.length);

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
        }

    }).then(() => {
        populateTopicsTable()
    })

}

//create organistion
async function createOrganisation() {

    showSpinnerInButton(newOrgButton, "Create", true);

    //get the name of the organisation
    const organisationName = document.getElementById("newOrganisationName")

    if (organisationName.value != "") {

        await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/organisations", {
            method: "POST",
            headers: new Headers({
                Authorization: sessionStorage.getItem("BearerAuth"),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "name": organisationName.value,
            })
        }).then(response  => {

            //if the response != ok
            if(!response === "200") {

                

                //throw and error
                throw Error(response["message"]);
            }

            return response;

        }).then(response => response.json()).then(res => {
            
            //submit the form - will refresh the page and show the new conf
            document.getElementById("newOrganisationForm").submit()

        }).catch(e => {
            console.log(e)

            alert(e.message)
        })

    }

    showSpinnerInButton(newOrgButton, "Create", false);

}

//update organisation
async function editOrganisation() {

    showSpinnerInButton(editOrgButton, "save", true);

    //get the name of the organisation
    const organisationName = document.getElementById("editOrganisationName")

    if (organisationName.value != "" && selectedOrganisationID != null) {

        await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/organisations/" + selectedOrganisationID, {
            method: "PATCH",
            headers: new Headers({
                Authorization: sessionStorage.getItem("BearerAuth"),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "name": organisationName.value,
            })
        }).then(response  => {

            //if the response != ok
            if(!response === "200") {

                //throw and error
                throw Error(response["message"]);
            }

            return response;

        }).then(response => response.json()).then(res => {
            
            //submit the form - will refresh the page and show the new conf
            document.getElementById("editOrganisationForm").submit()

        }).catch(e => {
            console.log(e)

            alert(e.message)
        })

    }

    showSpinnerInButton(editOrgButton, "Save", false);

}

//update organisation
async function deleteOrganisation() {

    showSpinnerInButton(deleteOrgButton, "Delete", true);

    if (selectedOrganisationID != null) {

        await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/organisations/" + selectedOrganisationID, {
            method: "PATCH",
            headers: new Headers({
                Authorization: sessionStorage.getItem("BearerAuth"),
                'Accept': 'application/json'
                
            })
        }).then(response  => {

            //if the response != ok
            if(!response === "200") {

                //throw and error
                throw Error(response["message"]);
            }

            return response;

        }).then(response => response.json()).then(res => {
            
            //submit the form - will refresh the page and show the new conf
            document.getElementById("deleteOrganisationForm").submit()

        }).catch(e => {
            console.log(e)

            alert(e.message)
        })

    }

    showSpinnerInButton(deleteOrgButton, "Delete", false);

}

async function createTopic() {

    showSpinnerInButton(newTopicButton, "create", true);

    //get the name of the organisation
    const topicName = document.getElementById("newTopicName")

    if (topicName.value != "") {

        await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/topics", {
            method: "POST",
            headers: new Headers({
                Authorization: sessionStorage.getItem("BearerAuth"),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "name": topicName.value,
                "organisationID": selectedOrganisationSelector.value
            })
        }).then(response  => {

            // console.log(response.ok)

            //if the response != ok
            if(!response === "200") {

                //throw and error
                throw Error(response["message"]);
            }

            return response;

        }).then(response => response.json()).then(res => {
            
            //submit the form - will refresh the page and show the new conf
            document.getElementById("newTopicForm").submit()

        }).catch(e => {
            console.log(e)

            alert(e.message)
        })

    }

    showSpinnerInButton(newTopicButton, "Create", false);

}

async function editTopic() {

    showSpinnerInButton(editTopicButton, "save", true);

    //get the name of the organisation
    const topicName = document.getElementById("editTopicName")

    if (topicName.value != "" && selectedTopicID != null) {

        await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/topics/" + selectedTopicID, {
            method: "PATCH",
            headers: new Headers({
                Authorization: sessionStorage.getItem("BearerAuth"),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "name": topicName.value,
                "organisationID": selectedOrganisationSelector.value
            })
        }).then(response  => {

            //if the response != ok
            if(!response === "200") {

                //throw and error
                throw Error(response["message"]);
            }

            return response;

        }).then(response => response.json()).then(res => {
            
            //submit the form - will refresh the page and show the new conf
            document.getElementById("editTopicForm").submit()

        }).catch(e => {
            console.log(e)

            alert(e.message)
        })

    }

    showSpinnerInButton(editTopicButton, "Save", false);

}

async function deleteTopic() {

    showSpinnerInButton(deleteTopicButton, "Delete", true);

    // continue if the selected topic is not null
    if (selectedTopicID != null) {

        //send request to server to delete specific topic
        await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/topics/" + selectedTopicID, {
            method: "DELETE",
            headers: new Headers({
                Authorization: sessionStorage.getItem("BearerAuth"),
                'Accept': 'application/json'
            }),
        }).then(response  => {

            //if the response != ok
            if(!response === "200") {

                

                //throw and error
                throw Error(response["message"]);

            }

            return response;

        }).then(response => response.json()).then(res => {

            
            //submit the form - will refresh the page and show the new conf
            document.getElementById("deleteTopicForm").submit()

        }).catch(e => {
            console.log(e)

            alert(e.message)
        })

    }

    showSpinnerInButton(deleteTopicButton, "Delete", false);

}

//hide the topics spinner
showSpinner(false, loadingTopicsSpinner)

//load organisations from backend
loadOrganisations()
