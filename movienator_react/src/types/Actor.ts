import { Movie } from './Movie';

export type Actor = {
  actorId: number;
  name: string;
  movies: Movie[];
};
