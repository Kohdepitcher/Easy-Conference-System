//import required libraries
import { Request, Response } from "express";

//import database connection
import { connect } from "../config";

//entities
import { Presentation } from "../entities/presentation";
import { User } from "../entities/user";
import { Paper } from "../entities/paper";
import { Conference } from "../entities/conference";

/*
    create presentations
        responsible for also creating papers
    
    get presentations
        need to get all for conferenceID for admin
        need to get all for user
    
    get specific presentation
        need to get any for admin
        need to get if only the presentation does belong to the user
    
    delete specific presentation
        need to delete any if requested by admin
        need to delete only ones owned by user
*/

export class PresentationController {

    //CREATE
    //creates a new presentation in database
    //this is also responsible for creating papers as the relationship is one to one which means its just easier to create it here than to pass in a paperID
    async createconPresentation(request: Request, response: Response) {

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
            const fetchedConference = await conferenceRepo.find(conferenceID);
            
            //fetch the matching topic
            const fetchedTopic = await topicRepo.find(topicID);
            
            //fetch the matching user from firebase auth passed in from res

            //new paper entry
            const newPaper = new Paper();

            //set the name for the paper
            newPaper.paperTitle = paperName;
            
            //set the publisher for the paper
            newPaper.paperPublisher = paperPublisher;
            
            //set the topic for the paper
            newPaper.topic = fetchedTopic;

            //save the new conference to DB
            await paperRepo.save(newPaper);
            
            //create the presentation
            const newPresentation = new Presentation();
            
            //set conference on presentation
            newPresentation.conference = fetchedConference;
            
            //set paper on presentation
            newPresentation.paper = newPaper;
            
            //set user on presentation
            //newPresentation.user = fetchedUser;
            
            const savedNewPresentation = await presentationRepo.save(newPresentation);
            

            //send a copy of the new conference to the server
            //TODO: remove sending newconference to client when its created
            return response.status(200).send(newSavedconference);
        }

        catch (error) {
            return handleError(response, error);
        }
    }


    //READ
    //TODO: fetch all presentations for user
    async getPresentationsForUser(request: Request, response: Response) {
        
        //get the user id from request parameters
        const { userID } = request.params.UUID;
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
            const userRepo = connection.getRepository(User);
            
            //all presentations for user
            var allPresentationsForUser: Presentation[];
            
            //create a query to join the required tables together for the specific user
            allPresentationsForUser = presentationRepo.createQueryBuilder('presentation') 
            
                .select()
            
                //join the relevant paper to the presentation
                .leftJoinAndSelect("presentation.paper, "paper")
                                   
                //select only those that match the user's UUID
                
                //return all
               .getMany();
            
            //send the array to the client
            return response.status(200).send(allPresentationsForUser);
            
        } catch (error) {
               return handleError(response, error);
        }
        
    }


    //returns all the conferences from the database
    async getconferences(request: Request, response: Response) {

        try {

            //create connection to database
            const connection = await connect();

            //store reference to conference repository
            const repository = connection.getRepository(Conference);

            //store all the conferences
            var allConferences: Conference[];

            //populate conference array with all conferences
            allConferences = await repository.createQueryBuilder('conference')

                //select all columns
                .select()

                //order by conference name asc
                .orderBy("conference.conferenceName", "ASC")

                //get more than one
                .getMany();

            //send the conferences array to client with success code
            return response.status(200).send(allConferences);
            
        } catch (error) {
            return handleError(response, error);
        }

    }

    // getconferences(request: Request, response: Response) {
    //     console.log("Get conferences");
    // }

    //return single conference matching conference ID
    async getSpecificconference(request: Request, response: Response) {

        //get the conference id from request parameters
        const { conferenceID } = request.params;
        console.log("Fetching details for conference: " + conferenceID);

        //send error msg if no conferenceID was provided
        if (!conferenceID) {
            return response.status(400).send({ message: "conference ID is missing from request paramters"});
        }

        try {
            
            //create connection to database
            const connection = await connect();

            //store reference to conference repository
            const repository = connection.getRepository(Conference);

            //get single row from conference table if IDs match
            const matchingIDConference = await repository.findOne(conferenceID);

            //return fetched conference from db to client
            return response.status(200).send(matchingIDConference);

        } catch (error) {
            return handleError(response, error)
        }

    }

    //UPDATE
    async updateconference(request: Request, response: Response) {
                
        //get the conference id from request parameters
        const { conferenceID } = request.params;
        console.log("Fetching details for conference: " + conferenceID);

        //send error msg if no conferenceID was provided
        if (!conferenceID) {
            return response.status(400).send({ message: "conference ID is missing from request paramters"});
        }

        //get the contents of the body and set to a constant
        //each word inside is a key to a matching value in the body json
        const { name, submissionDeadline } = request.body;
        
        //no name in body
        if(!name) {
            return response.status(400).send({ message: "Missing name for conference"});
        }

        if(!submissionDeadline) {
            return response.status(400).send({ message: "Missing conference submission deadline"});
        }

        try {
            
            //create connection to database
            const conneciton = await connect()

            //create reference to conference repository
            const repository = conneciton.getRepository(Conference);

            //store the fetched conference to update
            const fetchedConference = await repository.findOne(conferenceID);

            //update the conference properties
            fetchedConference.conferenceName = name;

            //update the conference submission deadline
            fetchedConference.conferenceSubmissionDeadline = new Date(Date.parse(submissionDeadline));

            //save the conference back to db
            const updatedconference = await repository.save(fetchedConference);

            //send success to client with copy of update conference
            return response.status(200).send(updatedconference);

        } catch (error) {
            return handleError(response, error);
        }

    }

    //DELETE
    async deleteconference(response: Response, request: Request) {

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
