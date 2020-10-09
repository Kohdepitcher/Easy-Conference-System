/*
    created by kohde pitcher on 14/8/20

    this files purpose is to set up connections between the firebase cloud function and Cloud MySQL
*/

//Imports
import { ConnectionOptions, Connection, createConnection, getConnection } from 'typeorm';
import 'reflect-metadata';

// Will be true on deployed functions
export const prod = process.env.NODE_ENV === 'production';

export const config: ConnectionOptions = {
    name: 'fun',
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root', // review
    password: 'vewmi9-soxbYv-jagher', // review
    database: 'development',
    synchronize: true,
    logging: false,
    entities: [
       'lib/entities/**/*.js'
    ],
    "migrations": ["migration/*.js"],
    "cli": {
        "migrationsDir": "migration"
    },

    // Production Mode
    ...(prod && {
        //database: 'production',
        database: 'development',
        logging: false,
        // synchronize: false,
        extra: {

            //path to database
            socketPath: '/cloudsql/easy-conference-scheduling:australia-southeast1:easyconferencedatabase'
        },
    })
 }

 //create a connection to the Mysql database
 //looks for an exisitng connection and if available use it otherwise create a new connection
 export const connect = async () => {

    //create connection object
    let connection: Connection;

    
    try {
        connection = getConnection(config.name)
        console.log(connection)
    } catch(err) {
        connection = await createConnection(config);
    }

    return connection;
}