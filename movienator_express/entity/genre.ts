import {BaseEntity, Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export default class Genre extends BaseEntity{
    @PrimaryColumn()
    genreId: number

    @Column()
    genreName: string
}