
//import required libaries
import { Application } from "express";

//import the authentication and authorization functions
// import { isAuthenticated } from "../auth/authenticated";
// import { isAuthorized } from "../auth/authorized";

//import the topic controller
import { TopicController } from "../controllers/topicController";


//API Routes
export function topicRoutesConfig(app: Application) {

    //CREATE
    //creates a topic
    app.post('/topics', [
        // isAuthenticated,
        // isAuthorized({ hasRole: ['admin', 'manager', 'user'] }),
        new TopicController().createTopic
    ]);

    //READ
    //get all topics
    app.get('/topics', [
        // isAuthenticated,
        // isAuthorized({ hasRole: ['admin', 'manager', 'user'] }),
        new TopicController().getTopics
        
    ]);

    // lmao never mind, cant put a catch on that
    // app.get("/topics", (req, res) => {
    //     console.log("Get Topics")
    //     res.send("Get Topics")
    // })

    //get specific topic
    app.get('/topics/:topicID', [
        new TopicController().getSpecificTopic
    ]);

    //UPDATE
    app.patch('/topics/:topicID', [
        new TopicController().updateTopic
        //new TopicController().test
    ]);

    //DELETE
    app.delete('/topics/:topicID', [
        new TopicController().deleteTopic
    ]);

}