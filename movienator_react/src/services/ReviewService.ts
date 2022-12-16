import { Review } from '../types/Review';
import { ProfileImage } from '../types/ProfileImage';
import axios from 'axios';

const baseUrl: string = 'http://localhost:8080/reviews';
export async function getAllReviews(): Promise<Review[]> {
  let resArray: Review[] = [];
  try {
    let response = await axios.get(baseUrl + `/all`);
    if (response.status === 200) {
      resArray = response.data.data as Review[];
    }
  } catch (e) {
    console.log('Error fetching Images: ' + e);
  }
  return resArray;
}
export async function getAllReviewsSinceTime(date: Date): Promise<Review[]> {
  let resArray: Review[] = [];
  try {
    let response = await axios.get(baseUrl + `/time/${date}`);
    if (response.status === 200) {
      resArray = response.data.data as Review[];
    }
  } catch (e) {
    console.log('Error fetching Images: ' + e);
  }
  return resArray;
}
export async function getOneReview(
  userId: number,
  movieId: number
): Promise<Review | null> {
  let resReview: Review | null = null;
  try {
    let response = await axios.get(baseUrl + `/one/${movieId}/${userId}`);
    if (response.status === 200) {
      resReview = response.data.data as Review;
    }
  } catch (e) {
    console.log('Error fetching Images: ' + e);
  }
  return resReview;
}

export async function getReviewsToMovie(movieId: number): Promise<Review[]> {
  let resArray: Review[] = [];
  try {
    let response = await axios.get(baseUrl + `/movie/${movieId}`);
    if (response.status === 200) {
      resArray = response.data.data as Review[];
    }
  } catch (e) {
    console.log('Error fetching Images: ' + e);
  }
  return resArray;
}

export async function getReviewsToUser(userId: number): Promise<Review[]> {
  let resArray: Review[] = [];
  try {
    let response = await axios.get(baseUrl + `/user/own/${userId}`);
    if (response.status === 200) {
      resArray = response.data.data as Review[];
    }
  } catch (e) {
    console.log('Error fetching Images: ' + e);
  }
  return resArray;
}

export async function getReviewsOfFollowing(userId: number): Promise<Review[]> {
  let resArray: Review[] = [];
  try {
    let response = await axios.get(baseUrl + `/user/following/${userId}`);
    if (response.status === 200) {
      resArray = response.data.data as Review[];
    }
  } catch (e) {
    console.log('Error fetching Images: ' + e);
  }
  return resArray;
}
export async function getReviewsOfFollowingSinceTime(
  userId: number,
  date: Date
): Promise<Review[]> {
  let resArray: Review[] = [];
  try {
    let response = await axios.get(
      baseUrl + `/user/following/${userId}/${date}`
    );
    if (response.status === 200) {
      resArray = response.data.data as Review[];
    }
  } catch (e) {
    console.log('Error fetching Images: ' + e);
  }
  return resArray;
}
export async function postNewReview(newReview: Review): Promise<Boolean> {
  try {
    let response = await axios.post(baseUrl, newReview);
    if (response.status === 201) {
      return true;
    }
  } catch (e) {
    console.log('Error fetching Images: ' + e);
  }
  return false;
}
export async function updateReview(updatedReview: Review): Promise<Boolean> {
  try {
    let response = await axios.put(baseUrl, updatedReview);
    if (response.status === 201) {
      return true;
    }
  } catch (e) {
    console.log('Error fetching Images: ' + e);
  }
  return false;
}
export async function deleteReview(
  movieId: number,
  userId: number
): Promise<Boolean> {
  try {
    let response = await axios.delete(baseUrl + `/${userId}/${movieId}`);
    if (response.status === 201) {
      return true;
    }
  } catch (e) {
    console.log('Error fetching Images: ' + e);
  }
  return false;
}
