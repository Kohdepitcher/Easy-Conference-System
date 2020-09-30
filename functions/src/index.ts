
//import neccessary firebase APIs
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

//import dependencies
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

//import db stuff for the fireauth trigger
//import database connector
import { connect } from "./config";

//import the user entity
import { User } from "./entities/user";

import { AuthRoles } from "./globals";




//import routes
import { userRoutesConfig } from "./routes/user-routes-config";
import { topicRoutesConfig } from "./routes/topicRoutesConfig";
import { organisationRoutesConfig } from "./routes/organisationRoutesConfig";
import { conferenceRoutesConfig } from './routes/conferenceRoutesConfig'
import { paperRoutesConfig } from "./routes/paperRoutesConfig";
import { presentationRoutesConfig } from "./routes/presentationRoutesConfig";
import { sessionRoutesConfig } from "./routes/sessionRoutesConfig"


//var admin = require("firebase-admin");

//refence to the service account private key
//use this for local testing
//change the file path to where you stored this file
//var serviceAccount = require("/Users/kohdepitcher/Downloads/easyconferencescheduling-firebase-adminsdk-h4pyr-5769f98ea6.json");

//initialise admin with private key
admin.initializeApp({

  //this is used when deploying
  credential: admin.credential.applicationDefault(),

  //this is used when testing locally
  // credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://easyconferencescheduling.firebaseio.com"
});


//create instance of express
const app = express();
app.use(bodyParser.json());
app.use(cors({ origin : true}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-Width, Content-Type, Accept")
  next();
})

//include the routes in express
userRoutesConfig(app);
topicRoutesConfig(app);
organisationRoutesConfig(app);
conferenceRoutesConfig(app);
paperRoutesConfig(app);
presentationRoutesConfig(app);
sessionRoutesConfig(app);




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

exports.setUpUser = functions.auth.user().onCreate(async (user) => {

  //get the user's attributes
  const {uid} = user;

  //store the default role in a variable
  const role = AuthRoles.presenter

  try {

      //set the custom role claim
     return await admin.auth().setCustomUserClaims(uid, { role })

      // //create new connection to DB
      // const connection = await connect();
  
      // //get the user repository
      // const repo = connection.getRepository(User);
      
      // //create a new user
      // const newUser: User = new User();

      // //set the uuid on the db user
      // newUser.UUID = uid

      // //set the email on the db user
      // newUser.email = email;

      // //set the other user attributes to default empty values
      // newUser.country = "";
      // newUser.timeZone = 0;
      // newUser.name = "";

      // const savedNewUser = await repo.save(newUser);

      // console.log(savedNewUser)

      // return savedNewUser;

      

  } catch (err) {
      console.log(err)

      return `${err.code} - ${err.message}`;
  }

});

exports.setUpUserInDB = functions.auth.user().onCreate(async (user) => {

  //get the user's attributes
  const {uid, email} = user;

  try {

      //create new connection to DB
      const connection = await connect();
  
      //get the user repository
      const repo = connection.getRepository(User);
      
      //create a new user
      const newUser: User = new User();

      //set the uuid on the db user
      newUser.UUID = uid

      //set the email on the db user
      newUser.email = email;

      //set the other user attributes to default empty values
      newUser.country = "";
      newUser.timeZone = 0;
      newUser.name = "";

      const savedNewUser = await repo.save(newUser);

      console.log(savedNewUser)

      return savedNewUser;

      

  } catch (err) {
      console.log(err)

      return `${err.code} - ${err.message}`;
  }

});


//edit the user in db when account information is changed

