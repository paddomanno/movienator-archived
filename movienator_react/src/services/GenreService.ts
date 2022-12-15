import { Genre } from '../types/Genre';
import { Movie } from '../types/Movie';
import axios from 'axios';

const baseUrl: string = 'http://localhost:8080/genres';
export async function getAllGenres(): Promise<Genre[]> {
  let resArray: Genre[] = [];
  try {
    let response = await axios.get(baseUrl + '/all');
    if (response.status === 200) {
      resArray = response.data.data as Genre[];
    }
  } catch (e) {
    console.log('Error fetching Genres: ' + e);
  }
  return resArray;
}
