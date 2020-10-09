//import required libraries
import { Request, Response } from "express";

//import database connection
import { connect } from "../config";

import { AuthRoles, dateFromUTCString} from "../globals"

//entities
import { Session } from "../entities/session";
// import { User } from "../entities/user";
// import { Paper } from "../entities/paper";
import { Conference } from "../entities/conference";
import { Presentation } from "../entities/presentation";
// import { Topic } from "../entities/topic"

/*
    create sessions
        
    
    get sessions
        need to get all for conferenceID for admin
        need to get all for user 
        need to show all users in session and show the other 5 users as well
    
    get specific session
        need to get any for admin
        need to get if only the session does belong to the user

    Update Specific Session
        only admins can update
    
    delete specific session
        need to delete any if requested by admin
        need to delete only ones owned by user
*/

export class SessionController {

    //CREATE
    //creates a new session in database
    async createSession(request: Request, response: Response) {

        //get the contents of the body and set to a constant
        //each word inside is a key to a matching value in the body json
        
        //first we need the required session details - name, date, start time, and end time
        const { sessionName, date, startTime, endTime, conferenceID } = request.body;
        
        //if any of the key value pairs from the body is missing, return a 400 status and error
        if(!sessionName) {
            return response.status(400).send({ message: "Missing session name"});
        }
        
        if(!date) {
            return response.status(400).send({ message: "Missing session date"});
        }
        
        if(!startTime) {
            return response.status(400).send({ message: "Missing start time for session"});
        }
        
        if(!endTime) {
            return response.status(400).send({ message: "Missing end time for session"});
        }

        if(!conferenceID) {
            return response.status(400).send({ message: "Missing conference id for session"});
        }


        try {

            //store an instance of connect for db interaction
            const connection = await connect();

            //store a reference to the requires repositories
            const sessionRepo = connection.getRepository(Session);
            const conferenceRepo = connection.getRepository(Conference);
            
            // fetch the matching conference
            const fetchedConference = await conferenceRepo.findOne(conferenceID);

            if (fetchedConference == undefined || fetchedConference == null) {
                return response.status(400).send({ message: "No conference exists that matched conference id: " + conferenceID})
            }
            

            //new paper entry
            const newSession = new Session();

            //asign name of session
            newSession.sessionName = sessionName;

            //assign date for session
            newSession.date = dateFromUTCString(date);

            //assign start time
            newSession.startTime = dateFromUTCString(startTime);

            //assign end time
            newSession.endTime = dateFromUTCString(endTime);

            //assign the conference to the session
            newSession.conference = fetchedConference

        
            //save the new conference to DB
            const savedNewSession = await sessionRepo.save(newSession);
        

            //send a copy of the new session to the server
            //TODO: remove sending newconference to client when its created
            return response.status(200).send(savedNewSession);
        }

        catch (error) {
            return handleError(response, error);
        }
    }


    //READ
  
