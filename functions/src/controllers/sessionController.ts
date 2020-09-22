//import required libraries
import { Request, Response } from "express";

//import database connection
import { connect } from "../config";

import { AuthRoles } from "../globals"

//entities
import { Session } from "../entities/session";
// import { User } from "../entities/user";
// import { Paper } from "../entities/paper";
import { Conference } from "../entities/conference";
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
            newSession.date = date;

            //assign start time
            newSession.startTime = startTime;

            //assign end time
            newSession.endTime = endTime;

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

    // //DELETE
    // //TODO: make this work
    // async deletePresentation(response: Response, request: Request) {

    //     //get the conference id from request parameters
    //     const { conferenceID } = request.params;
    //     console.log("Fetching details for conference: " + conferenceID);

    //     //send error msg if no conferenceID was provided
    //     if (!conferenceID) {
    //         return response.status(400).send({ message: "conference ID is missing from request paramters"});
    //     }

    //     try {

    //             //create connection to database
    //             const conneciton = await connect()

    //             //create reference to conference repository
    //             const repository = conneciton.getRepository(Conference);

    //             //store the fetched conference to update
    //             const fetchedconference = await repository.findOne(conferenceID);

    //             //delete the conference
    //             const deletedconference = await repository.remove(fetchedconference);

    //             return response.status(200).send(deletedconference)
            
    //     } catch (error) {
    //         return handleError(response, error);
    //     }

    // }


    //helper functions
    //handles an error and returns a response to the client


}

function handleError(res: Response, err: any) {
    return res.status(500).send({ message: `${err.code} - ${err.message}` });
}
