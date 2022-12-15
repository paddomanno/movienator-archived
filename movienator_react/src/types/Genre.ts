import { Movie } from './Movie';

export type Genre = {
  genreId: number;
  genreName: string;
  movies: Movie[];
};
