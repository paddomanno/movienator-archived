import {BaseEntity, Column, Entity, JoinTable, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import Movie from "./movie";
import User from "./user";
import {JoinColumn} from "typeorm/browser";

@Entity()
export default class Review extends BaseEntity{
    @PrimaryColumn()
    review_movieId: number

    @PrimaryColumn()
    review_userId: number

    @Column()
    title: string

    @Column({length: 1024})
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
    review_movie: Movie

    @ManyToOne(()=>User,(user)=>user.reviews,{
        onDelete: "CASCADE"
    })
    review_user: User
}