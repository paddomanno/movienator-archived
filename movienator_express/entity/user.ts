import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ProfileImage from './profileImage';
import Review from './review';
import Movie from './movie';

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  userName: string;

  @Column()
  password: string;

  @Column({ default: '', length: 1024 })
  comment: string;

  @Column()
  birthday: Date;

  @ManyToOne(() => ProfileImage, (profileImage) => profileImage.users, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  profileImage: ProfileImage;

  @OneToMany(() => Review, (review) => review.review_user)
  reviews: Review[];

  @ManyToMany(() => User, (user) => user.followers, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  following: User[];

  @ManyToMany(() => User, (user) => user.following, {
    onDelete: 'CASCADE',
  })
  followers: User[];

  @ManyToMany(() => Movie)
  @JoinTable()
  watchlist: Movie[];
}
