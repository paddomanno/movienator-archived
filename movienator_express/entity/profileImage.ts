import {BaseEntity, Column, Entity, OneToMany, PrimaryColumn} from "typeorm";
import User from "./user";

@Entity()
export default class ProfileImage extends BaseEntity{
    @PrimaryColumn()
    ressourceLink: string

    @Column()
    name: string

    @OneToMany(()=> User, (user)=>user.profileImage,{
        onDelete: "SET NULL",
    })
    users: User[]
}