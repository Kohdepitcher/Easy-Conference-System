
//imports
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";

//import related entities
import { Paper } from "../entities/paper";
import { Organisation } from "./organisation";
// import { Presentation } from "./presentation"

@Entity()
export class Topic extends BaseEntity {

    @PrimaryGeneratedColumn()
    topicID: number;

    @Column()
    topicName: string;

    //relationships
    //Paper relationship
    //foreign key - referenced by paper class
    @OneToMany(type => Paper, paper => paper.topic)
    papers: Paper[];


    //associated organisation
    //delete topics when the related organisation is deleted
    @ManyToOne(type => Organisation, Organisation => Organisation.relatedTopics, {cascade: true, onDelete: "CASCADE" })
    organisation: Organisation;

    // @OneToMany(type => Presentation, presentation => presentation.topic)
    // presentations: Presentation[]
}