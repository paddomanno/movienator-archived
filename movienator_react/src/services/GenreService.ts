import { Genre } from '../types/Genre';

export async function getAllGenres(): Promise<Genre[]> {
  return [];
}

export async function getOneGenre(
  genreIdentifier: number | string
): Promise<Genre | null> {
  return null;
}
