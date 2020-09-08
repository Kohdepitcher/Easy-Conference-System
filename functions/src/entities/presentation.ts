//imports
import { BaseEntity, Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from "typeorm";

//import related entities
import { Paper } from "../entities/paper";
import { Organisation } from "./organisation";
import { Conference } from "./conference";
import { Session } from "./session";
// import { Topic } from "./topic";
import { User } from "./user";

@Entity()
export class Presentation extends BaseEntity {

    @PrimaryGeneratedColumn()
    presentationID: number;


    //relationships
    //Paper relationship
    //foreign key - referenced by paper class
    @OneToOne(type => Paper)
    @JoinColumn()
    paper: Paper;


    //associated organisation
    @ManyToOne(type => Organisation, Organisation => Organisation.relatedTopics)
    organisation: Organisation;

    @ManyToOne(type => Conference, conference => conference.presentations)
    conference: Conference;

    @ManyToOne(type => Session, session => session.presentations)
    session: Session;

    // @ManyToOne(type => Topic, topic => topic.presentations)
    // topic: Topic;

    @ManyToOne(type => User, user => user.papers)
    user: User;
}