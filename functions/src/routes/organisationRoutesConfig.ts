
//import required libaries
import { Application } from "express";

//import the authentication and authorization functions
import { isAuthenticated } from "../auth/authenticated";
import { isAuthorized } from "../auth/authorized";

import { AuthRoles } from "../globals"

//import the topic controller
import { OrganisationController } from "../controllers/organisationController";


//API Routes
export function organisationRoutesConfig(app: Application) {

    //CREATE
    //creates a organisation
    app.post('/organisations', [
        isAuthenticated,
        isAuthorized({ hasRole: [AuthRoles.Admin] }),
        new OrganisationController().createOrganisation
    ])

    //READ
    //get all organisations
    app.get('/organisations', [
        isAuthenticated,
        isAuthorized({ hasRole: [AuthRoles.Admin] }),
        new OrganisationController().getOrganisations
        
    ])


    //get specific organisation
    app.get('/organisations/:organisationID', [
        isAuthenticated,
        isAuthorized({ hasRole: [AuthRoles.Admin] }),
        new OrganisationController().getSpecificOrganisation
    ])

    //UPDATE
    app.patch('/organisations/:organisationID', [
        isAuthenticated,
        isAuthorized({ hasRole: [AuthRoles.Admin] }),
        new OrganisationController().updateOrganisation
    ])

    //DELETE
    app.delete('/organisations/:organisationID', [
        isAuthenticated,
        isAuthorized({ hasRole: [AuthRoles.Admin] }),
        new OrganisationController().updateOrganisation
    ])

}