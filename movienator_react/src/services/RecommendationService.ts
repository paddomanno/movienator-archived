import { User } from '../types/User';
import axios from 'axios';
import {
  CreateRecommendationDTO,
  MovieWithScore,
  Recommendation,
} from '../types/Recommendation';
import { Movie } from '../types/Movie';
import { getWatchlistMoviesToUserId } from './MovieService';
import {
  getMoviesToGenreId,
  getUserRecommendationsToUserId,
} from './ExternService';
import { getFavoriteGenreToUserId } from './GenreService';

const baseUrl = 'http://localhost:8080/recommendation';

export async function getOneRecommendationByAllIds(
  fromUserId: number,
  forUserId: number,
  movieId: number
): Promise<Recommendation | null> {
  try {
    const response = await axios.get(
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
    const response = await axios.get(baseUrl + `/for/${forUserId}`);
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
    const response = await axios.get(baseUrl + `/from/${fromUserId}`);
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
    const response = await axios.get(
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
  rec: CreateRecommendationDTO
): Promise<boolean> {
  try {
    const response = await axios.post(baseUrl + '/', rec);
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
): Promise<boolean> {
  try {
    const response = await axios.delete(
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

export async function getRecommendationForUserList(
  users: User[]
): Promise<MovieWithScore[]> {
  try {
    // Get movie recommendations for this group of users
    //Now we have a list of movies (without duplicates) that at least one input user has on his/her watchlist, has reviewed or has in his/her recommended
    return await calculateWatchPartyResults(users);
  } catch (e) {
    console.log(e);
    throw e;
  }
}

/**
 * Given a list of users, this function will return a list of movies that
 * our algorithm determines to be good recommendations for this group.
 * For each user in the watch party group, collect movies based on their
 * own watchlist, recommendations and favorite genre
 * @param users users in this watch party group
 * @returns list of movies we recommend
 */
async function calculateWatchPartyResults(users: User[]) {
  const watchPartyResult: MovieWithScore[] = [];
  for (const currentUser of users) {
    //WATCHLIST
    const currentWatchList = await getWatchlistMoviesToUserId(
      currentUser.userId as number
    );
    await addMoviesToResults(watchPartyResult, currentWatchList);

    //RECOMMENDATIONS
    const currentRecommendationList = await getUserRecommendationsToUserId(
      currentUser.userId as number
    );
    await addMoviesToResults(watchPartyResult, currentRecommendationList);

    //FAVORITE GENRE
    const favoriteGenre = await getFavoriteGenreToUserId(
      currentUser.userId as number
    );
    if (!favoriteGenre) {
      continue;
    }
    const thisGenreTopMovies = await getMoviesToGenreId(
      favoriteGenre.genreId,
      1
    );
    await addMoviesToResults(watchPartyResult, thisGenreTopMovies.slice(0, 10));
  }
  return watchPartyResult;
}

/**
 * Given an array of movies, this function will add the movies to the results array,
 * giving each movie a score based on a (simple) algorithm (currently the number of times
 * this movie was going to be put into the results)
 * @param watchPartyResult the resulting list of movies given to the watch party group
 * @param listToAdd list of movies that should be given scores and added to the results
 */
async function addMoviesToResults(
  watchPartyResult: MovieWithScore[],
  listToAdd: Movie[]
) {
  listToAdd.forEach((currentMovie) => {
    // check if this movie is already in watchPartyResult
    const movieInList = watchPartyResult.find(
      (x) => x.movieId === currentMovie.movieId
    ) ?? { score: 0 };

    // if movieInList is undefined, it will be set as an object with score 0 instead of undefined
    if (movieInList.score === 0) {
      //Create a MovieWithScore Object
      const currentMovieWithScore: MovieWithScore = {
        ...currentMovie,
        score: 1,
      };
      watchPartyResult.push(currentMovieWithScore);
    }
    //Movie is already in the list --> Increase score
    else {
      movieInList.score += 1;
    }
  });
}