    //returns all the sessions from the database for a conferece
    async getSessionsForConference(request: Request, response: Response) {

        // get the conference id from request parameters
        const { conferenceID } = request.params;
        console.log("Fetching sessions for confereceID: " + conferenceID);

        //send error msg if no conferenceID was provided
        if (!conferenceID) {
            return response.status(400).send({ message: "conference ID is missing from request paramters"});
        }
        
        try {
            
            //store an instance of connect for db interaction
            const connection = await connect()
            
            //store references to the required repositories
            const sessionRepo = connection.getRepository(Session);
            //const userRepo = connection.getRepository(User);
            
            //all sessions for user
            var allSessionsForConference: Session[];
            
            //create a query to join the required tables together for the specific user
            allSessionsForConference = await sessionRepo.createQueryBuilder('session')

            .select()

            // //join the relevant paper to the session
            // .leftJoinAndSelect("session.paper", "Paper")

            // //join the session to the session
            // .leftJoinAndSelect("session.session", "Session")

            //need to also join the presentations to the session
            .leftJoinAndSelect("session.presentations", "Presentation")

            //need to also join the paper to each presentation
            .leftJoinAndSelect("Presentation.paper", "Paper")

            .leftJoinAndSelect("Paper.topic", "Topic")

            //need to also join the author to each paper
            .leftJoinAndSelect("Presentation.user", "User")
            // .leftJoinAndSelect("Presentation", "presentation", "presentation.sessionSessionID = session.sessionID")

            // .leftJoinAndSelect("session.presentations.presentation.paper", "Paper")
            // .leftJoinAndSelect("presentation.paper", "Paper")
            // .where("Paper.paperID = Presentation.paperPaperID")

            //need to also join the paper to the presentation
            // .leftJoinAndSelect("paper", "Paper", "Paper.paperID = Presentation.paperPaperID")
            // .leftJoinAndMapMany("presentation.paperPaperID", "paper.paperID", "Paper")

            // .leftJoinAndSelect(Paper, "paper", "paper.paperID = Presentation.paperPaperID")
            // .leftJoinAndMapOne("Presentation.paperPaperID", "Paper.PaperID", "paper")

            //left join the conference to the session so that we only get sessions that match the conference id
            .leftJoinAndSelect("session.conference", "Conference")
            .where("Conference.conferenceID = :id", { id: conferenceID })

            //order by date asc
            .orderBy("session.date", "ASC")

            //then order by start time
            .addOrderBy("session.startTime", "ASC")

            

            .printSql()

            .getMany();
            
        

            
            //send the array to the client
            return response.status(200).send(allSessionsForConference);
            
        } catch (error) {
               return handleError(response, error);
        }

    }

    //TODO: need to show other users in a session
    async getPresentationsWithinSession(request: Request, response: Response) {

        // get the session id from request parameters
        const { sessionID } = request.params;
        console.log("Fetching other presentations for sessionID: " + sessionID);

        //send error msg if no conferenceID was provided
        if (!sessionID) {
            return response.status(400).send({ message: "session ID is missing from request paramters"});
        }
        
        try {
            
            //store an instance of connect for db interaction
            const connection = await connect()
            
            //store references to the required repositories
            const sessionRepo = connection.getRepository(Session);
            //const userRepo = connection.getRepository(User);
            
            //all sessions for user
            var presentersForSession: Session;
            
            //create a query to join the required tables together for the specific user
            presentersForSession = await sessionRepo.createQueryBuilder('session')

            //select everything
            .select()

            //need to also join the presentations to the session
            .leftJoinAndSelect("session.presentations", "Presentation")

            // //need to also join the paper to each presentation
            .leftJoinAndSelect("Presentation.paper", "Paper")

            .leftJoinAndSelect("Paper.topic", "Topic")

            // //need to also join the author to each paper
            .leftJoinAndSelect("Paper.author", "User")

            //only return session that matches the session ID
            .where("session.sessionID = :id", { id: sessionID })

            //order by the presentation id
            .orderBy("Presentation.presentationID")

            .getOne();

            //send the session to the client
            return response.status(200).send(presentersForSession);
            
        } catch (error) {
               return handleError(response, error);
        }

    }

