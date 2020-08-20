
//imports
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm";

//import the related entities


//models the session time table and relationships
@Entity()
export class Session extends BaseEntity {

    //primary key
    @PrimaryGeneratedColumn()
    sessionID: number;

    //name of the session
    //will usually be the topic name then a number to represent an extra session with same topic
    //i.e. topic (1)
    @Column()
    sessionName: string;

    //date of session
    @Column()
    date: Date;

    //starting time for session
    @Column()
    startTime: Date;

    //ending time for session
    @Column()
    endTime: Date;

    


}