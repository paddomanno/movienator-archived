import { User } from './User';
import { Movie } from './Movie';

export type Recommendation = {
  sendingUserUserId: number;
  receivingUserUserId: number;
  recommendedMovieMovieId: number;
  message: string;
  sendingUser: User;
  receivingUser: User;
  recommendedMovie: Movie;
};
