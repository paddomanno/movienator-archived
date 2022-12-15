import { Review } from '../types/Review';

export async function getAllReviews(): Promise<Review[]> {
  return [];
}

export async function getOneReview(
  userId: number,
  movieId: number
): Promise<Review | null> {
  return null;
}
