import { Movie } from '../types/Movie';
import { Actor } from '../types/Actor';

export async function getPopularMovies(): Promise<Movie[]> {
  return [];
}

export async function getActorsToMovie(movieId: number): Promise<Actor[]> {
  return [];
}
