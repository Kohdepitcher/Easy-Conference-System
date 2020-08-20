//import required libraries
import { Request, Response } from "express";

//import database connection
import { connect } from "../config";

//entities
import { Organisation } from "../entities/organisation";



// Typical Express Promise (Ceejay Written)
// app.get("url path", (req, res) => {
    // console.log(res)
//}).catch(e => console.log(e))

export class OrganisationController {

    //CREATE
    //creates a new organisation in database
    // export async
    async createOrganisation(request: Request, response: Response) {

        //get the contents of the body and set to a constant
        //each word inside is a key to a matching value in the body json
        const { name } = request.body;
        
        //no name in body
        if(!name) {
            return response.status(400).send({ message: "Missing name for organisation"});
        }

        try {

            //store an instance of connect for db interaction
            const connection = await connect();

            //store a reference to the organisation repository
            const repo = connection.getRepository(Organisation);

            //new organisation entry
            const newOrganisation = new Organisation();

            //set the name for the organisation
            newOrganisation.organisationName = name;

            //save the new organisation to DB
            const newSavedOrganisation = await repo.save(newOrganisation);

            //send a copy of the new organisation to the server
            //TODO: remove sending new organisation to client when its created
            return response.status(200).send(newSavedOrganisation);
        }

        catch (error) {
            return handleError(response, error);
        }
    }


    //READ
    //TODO: fetch all topics for organisation


    //returns all the organisations from the database
    async getOrganisations(request: Request, response: Response) {

        try {

            //create connection to database
            const connection = await connect();

            //store reference to organisation repository
            const repository = connection.getRepository(Organisation);

            //store all the organisations
            var allOrganisations: Organisation[];

            //populate organisation array with all organisations
            allOrganisations = await repository.createQueryBuilder('organisation')

                //select all columns
                .select()

                //order by organisation name asc
                .orderBy("organisation.OrganisationName", "ASC")

                //get more than one
                .getMany();

            //send the organisations array to client with success code
            return response.status(200).send(allOrganisations);
            
        } catch (error) {
            return handleError(response, error);
        }

    }


    //return single organisation matching organisation ID
    async getSpecificOrganisation(request: Request, response: Response) {

        //get the organisation id from request parameters
        const { organisationID } = request.params;
        console.log("Fetching details for organisation: " + organisationID);

        //send error msg if no organisationID was provided
        if (!organisationID) {
            return response.status(400).send({ message: "Organisation ID is missing from request paramters"});
        }

        try {
            
            //create connection to database
            const connection = await connect();

            //store reference to organisation repository
            const repository = connection.getRepository(Organisation);

            //get single row from organisation table if IDs match
            const matchingIDOrganisation = await repository.findOne(organisationID);

            //return fetched organisation from db to client
            return response.status(200).send(matchingIDOrganisation);

        } catch (error) {
            return handleError(response, error)
        }

    }

    //UPDATE
    async updateOrganisation(request: Request, response: Response) {
                
        //get the Organisation id from request parameters
        const { organisationID } = request.params;
        console.log("Fetching details for organisation: " + organisationID);

        //send error msg if no organisationID was provided
        if (!organisationID) {
            return response.status(400).send({ message: "Organisation ID is missing from request paramters"});
        }

        //get the contents of the body and set to a constant
        //each word inside is a key to a matching value in the body json
        const { name } = request.body;
        
        //no name in body
        if(!name) {
            return response.status(400).send({ message: "Missing name for organisation"});
        }

        try {
            
            //create connection to database
            const conneciton = await connect()

            //create reference to organisation repository
            const repository = conneciton.getRepository(Organisation);

            //store the fetched organisation to update
            const fetchedOrganisation = await repository.findOne(organisationID);

            //update the organisation properties
            fetchedOrganisation.organisationName = name;

            //save the organisaiton back to db
            const updatedOrganisation = await repository.save(fetchedOrganisation);

            //send success to client with copy of update organisation
            return response.status(200).send(updatedOrganisation);

        } catch (error) {
            return handleError(response, error);
        }

    }

    //DELETE
    async deleteOrganisation(response: Response, request: Request) {

        //get the organisation id from request parameters
        const { organisationID } = request.params;
        console.log("Fetching details for organisation: " + organisationID);

        //send error msg if no organisationID was provided
        if (!organisationID) {
            return response.status(400).send({ message: "Organisation ID is missing from request paramters"});
        }

        try {

                //create connection to database
                const conneciton = await connect()

                //create reference to organisation repository
                const repository = conneciton.getRepository(Organisation);

                //store the fetched organisation to update
                const fetchedOrganisation = await repository.findOne(organisationID);

                //delete the organisation
                const deletedOrganisation = await repository.remove(fetchedOrganisation);

                return response.status(200).send(deletedOrganisation)
            
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