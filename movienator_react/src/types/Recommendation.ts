import { User } from './User';
import { Movie } from './Movie';

export type Recommendation = {
  sendingUserUserId: number;
  receivingUserUserId: number;
  recommendedMovieMovieId: number;
  message: string;
  sendingUser: User | null;
  receivingUser: User | null;
  recommendedMovie: Movie | null;
};

type Score = { score: number };

export type MovieWithScore = Score & Movie;
