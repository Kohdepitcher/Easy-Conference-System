//refereces to dom elements
const conferenceTable = document.querySelector(".conference-table");
const conferenceTableRow = document.querySelector(".conference-table-row");
const conferenceTableBody = document.querySelector(".conferece-table-body");

//style consts
const tdLeftStyle = "td-left";
const tdRestStyle = "td-rest";

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
        
        // For every conference, call all the presentations associated with it
        for (var x in res) {
            console.log(res[x]["conferenceName"])

            //create table row data
            var tableRow = conferenceTable.insertRow(-1)//document.createElement("<tr></tr>")

            var conferenceNameTableData = tableRow.insertCell(0)//document.createElement("<td></td>");
            var organisationTableData = tableRow.insertCell(1)//document.createElement("<td></td>");
            var conferenceDateTableData = tableRow.insertCell(2)//document.createElement("<td></td>");
            var conferenceSubDeadlineTableData = tableRow.insertCell(3)//document.createElement("<td></td>");
            var conferenceActionsTableData = tableRow.insertCell(4)

            //assign class names to table row data
            conferenceNameTableData.className = tdLeftStyle;
            organisationTableData.className = tdRestStyle;
            conferenceDateTableData.className = tdRestStyle;
            conferenceSubDeadlineTableData.className = tdRestStyle;
            conferenceActionsTableData.className = tdRestStyle;

            //assign IDs
            

            //populate table row with data
            conferenceNameTableData.innerHTML = res[x]["conferenceName"]
            organisationTableData.innerHTML = res[x]["organisation"]["organisationName"]
            conferenceDateTableData.innerHTML = new Date(res[x]["conferenceSubmissionDeadline"]).toLocaleString()
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


            // conferenceData.push(res[x])
            //     var tableNode = document.createElement("div")
            //     var cNode = document.createElement("div")
            //     var sNode = document.createElement("div")
            //     var pNode = document.createElement("div")
            //     var dNode = document.createElement("div")

            //     tableNode.className = "indiv-report-entry"
            //     cNode.className = "indiv-report-part"
            //     sNode.className = "indiv-report-part"
            //     pNode.className = "indiv-report-part"
            //     dNode.className = "indiv-report-part"

            //     tableNode.id = res[x]["conferenceID"]
            //     cNode.id = res[x]["conferenceID"]
            //     sNode.id = res[x]["conferenceID"]
            //     pNode.id = res[x]["conferenceID"]
            //     dNode.id = res[x]["conferenceID"]

            //     console.log(res[x]["conferenceName"])
            //     cNode.innerHTML = res[x]["conferenceName"]
            //     sNode.innerHTML = "Unknown (For Now)"
            //     pNode.innerHTML = res.length
            //     var deadlineDate = new Date(res[x]["conferenceSubmissionDeadline"])
            //     var deadlineMoment = moment(deadlineDate.toString())
            //     dNode.innerHTML = deadlineMoment.format("DD/MM/YYYY HH:mm")

            //     tableNode.onclick = (event) => {
            //         console.log(event.target.id)
            //         sessionStorage.setItem("confID", event.target.id);
            //         window.location.replace("indiv-conference.html");
            //     }

            //     tableNode.appendChild(cNode)
            //     tableNode.appendChild(sNode)
            //     tableNode.appendChild(pNode)
            //     tableNode.appendChild(dNode)

            //     document.querySelector(".current-groupings-admin-text").appendChild(tableNode)

            //     if(parseInt(x) + 1 == res.length) {
            //         document.querySelector(".loading-box").style.display = "none"
            //     }


            // fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/presentations-for-user/" + res[x]["conferenceID"], {
            //     method: "GET",
            //     headers: new Headers({
            //         Authorization: sessionStorage.getItem("BearerAuth"),
            //         cache: "no-cache"
            //     })
            // }).then(response1 => response1.json()).then(res1 => {
                
            // })    
                
            }
        }).catch(e => {
            console.log(e);
        })
}

//call the render conferences func
loadActiveConferences();