    //returns all the sessions from the database for a conferece
    async getSessionsForUser(request: Request, response: Response) {

        //temp store a UID that will be set soon
        var specifiedUID: string;

        //if a user is a presenter
        if (response.locals.role == AuthRoles.presenter) {

            //fetch the uid from the token instead
            specifiedUID = response.locals.uid;

        } 
        
        //user is a admin
        else if (response.locals.role == AuthRoles.Admin) {

            //if the uid is not set on the parameter when called by an admin
            if (!request.params.userUID) {
                return response.status(400).send({ message: 'Missing user UID when updating details by admin' })
            }

            //set the temp uid to be the one retrieved from the header
            specifiedUID = request.params.userUID;
        }

        // get the conference id from request parameters
        // const { userUID } = request.params;
        console.log("Fetching sessions for userUID: " + specifiedUID);

        //send error msg if no conferenceID was provided
        // if (!specifiedUID) {
        //     return response.status(400).send({ message: "user UID is missing from request paramters"});
        // }
        
        try {
            
            //store an instance of connect for db interaction
            const connection = await connect()
            
            //store references to the required repositories
            const sessionRepo = connection.getRepository(Session);
            //const userRepo = connection.getRepository(User);
            
            //all sessions for user
            var allSessionsForConference: Session[];
            
            //create a query to join the required tables together for the specific user
            allSessionsForConference = await sessionRepo.createQueryBuilder('session')

            .select()

            // //join the relevant paper to the session
            // .leftJoinAndSelect("session.paper", "Paper")

            // //join the session to the session
            // .leftJoinAndSelect("session.session", "Session")

            //need to also join the presentations to the session
            .leftJoinAndSelect("session.presentations", "Presentation")

            //need to also join the paper to each presentation
            .leftJoinAndSelect("Presentation.paper", "Paper")

            .leftJoinAndSelect("Paper.topic", "Topic")

            //need to also join the author to each paper
            .leftJoinAndSelect("Presentation.user", "User")
            // .leftJoinAndSelect("Presentation", "presentation", "presentation.sessionSessionID = session.sessionID")

            // .leftJoinAndSelect("session.presentations.presentation.paper", "Paper")
            // .leftJoinAndSelect("presentation.paper", "Paper")
            // .where("Paper.paperID = Presentation.paperPaperID")

            //need to also join the paper to the presentation
            // .leftJoinAndSelect("paper", "Paper", "Paper.paperID = Presentation.paperPaperID")
            // .leftJoinAndMapMany("presentation.paperPaperID", "paper.paperID", "Paper")

            // .leftJoinAndSelect(Paper, "paper", "paper.paperID = Presentation.paperPaperID")
            // .leftJoinAndMapOne("Presentation.paperPaperID", "Paper.PaperID", "paper")

            //left join the conference to the session so that we only get sessions that match the conference id
            .leftJoinAndSelect("session.conference", "Conference")
            
            
            .where("User.UUID = :id", { id: specifiedUID })

            //order by date asc
            .orderBy("session.date", "ASC")

            //then order by start time
            .addOrderBy("session.startTime", "ASC")

            

            .printSql()

            .getRawMany();
            
        

            
            //send the array to the client
            return response.status(200).send(allSessionsForConference);
            
        } catch (error) {
               return handleError(response, error);
        }

    }


    // //UPDATE
    async updateSession(request: Request, response: Response) {

        const { sessionID } = request.params;

        //error message if sesionID is missing
        if(!sessionID) {
            return response.status(400).send({ message: "session ID is missing from request paramters"});
        }
        
        //first we need the required session details - name, date, start time, and end time
        const { sessionName, date, startTime, endTime, conferenceID } = request.body;
        
        //if any of the key value pairs from the body is missing, return a 400 status and error
        if(!sessionName) {
            return response.status(400).send({ message: "Missing session name"});
        }
        
        if(!date) {
            return response.status(400).send({ message: "Missing session date"});
        }
        
        if(!startTime) {
            return response.status(400).send({ message: "Missing start time for session"});
        }
        
        if(!endTime) {
            return response.status(400).send({ message: "Missing end time for session"});
        }

        if(!conferenceID) {
            return response.status(400).send({ message: "Missing conference id for session"});
        }


        try {

            //store an instance of connect for db interaction
            const connection = await connect();

            //store a reference to the requires repositories
            const sessionRepo = connection.getRepository(Session);
            const conferenceRepo = connection.getRepository(Conference);

            
            // fetch the matching conference
            const fetchedConference = await conferenceRepo.findOne(conferenceID);

            if (fetchedConference == undefined || fetchedConference == null) {
                return response.status(400).send({ message: "No conference exists that matched conference id: " + conferenceID})
            }
            

            //new paper entry
            const fetchedSession = await sessionRepo.findOne(sessionID)

            //asign name of session
            fetchedSession.sessionName = sessionName;

            //assign date for session
            fetchedSession.date = date;

            //assign start time
            fetchedSession.startTime = startTime;

            //assign end time
            fetchedSession.endTime = endTime;

            //assign the conference to the session
            fetchedSession.conference = fetchedConference

        
            //save the new conference to DB
            const savedNewSession = await sessionRepo.save(fetchedSession);
        

            //send a copy of the new session to the server
            //TODO: remove sending newconference to client when its created
            return response.status(200).send(savedNewSession);
        }

        catch (error) {
            return handleError(response, error);
        }
    }

