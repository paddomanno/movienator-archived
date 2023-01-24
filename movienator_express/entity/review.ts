import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import Movie from './movie';
import User from './user';

@Entity()
export default class Review extends BaseEntity {
  /**
   * Needs to be named exactly like this for typeORM to work
   */
  @PrimaryColumn()
  reviewMovieMovieId: number;

  /**
   * Needs to be named exactly like this for typeORM to work
   */
  @PrimaryColumn()
  reviewUserUserId: number;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 4096 })
  content: string;

  /**
   * The rating of this review. A number between 1 an 10
   */
  @Column()
  rating: number;

  @Column()
  lastUpdated: Date;

  @ManyToOne(() => Movie, (movie) => movie.reviews, {
    onDelete: 'CASCADE',
  })
  review_movie: Movie;

  @ManyToOne(() => User, (user) => user.reviews, {
    onDelete: 'CASCADE',
  })
  review_user: User;
}
