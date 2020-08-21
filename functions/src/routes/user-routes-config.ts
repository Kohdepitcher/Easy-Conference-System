//import required dependencies
import { Application } from "express";

//import the authentication and authorization functions
// import { isAuthenticated } from "../auth/authenticated";
// import { isAuthorized } from "../auth/authorized";

//import the user controller
import { userController } from '../controllers/userController'

export function userRoutesConfig(app: Application) {

    // creates user
    app.post('/users', [
        //isAuthenticated,
        //isAuthorized({ hasRole: ['admin', 'manager'] }),
        new userController().createUser
     ]);
 
     // lists all users
     app.get('/users', [
         //isAuthenticated,
         //isAuthorized({ hasRole: ['admin', 'manager'], allowSameUser: true }),
         new userController().all
     ]);


     // get :id user
     //requires the alpha-numeric UID from firebase not the database's userID primary key
     app.get('/users/:uid', [
         //isAuthenticated,
         //isAuthorized({ hasRole: ['admin', 'manager'], allowSameUser: true }),
         new userController().get
     ]);


     // updates :id user
     //requires the alpha-numeric UID from firebase not the database's userID primary key
     app.patch('/users/:uid', [
         //isAuthenticated,
         //isAuthorized({ hasRole: ['admin', 'manager'], allowSameUser: true }),
         new userController().patch
     ]);
     // deletes :id user
     //requires the alpha-numeric UID from firebase not the database's userID primary key
     app.delete('/users/:uid', [
         //isAuthenticated,
         //isAuthorized({ hasRole: ['admin', 'manager'] }),
         new userController().remove
     ]);
    
}