
//import the necessary express APIs
import { Request, Response } from "express";

//import admin sdk
import * as admin from 'firebase-admin';

//import database connector
import { connect } from "../config";

//import the user entity
import { User } from "../entities/user";

export enum userRole {
    user = "user",
    manager = "manager",
    admin = "admin"
}

export class userController {

    //properties
    
    
    //CREATE
    //creates a new user account and in database
    //requres a name, password, email, country, and timezone
    async createUser(req: Request, res: Response) {
        
        try {
            
            //default role that will be assigned to user
            //if the user is intended to be an admin, they can have their role update later on
            const role = userRole.user;
            
            //create a constant to store the request body
            const { name, email, country, timeZone } = req.body
            
            //if any of the required fields are empty
            if (!name || !email) {
                
                //send 400 error to client
                return res.status(400).send({ message: 'Missing fields' })
            }

            //no country in body
            if (!country) {

                //send error message to client
                return res.status(400).send({ message: 'Missing country for user'})
            }

            //no timezone in budy
            if (!timeZone) {

                //return error message to client
                return res.send(400).send({ message: 'Missing timezone for user'})
            }
            
            
            //create and store the user in fireauth
            const { uid } = await admin.auth().createUser({

                //set the name for user
                displayName: name,

                //assign a random 36 int long password
                password: Math.random().toString(36).replace('0.', ''),

                //set the email of the user
                email: email
            })
            
            //set the custom role claim
            await admin.auth().setCustomUserClaims(uid, { role })
            
            //create new connection to DB
            const connection = await connect();
            
            //get the user repository
            const repo = connection.getRepository(User);
            
            //create a new user
            const newUser = new User();
            
            //parse data from func parameters
            //uuid from fireauth
            newUser.UUID = uid;
            
            //name is the display name
            newUser.name = name;

            //TODO: add the other required fields
            
            
            //save the user in DB
            const savedUser = await repo.save(newUser);
            
            
            //send success message to cleint
            return res.status(201).send({ uid, savedUser })
        } catch (err) {
            return handleError(res, err)
        }
    }
    
    
    //READ
    //lists all the users in fire auth
    //TODO: include the other properties of the user in the return
    async all(req: Request, res: Response) {
        try {

            //NOTE: only gets max 1000 users
            const listUsers = await admin.auth().listUsers()

            //console.log(listUsers);

            const users = listUsers.users.map(mapUser)
            return res.status(200).send(users)
        } catch (err) {
            return handleError(res, err)
        }
    }
    

    
    
    //get details of specific user with id
    //TODO: also return other specific user details like country
    async get(req: Request, res: Response) {
        try {
            const { uid } = req.params
            const user = await admin.auth().getUser(uid)
            return res.status(200).send({ user: mapUser(user) })
        } catch (err) {
            return handleError(res, err)
        }
    }
    
    
    //UPDATE
    //update user
    //TODO: include the other required properties when updating the user 
    async patch(req: Request, res: Response) {
        try {
            const { uid } = req.params
            const { displayName, email, role } = req.body
            
            if (!uid || !displayName || !email || !role) {
                return res.status(400).send({ message: 'Missing fields' })
            }
            
            await admin.auth().updateUser(uid, { displayName, email })
            await admin.auth().setCustomUserClaims(uid, { role })
            
            const user = await admin.auth().getUser(uid)
            
            const connection = await connect();
            
            const userRepo = connection.getRepository(User);
            
            const updateUser = await userRepo.findOne({UUID: uid});
            updateUser.name = displayName
            
            
            await userRepo.save(updateUser);
            
            return res.status(204).send({ user: mapUser(user) })
        } catch (err) {
            return handleError(res, err)
        }
    }
    
    //DELETE
    //remove user
    //TODO: also delete the user from the DB
    async  remove(req: Request, res: Response) {
        try {
            const { id } = req.params
            await admin.auth().deleteUser(id)
            return res.status(204).send({})
        } catch (err) {
            return handleError(res, err)
        }
    }
    
}

function handleError(res: Response, err: any) {
    return res.status(500).send({ message: `${err.code} - ${err.message}` });
}

    function mapUser(user: admin.auth.UserRecord) {
        const customClaims = (user.customClaims || { role: '' }) as { role?: string }
        const role = customClaims.role ? customClaims.role : 'Role Not Set'
        return {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            role,
            lastSignInTime: user.metadata.lastSignInTime,
            creationTime: user.metadata.creationTime
        }
    }
