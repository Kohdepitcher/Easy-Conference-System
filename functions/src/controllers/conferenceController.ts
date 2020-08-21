//import required libraries
import { Request, Response } from "express";

//import database connection
import { connect } from "../config";

//entities
import { Conference } from "../entities/conference";



// Typical Express Promise (Ceejay Written)
// app.get("url path", (req, res) => {
    // console.log(res)
//}).catch(e => console.log(e))

export class ConferenceController {

    //CREATE
    //creates a new conference in database
    async createconference(request: Request, response: Response) {

        //TODO: include fetching organisation id so that the organisation can be attached to the conference

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

            //store an instance of connect for db interaction
            const connection = await connect();

            //store a reference to the conference repository
            const repo = connection.getRepository(Conference);

            //new conference entry
            const newConference = new Conference();

            //set the name for the conference
            newConference.conferenceName = name;

            //convert the json date to proper date and store on conference cutoff
            newConference.conferenceSubmissionDeadline = new Date(Date.parse(submissionDeadline));

            //save the new conference to DB
            const newSavedconference = await repo.save(newConference);

            //send a copy of the new conference to the server
            //TODO: remove sending newconference to client when its created
            return response.status(200).send(newSavedconference);
        }

        catch (error) {
            return handleError(response, error);
        }
    }


    //READ
    //TODO: fetch all conferences for organisation


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