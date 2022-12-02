import {BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn} from "typeorm";
import Actor from "./actor";
import Review from "./review";

@Entity()
export default class Movie extends BaseEntity{
    @PrimaryColumn()
    movieId: number

    @Column({type: "simple-array", nullable: true})
    genres: string[]

    @Column()
    title: string

    @Column({nullable: true, length: 1024})
    overview: string

    @Column({nullable:true})
    releaseDate: Date

    @Column({nullable: true})
    lengthMinutes: number

    @Column()
    adultContent: boolean

    @Column({nullable:true})
    imagePath: string

    @ManyToMany(()=>Actor,(actor)=>actor.movies)
    @JoinTable()
    actors: Actor[]

    @OneToMany(()=>Review,(review)=>review.user)
    reviews: Review[]
}