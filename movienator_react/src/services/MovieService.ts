import { Movie } from '../types/Movie';
import { Genre } from '../types/Genre';
import axios from 'axios';

const baseUrl: string = 'http://localhost:8080/movies';
export async function getAllMovies(): Promise<Movie[]> {
  let resArray: Movie[] = [];
  try {
    let response = await axios.get(baseUrl + '/all');
    if (response.status === 200) {
      resArray = response.data.data as Movie[];
    }
  } catch (e) {
    console.log('Error fetching Movies: ' + e);
  }
  return resArray;
}

export async function getOneMovie(movieId: number): Promise<Movie | null> {
  let resMovie: Movie | null = null;
  try {
    let response = await axios.get(baseUrl + `/one/${movieId}`);
    if (response.status === 200) {
      resMovie = response.data.data as Movie;
    }
  } catch (e) {
    console.log('Error fetching Genres: ' + e);
  }
  return resMovie;
}

export async function getMoviesToActor(actorId: number): Promise<Movie[]> {
  let resArray: Movie[] = [];
  try {
    let response = await axios.get(baseUrl + `/actor/${actorId}`);
    if (response.status === 200) {
      resArray = response.data.data as Movie[];
    }
  } catch (e) {
    console.log('Error fetching Movies: ' + e);
  }
  return resArray;
}
export async function getReviewedMovies(userId: number): Promise<Movie[]> {
  let resArray: Movie[] = [];
  try {
    let response = await axios.get(baseUrl + `/user/${userId}`);
    if (response.status === 200) {
      resArray = response.data.data as Movie[];
    }
  } catch (e) {
    console.log('Error fetching Movies: ' + e);
  }
  return resArray;
}
export async function getWatchlistMovies(userId: number): Promise<Movie[]> {
  let resArray: Movie[] = [];
  try {
    let response = await axios.get(baseUrl + `/watchlist/${userId}`);
    if (response.status === 200) {
      resArray = response.data.data as Movie[];
    }
  } catch (e) {
    console.log('Error fetching Movies: ' + e);
  }
  return resArray;
}
export async function getMoviesByMinTime(minTime: number): Promise<Movie[]> {
  let resArray: Movie[] = [];
  try {
    let response = await axios.get(baseUrl + `/time/min/${minTime}`);
    if (response.status === 200) {
      resArray = response.data.data as Movie[];
    }
  } catch (e) {
    console.log('Error fetching Movies: ' + e);
  }
  return resArray;
}
export async function getMoviesByMaxTime(maxTime: number): Promise<Movie[]> {
  let resArray: Movie[] = [];
  try {
    let response = await axios.get(baseUrl + `/time/max/${maxTime}`);
    if (response.status === 200) {
      resArray = response.data.data as Movie[];
    }
  } catch (e) {
    console.log('Error fetching Movies: ' + e);
  }
  return resArray;
}

export async function getMoviesByDateRange(
  minDate: Date,
  maxDate: Date
): Promise<Movie[]> {
  let resArray: Movie[] = [];
  try {
    let response = await axios.get(baseUrl + `/date/${minDate}/${maxDate}`);
    if (response.status === 200) {
      resArray = response.data.data as Movie[];
    }
  } catch (e) {
    console.log('Error fetching Movies: ' + e);
  }
  return resArray;
}

export async function getMoviesBySearchWord(
  searchWord: string
): Promise<Movie[]> {
  let resArray: Movie[] = [];
  try {
    let response = await axios.get(baseUrl + `/name/${searchWord}`);
    if (response.status === 200) {
      resArray = response.data.data as Movie[];
    }
  } catch (e) {
    console.log('Error fetching Movies: ' + e);
  }
  return resArray;
}
export async function getMoviesByMinAvgRating(
  minRating: number
): Promise<Movie[]> {
  let resArray: Movie[] = [];
  try {
    let response = await axios.get(baseUrl + `/rating/${minRating}`);
    if (response.status === 200) {
      resArray = response.data.data as Movie[];
    }
  } catch (e) {
    console.log('Error fetching Movies: ' + e);
  }
  return resArray;
}
export async function getMoviesOfGenre(
  genreIdentifier: string | number
): Promise<Movie[]> {
  let resArray: Movie[] = [];
  try {
    let response = await axios.get(baseUrl + `/genre/${genreIdentifier}`);
    if (response.status === 200) {
      resArray = response.data.data as Movie[];
    }
  } catch (e) {
    console.log('Error fetching Movies: ' + e);
  }
  return resArray;
}

export async function getMutualWatchlist(
  userA: number,
  userB: number
): Promise<Movie[]> {
  let resArray: Movie[] = [];
  try {
    let response = await axios.get(
      baseUrl + `/mutual/watchlist/${userA}/${userB}`
    );
    if (response.status === 200) {
      resArray = response.data.data as Movie[];
    }
  } catch (e) {
    console.log('Error fetching Movies: ' + e);
  }
  return resArray;
}

export async function getMutualReviewed(
  userA: number,
  userB: number
): Promise<Movie[]> {
  let resArray: Movie[] = [];
  try {
    let response = await axios.get(
      baseUrl + `/mutual/review/${userA}/${userB}`
    );
    if (response.status === 200) {
      resArray = response.data.data as Movie[];
    }
  } catch (e) {
    console.log('Error fetching Movies: ' + e);
  }
  return resArray;
}

/**
 * Inserts the movie if it doesnt exist yet. Does nothing if it already exists
 * @param newMovie
 */
export async function saveMovie(newMovie: Movie): Promise<Boolean> {
  try {
    let response = await axios.post(baseUrl, newMovie);
    if (response.status === 201) {
      return true;
    }
  } catch (e) {
    console.log('Error inserting Movies: ' + e);
  }
  return false;
}

/**
 * Shouldn't be used really. Just use saveMovie instead
 * @param newMovie
 * @see saveMovie
 */
export async function updateMovie(newMovie: Movie): Promise<Boolean> {
  try {
    let response = await axios.put(baseUrl, newMovie);
    if (response.status === 201) {
      return true;
    }
  } catch (e) {
    console.log('Error updating Movies: ' + e);
  }
  return false;
}

export async function deleteMovie(movieId: number): Promise<Boolean> {
  try {
    let response = await axios.put(baseUrl + `/${movieId}`);
    if (response.status === 204) {
      return true;
    }
  } catch (e) {
    console.log('Error deleting Movies: ' + e);
  }
  return false;
}
