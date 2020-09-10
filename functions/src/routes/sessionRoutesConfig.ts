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

    // //READ
    // //get all presentations for user
    // app.get('/presentations/:userID', [
    //     // isAuthenticated,
    //     // isAuthorized({ hasRole: ['admin', 'manager', 'user'] }),
    //     new  PresentationController().getPresentationsForUser
        
    // ])

    // //get all presentations for conference
    // app.get('/presentations-for-user/:conferenceID', [
    //     // isAuthenticated,
    //     // isAuthorized({ hasRole: ['admin', 'manager', 'user'] }),
    //     new  PresentationController().getPresentationsForConference
        
    // ])

    // //get specific presentation
    // app.get('/specific-presentation/:presentationID', [
    //     new  PresentationController().getSpecificPresentation
    // ])

    // //UPDATE
    // app.patch('/presentations/:presentationID', [
    //     new  PresentationController().updatePresentation
    // ])

    // //DELETE
    // app.delete('/presentations/:presentationID', [
    //     new  PresentationController().updateOrganisation
    // ])

}