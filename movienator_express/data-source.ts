import { DataSource } from 'typeorm';
import Movie from './entity/movie';
import Actor from './entity/actor';
import ProfileImage from './entity/profileImage';
import Review from './entity/review';
import User from './entity/user';
import Genre from './entity/genre';
import Recommendation from './entity/recommendation';

/**
 * The Datasource used to connect to the main Database
 */
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'database',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'movienator-database',
  //Hier die importierten Entitätsklassen angeben
  entities: [Actor, Movie, ProfileImage, Review, User, Genre, Recommendation],
  synchronize: true,
  logging: false,
});
