import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './user';
import Movie from './movie';

@Entity()
export default class Recommendation extends BaseEntity {
  @PrimaryColumn()
  sendingUserUserId: number;

  @PrimaryColumn()
  receivingUserUserId: number;

  @PrimaryColumn()
  recommendedMovieMovieId: number;

  @Column({ length: 2000 })
  message: string;

  @ManyToOne(() => User)
  sendingUser: User;

  @ManyToOne(() => User)
  receivingUser: User;

  @ManyToOne(() => Movie)
  recommendedMovie: Movie;
}