    //DELETE
    //TODO: make this work
    async deleteSession(request: Request, response: Response) {

        //get the sessionID from request parameters
        const { sessionID } = request.params;
        console.log("Fetching details for session: " + sessionID);

        //send error msg if no conferenceID was provided
        if (!sessionID) {
            return response.status(400).send({ message: "session ID is missing from request paramters"});
        }

        try {

                //create connection to database
                const conneciton = await connect()

                //create reference to conference repository
                const repository = conneciton.getRepository(Session);

                //store the fetched conference to update
                const fetchedSession = await repository.findOne(sessionID);

                //delete the conference
                const deleteSession = await repository.remove(fetchedSession);

                return response.status(200).send(deleteSession)
            
        } catch (error) {
            return handleError(response, error);
        }

    }


    async assignSessionsToPresentations(request: Request, response: Response) {

        //get the confID from request parameters
        const { conferenceID } = request.params;

        //send error msg if no conferenceID was provided
        if (!conferenceID) {
            return response.status(400).send({ message: "conference ID is missing from request paramters"});
        }

        try {

            //store an instance of connect for db interaction
            const connection = await connect()
            
            //store references to the required repositories
            const presentationRepo = connection.getRepository(Presentation);
            const sessionRepo = connection.getRepository(Session);
            const conferenceRepo = connection.getRepository(Conference);

            // fetch the matching conference
            const fetchedConference = await conferenceRepo.findOne(conferenceID);

            //if the conference doesnt exist, break early and show user error
            if (fetchedConference == undefined || fetchedConference == null) {
                return response.status(400).send({ message: "No conference exists that matched conference id: " + conferenceID})
            }

            //if a conferece does exist, delete all the sessions related to the conferece
            // NOTE this a realy stupid fix to assigning sessions to exisitng sessions that have less than 6
            // if we had more time, this would have a better solution than simply just jumping all the sessions and recreating them
            await sessionRepo.createQueryBuilder('session')
                .delete()
                .where("session.conferenceConferenceID = :id", { id: conferenceID })
                .execute();




            var sessionlessPresentations: Presentation[]; // List of presentations that dont have a session
            var unfullSessions: Session[]// List of sessions that aren't already full

            //fill the sessionless presentations array with all presentations that dont have a session assigned
            sessionlessPresentations = await presentationRepo.createQueryBuilder('presentation')

                .select()

                //join the relevant paper to the presentation
                .leftJoinAndSelect("presentation.paper", "Paper")

                .leftJoinAndSelect("Paper.topic", "Topic")

                //join the session to the presentation
                .leftJoinAndSelect("presentation.session", "Session")

                //join the users to the presentation
                .leftJoinAndSelect("presentation.user", "User")

                //left join the user so that we only get presentations that match the user uuid
                .leftJoinAndSelect("presentation.conference", "Conference")
                .leftJoinAndSelect("Conference.organisation", "Organisation")

                //only want the presentations for conference
                .where("Conference.conferenceID = :id", { id: conferenceID })

                //and only want where they havent got a session assigned
                .andWhere("presentation.sessionSessionID IS NULL")

                .getMany();


            const tempSessions = await sessionRepo.createQueryBuilder('session')

                .select()

                //need to also join the presentations to the session
                .leftJoinAndSelect("session.presentations", "Presentation")

                //need to also join the paper to each presentation
                .leftJoinAndSelect("Presentation.paper", "Paper")

                .leftJoinAndSelect("Paper.topic", "Topic")

                //need to also join the author to each paper
                .leftJoinAndSelect("Presentation.user", "User")


                //left join the conference to the session so that we only get sessions that match the conference id
                .leftJoinAndSelect("session.conference", "Conference")
                .where("Conference.conferenceID = :id", { id: conferenceID })

                // .andWhere("Count(Presentation.presentationID) < 6")

                // .groupBy("Presentation.presentationID")

                //order by date asc
                .orderBy("session.date", "ASC")

                //then order by start time
                .addOrderBy("session.startTime", "ASC")

        
                .printSql()

                .getMany();

            //filter out sessions that have 6 presentations
            unfullSessions = tempSessions.filter(function(a) {

                //return true if the length of the presentation array is less than 6
                return a.presentations.length < 6;
            })


            var averageTimezone = 0
            var totalTimezone = 0

            if (sessionlessPresentations.length > 0 ) {
           
                for(var a in sessionlessPresentations) {

                    var zone = sessionlessPresentations[a].user.timeZone//["user"]["timeZone"]
                    console.log(zone)

                    // if (unfullSessions[0].presentations.length != 0 ) {
                    
                            for(var b in unfullSessions) {

                                var totalTimezone = 0

                                for(var c in unfullSessions[b].presentations) {
                                    
                                    totalTimezone += unfullSessions[b].presentations[c].user.timeZone
                    
                                    if(parseInt(c) + 1 == unfullSessions[b].presentations.length) {

                                        averageTimezone = Math.round(totalTimezone / unfullSessions[b].presentations.length)

                                        

                                        try {
                                            console.log("Sessionless presentation topic name: " + sessionlessPresentations[a].paper.topic.topicName)
                                            console.log("unfull session presentation topic name: " + unfullSessions[b].presentations[0].paper.topic.topicName)

                                            if((zone >= averageTimezone - 3) && (zone <= averageTimezone + 3) && (sessionlessPresentations[a].paper.topic.topicName == unfullSessions[b].presentations[0].paper.topic.topicName)) {
                                            
                                                unfullSessions[b].presentations.push(sessionlessPresentations[a]) // Update session to include the new presentation
                                                
                                                sessionlessPresentations.splice(parseInt(a), 1) // remove presentation from sessionlessPresentations array
                                            }
                                        } catch (err) {
                                            console.log(err)
                                        }
                                        
                                        
                                    }
                                }
                    
                                if(unfullSessions[b]["presentations"].length == 6) {
                                    unfullSessions.splice(parseInt(b), 1)
                                }
                            }
                    // }
                }

                    groupSessionsToTimezone(sessionlessPresentations, 3)

        
            }



            return response.status(200).send("Successfully generated sessions for conference");

        } catch (error) {
            return handleError(response, error);
        }


    }

}

