import { Movie } from './Movie';
import { User } from './User';

export type Review = {
  reviewMovieMovieId: number;

  reviewUserUserId: number;

  title: string;

  content: string;

  rating: number;

  lastUpdated: Date;

  review_movie: Movie;

  review_user: User;
};
