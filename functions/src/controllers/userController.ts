
//import the necessary express APIs
import { Request, Response } from "express";

//import admin sdk
import * as admin from 'firebase-admin';

//import database connector
import { connect } from "../config";

//import the user entity
import { User } from "../entities/user";

import { AuthRoles } from "../globals";

export class userController {

    //properties
    
    
    //CREATE
    
    /*
        This function is responsible for creating users in the database directly without creating a firebase account
        NOTE: this should only be used during development to create a user after creating a test user in firebase auth panel
        It asks for the UUID of the new user to then create a matching entry in the DB

        NOTE: this will not be needed after the on create firebase auth create user trigger is implemented
        as it will automatically create a user itself and assign a role
    */
    async createUserInDB(req: Request, res: Response) {

        try {

            //create a constant to store the request body
            const { uid, name, email, country, timeZone } = req.body

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

            //set user email
            newUser.email = email;

            //set user country
            newUser.country = country;

            //set user timezone
            newUser.timeZone = timeZone;

            //save the user in DB
            const savedUser = await repo.save(newUser);
            
            
            //send success message to cleint
            return res.status(201).send({ uid, savedUser })

        } catch (error) {
            return handleError(res,error)
        }
        
    }


    //creates a new user account and in database
    //requres a name, password, email, country, and timezone

