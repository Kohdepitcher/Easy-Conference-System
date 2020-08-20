
//imports
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

//import the related entities
import { Topic } from "../entities/topic";
import { User } from "../entities/user";

//models the paper table and relationships
@Entity()
export class Paper extends BaseEntity {

    //primary key
    @PrimaryGeneratedColumn()
    paperID: number;

    //paper title
    @Column()
    paperTitle: string;

    //publisher
    @Column()
    paperPublisher: string;


    //relationships
    //Topic relationship
    //foreign key - referenced by topic class
    @ManyToOne(type => Topic, topic => topic.papers)
    topic: Topic;

    //User relationship
    //foreign key - referenced by user class
    @ManyToOne(type => User, user => user.papers)
    author: User;

}