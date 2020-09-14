//import required libaries
import { Application } from "express";

//import the authentication and authorization functions
// import { isAuthenticated } from "../auth/authenticated";
// import { isAuthorized } from "../auth/authorized";

//import the session controller
import { SessionController } from "../controllers/sessionController";


//API Routes
export function sessionRoutesConfig(app: Application) {

    //CREATE
    //creates a presentation
    app.post('/sessions', [
        // isAuthenticated,
        // isAuthorized({ hasRole: ['admin', 'manager', 'user'] }),
        new SessionController().createSession
    ])

    // READ
    //get all sessions for user
    // app.get('/sessions/:userID', [
    //     // isAuthenticated,
    //     // isAuthorized({ hasRole: ['admin', 'manager', 'user'] }),
    //     new  SessionController().getSessionsForUser
        
    // ])

    //get all sessions for conference
    app.get('/sessions-for-conferece/:conferenceID', [
        // isAuthenticated,
        // isAuthorized({ hasRole: ['admin', 'manager', 'user'] }),
        new  SessionController().getSessionsForConference
        
    ])

    //gets all presenters and paper for session
    app.get('/presenters-for-session/:sessionID', [
        // isAuthenticated,
        // isAuthorized({ hasRole: ['admin', 'manager', 'user'] }),
        new  SessionController().getPresentationsWithinSession
        
    ])


    //UPDATE
    app.patch('/sessions/:sessionID', [
        new  SessionController().updateSession
    ])

    // //DELETE
    // app.delete('/presentations/:presentationID', [
    //     new  PresentationController().updateOrganisation
    // ])

}