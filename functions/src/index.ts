
//import neccessary firebase APIs
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

//import dependencies
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';



//import routes
import { userRoutesConfig } from "./routes/user-routes-config";
import { topicRoutesConfig } from "./routes/topicRoutesConfig";
import { organisationRoutesConfig } from "./routes/organisationRoutesConfig";
import { conferenceRoutesConfig } from './routes/conferenceRoutesConfig'


//var admin = require("firebase-admin");

//refence to the service account private key
//use this for local testing
var serviceAccount = require("/Users/kohdepitcher/Downloads/easyconferencescheduling-firebase-adminsdk-h4pyr-5769f98ea6.json");

//initialise admin with private key
admin.initializeApp({

  //this is used when deploying
  // credential: admin.credential.applicationDefault(),

  //this is used when testing locally
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://easyconferencescheduling.firebaseio.com"
});


//create instance of express
const app = express();
app.use(bodyParser.json());
app.use(cors({ origin : true}));
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-Width, Content-Type, Accept")
//   next();
// })

//include the routes in express
userRoutesConfig(app);
topicRoutesConfig(app);
organisationRoutesConfig(app);
conferenceRoutesConfig(app);




//create api end point
export const api = functions.https.onRequest(app);

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


//CLOUD FUNCTIONS THAT ARE EXECUTED WHEN FIREBASE AUTH EVENTS OCCUR
// set up the user in the database when a new user signs up
//TODO: fill out the stub

exports.setUpUser = functions.auth.user().onCreate((user) => {

});