// user	{"uid":"tn8EPnhryMPQ4NNnrf78uT6RNtz2","displayName":"Test Admin","photoURL":null,"email":"testadmin@test.com","emailVerified":false,"phoneNumber":null,"isAnonymous":false,"tenantId":null,"providerData":[{"uid":"testadmin@test.com","displayName":"Test Admin","photoURL":null,"email":"testadmin@test.com","phoneNumber":null,"providerId":"password"}],"apiKey":"AIzaSyCtLvZgFz2axlTPnnQhojQ1i7tnxJBdQqc","appName":"[DEFAULT]","authDomain":"rjc-trial-nominations.firebaseapp.com","stsTokenManager":{"apiKey":"AIzaSyCtLvZgFz2axlTPnnQhojQ1i7tnxJBdQqc","refreshToken":"AE0u-NeC0zqvH6pGkRYLAFqyRLf_uQ6jkQIUZl-s7l5BnF9gNjW3xupXAPsojlTBg22RI_yO1om1-zqEsn-xdnIolGWRSGkD3JFlm8QuMQY4Mn9-XMEAbzeMod37m1lih35z3mdWSYM7T19v6tvcR1vzPz5cq-VqUHwcgeNEIclYQK-3lLpYXE5JQf2VmkXTccACBmD8zxT3DGJnQJLjKGu9umbpCGXpVfm8NCz-DWW4ancTEeMlvM8","accessToken":"eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ5YWQ5YmM1ZThlNDQ3OTNhMjEwOWI1NmUzNjFhMjNiNDE4ODA4NzUiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiVGVzdCBBZG1pbiIsInJvbGUiOiJhZG1pbiIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9yamMtdHJpYWwtbm9taW5hdGlvbnMiLCJhdWQiOiJyamMtdHJpYWwtbm9taW5hdGlvbnMiLCJhdXRoX3RpbWUiOjE1OTkwMDkyOTEsInVzZXJfaWQiOiJ0bjhFUG5ocnlNUFE0Tk5ucmY3OHVUNlJOdHoyIiwic3ViIjoidG44RVBuaHJ5TVBRNE5ObnJmNzh1VDZSTnR6MiIsImlhdCI6MTU5OTYyODkwNiwiZXhwIjoxNTk5NjMyNTA2LCJlbWFpbCI6InRlc3RhZG1pbkB0ZXN0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJ0ZXN0YWRtaW5AdGVzdC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.zgucHKigEST1Es0MVqURBbXwYYPV9An23IUW8skYHaaF7Gl4IC0I2WMDndRyuFPOiWlIz_O8ZJHIWGfOIgHYDPHwUzeIy8HSC4oQQt5fXgiO_rZS-B1VkAMhqRYZMatPlqXPuwWTEq-UVN3gNklNc_HI3wZ_tYnSzQyJXLacXHF149krJQmo0NeO5jE2_WBEHfQuSw5Cf26guCcUW0Shx60L_7dsxcTts4qWdayc3qUkiS7-RjklA0tZQU8_KoxDYqyyQPcsnI7zmYJorWglR9kWCAj-rlHFSo9STFZ0v7pl70Z1y9UIxSvX2cKVJd4K7dqlLzz42akmLQq-jABxPQ","expirationTime":1599632506012},"redirectEventId":null,"lastLoginAt":"1599009291652","createdAt":"1589694043885"}

// eyJhbGciOiJSUzI1NiIsImtpZCI6IjRlMjdmNWIwNjllYWQ4ZjliZWYxZDE0Y2M2Mjc5YmRmYWYzNGM1MWIiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiVGVzdCBBZG1pbiIsInJvbGUiOiJhZG1pbiIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9yamMtdHJpYWwtbm9taW5hdGlvbnMiLCJhdWQiOiJyamMtdHJpYWwtbm9taW5hdGlvbnMiLCJhdXRoX3RpbWUiOjE1OTIxMTgxODQsInVzZXJfaWQiOiJ0bjhFUG5ocnlNUFE0Tk5ucmY3OHVUNlJOdHoyIiwic3ViIjoidG44RVBuaHJ5TVBRNE5ObnJmNzh1VDZSTnR6MiIsImlhdCI6MTU5MjMxMTQzMiwiZXhwIjoxNTkyMzE1MDMyLCJlbWFpbCI6InRlc3RhZG1pbkB0ZXN0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJ0ZXN0YWRtaW5AdGVzdC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.Ep30fBHUqjp18nPnqVMGPXarZc8lKd8ZQQXOhgJJJmgNyeR2295pb0qXNS3bY1uSeKKcdqt87uX5L3qRVDMb8PYy7RFYsjoPRtQ1Qc-m2GoOsQdv9qb9npHe5aTdzTYyFqCkqoxpkuRMEpEVhFAE3DtWCseaZItLZn4nTFA9Ca_88Ae-hyV3pNH0zi53fhIHwPjwIVtZu8UnoGBSnhcQQ07DEHRZqUknl5Ww_ROGS0gMsKqDRns4j1PdnWhxIwTGLuZ3ysUfgZdUcw-8Q4LjWgzO5cFQRIs-_N9Vhcdyb1hf-x1o6oDcR11TcfiXPl78rH2FzntKvgTAXNZUw-Ctpw