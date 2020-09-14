//import required libraries
import { Request, Response } from "express";

//import database connection
import { connect } from "../config";

//entities
import { Presentation } from "../entities/presentation";
import { User } from "../entities/user";
import { Paper } from "../entities/paper";
import { Conference } from "../entities/conference";
import { Topic } from "../entities/topic"
import { Session } from "../entities/session"

/*
    create presentations
        responsible for also creating papers
    
    get presentations
        need to get all for conferenceID for admin
        need to get all for user
    
    get specific presentation
        need to get any for admin
        need to get if only the presentation does belong to the user

    update a specific presentation
        only allow update if same user
    
    delete specific presentation
        need to delete any if requested by admin
        need to delete only ones owned by user
*/

export class PresentationController {

    //CREATE
    //creates a new presentation in database
    //this is also responsible for creating papers as the relationship is one to one which means its just easier to create it here than to pass in a paperID
    async createPresentation(request: Request, response: Response) {

        //get the contents of the body and set to a constant
        //each word inside is a key to a matching value in the body json
        
        //first we need the required paper details - name, publisher
        //second we need the required topic for paper - topicID
        //third we need the required conference for presentation - conferenceID
        const { paperName, paperPublisher, topicID, conferenceID } = request.body;
        
        //if any of the key value pairs from the body is missing, return a 400 status and error
        if(!paperName) {
            return response.status(400).send({ message: "Missing paper name for paper"});
        }
        
        if(!paperPublisher) {
            return response.status(400).send({ message: "Missing paper publisher for paper"});
        }
        
        if(!topicID) {
            return response.status(400).send({ message: "Missing topic ID for paper"});
        }
        
        if(!conferenceID) {
            return response.status(400).send({ message: "Missing conference ID for presentation"});
        }

        // if(!userID) {
        //     return response.status(400).send({ message: "Missing user ID for presentation"});
        // }

        try {

            //store an instance of connect for db interaction
            const connection = await connect();

            //store a reference to the requires repositories
            const conferenceRepo = connection.getRepository(Conference);
            const topicRepo = connection.getRepository(Topic);
            const paperRepo = connection.getRepository(Paper);
            const presentationRepo = connection.getRepository(Presentation);
            const userRepo = connection.getRepository(User);
            
            //fetch the matching conference
            const fetchedConference = await conferenceRepo.findOne(conferenceID);

            if (fetchedConference == undefined || fetchedConference == null) {
                return response.status(400).send({ message: "No conference exists that matched conference id: " + conferenceID})
            }
            
            //fetch the matching topic
            const fetchedTopic = await topicRepo.findOne(topicID);

            if (fetchedTopic == undefined || fetchedTopic == null) {
                return response.status(400).send({ message: "No topics exists that matched topic id: " + topicID})
            }
            
            //fetch the matching user from firebase auth passed in from res
            const fetchedUser = await userRepo.findOne({UUID: response.locals.uid})

            if (fetchedUser == undefined || fetchedUser == null) {
                return response.status(400).send({ message: "No user exists that matched user id: " + response.locals.uid})
            }

            //check if submission is before the deadline
            const deadLine = fetchedConference.conferenceSubmissionDeadline;

            //if the current UTC time and date is past the UTC deadline, deny the submission
            if (new Date(new Date().toUTCString()) > deadLine ) {
                return response.status(400).send({ message: "Submission denied - past submission deadline" })
            }

            //new paper entry
            const newPaper = new Paper();

            //set the name for the paper
            newPaper.paperTitle = paperName;
            
            //set the publisher for the paper
            newPaper.paperPublisher = paperPublisher;
            
            //set the topic for the paper
            newPaper.topic = fetchedTopic;

            //set the user on the paper
            newPaper.author = fetchedUser;

            //save the new conference to DB
            await paperRepo.save(newPaper);
            
            //create the presentation
            const newPresentation = new Presentation();
            
            //set conference on presentation
            newPresentation.conference = fetchedConference;
            
            //set paper on presentation
            newPresentation.paper = newPaper;
            
            //set user on presentation
            newPresentation.user = fetchedUser;
            
            const savedNewPresentation = await presentationRepo.save(newPresentation);
            

            //send a copy of the new presentation to the server
            //TODO: remove sending newconference to client when its created
            return response.status(200).send(savedNewPresentation);
        }

        catch (error) {
            return handleError(response, error);
        }
    }


