import { Review } from '../types/Review';
import axios, { AxiosError } from 'axios';

const baseUrl = 'http://localhost:8080/review';
export async function getAllReviews(): Promise<Review[]> {
  let resArray: Review[] = [];
  try {
    const response = await axios.get(baseUrl + `/all`);
    if (response.status === 200) {
      resArray = response.data.data as Review[];
    }
  } catch (e) {
    console.log('Error fetching Reviews: ' + e);
  }
  return resArray;
}
export async function getAllReviewsSinceSpecificDate(
  date: Date
): Promise<Review[]> {
  let resArray: Review[] = [];
  try {
    const response = await axios.get(baseUrl + `/time/${date}`);
    if (response.status === 200) {
      resArray = response.data.data as Review[];
    }
  } catch (e) {
    console.log('Error fetching Reviews: ' + e);
  }
  return resArray;
}
export async function getOneReviewToUserIdAndMovieId(
  userId: number,
  movieId: number
): Promise<Review | null> {
  if (!userId || !movieId) {
    return null;
  }
  let resReview: Review | null = null;
  try {
    const response = await axios.get(baseUrl + `/one/${movieId}/${userId}`);
    if (response.status === 200) {
      resReview = response.data.data as Review;
    }
  } catch (error) {
    const e = error as AxiosError;
    if (e.response && e.response.status === 404) {
      // Review not found, which is expected behavior
      return null;
    }
    console.log('Error fetching Reviews: ' + e);
  }
  return resReview;
}

export async function getAllReviewsToMovieId(
  movieId: number
): Promise<Review[]> {
  let resArray: Review[] = [];
  try {
    const response = await axios.get(baseUrl + `/movie/${movieId}`);
    if (response.status === 200) {
      resArray = response.data.data as Review[];
    }
  } catch (e) {
    console.log('Error fetching Reviews: ' + e);
  }
  return resArray;
}

export async function getAllReviewsToUserId(userId: number): Promise<Review[]> {
  let resArray: Review[] = [];
  try {
    const response = await axios.get(baseUrl + `/user/own/${userId}`);
    if (response.status === 200) {
      resArray = response.data.data as Review[];
    }
  } catch (e) {
    console.log('Error fetching Reviews: ' + e);
  }
  return resArray;
}

export async function getAllReviewsOfFollowingToUserId(
  userId: number
): Promise<Review[]> {
  let resArray: Review[] = [];
  try {
    const response = await axios.get(baseUrl + `/user/following/${userId}`);
    if (response.status === 200) {
      resArray = response.data.data as Review[];
    }
  } catch (e) {
    console.log('Error fetching Reviews: ' + e);
  }
  return resArray;
}

export async function getAllReviewsOfFollowingToUserIdAndMovieId(
  userId: number,
  movieId: number
): Promise<Review[]> {
  let resArray: Review[] = [];
  try {
    const response = await axios.get(
      baseUrl + `/user/following/${userId}/review/${movieId}`
    );
    if (response.status === 200) {
      resArray = response.data.data as Review[];
    }
  } catch (e) {
    console.log('Error fetching Reviews: ' + e);
  }
  return resArray;
}
export async function getAllReviewsOfNotFollowingToUserIdAndMovieId(
  userId: number,
  movieId: number
): Promise<Review[]> {
  let resArray: Review[] = [];
  try {
    const response = await axios.get(
      baseUrl + `/user/notFollowing/${userId}/review/${movieId}`
    );
    if (response.status === 200) {
      resArray = response.data.data as Review[];
    }
  } catch (e) {
    console.log('Error fetching Reviews: ' + e);
  }
  return resArray;
}
export async function getAllReviewsOfFollowingToUserIdSinceDate(
  userId: number,
  date: Date
): Promise<Review[]> {
  let resArray: Review[] = [];
  try {
    const response = await axios.get(
      baseUrl + `/user/following/${userId}/${date}`
    );
    if (response.status === 200) {
      resArray = response.data.data as Review[];
    }
  } catch (e) {
    console.log('Error fetching Reviews: ' + e);
  }
  return resArray;
}
export async function createReview(newReview: Review): Promise<boolean> {
  try {
    const response = await axios.post(baseUrl, newReview);
    if (response.status === 201) {
      return true;
    }
  } catch (e) {
    console.log('Error fetching Reviews: ' + e);
  }
  return false;
}
export async function updateReview(updatedReview: Review): Promise<boolean> {
  try {
    const response = await axios.put(baseUrl, updatedReview);
    if (response.status === 201) {
      return true;
    }
  } catch (e) {
    console.log('Error fetching Reviews: ' + e);
  }
  return false;
}
export async function deleteReviewToMovieIdAndUserId(
  movieId: number,
  userId: number
): Promise<boolean> {
  try {
    const response = await axios.delete(baseUrl + `/${userId}/${movieId}`);
    if (response.status === 204) {
      return true;
    }
  } catch (e) {
    console.log('Error deleting Reviews: ' + e);
  }
  return false;
}
