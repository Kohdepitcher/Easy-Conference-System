var session = {};

const loadSessions = async () => {
  document.querySelector(".loading-box").style.display = "block";
  await fetch(
    "https://us-central1-easyconferencescheduling.cloudfunctions.net/api/presenters-for-session/" +
      sessionStorage.getItem("sessID"),
    {
      method: "GET",
      headers: new Headers({
        Authorization: sessionStorage.getItem("BearerAuth"),
        cache: "no-cache",
      }),
    }
  )
    .then((response) => response.json())
    .then((res) => {
      // console.log(res)
      if (res.length != 0) {
        session = res;
        console.log(res)

        var sessionNode = document.createElement("div");
        var sessionDate = document.createElement("div");
        var sessionStart = document.createElement("div");
        var sessionEnd = document.createElement("div");
        var sessionPresentations = document.createElement("div");
        var sessionListingArea = document.createElement("div");

        sessionNode.className = "indiv-session";
        sessionDate.className = "indiv-session-section";
        sessionStart.className = "indiv-session-section";
        sessionEnd.className = "indiv-session-section";
        sessionPresentations.className = "indiv-session-section";

        sessionStart.id = session["sessionID"];
        sessionDate.id = session["sessionID"];
        sessionPresentations.id = session["sessionID"];
        sessionEnd.id = session["sessionID"];

        sessionDate.innerHTML = moment(
          new Date(session["date"]).toString()
        ).format("DD/MM/YYYY");
        sessionStart.innerHTML = moment(
          new Date(session["startTime"]).toString()
        ).format("HH:mm");
        sessionEnd.innerHTML = moment(
          new Date(session["endTime"]).toString()
        ).format("HH:mm");
        sessionPresentations.innerHTML = session["presentations"].length;

        sessionListingArea.className =
          "indiv-session-list-area disable-scrolls";
        sessionListingArea.id = "s" + session["sessionID"];

        sessionNode.onclick = (event) => {
          if (
            document.getElementById("s" + event.target.id).style.height == "50%"
          ) {
            document.getElementById("s" + event.target.id).style.height = "0%";
            document.getElementById("s" + event.target.id).style.opacity = "0";
            document.getElementById("s" + event.target.id).innerHTML = "";
          } else {
            document.getElementById("s" + event.target.id).style.height = "50%";
            document.getElementById("s" + event.target.id).style.opacity = "1";

            var presentations = session["presentations"];
            for (var y in presentations) {
              var presentationsNode = document.createElement("div");
              var presentationsTopic = document.createElement("div");
              var presentationsAuthor = document.createElement("div");

              presentationsAuthor.innerHTML = presentations[y]["paper"]["author"]["name"];
              presentationsTopic.innerHTML = presentations[y]["paper"]["paperTitle"];
              

              presentationsNode.className = "indiv-pres";
              presentationsAuthor.className = "indiv-pres-section";
              presentationsTopic.className = "indiv-pres-section";

              presentationsNode.append(presentationsTopic);
              presentationsNode.append(presentationsAuthor);

              document
                .getElementById("s" + event.target.id)
                .appendChild(presentationsNode);
            }
          }
        };

        sessionNode.appendChild(sessionDate);
        sessionNode.appendChild(sessionStart);
        sessionNode.appendChild(sessionEnd);
        sessionNode.appendChild(sessionPresentations);

        document.querySelector(".listing-sessions").appendChild(sessionNode);
        document
          .querySelector(".listing-sessions")
          .appendChild(sessionListingArea);

        document.querySelector(".loading-box").style.display = "none";
      } else {
        document.querySelector(".listing-sessions").innerHTML =
          "No sessions added to this conference.";
        document.querySelector(".loading-box").style.display = "none";
      }
    });
};

loadSessions();
