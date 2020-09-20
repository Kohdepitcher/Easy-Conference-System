//import required libaries
import { Application } from "express";

//import the authentication and authorization functions
import { isAuthenticated } from "../auth/authenticated";
import { isAuthorized } from "../auth/authorized";

import { AuthRoles } from "../globals"

//import the session controller
import { SessionController } from "../controllers/sessionController";


//API Routes
export function sessionRoutesConfig(app: Application) {

    //CREATE
    //creates a session
    app.post('/sessions', [
        isAuthenticated,
        isAuthorized({ hasRole: [AuthRoles.Admin] }),
        new SessionController().createSession
    ])

    // READ
    // get all sessions for user
    app.get('/sessions/:userUID', [
        isAuthenticated,
        isAuthorized({ hasRole: [AuthRoles.Admin, AuthRoles.presenter] }),
        new  SessionController().getSessionsForUser
        
    ])

    //get all sessions for conference
    app.get('/sessions-for-conferece/:conferenceID', [
        isAuthenticated,
        isAuthorized({ hasRole: [AuthRoles.Admin, AuthRoles.presenter] }),
        new  SessionController().getSessionsForConference
        
    ])

    //gets all presenters and paper for session
    app.get('/presenters-for-session/:sessionID', [
        isAuthenticated,
        isAuthorized({ hasRole: [AuthRoles.Admin, AuthRoles.presenter] }),
        new  SessionController().getPresentationsWithinSession
        
    ])


    //UPDATE
    app.patch('/sessions/:sessionID', [
        isAuthenticated,
        isAuthorized({ hasRole: [AuthRoles.Admin] }),
        new  SessionController().updateSession
    ])

    // //DELETE
    // app.delete('/presentations/:presentationID', [
    //     new  PresentationController().updateOrganisation
    // ])

}