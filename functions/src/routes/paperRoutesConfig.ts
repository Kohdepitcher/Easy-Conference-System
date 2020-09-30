
//import required libaries
import { Application } from "express";

//import the authentication and authorization functions
import { isAuthenticated } from "../auth/authenticated";
import { isAuthorized } from "../auth/authorized";

import { AuthRoles } from "../globals"

//import the topic controller
import { PaperController } from "../controllers/paperController";


//API Routes
export function paperRoutesConfig(app: Application) {

    //CREATE
    //creates a paper
    app.post('/papers', [
        isAuthenticated,
        isAuthorized({ hasRole: [AuthRoles.presenter] }),
        new PaperController().createPaper
    ]);

    //READ
    //get all papers
    // app.get('/papers', [
    //     // isAuthenticated,
    //     // isAuthorized({ hasRole: ['admin', 'manager', 'user'] }),
    //     new PaperController().getPapers
        
    // ]);

    //get papers for user
    app.get('/papers-for-user/:userID', [
        isAuthenticated,
        isAuthorized({ hasRole: [AuthRoles.presenter, AuthRoles.Admin] }),
        new PaperController().getPapersForUser
    ]);

    //get specific paper
    app.get('/papers/:paperID', [
        isAuthenticated,
        isAuthorized({ hasRole: [AuthRoles.presenter, AuthRoles.Admin] }),
        new PaperController().getSpecificPaper
    ]);




    //UPDATE
    app.patch('/papers/:paperID', [
        isAuthenticated,
        isAuthorized({ hasRole: [AuthRoles.presenter] }),
        new PaperController().updatePaper
    ]);

    app.patch('/just-topic-for-paper/:paperID', [
        isAuthenticated,
        isAuthorized({ hasRole: [AuthRoles.Admin] }),
        new PaperController().updatePaperWithJustTopic
    ]);

    //DELETE
    // app.delete('/papers/:paperID', [
    //     new PaperController().deletePaper
    // ]);

}