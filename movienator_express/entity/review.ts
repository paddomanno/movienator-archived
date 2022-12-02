import {BaseEntity, Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import Movie from "./movie";
import User from "./user";

@Entity()
export default class Review extends BaseEntity{
    /**
     * Name NEEDS to be "entity+attribute"
     * Otherwise typeorm won't take the forgein key as primary key
     */
    @PrimaryColumn()
    movieMovieId: string
    /**
     * Name NEEDS to be "entity+attribute"
     * Otherwise typeorm won't take the forgein key as primary key
     */
    @PrimaryColumn()
    userUserId: number

    @Column()
    title: string

    @Column()
    content: string

    /**
     * The rating of this review. A number between 1 an 10
     */
    @Column()
    rating: number

    @Column()
    lastUpdated: Date

    @ManyToOne(()=>Movie, (movie)=>movie.reviews,{
        onDelete: "CASCADE"
    })
    movie: Movie

    @ManyToOne(()=>User,(user)=>user.reviews,{
        onDelete: "CASCADE"
    })
    user: User
}