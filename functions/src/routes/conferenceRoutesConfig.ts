
//import required libaries
import { Application } from "express";

//import the authentication and authorization functions
import { isAuthenticated } from "../auth/authenticated";
import { isAuthorized } from "../auth/authorized";

import { AuthRoles } from "../globals"

//import the conference controller
import { ConferenceController } from "../controllers/conferenceController";


//API Routes
export function conferenceRoutesConfig(app: Application) {

    //CREATE
    //creates a organisation
    app.post('/conferences', [
        isAuthenticated,
        isAuthorized({ hasRole: [AuthRoles.Admin] }),
        new ConferenceController().createconference
    ])

    //READ
    //get all organisations
    app.get('/conferences', [
        isAuthenticated,
        isAuthorized({ hasRole: [AuthRoles.Admin, AuthRoles.presenter] }),
        new ConferenceController().getconferences
        
    ])


    //get specific organisation
    app.get('/conferences/:conferenceID', [
        isAuthenticated,
        isAuthorized({ hasRole: [AuthRoles.Admin, AuthRoles.presenter] }),
        new ConferenceController().getSpecificconference
    ])

    //UPDATE
    app.patch('/conferences/:conferenceID', [
        isAuthenticated,
        isAuthorized({ hasRole: [AuthRoles.Admin] }),
        new ConferenceController().updateconference
    ])

    //DELETE
    // app.delete('/conferences/:conferenceID', [
    //     isAuthenticated,
    //     isAuthorized({ hasRole: [AuthRoles.Admin] }),
    //     new ConferenceController().deleteconference
    // ])

}