import { DataSource } from 'typeorm';
import Actor from '../../entity/actor';
import ProfileImage from '../../entity/profileImage';
import Review from '../../entity/review';
import User from '../../entity/user';
import Movie from '../../entity/movie';
import Genre from '../../entity/genre';

export const TestDataSource = new DataSource({
  type: 'mysql',
  host: 'database-test',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'movienator-database-test',
  entities: [Actor, Movie, ProfileImage, Review, User, Genre],
  synchronize: true,
  logging: ['error'],
  dropSchema: true,
});
