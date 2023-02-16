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

export type CreateRecommendationDTO = Omit<
  Recommendation,
  'sendingUser' | 'receivingUser' | 'recommendedMovie'
>; // for creating or updating recommendations, omits the nested relations

type Score = { score: number };

export type MovieWithScore = Score & Movie; // used in watchparty ranking algorithm
