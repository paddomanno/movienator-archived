import { Genre } from '../types/Genre';
import axios from 'axios';

const baseUrl = 'http://localhost:8080/genre';
export async function getAllGenres(): Promise<Genre[]> {
  let resArray: Genre[] = [];
  try {
    const response = await axios.get(baseUrl + '/all');
    if (response.status === 200) {
      resArray = response.data.data as Genre[];
    }
  } catch (e) {
    console.log('Error fetching Genres: ' + e);
  }
  return resArray;
}

export async function getFavoriteGenreToUserId(
  userId: number
): Promise<Genre | null> {
  try {
    const response = await axios.get(baseUrl + `/favorite/${userId}`);
    if (response.status === 200) {
      return response.data.data as Genre;
    }
  } catch (e) {
    console.log('Error getting Genre');
  }
  return null;
}
