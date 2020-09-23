//import required libaries
import { Application } from "express";

//import the authentication and authorization functions
import { isAuthenticated } from "../auth/authenticated";
import { isAuthorized } from "../auth/authorized";

import { AuthRoles } from "../globals"

//import the topic controller
import { PresentationController } from "../controllers/presentationController";


//API Routes
export function presentationRoutesConfig(app: Application) {

    //CREATE
    //creates a presentation
    app.post('/presentations', [
        isAuthenticated,
        isAuthorized({ hasRole: [AuthRoles.presenter] }),
        new PresentationController().createPresentation
    ])

    //READ
    //get all presentations for user
    app.get('/presentations-for-user/:userID', [
        isAuthenticated,
        isAuthorized({ hasRole: [AuthRoles.Admin, AuthRoles.presenter] }),
        new  PresentationController().getPresentationsForUser
        
    ])

    //get all presentations without assigned sessions for user
    app.get('/presentations-without-sessions-for-user/:userID', [
        isAuthenticated,
        isAuthorized({ hasRole: [AuthRoles.Admin, AuthRoles.presenter] }),
        new  PresentationController().getPresentationsWithUnassignedSessionsForUser
        
    ])

    //get all presentations for conference
    app.get('/presentations-for-conference/:conferenceID', [
        isAuthenticated,
        isAuthorized({ hasRole: [AuthRoles.Admin, AuthRoles.presenter] }),
        new  PresentationController().getPresentationsForConference
        
    ])

    //get specific presentation
    app.get('/specific-presentation/:presentationID', [
        new  PresentationController().getSpecificPresentation
    ])

    //UPDATE
    app.patch('/presentations/:presentationID', [
        isAuthenticated,
        isAuthorized({ hasRole: [AuthRoles.Admin] }),
        new  PresentationController().updatePresentation
    ])

    // //DELETE
    // app.delete('/presentations/:presentationID', [
    //     new  PresentationController().updateOrganisation
    // ])

}