import { BaseEntity, Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import Movie from './movie';

@Entity()
export default class Genre extends BaseEntity {
  @PrimaryColumn()
  genreId: number;

  @Column()
  genreName: string;

  @ManyToMany(() => Movie, (movie) => movie.genres)
  movies: Movie[];
}
