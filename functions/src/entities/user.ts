
//import typreorm 
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany } from "typeorm";

//import related entities
import { Paper } from "../entities/paper";

@Entity()
export class User extends BaseEntity {

    //primary key
    @PrimaryGeneratedColumn()
    userID: number;

    //the user's uuid from firebase
    @Column()
    UUID: string;

    //name of the user
    @Column()
    name: string;

    //email address
    @Column()
    email: string;

    //country that user resides in
    @Column()
    country: string;

    //timezone for the user
    @Column()
    timeZone: Number;

    //track when user was created
    @Column('datetime')
    createdAt: Date;

    //track when user was last modified
    @Column('datetime')
    modifiedAt: Date;

    //relationships
    //Paper relationship
    //foreign key - referenced by paper class
    @OneToMany(type => Paper, paper => paper.author)
    papers: Paper[];

    //setup default values
    @BeforeInsert()
    setupDefaultValue() {

        //set the created date and modified date
        this.createdAt = new Date();
        this.modifiedAt = new Date();
    }

    //modify data before updating
    @BeforeUpdate()
    updateModifiedDate() {

        //set a new modified date
        this.modifiedAt = new Date();
    }

}