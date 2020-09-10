//import required libaries
import { Application } from "express";

//import the authentication and authorization functions
// import { isAuthenticated } from "../auth/authenticated";
// import { isAuthorized } from "../auth/authorized";

//import the topic controller
import { PresentationController } from "../controllers/presentationController";


//API Routes
export function presentationRoutesConfig(app: Application) {

    //CREATE
    //creates a presentation
    app.post('/presentations', [
        // isAuthenticated,
        // isAuthorized({ hasRole: ['admin', 'manager', 'user'] }),
        new PresentationController().createPresentation
    ])

    //READ
    //get all presentations for user
    app.get('/presentations/:userID', [
        // isAuthenticated,
        // isAuthorized({ hasRole: ['admin', 'manager', 'user'] }),
        new  PresentationController().getPresentationsForUser
        
    ])

    //get all presentations for conference
    app.get('/presentations-for-user/:conferenceID', [
        // isAuthenticated,
        // isAuthorized({ hasRole: ['admin', 'manager', 'user'] }),
        new  PresentationController().getPresentationsForConference
        
    ])

    //get specific presentation
    app.get('/specific-presentation/:presentationID', [
        new  PresentationController().getSpecificPresentation
    ])

    //UPDATE
    app.patch('/presentations/:presentationID', [
        new  PresentationController().updatePresentation
    ])

    // //DELETE
    // app.delete('/presentations/:presentationID', [
    //     new  PresentationController().updateOrganisation
    // ])

}