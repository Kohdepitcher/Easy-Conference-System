//


//global enum to define types of auth roles
//models the available roles within the system
export enum AuthRoles {
    Admin = "admin",
    presenter = "user"
}

// export enum userRole {
//     user = "user",
//     manager = "manager",
//     admin = "admin"
// }

export function dateFromUTCString(s) {
    s = s.split(/[-T:Z]/ig);
    return new Date(Date.UTC(s[0], --s[1], s[2], s[3], s[4], s[5]));
}