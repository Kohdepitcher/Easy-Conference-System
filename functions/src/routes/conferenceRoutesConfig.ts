
//import required libaries
import { Application } from "express";

//import the authentication and authorization functions
// import { isAuthenticated } from "../auth/authenticated";
// import { isAuthorized } from "../auth/authorized";

//import the conference controller
import { ConferenceController } from "../controllers/conferenceController";


//API Routes
export function conferenceRoutesConfig(app: Application) {

    //CREATE
    //creates a organisation
    app.post('/conferences', [
        // isAuthenticated,
        // isAuthorized({ hasRole: ['admin', 'manager', 'user'] }),
        new ConferenceController().createconference
    ])

    //READ
    //get all organisations
    app.get('/conferences', [
        // isAuthenticated,
        // isAuthorized({ hasRole: ['admin', 'manager', 'user'] }),
        new ConferenceController().getconferences
        
    ])


    //get specific organisation
    app.get('/conferences/:conferenceID', [
        new ConferenceController().getSpecificconference
    ])

    //UPDATE
    app.patch('/conferences/:conferenceID', [
        new ConferenceController().updateconference
    ])

    //DELETE
    app.delete('/conferences/:conferenceID', [
        new ConferenceController().deleteconference
    ])

}