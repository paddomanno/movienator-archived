import { WatchProvider } from '../types/WatchProvider';
import axios from 'axios';

const baseUrl: string = 'http://localhost:8080/watchProviders';
export async function getAllWatchProviders(): Promise<WatchProvider[]> {
  let resArray: WatchProvider[] = [];
  //   try {
  //     let response = await axios.get(baseUrl + '/all');
  //     if (response.status === 200) {
  //       resArray = response.data.data as Genre[];
  //     }
  //   } catch (e) {
  //     console.log('Error fetching Genres: ' + e);
  //   }
  return resArray;
}
