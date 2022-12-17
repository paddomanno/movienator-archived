import { Movie } from '../types/Movie';
import { Actor } from '../types/Actor';
import axios from 'axios';
import { Genre } from '../types/Genre';

const baseUrl: string = 'http://localhost:8080/extern';
export async function searchMoviesByName(searchWord: string): Promise<Movie[]> {
  let resArray: Movie[] = [];
  try {
    let response = await axios.get(baseUrl + `/search/movie/${searchWord}`);
    if (response.status === 200) {
      resArray = response.data.data as Movie[];
    }
  } catch (e) {
    console.log('Error fetching movies: ' + e);
  }
  return resArray;
}
export async function getMovieById(movieId: number): Promise<Movie | null> {
  let resMovie: Movie | null = null;
  try {
    let response = await axios.get(baseUrl + `/movie/one/${movieId}`);
    if (response.status === 200) {
      resMovie = response.data.data as Movie;
    }
  } catch (e) {
    console.log('Error fetching movies: ' + e);
  }
  return resMovie;
}

export async function searchActorsByName(searchWord: string): Promise<Actor[]> {
  let resActors: Actor[] = [];
  try {
    let response = await axios.get(baseUrl + `/search/actor/${searchWord}`);
    if (response.status === 200) {
      resActors = response.data.data as Actor[];
    }
  } catch (e) {
    console.log('Error fetching actors: ' + e);
  }
  return resActors;
}

export async function getActorsToMovie(movieId: number): Promise<Actor[]> {
  let resArray: Actor[] = [];
  try {
    let response = await axios.get(baseUrl + `/actor/movie/${movieId}`);
    if (response.status === 200) {
      resArray = response.data.data as Actor[];
    }
  } catch (e) {
    console.log('Error fetching actors: ' + e);
  }
  return resArray;
}

export async function getMoviesToActor(actorId: number): Promise<Movie[]> {
  let resArray: Movie[] = [];
  try {
    let response = await axios.get(baseUrl + `/movies/actor/${actorId}`);
    if (response.status === 200) {
      resArray = response.data.data as Movie[];
    }
  } catch (e) {
    console.log('Error fetching Movies: ' + e);
  }
  return resArray;
}

export async function getUserRecommendations(userId: number): Promise<Movie[]> {
  let resArray: Movie[] = [];
  try {
    let response = await axios.get(baseUrl + `/user/${userId}/recommendations`);
    if (response.status === 200) {
      resArray = response.data.data as Movie[];
    }
  } catch (e) {
    console.log('Error fetching Movies: ' + e);
  }
  return resArray;
}

export async function getMovieRecommendations(
  movieId: number
): Promise<Movie[]> {
  let resArray: Movie[] = [];
  try {
    let response = await axios.get(
      baseUrl + `/movie/${movieId}/recommendations`
    );
    if (response.status === 200) {
      resArray = response.data.data as Movie[];
    }
  } catch (e) {
    console.log('Error fetching Movies: ' + e);
  }
  return resArray;
}

export async function getPopularMovies(): Promise<Movie[]> {
  let resArray: Movie[] = [];
  try {
    let response = await axios.get(baseUrl + '/popular');
    if (response.status === 200) {
      resArray = response.data.data as Movie[];
    }
  } catch (e) {
    console.log('Error fetching Movies: ' + e);
  }
  return resArray;
}

export async function getAllGenres(): Promise<Genre[]> {
  let resArray: Genre[] = [];
  try {
    let response = await axios.get(baseUrl + '/genres');
    if (response.status === 200) {
      resArray = response.data.data as Genre[];
    }
  } catch (e) {
    console.log('Error fetching Genres: ' + e);
  }
  return resArray;
}

export async function getMoviesToGenre(genreId: number): Promise<Movie[]> {
  let resArray: Movie[] = [];
  try {
    let response = await axios.get(baseUrl + `/movie/genre/${genreId}`);
    if (response.status === 200) {
      resArray = response.data.data as Movie[];
    }
  } catch (e) {
    console.log('Error fetching Genres: ' + e);
  }
  return resArray;
}
