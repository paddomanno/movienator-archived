import { DataSource } from 'typeorm';
import Movie from './entity/movie';
import Actor from './entity/actor';
import ProfileImage from './entity/profileImage';
import Review from './entity/review';
import User from './entity/user';
import Genre from './entity/genre';
import Recommendation from './entity/recommendation';
import WatchProvider from './entity/watchProvider';

/**
 * The Datasource used to connect to the main Database
 */
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env['DB_HOST'],
  port: 3306,
  username: process.env['DB_USERNAME'],
  password: process.env['DB_PASSWORD'],
  database: process.env['DB_NAME'],
  //Hier die importierten Entitätsklassen angeben
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
  logging: true,
  charset: 'UTF8_GENERAL_CI',
});
