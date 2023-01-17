import { User } from '../types/User';
import axios from 'axios';
import { MovieWithScore, Recommendation } from '../types/Recommendation';
import { Movie } from '../types/Movie';
import { getWatchlistMoviesToUserId } from './MovieService';
import { getUserRecommendationsToUserId } from './ExternService';
import { getAllReviewsToUserId } from './ReviewService';
import { Genre } from '../types/Genre';
import { listClasses } from '@mui/material/List';
import { Review } from '../types/Review';

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

export async function getRecommendationForUserList(
  users: User[]
): Promise<MovieWithScore[]> {
  // Get movie recommendations for this group of users
  const watchPartyResult: MovieWithScore[] = await calculateWatchPartyResults(
    users
  );
  console.log(`5 Watch Party Service Result: ${watchPartyResult}`);

  //Now we have a list of movies (without duplicates) that at least one input user has on his/her watchlist, has reviewed or has in his/her recommended
  return watchPartyResult;
}

async function calculateWatchPartyResults(users: User[]) {
  let watchPartyResult: MovieWithScore[] = [];
  //Iterate trough all users of the watch party
  for (const currentUser of users) {
    console.log(`1 //Looking at User ${currentUser.userName}`);

    //WATCHLIST
    console.log('2 //WATCHLIST');
    const currentWatchList = await getWatchlistMoviesToUserId(
      currentUser.userId as number
    );
    await addMoviesToResults(watchPartyResult, currentWatchList);

    //RECOMMENDATIONS
    console.log('3 //RECOMMENDATIONS');
    const currentRecommendationList = await getUserRecommendationsToUserId(
      currentUser.userId as number
    );
    await addMoviesToResults(watchPartyResult, currentRecommendationList);

    //REVIEWS
    console.log('4 //REVIEWS');
    const currentReviewList = await getAllReviewsToUserId(
      currentUser.userId as number
    );
    const currentMoviesFromReviews: Movie[] = currentReviewList.map(
      (review) => review.review_movie!
    );
    await addMoviesToResults(watchPartyResult, currentMoviesFromReviews);
  }
  return watchPartyResult;
}

async function addMoviesToResults(
  watchPartyResult: MovieWithScore[],
  listToAdd: Movie[]
) {
  listToAdd.forEach((currentMovie) => {
    //If this movie is not already in watchPartyResult
    // console.log(`Adding movie ${currentMovie.title} to results`);
    let movieIndex = watchPartyResult.findIndex(
      (x) => x.movieId === currentMovie.movieId
    );
    if (movieIndex === -1) {
      //Create a MovieWithScore Object
      let currentMovieWithScore: MovieWithScore = {
        ...currentMovie,
        score: 0,
      };
      watchPartyResult.push(currentMovieWithScore);
    }
    //Movie is already in the list --> Increase score
    else {
      watchPartyResult.at(movieIndex)!.score += 1;
    }
  });

  // console.log(`Results so far: ${watchPartyResult}`);
}
