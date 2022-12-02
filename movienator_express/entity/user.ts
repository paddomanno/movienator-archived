import {BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import ProfileImage from "./profileImage";
import Review from "./review";

@Entity()
export default class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    userId: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    userName: string

    @Column()
    password: string

    @Column({default: ""})
    comment: string

    @Column()
    birthday: Date

    @ManyToOne(() => ProfileImage,(profileImage)=>profileImage.users, {
        onDelete: "SET NULL"
    })
    profileImage: ProfileImage

    @OneToMany(()=>Review,(review)=>review.user)
    reviews: Review[]
}