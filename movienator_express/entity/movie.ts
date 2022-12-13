import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import Actor from './actor';
import Review from './review';
import { JoinColumn } from 'typeorm/browser';
import Genre from './genre';

@Entity()
export default class Movie extends BaseEntity {
  @PrimaryColumn()
  movieId: number;

  @Column()
  title: string;

  @Column({ nullable: true, length: 1024 })
  overview: string;

  @Column({ nullable: true })
  releaseDate: Date;

  @Column({ nullable: true })
  lengthMinutes: number;

  @Column()
  adultContent: boolean;

  @Column({ nullable: true })
  imagePath: string;

  @Column({ nullable: true })
  videoPath: string;

  @ManyToMany(() => Actor, (actor) => actor.movies, { cascade: ['insert'] })
  @JoinTable()
  actors: Actor[];

  @OneToMany(() => Review, (review) => review.review_movie)
  reviews: Review[];

  @ManyToMany(() => Genre, (genre) => genre.movies, { cascade: ['insert'] })
  @JoinTable()
  genres: Genre[];
}