    /*
        This function is responsible for creating a user in the system
            It will create a fireauth user account using the provided details in the request body and assign a default role of user
            It will also create a matching user entry in the DB using the provided details in the request body

        NOTE: This query requires the following in the body:
            name - becomes the user name and display name in fireauth
            email - assigned to the DB record and firebase auth
            country - assigned to the DB record
            timeZone - assigned to tge db record

        NOTE: Users created using this will have an automatic randomly generated password assigned to them
        and if a user wants to use their account, they will have to reset their password

        NOTE: This should only be used by an admin to create an account as it doesnt actually return the required auth details to log in on the client side
        Users should use the fireauth web createuser api for the front end
    */
    async createUser(req: Request, res: Response) {
        
        try {
            
            //default role that will be assigned to user
            //if the user is intended to be an admin, they can have their role update later on
            const role = AuthRoles.presenter;
            
            //create a constant to store the request body
            const { name, email, country, timeZone } = req.body
            
            //if any of the required fields are empty
            if (!email) {
                
                //send 400 error to client
                return res.status(400).send({ message: 'Missing email for user' })
            }

            // no name in body
            if (!name) {
                
                //send 400 error to client
                return res.status(400).send({ message: 'Missing name for user' })
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

            //set user email
            newUser.email = email;

            //set user country
            newUser.country = country;

            //set user timezone
            newUser.timeZone = timeZone;
            
            
            //save the user in DB
            const savedUser = await repo.save(newUser);
            
            
            //send success message to cleint
            return res.status(200).send({ uid, savedUser })
        } catch (err) {
            return handleError(res, err)
        }
    }
    
    
    //READ
    //lists all the users in fire auth
    //TODO: include the other properties of the user in the return
    async all(req: Request, res: Response) {
        try {

            //create new connection to DB
            const connection = await connect();

            //get the user repository
            const userRepo = connection.getRepository(User);

            const users = [];


            //fetch the matching user from firebase auth passed in from res
            const fetchedUsers: User[] = await userRepo.find();

            for (const index in fetchedUsers) {  
                
                const user = await admin.auth().getUser(fetchedUsers[index].UUID)

                users.push({"user": mapUser(user), "db": fetchedUsers[index]})

            }

            


            // //NOTE: only gets max 1000 users
            // const listUsers = await admin.auth().listUsers()

            // //console.log(listUsers);

            // const users = listUsers.users.map(mapUser)
            return res.status(200).send(users)
        } catch (err) {
            return handleError(res, err)
        }
    }
    

    
    
    //get details of specific user with id
    //TODO: also return other specific user details like country
    async get(req: Request, res: Response) {
        try {

            //create new connection to DB
            const connection = await connect();
            
            //get the user repository
            const userRepo = connection.getRepository(User);

            const { uid } = req.params

            //fetch the matching user from firebase auth passed in from res
            const fetchedUser = await userRepo.findOne({UUID: uid})

            //get the user from firebase
            const user = await admin.auth().getUser(uid)
            return res.status(200).send({ user: mapUser(user), db: fetchedUser })
        } catch (err) {
            return handleError(res, err)
        }
    }
    
    
    //UPDATE
    //update user

    /*
        This function is responsible for updating a specific user in both fireauth and DB

        NOTE: if the user token attached to the request has a role of 'user', then they can only update their own record
              if the user token attached has a admin role, then they can update any user using their UIDs

        NOTE: only admins can assign roles to users
    */

    async patch(req: Request, res: Response) {
        try {

            //temp store a UID that will be set soon
            var specifiedUID: string;

            //if a user is a presenter
            if (res.locals.role == AuthRoles.presenter) {

                //fetch the uid from the token instead
                specifiedUID = res.locals.uid;

            } 
            
            //user is a admin
            else if (res.locals.role == AuthRoles.Admin) {

                //if the uid is not set on the parameter when called by an admin
                if (!req.params.uid) {
                    return res.status(400).send({ message: 'Missing user UID when updating details by admin' })
                }

                //set the temp uid to be the one retrieved from the header
                specifiedUID = req.params.uid;
            }

            //create a constant to store the request body
            const { displayName, email, country, timeZone } = req.body

            //if any of the required fields are empty
            if (!email) {
                
                //send 400 error to client
                return res.status(400).send({ message: 'Missing email for user' })
            }

            // no name in body
            if (!displayName) {
                
                //send 400 error to client
                return res.status(400).send({ message: 'Missing displayName for user' })
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

                        
            
            //update the user information in fire auth
            await admin.auth().updateUser(specifiedUID, { displayName, email })


            //check if user calling this is an admin, if so they can change the role of the user
            /* 
                this next part assigns the role to a user if the calling user is an admin
            */
            if (res.locals.role == AuthRoles.Admin) {

                //valid elements from the body
                const { role } = req.body

                if (!role) {
                    return res.status(400).send({ message: 'Missing role from update'})
                }

                //check if the role from body exists in the auth roles enum
                //if not return an error
                if (!Object.values(AuthRoles).includes(role)) {
                    return res.status(400).send({ message: 'Role: ' + role + " is not a valid role, must be either: " + AuthRoles.Admin + " or " + AuthRoles.presenter})
                }

                //if the user calling this endpoint is a admin, then update the role of the specificed user from request params
                //update the user roles
                await admin.auth().setCustomUserClaims(specifiedUID, { role })
            }
            
            //get and store the specific user from db
            const user = await admin.auth().getUser(specifiedUID)


            //update the user in the DB
            //create a new connection
            const connection = await connect();
            
            //create reference to the user repo
            const userRepo = connection.getRepository(User);
            
            //fetch the user from DB that matches the UID
            const updateUser = await userRepo.findOne({UUID: specifiedUID});
                       
            //name is the display name
            updateUser.name = displayName;

            //set user email
            updateUser.email = email;

            //set user country
            updateUser.country = country;

            //set user timezone
            updateUser.timeZone = timeZone;
            
            //save the changes to the DB
            await userRepo.save(updateUser);
            
            return res.status(204).send({ user: mapUser(user) })
        } catch (err) {
            return handleError(res, err)
        }
    }
    
    //DELETE
    //remove user
    //TODO: also delete the user from the DB

    /* 
        This function is responsible for deleting users from both fireauth and the db

        NOTE: if the user token attached to the request has a role of 'user', then they can only delete their own record and account
              if the user token attached has a admin role, then they can delete any user using their UIDs
    */
    async  remove(req: Request, res: Response) {

        // const userUID = determineTargetUIDFromRole(res, req.params.uid)

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


    /*
        This function determines which uid should be used based on the user's role from the token
        It works by getting the uid from the response which has the uid, role, and email attached to it and then comparing the roles

            if the user is an Admin, it will return the uid from the query paramters
            otherwise, if the user is a presenter, it will return the UID from the token itself

        NOTE: this in intended in routes where users should only be able to edit their own but admins can edit any user's data

    */
    // function determineTargetUIDFromRole(response: Response, uidFromQueryParam: string ) {

    //     //if a user is a presenter
    //     if (response.locals.role == AuthRoles.presenter) {

    //         //fetch the uid from the token instead
    //         return response.locals.uid;

    //     } 
        
    //     //user is a admin
    //     else if (response.locals.role == AuthRoles.Admin) {

    //         //if the uid is not set on the parameter when called by an admin
    //         if (!uidFromQueryParam) {
    //             return response.status(400).send({ message: 'Missing user UID when updating details by admin' })
    //         }

    //         //set the temp uid to be the one retrieved from the header
    //         return uidFromQueryParam;
    //     }
    // }
