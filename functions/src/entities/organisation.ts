
//import typeorm dependencies
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

//import required entities
import { Topic } from './topic'
import { Conference } from "./conference";


//models the organisation table
@Entity()
export class Organisation extends BaseEntity {

    //primary key
    @PrimaryGeneratedColumn()
    organisationID: number;

    //organisation name
    @Column()
    organisationName: string;



    //all topics associated with organisation
    @OneToMany(type => Topic, topic => topic.organisation)
    relatedTopics: Topic[];


    //all conferences related to organisation
    @OneToMany(type => Conference, conference => conference.organisation)
    conferences: Conference[]

}