import { Movie } from './Movie';

export type WatchProvider = {
  providerId: number;
  providerName: string;
  movies: Movie[];
};
