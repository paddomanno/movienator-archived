import { Actor } from './Actor';
import { Review } from './Review';
import { Genre } from './Genre';
import { WatchProvider } from './WatchProvider';

export type Movie = {
  movieId: number;
  title: string;
  overview: string;
  releaseDate: Date;
  lengthMinutes: number;
  adultContent: boolean;
  imagePath: string;
  videoPath: string;
  actors: Actor[];
  reviews: Review[];
  genres: Genre[];
  watchProviders: WatchProvider[];
};
