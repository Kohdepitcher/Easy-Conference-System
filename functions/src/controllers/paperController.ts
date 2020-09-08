//import required libraries
import { Request, Response } from "express";

//import database connection
import { connect } from "../config";

//entities
import { Paper } from "../entities/paper";
// import { User } from "../entities/user";
import { Topic } from "../entities/topic";


export class PaperController {

    //CREATE
    //creates a new paper in database
    async createPaper(request: Request, response: Response) {

        //TODO: include fetching organisation id so that the organisation can be attached to the paper

        //get the contents of the body and set to a constant
        //each word inside is a key to a matching value in the body json
        const { title, publisher, topicID } = request.body;
        
        //no name in body
        if(!title) {
            return response.status(400).send({ message: "Missing title for paper"});
        }
        
        if(!publisher) {
            return response.status(400).send({ message: "Missing publisher for paper "});
        }

        if(!topicID) {
            return response.status(400).send({ message: "Missing topic id"});
        }

        try {

            //store an instance of connect for db interaction
            const connection = await connect();

            //also get the topic repository
            const topicRepository = connection.getRepository(Topic)

            //find the matching topic by id from repository
            const fetchedTopic = await topicRepository.findOne(topicID)

            //if the fetched topic is null or undefined due to it not existing
            //send error message to client stating that it doesnt exist
            if (fetchedTopic == undefined || fetchedTopic == null) {
                return response.status(400).send({ message: "No topics exists that matched topic id: " + topicID})
            }
            
            //TODO: add user to paper

            // //also get the topic repository
            // const userRepository = connection.getRepository(User)

            // //find the matching topic by id from repository
            // const fetchedUser = await userRepository.findOne(topicID)

            // //if the fetched topic is null or undefined due to it not existing
            // //send error message to client stating that it doesnt exist
            // if (fetchedTopic == undefined || fetchedTopic == null) {
            //     return response.status(400).send({ message: "No topics exists that matched topic id: " + topicID})
            // }



            //store a reference to the paper repository
            const repo = connection.getRepository(Paper);

            //new paper entry
            const newPaper = new Paper();

            //set the name for the paper
            newPaper.paperTitle = title;

            //set the publisher for the paper
            newPaper.paperPublisher = publisher
            
            //set the topic for paper
            newPaper.topic = fetchedTopic;

            //set the user for the paper


            //save the new paper to DB
            const newSavedPaper = await repo.save(newPaper);

            //send a copy of the new paper to the server
            //TODO: remove sending newpaper to client when its created
            return response.status(200).send(newSavedPaper);
        }

        catch (error) {
            return handleError(response, error);
        }
    }


    //READ
    //TODO: fetch all papers for organisation


    //returns all the papers from the database
    async getPapers(request: Request, response: Response) {

        try {

            //create connection to database
            const connection = await connect();

            //store reference to paper repository
            const repository = connection.getRepository(Paper);

            //store all the papers
            var allPapers: Paper[];

            //populate paper array with all conferences
            allPapers = await repository.createQueryBuilder('paper')

                //select all columns
                .select()

                //get more than one
                .getMany();

            //send the conferences array to client with success code
            return response.status(200).send(allPapers);
            
        } catch (error) {
            return handleError(response, error);
        }

    }

    // getconferences(request: Request, response: Response) {
    //     console.log("Get conferences");
    // }

    //return single paper matching paper ID
    async getSpecificPaper(request: Request, response: Response) {

        //get the paper id from request parameters
        const { paperID } = request.params;
        console.log("Fetching details for paper: " + paperID);

        //send error msg if no conferenceID was provided
        if (!paperID) {
            return response.status(400).send({ message: "Paper ID is missing from request paramters"});
        }

        try {
            
            //create connection to database
            const connection = await connect();

            //store reference to paper repository
            const repository = connection.getRepository(Paper);

            //get single row from paper table if IDs match
            const matchingIDPaper = await repository.findOne(paperID);

            //return fetched paper from db to client
            return response.status(200).send(matchingIDPaper);

        } catch (error) {
            return handleError(response, error)
        }

    }

    //UPDATE
    async updatePaper(request: Request, response: Response) {
                
        //get the paper id from request parameters
        const { paperID } = request.params;
        console.log("Fetching details for paper: " + paperID);

        //send error msg if no paperID was provided
        if (!paperID) {
            return response.status(400).send({ message: "paper ID is missing from request paramters"});
        }

        //get the contents of the body and set to a constant
        //each word inside is a key to a matching value in the body json
        const { title, publisher, topicID } = request.body;
        
        //no name in body
        if(!title) {
            return response.status(400).send({ message: "Missing title for paper"});
        }
        
        if(!publisher) {
            return response.status(400).send({ message: "Missing publisher for paper "});
        }

        if(!topicID) {
            return response.status(400).send({ message: "Missing topic id"});
        }

        try {

            //store an instance of connect for db interaction
            const connection = await connect();

            //also get the topic repository
            const topicRepository = connection.getRepository(Topic)

            //find the matching topic by id from repository
            const fetchedTopic = await topicRepository.findOne(topicID)

            //if the fetched topic is null or undefined due to it not existing
            //send error message to client stating that it doesnt exist
            if (fetchedTopic == undefined || fetchedTopic == null) {
                return response.status(400).send({ message: "No topics exists that matched topic id: " + topicID})
            }


            
            //create connection to database
            const conneciton = await connect()

            //create reference to paper repository
            const repository = conneciton.getRepository(Paper);

            //store the fetched paper to update
            const fetchedPaper = await repository.findOne(paperID);

            //update the paper properties
            fetchedPaper.paperTitle = title;

            fetchedPaper.paperPublisher = publisher;

            fetchedPaper.topic = fetchedTopic

            //save the paper back to db
            const updatedPaper = await repository.save(fetchedPaper);

            //send success to client with copy of update paper
            return response.status(200).send(updatedPaper);

        } catch (error) {
            return handleError(response, error);
        }

    }

    //DELETE
    async deletePaper(response: Response, request: Request) {

        //get the paper id from request parameters
        const { paperID } = request.params;
        console.log("Fetching details for paper: " + paperID);

        //send error msg if no conferenceID was provided
        if (!paperID) {
            return response.status(400).send({ message: "paper ID is missing from request paramters"});
        }

        try {

                //create connection to database
                const conneciton = await connect()

                //create reference to paper repository
                const repository = conneciton.getRepository(Paper);

                //store the fetched paper to update
                const fetchedPaper = await repository.findOne(paperID);

                //delete the paper
                const deletedPaper = await repository.remove(fetchedPaper);

                return response.status(200).send(deletedPaper)
            
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