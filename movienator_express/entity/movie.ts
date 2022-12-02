import {BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn} from "typeorm";
import Actor from "./actor";
import Review from "./review";

@Entity()
export default class Movie extends BaseEntity{
    @PrimaryColumn()
    movieId: string

    @Column({nullable: true})
    genre: string

    @Column()
    title: string

    @Column()
    yearPublished: number

    @Column()
    lengthMinutes: number

    @Column()
    adultContent: boolean

    @ManyToMany(()=>Actor,(actor)=>actor.movies)
    @JoinTable()
    actors: Actor[]

    @OneToMany(()=>Review,(review)=>review.user)
    reviews: Review[]
}