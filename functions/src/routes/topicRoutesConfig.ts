
//import required libaries
import { Application } from "express";

//import the authentication and authorization functions
import { isAuthenticated } from "../auth/authenticated";
import { isAuthorized } from "../auth/authorized";

import { AuthRoles } from "../globals";

//import the topic controller
import { TopicController } from "../controllers/topicController";


//API Routes
export function topicRoutesConfig(app: Application) {

    //CREATE
    //creates a topic
    app.post('/topics', [
        isAuthenticated,
        isAuthorized({ hasRole: [AuthRoles.Admin] }),
        new TopicController().createTopic
    ]);

    //READ
    //get all topics
    app.get('/topics', [
        isAuthenticated,
        isAuthorized({ hasRole: [AuthRoles.Admin, AuthRoles.presenter] }),
        new TopicController().getTopics
        
    ]);



    //get specific topic
    app.get('/topics/:topicID', [
        isAuthenticated,
        isAuthorized({ hasRole: [AuthRoles.Admin, AuthRoles.presenter] }),
        new TopicController().getSpecificTopic
    ]);

    //get topics for organisationID
    app.get('/topics-for-organisation/:organisationID', [
        isAuthenticated,
        isAuthorized({ hasRole: [AuthRoles.Admin, AuthRoles.presenter] }),
        new TopicController().getTopicsForOrganisation
    ]);



    //UPDATE
    app.patch('/topics/:topicID', [
        isAuthenticated,
        isAuthorized({ hasRole: [AuthRoles.Admin] }),
        new TopicController().updateTopic
        //new TopicController().test
    ]);

    //DELETE
    app.delete('/topics/:topicID', [
        isAuthenticated,
        isAuthorized({ hasRole: [AuthRoles.Admin] }),
        new TopicController().deleteTopic
    ]);

}