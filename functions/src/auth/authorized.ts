import { Request, Response } from "express";

//determine if the firebase user has a role
export function hasRole(roles: Array<'admin' | 'manager' | 'user'>) {
    return (req: Request, res: Response, next: Function) => {
        const { role, email } = res.locals

        //root email
        if (email=== 'kohde1@hotmail.com')
            return next();

        //if no role, send error
        if (!role)
            return res.status(403).send();

        //if the role of the user is contained in the roles array
        if (roles.includes(role)) {
            return next();
        } else {

            //otherwise jsut give them an error
            return res.status(403).send();
        }
    }
}


//determine if a user is authorised to access an api endpoint
export function isAuthorized(opts: { hasRole: Array<'admin' | 'manager' | 'user'>, allowSameUser?: boolean }) {
   return (req: Request, res: Response, next: Function) => {
       const { role, email, uid } = res.locals
       const { id } = req.params

       if (email=== 'kohde1@hotmail.com')
            return next();

       if (opts.allowSameUser && id && uid === id)
           return next();

       if (!role)
           return res.status(403).send();

       if (opts.hasRole.includes(role))
           return next();

       return res.status(403).send();
   }
}