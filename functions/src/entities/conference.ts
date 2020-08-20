//imports
import { BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, Entity } from "typeorm";

//import related entities
import { Organisation } from './organisation'

//models the conference table and relationships
@Entity()
export class Conference extends BaseEntity {

    //primary key
    @PrimaryGeneratedColumn()
    conferenceID: number;

    //name of the conference
    @Column()
    conferenceName: string;

    //cutoff date for submission
    @Column()
    conferenceSubmissionDeadline: Date;

    //related organisation
    @ManyToOne( type => Organisation, organisation => organisation.conferences)
    organisation: Organisation
}