import { Movie } from './Movie';

export type WatchProvider = {
  providerId: number;
  providerName: string;
  movies: Movie[];
};

export type WatchProvidersWithCountry = {
  country: string;
  providers: WatchProvider[];
};