// function range(start, stop, step) {
//     if (typeof stop == 'undefined') {
//         // one param defined
//         stop = start;
//         start = 0;
//     }

//     if (typeof step == 'undefined') {
//         step = 1;
//     }

//     if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
//         return [];
//     }

//     var result = [];
//     for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
//         result.push(i);
//     }

//     return result;
// };

const rangeCreator = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);

function handleError(res: Response, err: any) {
    return res.status(500).send({ message: `${err.code} - ${err.message}` });
}

function groupSessionsToTimezone(presentations: Presentation[], days: number) {

    var usedTopics = []

    for(var x in presentations) {
        if(!usedTopics.includes(presentations[x].paper.topic.topicName)) {
            usedTopics.push(presentations[x].paper.topic.topicName)
        }
    }

    var sortedPres = presentations.sort((a: Presentation, b: Presentation) => {
        return Number(a.user.timeZone) - Number(b.user.timeZone)
    })

    var arrangedSessions = []

    // Works 
    var range = sortedPres[sortedPres.length - 1].user.timeZone - sortedPres[0].user.timeZone
    console.log("Range: " + range)
    if(range == 0) {

        var sessionCount = 0;

        for(var w in usedTopics) {
            var currentTopic = usedTopics[w]

            var newSession: any[] = sortedPres.filter(sess => sess.paper.topic.topicName == currentTopic);
            var numberOfSessions = Math.ceil(newSession.length / 6)

            //store a count of matching sessions for topic
            var matchingSessionsCount = 0;

            for(var z = 0; z < numberOfSessions; z++) {

                var addableSession = newSession.splice(0, 6);
                arrangedSessions.push(addableSession);

                //increment the matching session count
                //will count up if there is multiple sessions with the same topic
                matchingSessionsCount += 1;
                sessionCount += 1;
                console.log("session Count:" + matchingSessionsCount)

                //create a session for the topic using the array of 6 presentations
                createSessionForPresentation(addableSession, days, matchingSessionsCount, sessionCount)
            }
        }
    }

    //this code will now never execute since we now delete all sessions to assign presentations to new sessions
    // else {
    //     // Works
    //     var splits = Math.ceil(range / days)

    //     // console.log(range)

    //     // Works
    //     var hourDiff = Math.ceil(range / splits)

    //     for(var w in usedTopics) {

    //         var currentTopic = usedTopics[w]

    //         const splitRange = rangeCreator(0, splits);


    //         for(let x of splitRange) {

    //             var newSession = []
    //             var splitStart = 0
        
    //             if(x == 0) {
    //                 splitStart = sortedPres[0].user.timeZone
    //             }
    //             else {
    //                 splitStart = sortedPres[0].user.timeZone + (hourDiff * x) + 1
    //             }
        
    //             var splitIncrease = hourDiff
    //             var splitLimit = sortedPres[0].user.timeZone + (hourDiff * x) + splitIncrease
        
    //             newSession = sortedPres.filter(sess => sess.user.timeZone <= splitLimit && sess.user.timeZone >= splitStart && sess.paper.topic.topicName == currentTopic);
    //             var numberOfSessions = Math.ceil(newSession.length / 6)
    //             // console.log(newSession)
        
    //             for(var z = 0; z < numberOfSessions; z++) {
    //                 var addableSession = newSession.splice(0, 6);
    //                 arrangedSessions.push(addableSession);
                    
    //                 createSessionForPresentation(addableSession, splits, 1);
    //                 console.log("splits: " + splits)
    //             }
    //         }
    //     }
    // }

    console.log(arrangedSessions)


}

