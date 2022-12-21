import { Movie } from './Movie';

export type Actor = {
  actorId: number;
  name: string;
  imagePath: string | null;
  movies: Movie[];
};
