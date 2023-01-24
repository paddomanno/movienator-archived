import { Movie } from '../types/Movie';
import { Actor } from '../types/Actor';
import axios from 'axios';
import { Genre } from '../types/Genre';
import {
  WatchProvider,
  WatchProvidersWithCountry,
} from '../types/WatchProvider';

const baseUrl = 'http://localhost:8080/extern';
export async function getMoviesToName(
  searchWord: string,
  page: number
): Promise<Movie[]> {
  let resArray: Movie[] = [];
  try {
    const response = await axios.get(
      baseUrl + `/search/movie/${searchWord}` + `?page=${page}`
    );
    if (response.status === 200) {
      resArray = response.data.data as Movie[];
    }
  } catch (e) {
    console.log('Error fetching movies: ' + e);
  }
  return resArray;
}
export async function getOneMovieToId(movieId: number): Promise<Movie | null> {
  let resMovie: Movie | null = null;
  try {
    const response = await axios.get(baseUrl + `/movie/one/${movieId}`);
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
    const response = await axios.get(baseUrl + `/search/actor/${searchWord}`);
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
    const response = await axios.get(baseUrl + `/actor/movie/${movieId}`);
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
    const response = await axios.get(baseUrl + `/movies/actor/${actorId}`);
    if (response.status === 200) {
      resArray = response.data.data as Movie[];
    }
  } catch (e) {
    console.log('Error fetching Movies: ' + e);
  }
  return resArray;
}

export async function getOneActorToId(actorId: number): Promise<Actor | null> {
  let resArray: Actor | null = null;
  try {
    const response = await axios.get(baseUrl + `/actor/${actorId}`);
    if (response.status === 200) {
      resArray = response.data.data as Actor;
    }
  } catch (e) {
    console.log('Error fetching Movies: ' + e);
  }
  return resArray;
}

export async function getUserRecommendationsToUserId(
  userId: number
): Promise<Movie[]> {
  let resArray: Movie[] = [];
  try {
    const response = await axios.get(
      baseUrl + `/user/${userId}/recommendations`
    );
    if (response.status === 200) {
      resArray = response.data.data as Movie[];
    }
  } catch (e) {
    console.log('Error fetching Movies: ' + e);
  }
  return resArray;
}

export async function getMovieRecommendationsToMovieId(
  movieId: number
): Promise<Movie[]> {
  let resArray: Movie[] = [];
  try {
    const response = await axios.get(
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

export async function getPopularMoviesToPagenumber(
  page: number
): Promise<Movie[]> {
  let resArray: Movie[] = [];
  try {
    const response = await axios.get(baseUrl + '/popular' + `?page=${page}`);
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
    const response = await axios.get(baseUrl + '/genres');
    if (response.status === 200) {
      resArray = response.data.data as Genre[];
    }
  } catch (e) {
    console.log('Error fetching Genres: ' + e);
  }
  return resArray;
}

export async function getMoviesToGenreId(
  genreId: number,
  page: number
): Promise<Movie[]> {
  let resArray: Movie[] = [];
  try {
    const response = await axios.get(
      baseUrl + `/movie/genre/${genreId}` + `?page=${page}`
    );
    if (response.status === 200) {
      resArray = response.data.data as Movie[];
    }
  } catch (e) {
    console.log('Error fetching Genres: ' + e);
  }
  return resArray;
}

export async function getOneGenreToId(genreId: number): Promise<Genre | null> {
  let resGenre: Genre | null = null;
  try {
    const response = await axios.get(baseUrl + `/genre/${genreId}`);
    if (response.status === 200) {
      resGenre = response.data.data as Genre;
    }
  } catch (e) {
    console.log('Error fetching Genres: ' + e);
  }
  return resGenre;
}

//Checks if a string contains hatespeech or insults
export async function getContainsHateSpeech(
  inputText: string
): Promise<boolean> {
  try {
    let response = await axios.get(baseUrl + '/hatespeech', {
      params: { text: inputText },
    });
    if (response.status == 200) {
      return response.data.data as boolean;
    }
  } catch (e) {
    console.log(e);
  }
  return false;
}

export async function getAllWatchProvidersUS(): Promise<WatchProvider[]> {
  let resArray: WatchProvider[] = [];
  try {
    const response = await axios.get(baseUrl + '/watchProviders');
    if (response.status === 200) {
      resArray = response.data.data as WatchProvider[];
    }
  } catch (e) {
    console.log('Error fetching Watch Providers: ' + e);
  }
  return resArray;
}

export async function getAllWatchProvidersForMovie(
  movieId: number,
  country: string
): Promise<WatchProvidersWithCountry> {
  let result: WatchProvidersWithCountry = { country: '', providers: [] };
  try {
    const response = await axios.get(
      baseUrl + `/watchProviders/movie/${movieId}/${country}`
    );
    if (response.status === 200) {
      result = response.data.data;
    }
  } catch (e) {
    console.log('Error fetching Watch Providers: ' + e);
  }
  return result;
}
