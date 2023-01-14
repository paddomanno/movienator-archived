import { User } from '../types/User';
import axios from 'axios';
import { Recommendation } from '../types/Recommendation';
import { Movie } from '../types/Movie';
import { getWatchlistMoviesToUserId } from './MovieService';
import { getUserRecommendationsToUserId } from './ExternService';
import { getAllReviewsToUserId } from './ReviewService';
import { Genre } from '../types/Genre';

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

type movieWithScore = {
  movieId: number;
  title: string;
  overview: string;
  releaseDate: Date;
  lengthMinutes: number;
  adultContent: boolean;
  imagePath: string;
  videoPath: string;
  genres: Genre[];
};

export async function getRecommendationForUserList(
  users: User[]
): Promise<movieWithScore[]> {
  let watchPartyResult: movieWithScore[] = [];
  //Iterate trough all users of the watch party
  users.forEach(async (currentUser) => {
    //WATCHLIST
    let currentWatchList = await getWatchlistMoviesToUserId(
      currentUser.userId as number
    );
    //Add the movies that arent already on the list
    currentWatchList.forEach((currentMovie) => {
      //If this movie is not already in watchPartyResult
      //console.log(currentMovie);
      if (
        watchPartyResult.findIndex(
          (x) => x.movieId === currentMovie.movieId
        ) === -1
      ) {
        watchPartyResult.push(currentMovie);
      }
    });

    //WATCHLIST
    let currentRecommendationList = await getUserRecommendationsToUserId(
      currentUser.userId as number
    );
    //Add the movies that arent already on the list
    currentRecommendationList.forEach((currentMovie) => {
      //If this movie is not already in watchPartyResult
      //console.log(currentMovie);
      if (
        watchPartyResult.findIndex(
          (x) => x.movieId === currentMovie.movieId
        ) === -1
      ) {
        watchPartyResult.push(currentMovie);
      }
    });

    //REVIEWS
    let currentReviewList = await getAllReviewsToUserId(
      currentUser.userId as number
    );
    //Add the movies that arent already on the list
    currentReviewList.forEach((currentReview) => {
      //If this movie is not already in watchPartyResult

      //TODO: Kann review_movie null sein?
      if (
        watchPartyResult.findIndex(
          (x) => x.movieId === currentReview.review_movie!.movieId
        ) === -1
      ) {
        watchPartyResult.push(currentReview.review_movie!);
      }
    });
  });
  console.log(watchPartyResult);
  //Now we have a list of movies (without duplicates) that at least one input user has on his/her watchlist, has reviewed or has in his/her recommended
  return watchPartyResult;
}
