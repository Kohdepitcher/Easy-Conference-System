//import required libraries
import { Request, Response } from "express";

//import database connection
import { connect } from "../config";

//entities
import { Session } from "../entities/session";
// import { User } from "../entities/user";
// import { Paper } from "../entities/paper";
// import { Conference } from "../entities/conference";
// import { Topic } from "../entities/topic"

/*
    create sessions
        
    
    get sessions
        need to get all for conferenceID for admin
        need to get all for user and show the other 5 users as well
    
    get specific session
        need to get any for admin
        need to get if only the session does belong to the user
    
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
        const { sessionName, date, startTime, endTime } = request.body;
        
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


        try {

            //store an instance of connect for db interaction
            const connection = await connect();

            //store a reference to the requires repositories
            const sessionRepo = connection.getRepository(Session);

            // const conferenceRepo = connection.getRepository(Conference);
            // const topicRepo = connection.getRepository(Topic);
            // const paperRepo = connection.getRepository(Paper);
            // const sessionRepo = connection.getRepository(Presentation);
            // const userRepo = connection.getRepository(User);
            
            //fetch the matching conference
            // const fetchedConference = await conferenceRepo.findOne(conferenceID);

            // if (fetchedConference == undefined || fetchedConference == null) {
            //     return response.status(400).send({ message: "No conference exists that matched conference id: " + conferenceID})
            // }
            
            // //fetch the matching topic
            // const fetchedTopic = await topicRepo.findOne(topicID);

            // if (fetchedTopic == undefined || fetchedTopic == null) {
            //     return response.status(400).send({ message: "No topics exists that matched topic id: " + topicID})
            // }
            
            // //fetch the matching user from firebase auth passed in from res
            // const fetchedUser = await userRepo.findOne(userID)

            // if (fetchedUser == undefined || fetchedUser == null) {
            //     return response.status(400).send({ message: "No user exists that matched user id: " + userID})
            // }

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


    // //READ
    // //TODO: fetch all sessions for user
    // async getPresentationsForUser(request: Request, response: Response) {
        
    //     // get the user id from request parameters
    //     const { userID } = request.params;
    //     console.log("Fetching sessions for userID: " + userID);

    //     //send error msg if no userID was provided
    //     if (!userID) {
    //         return response.status(400).send({ message: "user ID is missing from request paramters"});
    //     }
        
    //     try {
            
    //         //store an instance of connect for db interaction
    //         const connection = await connect()
            
    //         //store references to the required repositories
    //         const sessionRepo = connection.getRepository(Presentation);
    //         //const userRepo = connection.getRepository(User);
            
    //         //all sessions for user
    //         var allPresentationsForUser: Presentation[];
            
    //         //create a query to join the required tables together for the specific user
    //         allPresentationsForUser = await sessionRepo.createQueryBuilder('session')

    //             .select()

    //             //join the relevant paper to the session
    //             .leftJoinAndSelect("session.paper", "Paper")

    //             //join the session to the session
    //             .leftJoinAndSelect("session.session", "Session")

    //             //left join the user so that we only get sessions that match the user uuid
    //             .leftJoin("session.user", "User")
    //             .where("User.UUID = :id", { id: userID })

    //             .getMany();
        

            
    //         //send the array to the client
    //         return response.status(200).send(allPresentationsForUser);
            
    //     } catch (error) {
    //            return handleError(response, error);
    //     }
        
    // }


    // //returns all the sessions from the database
    // async getPresentationsForConference(request: Request, response: Response) {

    //     // get the conference id from request parameters
    //     const { conferenceID } = request.params;
    //     console.log("Fetching sessions for confereceID: " + conferenceID);

    //     //send error msg if no conferenceID was provided
    //     if (!conferenceID) {
    //         return response.status(400).send({ message: "session ID is missing from request paramters"});
    //     }
        
    //     try {
            
    //         //store an instance of connect for db interaction
    //         const connection = await connect()
            
    //         //store references to the required repositories
    //         const sessionRepo = connection.getRepository(Presentation);
    //         //const userRepo = connection.getRepository(User);
            
    //         //all sessions for user
    //         var allPresentationsForConference: Presentation[];
            
    //         //create a query to join the required tables together for the specific user
    //         allPresentationsForConference = await sessionRepo.createQueryBuilder('session')

    //         .select()

    //         //join the relevant paper to the session
    //         .leftJoinAndSelect("session.paper", "Paper")

    //         //join the session to the session
    //         .leftJoinAndSelect("session.session", "Session")

    //         //left join the user so that we only get sessions that match the user uuid
    //         .leftJoinAndSelect("session.conference", "Conference")
    //         .where("Conference.conferenceID = :id", { id: conferenceID })

    //         .getMany();
        

            
    //         //send the array to the client
    //         return response.status(200).send(allPresentationsForConference);
            
    //     } catch (error) {
    //            return handleError(response, error);
    //     }

    // }


    // //return single conference matching conference ID
    // async getSpecificPresentation(request: Request, response: Response) {

    //     // get the conference id from request parameters
    //     const { sessionID } = request.params;
    //     console.log("Fetching session for sessionID: " + sessionID);

    //     //send error msg if no conferenceID was provided
    //     if (!sessionID) {
    //         return response.status(400).send({ message: "session ID is missing from request paramters"});
    //     }
        
    //     try {
            
    //         //store an instance of connect for db interaction
    //         const connection = await connect()
            
    //         //store references to the required repositories
    //         const sessionRepo = connection.getRepository(Presentation);
    //         //const userRepo = connection.getRepository(User);
            
    //         //all sessions for user
    //         var fetchedPresentation: Presentation;
            
    //         //create a query to join the required tables together for the specific user
    //         fetchedPresentation = await sessionRepo.createQueryBuilder('session')

    //         .select()

    //         //join the relevant paper to the session
    //         .leftJoinAndSelect("session.paper", "Paper")

    //         //join the session to the session
    //         .leftJoinAndSelect("session.session", "Session")

    //         .leftJoinAndSelect("session.conference", "Conference")

            
    //         .where("session.sessionID = :id", { id: sessionID })

    //         .getOne();
        

            
    //         //send the array to the client
    //         return response.status(200).send(fetchedPresentation);
            
    //     } catch (error) {
    //            return handleError(response, error);
    //     }

    // }

    // //UPDATE
    // async updatePresentation(request: Request, response: Response) {
                
    //     //get the conference id from request parameters
    //     const { sessionID } = request.params;

    //     //send error msg if no conferenceID was provided
    //     if (!sessionID) {
    //         return response.status(400).send({ message: "session ID is missing from request paramters"});
    //     }

    //     //get the contents of the body and set to a constant
    //     //each word inside is a key to a matching value in the body json
    //     const { conferenceID, paperID } = request.body;
        
    //     //no name in body
    //     if(!conferenceID) {
    //         return response.status(400).send({ message: "Missing conference ID for session"});
    //     }

    //     if(!paperID) {
    //         return response.status(400).send({ message: "Missing paper ID for session"});
    //     }

    //     try {
            
    //         //create connection to database
    //         const connection = await connect()

    //         //store a reference to the requires repositories
    //         const conferenceRepo = connection.getRepository(Conference);
    //         const paperRepo = connection.getRepository(Paper);
    //         const sessionRepo = connection.getRepository(Presentation);


    //         //fetch the matching conference
    //         const fetchedConference: Conference = await conferenceRepo.findOne(conferenceID);

    //         if (fetchedConference == undefined || fetchedConference == null) {
    //             return response.status(400).send({ message: "No conference exists that matched conference id: " + conferenceID})
    //         }

    //         //fetch the matching paper
    //         const fetchedPaper: Paper = await paperRepo.findOne(paperID);

    //         if (fetchedPaper == undefined || fetchedPaper == null) {
    //             return response.status(400).send({ message: "No paper exists that matched paper id: " + paperID})
    //         }

    //         //fetch the matching session
    //         const fetchedPresentation: Presentation = await sessionRepo.findOne(sessionID);

    //         if (fetchedPresentation == undefined || fetchedPresentation == null) {
    //             return response.status(400).send({ message: "No session exists that matched session id: " + sessionID})
    //         }

    //         //update the conference for session
    //         fetchedPresentation.conference = fetchedConference;

    //         //update the paper for session
    //         fetchedPresentation.paper = fetchedPaper

    //         //save the conference back to db
    //         const updatedPresentation = await sessionRepo.save(fetchedPresentation);

    //         //send success to client with copy of update conference
    //         return response.status(200).send(updatedPresentation);

    //     } catch (error) {
    //         return handleError(response, error);
    //     }

    // }

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
