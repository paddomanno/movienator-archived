import { User } from '../types/User';
import axios from 'axios';
import { Recommendation } from '../types/Recommendation';

const baseUrl: string = 'http://localhost:8080/recommendation';

export async function getOneRecommendationByAllIds(
  fromUserId: number,
  forUserId: number,
  movieId: number
): Promise<Recommendation | null> {
  try {
    let response = await axios.get(
      baseUrl + `/one/${fromUserId}/${forUserId}/${movieId}`
    );
    if (response.status === 200) {
      return response.data.data as Recommendation;
    }
  } catch (e) {
    console.log(e);
  }
  return null;
}

export async function getAllRecommendationsForUserId(
  forUserId: number
): Promise<Recommendation[]> {
  try {
    let response = await axios.get(baseUrl + `/for/${forUserId}`);
    if (response.status === 200) {
      return response.data.data as Recommendation[];
    }
  } catch (e) {
    console.log(e);
  }
  return [];
}

export async function getAllRecommendationsFromUserId(
  fromUserId: number
): Promise<Recommendation[]> {
  try {
    let response = await axios.get(baseUrl + `/from/${fromUserId}`);
    if (response.status === 200) {
      return response.data.data as Recommendation[];
    }
  } catch (e) {
    console.log(e);
  }
  return [];
}
export async function getAllRecommendationsForUserIdForMovieId(
  fromUserId: number,
  movieId: number
): Promise<Recommendation[]> {
  try {
    let response = await axios.get(
      baseUrl + `/forMovie/${fromUserId}/${movieId}`
    );
    if (response.status === 200) {
      return response.data.data as Recommendation[];
    }
  } catch (e) {
    console.log('Error getting Rec');
  }
  return [];
}

export async function postOrUpdateRecommendation(
  rec: Recommendation
): Promise<Boolean> {
  try {
    let response = await axios.post(baseUrl + '/', rec);
    if (response.status === 201) {
      return true;
    }
  } catch (e) {
    console.log('Error saving Rec' + e);
  }
  return false;
}

export async function deleteRecommendation(
  fromUserId: number,
  forUserId: number,
  movieId: number
): Promise<Boolean> {
  try {
    let response = await axios.delete(
      baseUrl + `/${fromUserId}/${forUserId}/${movieId}`
    );
    if (response.status === 204) {
      return true;
    }
  } catch (e) {
    console.log(e);
  }
  return false;
}
