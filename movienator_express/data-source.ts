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
  // for using local docker container
  // host: 'database',
  // port: 3306,
  // username: 'root',
  // password: 'root',
  // database: 'movienator-database',
  // for using remote db
  host: 'sql11.freesqldatabase.com',
  port: 3306,
  username: 'sql11591037',
  password: 'BLT9Q7rh9u',
  database: 'sql11591037',
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
  logging: false,
});