    //READ
    //TODO: fetch all presentations for user
    async getPresentationsForUser(request: Request, response: Response) {
        
        // get the user id from request parameters
        const { userID } = request.params;
        console.log("Fetching presentations for userID: " + userID);

        //send error msg if no userID was provided
        if (!userID) {
            return response.status(400).send({ message: "user ID is missing from request paramters"});
        }
        
        try {
            
            //store an instance of connect for db interaction
            const connection = await connect()
            
            //store references to the required repositories
            const presentationRepo = connection.getRepository(Presentation);
            //const userRepo = connection.getRepository(User);
            
            //all presentations for user
            var allPresentationsForUser: Presentation[];
            
            //create a query to join the required tables together for the specific user
            allPresentationsForUser = await presentationRepo.createQueryBuilder('presentation')

                .select()

                //join the relevant paper to the presentation
                .leftJoinAndSelect("presentation.paper", "Paper")

                //join the session to the presentation
                .leftJoinAndSelect("presentation.session", "Session")

                .leftJoinAndSelect("presentation.conference", "Conference")

                //left join the user so that we only get presentations that match the user uuid
                .leftJoin("presentation.user", "User")
                .where("User.UUID = :id", { id: userID })

                .getMany();
        

            
            //send the array to the client
            return response.status(200).send(allPresentationsForUser);
            
        } catch (error) {
               return handleError(response, error);
        }
        
    }


    //returns all the presentations from the database
    async getPresentationsForConference(request: Request, response: Response) {

        // get the conference id from request parameters
        const { conferenceID } = request.params;
        console.log("Fetching presentations for confereceID: " + conferenceID);

        //send error msg if no conferenceID was provided
        if (!conferenceID) {
            return response.status(400).send({ message: "presentation ID is missing from request paramters"});
        }
        
        try {
            
            //store an instance of connect for db interaction
            const connection = await connect()
            
            //store references to the required repositories
            const presentationRepo = connection.getRepository(Presentation);
            //const userRepo = connection.getRepository(User);
            
            //all presentations for user
            var allPresentationsForConference: Presentation[];
            
            //create a query to join the required tables together for the specific user
            allPresentationsForConference = await presentationRepo.createQueryBuilder('presentation')

            .select()

            //join the relevant paper to the presentation
            .leftJoinAndSelect("presentation.paper", "Paper")

            //join the session to the presentation
            .leftJoinAndSelect("presentation.session", "Session")

            //join the users to the presentation
            .leftJoinAndSelect("presentation.user", "User")

            //left join the user so that we only get presentations that match the user uuid
            .leftJoinAndSelect("presentation.conference", "Conference")
            .where("Conference.conferenceID = :id", { id: conferenceID })

            .getMany();
        

            
            //send the array to the client
            return response.status(200).send(allPresentationsForConference);
            
        } catch (error) {
               return handleError(response, error);
        }

    }


    //return single conference matching conference ID
    async getSpecificPresentation(request: Request, response: Response) {

        // get the conference id from request parameters
        const { presentationID } = request.params;
        console.log("Fetching presentation for presentationID: " + presentationID);

        //send error msg if no conferenceID was provided
        if (!presentationID) {
            return response.status(400).send({ message: "presentation ID is missing from request paramters"});
        }
        
        try {
            
            //store an instance of connect for db interaction
            const connection = await connect()
            
            //store references to the required repositories
            const presentationRepo = connection.getRepository(Presentation);
            //const userRepo = connection.getRepository(User);
            
            //all presentations for user
            var fetchedPresentation: Presentation;
            
            //create a query to join the required tables together for the specific user
            fetchedPresentation = await presentationRepo.createQueryBuilder('presentation')

            .select()

            //join the relevant paper to the presentation
            .leftJoinAndSelect("presentation.paper", "Paper")

            //join the session to the presentation
            .leftJoinAndSelect("presentation.session", "Session")

            .leftJoinAndSelect("presentation.conference", "Conference")

            
            .where("presentation.presentationID = :id", { id: presentationID })

            .getOne();
        

            
            //send the array to the client
            return response.status(200).send(fetchedPresentation);
            
        } catch (error) {
               return handleError(response, error);
        }

    }

