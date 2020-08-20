//import required libraries
import { Request, Response } from "express";

//import database connection
import { connect } from "../config";

//entities
import { Topic } from "../entities/topic";
import { Organisation } from "../entities/organisation";



// Typical Express Promise (Ceejay Written)
// app.get("url path", (req, res) => {
    // console.log(res)
//}).catch(e => console.log(e))

export class TopicController {

    //CREATE
    //creates a new topic in database
    // export async
    async createTopic(request: Request, response: Response) {

        //get the contents of the body and set to a constant
        //each word inside is a key to a matching value in the body json
        const { name } = request.body;
        
        //no name in body
        if(!name) {
            return response.status(400).send({ message: "Missing name for topic"});
        }

        try {

            //store an instance of connect for db interaction
            const connection = await connect();

            //store a reference to the topic repository
            const repo = connection.getRepository(Topic);

            //new topic entry
            const newTopic = new Topic();

            //set the name for the topic
            newTopic.topicName = name;

            //save the new topic to DB
            const newSavedTopic = await repo.save(newTopic);

            //send a copy of the new topic to the server
            //TODO: remove sending newtopic to client when its created
            return response.status(200).send(newSavedTopic);
        }

        catch (error) {
            return handleError(response, error);
        }
    }


    //READ
    //TODO: fetch all topics for organisation
    async getTopicsForOrganisation(request: Request, response: Response) {

        /*

        */

        //get the organisation id from request parameters
        const { organisationID } = request.params;
        console.log("Fetching topics for organisation with id: " + organisationID);

        try {
            
            //create a new connection
            const connection = await connect();

            //reference to the topic repository
            const repository = connection.getRepository(Topic);

            //array to store fetched topics
            var allTopicsForOrganisation: Topic [];

            allTopicsForOrganisation = await repository.createQueryBuilder('topic')

                //select all column
                .select()

                //where the organisation id matches on topic from query parameter
                .where('topic.organisationOrganisationID = :id', {id: organisationID})

                //order by topic name
                .orderBy('topic.topicName', 'ASC')

                .getMany();

            //send the fetched topics to client
            return response.status(200).send(allTopicsForOrganisation);

        } catch (error) {
            return handleError(response, error)
        }

    }


    //returns all the topics from the database
    async getTopics(request: Request, response: Response) {

        try {

            //create connection to database
            const connection = await connect();

            //store reference to topic repository
            const repository = connection.getRepository(Topic);

            //store all the topics
            var allTopics: Topic[];

            //populate topic array with all topics
            allTopics = await repository.createQueryBuilder('topic')

                //select all columns
                .select()

                //order by topic name asc
                .orderBy("topic.topicName", "ASC")

                //get more than one
                .getMany();

            //send the topics array to client with success code
            return response.status(200).send(allTopics);
            
        } catch (error) {
            return handleError(response, error);
        }

    }

    // getTopics(request: Request, response: Response) {
    //     console.log("Get Topics");
    // }

    //return single topic matching topic ID
    async getSpecificTopic(request: Request, response: Response) {

        //get the topic id from request parameters
        const { topicID } = request.params;
        console.log("Fetching details for topic: " + topicID);

        //send error msg if no topicID was provided
        if (!topicID) {
            return response.status(400).send({ message: "Topic ID is missing from request paramters"});
        }

        try {
            
            //create connection to database
            const connection = await connect();

            //store reference to topic repository
            const repository = connection.getRepository(Topic);

            //get single row from topic table if IDs match
            const matchingIDTopic = await repository.findOne(topicID);

            //return fetched topic from db to client
            return response.status(200).send(matchingIDTopic);

        } catch (error) {
            return handleError(response, error)
        }

    }

    //UPDATE
    async updateTopic(request: Request, response: Response) {
                
        //get the topic id from request parameters
        const { topicID } = request.params;
        console.log("Fetching details for topic: " + topicID);

        //send error msg if no topicID was provided
        if (!topicID) {
            return response.status(400).send({ message: "Topic ID is missing from request paramters"});
        }

        //get the contents of the body and set to a constant
        //each word inside is a key to a matching value in the body json
        const { name, organisationID } = request.body;
        
        //no name in body
        if(!name) {
            return response.status(400).send({ message: "Missing name for topic"});
        }

        //no organisationID in body
        if(!organisationID) {
            return response.status(400).send({ message: "Missing organisationID for topic"});
        }

        try {
            
            //create connection to database
            const conneciton = await connect()

            //create reference to topic repository
            const repository = conneciton.getRepository(Topic);

            //reference to organisation repository
            const organisationRepository = conneciton.getRepository(Organisation)

            //find the matching organisaiton by id from repository
            const fetchedOrganisation = await organisationRepository.findOne(organisationID)

            //store the fetched topic to update
            const fetchedTopic = await repository.findOne(topicID);

            //update the topic properties
            fetchedTopic.topicName = name;

            //update the related organisation
            fetchedTopic.organisation = fetchedOrganisation;

            //save the topic back to db
            const updatedTopic = await repository.save(fetchedTopic);

            //send success to client with copy of update topic
            return response.status(200).send(updatedTopic);

        } catch (error) {
            return handleError(response, error);
        }

    }

    //DELETE
    async deleteTopic(response: Response, request: Request) {

        //get the topic id from request parameters
        const { topicID } = request.params;
        console.log("Fetching details for topic: " + topicID);

        //send error msg if no topicID was provided
        if (!topicID) {
            return response.status(400).send({ message: "Topic ID is missing from request paramters"});
        }

        try {

                //create connection to database
                const conneciton = await connect()

                //create reference to topic repository
                const repository = conneciton.getRepository(Topic);

                //store the fetched topic to update
                const fetchedTopic = await repository.findOne(topicID);

                //delete the topic
                const deletedTopic = await repository.remove(fetchedTopic);

                return response.status(200).send(deletedTopic)
            
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