var conferenceData = []

const createConference = async (name, orgID, deadline) => {
    await fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/conferences", {
        method: "POST",
        headers: new Headers({
            Authorization: sessionStorage.getItem("BearerAuth"),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            "name": name,
            "organisationID": orgID,
            "submissionDeadline": deadline
        })
    }).then(response => response.json()).then(res => {
        console.log(res)
    }).catch(e => {
        console.log(e)
    })
}

// createConference("Ceej's Conf", 1, "2020-09-12 12:00:00")

// fetch("https://us-central1-easyconferencescheduling.cloudfunctions.net/api/topics/2?fbclid=IwAR2TK98wzUvvB5Hh8z8CF8eVSpLYR3I0BxCxJQLLyWVOU_m-zSNCjhqmKSM").then(response => response.json()).then(res => {
//     console.log(res)
// })