    //UPDATE
    //TODO: only allow admin to assign session, users shouldnt be able to
    //TODO: user can only update their own
    async updatePresentation(request: Request, response: Response) {
                
        //get the conference id from request parameters
        const { presentationID } = request.params;

        //send error msg if no conferenceID was provided
        if (!presentationID) {
            return response.status(400).send({ message: "presentation ID is missing from request paramters"});
        }

        //get the contents of the body and set to a constant
        //each word inside is a key to a matching value in the body json
        const { conferenceID, paperID, sessionID } = request.body;
        
        //no name in body
        if(!conferenceID) {
            return response.status(400).send({ message: "Missing conference ID for presentation"});
        }

        if(!paperID) {
            return response.status(400).send({ message: "Missing paper ID for presentation"});
        }

        if(!sessionID) {
            return response.status(400).send({ message: "Missing session ID for presentation"});
        }

        try {
            
            //create connection to database
            const connection = await connect()

            //store a reference to the requires repositories
            const conferenceRepo = connection.getRepository(Conference);
            const paperRepo = connection.getRepository(Paper);
            const presentationRepo = connection.getRepository(Presentation);
            const sessionRepo = connection.getRepository(Session);


            //fetch the matching conference
            const fetchedConference: Conference = await conferenceRepo.findOne(conferenceID);

            if (fetchedConference == undefined || fetchedConference == null) {
                return response.status(400).send({ message: "No conference exists that matched conference id: " + conferenceID})
            }

            //fetch the matching paper
            const fetchedPaper: Paper = await paperRepo.findOne(paperID);

            if (fetchedPaper == undefined || fetchedPaper == null) {
                return response.status(400).send({ message: "No paper exists that matched paper id: " + paperID})
            }

            //fetch the matching presentation
            const fetchedPresentation: Presentation = await presentationRepo.findOne(presentationID);

            if (fetchedPresentation == undefined || fetchedPresentation == null) {
                return response.status(400).send({ message: "No presentation exists that matched presentation id: " + presentationID})
            }

            //fetch the matching session
            const fetchedSession: Session = await sessionRepo.findOne(sessionID);

            if (fetchedSession == undefined || fetchedSession == null) {
                return response.status(400).send({ message: "No session exists that matched session id: " + sessionID})
            }

            //update the conference for presentation
            fetchedPresentation.conference = fetchedConference;

            //update the paper for presentation
            fetchedPresentation.paper = fetchedPaper

            //update the session for presentation
            fetchedPresentation.session = fetchedSession;

            //save the conference back to db
            const updatedPresentation = await presentationRepo.save(fetchedPresentation);

            //send success to client with copy of update conference
            return response.status(200).send(updatedPresentation);

        } catch (error) {
            return handleError(response, error);
        }

    }

    //DELETE
    //TODO: make this work
    async deletePresentation(response: Response, request: Request) {

        //get the conference id from request parameters
        const { conferenceID } = request.params;
        console.log("Fetching details for conference: " + conferenceID);

        //send error msg if no conferenceID was provided
        if (!conferenceID) {
            return response.status(400).send({ message: "conference ID is missing from request paramters"});
        }

        try {

                //create connection to database
                const conneciton = await connect()

                //create reference to conference repository
                const repository = conneciton.getRepository(Conference);

                //store the fetched conference to update
                const fetchedconference = await repository.findOne(conferenceID);

                //delete the conference
                const deletedconference = await repository.remove(fetchedconference);

                return response.status(200).send(deletedconference)
            
        } catch (error) {
            return handleError(response, error);
        }

    }


    //helper functions
    //handles an error and returns a response to the client


}

function handleError(res: Response, err: any) {
    return res.status(500).send({ message: `${err.code} - ${err.message}` });
}