//creates a session and assigns an array of presentations to it
async function createSessionForPresentation(presentations: Presentation[], days: number, matchingSessionsCount: number, sessionCount: number) {

    //how many sessions per day
    const maxSessionsPerDay = 4;

    try {

        //store an instance of connect for db interaction
        const connection = await connect()

        //store references to the required repositories
        // const presentationRepo = connection.getRepository(Presentation);
        const sessionRepo = connection.getRepository(Session);

        const conferenceRepo = connection.getRepository(Conference);
            
        // fetch the matching conference
        const fetchedConference = await conferenceRepo.findOne(presentations[0].conference.conferenceID);

        // if (fetchedConference == undefined || fetchedConference == null) {
        //     return response.status(400).send({ message: "No conference exists that matched conference id: " + conferenceID})
        // }

        //figure out how many days to add the session based on the total count of sessions so far divided by the allowed amount of sessions per day minus 1
        //the minus 1 is because we want the first sessions to occure on the same day of the conference
        var numberOfDaysToAdd = Math.ceil((sessionCount / maxSessionsPerDay) - 1)

        //new paper entry
        const newSession = new Session();

        const date = presentations[0].conference.conferenceDate
        const dateWithAddedOffset = new Date(date.setUTCDate(date.getUTCDate() + numberOfDaysToAdd));

        //store the starting time for session, calculated later on
        var startingTime: Date;

        //store the endtinf time for session, calculated later on
        var endingTime: Date;

        //determine times based on the number of days to add
        if (numberOfDaysToAdd == 0) {
            startingTime = new Date(dateWithAddedOffset.setUTCHours(13,30,0));
            endingTime = new Date(dateWithAddedOffset.setUTCHours(18,0,0));
        } 
        
        //if the day is after the first day of the conference
        else {
            startingTime = new Date(dateWithAddedOffset.setUTCHours(9,0,0));
            endingTime = new Date(dateWithAddedOffset.setUTCHours(12,0,0));
        }


            //asign name of session
            newSession.sessionName = presentations[0].paper.topic.topicName + " " + matchingSessionsCount;// + " " + String(matchingSession.length + 1)

            //assign date for session
            newSession.date = dateWithAddedOffset

            //assign start time
            newSession.startTime = startingTime;

            //assign end time
            newSession.endTime = endingTime;

            //assign the array of presentations to this new session
            newSession.presentations = presentations;

            //assign the conference to the session
            newSession.conference = fetchedConference

            
            //save the new conference to DB
            await sessionRepo.save(newSession);

    } catch (err) {
        console.error(err)
    }

}