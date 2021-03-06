//imports
import { BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, Entity, OneToMany } from "typeorm";

//import related entities
import { Organisation } from './organisation'
import { Presentation } from "./presentation";
import { Session } from "./session";

//models the conference table and relationships
@Entity()
export class Conference extends BaseEntity {

    //primary key
    @PrimaryGeneratedColumn()
    conferenceID: number;

    //name of the conference
    @Column({ nullable: false })
    conferenceName: string;

    @Column({ nullable: false, type: 'datetime', default: () => 'NOW()' })
    conferenceDate: Date;

    //cutoff date for submission
    @Column({ nullable: false, type: 'datetime', default: () => 'NOW()' })
    conferenceSubmissionDeadline: Date;

    

    //related organisation
    @ManyToOne( type => Organisation, organisation => organisation.conferences, {cascade: true, onDelete: "CASCADE" })
    organisation: Organisation

    @OneToMany( type => Presentation, presentation => presentation.conference)
    presentations: Presentation[];

    @OneToMany( type => Session, session => session.conference)
    sessions: Session[]
}