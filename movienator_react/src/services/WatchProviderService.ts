import { WatchProvider } from '../types/WatchProvider';
import axios from 'axios';

const baseUrl = 'http://localhost:8080/watchProviders';
export async function getAllWatchProviders(): Promise<WatchProvider[]> {
  let resArray: WatchProvider[] = [];
  try {
    const response = await axios.get(baseUrl + '/all');
    if (response.status === 200) {
      resArray = response.data.data as WatchProvider[];
    }
  } catch (e) {
    console.log('Error fetching Watch Providers: ' + e);
  }
  return resArray;
}
