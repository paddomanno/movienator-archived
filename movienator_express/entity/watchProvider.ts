import { BaseEntity, Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import Movie from './movie';

@Entity()
export default class WatchProvider extends BaseEntity {
  @PrimaryColumn()
  providerId: number;

  @Column()
  providerName: string;

  @ManyToMany(() => Movie, (movie) => movie.watchProviders)
  movies: Movie[];
}
