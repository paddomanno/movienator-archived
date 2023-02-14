import { DataSource } from 'typeorm';
import Actor from '../../entity/actor';
import ProfileImage from '../../entity/profileImage';
import Review from '../../entity/review';
import User from '../../entity/user';
import Movie from '../../entity/movie';
import Genre from '../../entity/genre';
import Recommendation from '../../entity/recommendation';
import WatchProvider from '../../entity/watchProvider';

export const TestDataSource = new DataSource({
  type: 'mysql',
  host: process.env['DB_HOST'],
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'movienator-database-test',
  entities: [
    Actor,
    Movie,
    ProfileImage,
    Review,
    User,
    Genre,
    Recommendation,
    WatchProvider,
  ],
  synchronize: true,
  logging: ['warn'],
  dropSchema: true,
});
