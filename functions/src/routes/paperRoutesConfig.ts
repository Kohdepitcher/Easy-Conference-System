
//import required libaries
import { Application } from "express";

//import the authentication and authorization functions
// import { isAuthenticated } from "../auth/authenticated";
// import { isAuthorized } from "../auth/authorized";

//import the topic controller
import { PaperController } from "../controllers/paperController";


//API Routes
export function paperRoutesConfig(app: Application) {

    //CREATE
    //creates a paper
    app.post('/papers', [
        // isAuthenticated,
        // isAuthorized({ hasRole: ['admin', 'manager', 'user'] }),
        new PaperController().createPaper
    ]);

    //READ
    //get all papers
    app.get('/papers', [
        // isAuthenticated,
        // isAuthorized({ hasRole: ['admin', 'manager', 'user'] }),
        new PaperController().getPapers
        
    ]);

    //get specific paper
    app.get('/papers/:paperID', [
        new PaperController().getSpecificPaper
    ]);




    //UPDATE
    app.patch('/papers/:paperID', [
        new PaperController().updatePaper
        //new TopicController().test
    ]);

    //DELETE
    app.delete('/papera/:paperID', [
        new PaperController().deletePaper
    ]);

}