import { User } from '../types/User';
import axios from 'axios';
import { Recommendation } from '../types/Recommendation';

const baseUrl: string = 'http://localhost:8080/user';
export async function getAllUsers(): Promise<User[]> {
  let resArray: User[] = [];
  try {
    let response = await axios.get(baseUrl + `/all`);
    if (response.status === 200) {
      resArray = response.data.data as User[];
    }
  } catch (e) {
    console.log('Error fetching Users: ' + e);
  }
  return resArray;
}

export async function getOneUserToUserId(
  userIdentifier: number | string
): Promise<User | null> {
  let resUser: User | null = null;
  try {
    if (isNaN(+userIdentifier)) {
      let response = await axios.get(
        baseUrl + `/one/username/${userIdentifier}`
      );
      if (response.status === 200) {
        resUser = response.data.data as User;
      }
    } else {
      let response = await axios.get(baseUrl + `/one/id/${userIdentifier}`);
      if (response.status === 200) {
        resUser = response.data.data as User;
      }
    }
  } catch (e) {
    console.log('Error fetching User: ' + e);
  }
  return resUser;
}
export async function searchUsersByUserNameQuery(
  word: string
): Promise<User[]> {
  let resArray: User[] = [];
  try {
    let response = await axios.get(baseUrl + `/username/${word}`);
    if (response.status === 200) {
      resArray = response.data.data as User[];
    }
  } catch (e) {
    console.log('Error fetching Users: ' + e);
  }
  return resArray;
}
export async function getFollowersToUserId(userId: number): Promise<User[]> {
  let resArray: User[] = [];
  try {
    let response = await axios.get(baseUrl + `/followers/${userId}`);
    if (response.status === 200) {
      resArray = response.data.data as User[];
    }
  } catch (e) {
    console.log('Error fetching Users: ' + e);
  }
  return resArray;
}
export async function getFollowingToUserId(userId: number): Promise<User[]> {
  let resArray: User[] = [];
  try {
    let response = await axios.get(baseUrl + `/following/${userId}`);
    if (response.status === 200) {
      resArray = response.data.data as User[];
    }
  } catch (e) {
    console.log('Error fetching Users: ' + e);
  }
  return resArray;
}
export async function getFollowingToUserIdThatReviewedMovieId(
  userId: number,
  movieId: number
): Promise<User[]> {
  let resArray: User[] = [];
  try {
    let response = await axios.get(
      baseUrl + `/following/${userId}/rated/${movieId}`
    );
    if (response.status === 200) {
      resArray = response.data.data as User[];
    }
  } catch (e) {
    console.log('Error fetching Users: ' + e);
  }
  return resArray;
}
export async function getFollowingToUserIdWithMovieIdOnWatchlist(
  userId: number,
  movieId: number
): Promise<User[]> {
  let resArray: User[] = [];
  try {
    let response = await axios.get(
      baseUrl + `/following/${userId}/watchlist/${movieId}`
    );
    if (response.status === 200) {
      resArray = response.data.data as User[];
    }
  } catch (e) {
    console.log('Error fetching Users: ' + e);
  }
  return resArray;
}
export async function createUser(newUser: User): Promise<Boolean> {
  try {
    let response = await axios.post(baseUrl + '/', newUser);
    if (response.status === 201) {
      return true;
    }
  } catch (e) {
    console.log('Error inserting Users: ' + e);
  }
  return false;
}

/**
 * User A will start following user B
 * @param userAId
 * @param userBId
 */
export async function insertFollowingToUserIdAndUserId(
  userAId: number,
  userBId: number
): Promise<Boolean> {
  try {
    let response = await axios.post(baseUrl + `/follow/${userAId}/${userBId}`);
    if (response.status === 201) {
      return true;
    }
  } catch (e) {
    console.log('Error inserting Following: ' + e);
  }
  return false;
}
export async function insertMovieIdOnWatchlistToUserId(
  userAId: number,
  movieId: number
): Promise<Boolean> {
  try {
    let response = await axios.post(
      baseUrl + `/watchlist/${userAId}/${movieId}`
    );
    if (response.status === 201) {
      return true;
    }
  } catch (e) {
    console.log('Error inserting Watchlist: ' + e);
  }
  return false;
}
export async function updateUser(user: User): Promise<Boolean> {
  try {
    let response = await axios.put(baseUrl, user);
    if (response.status === 201) {
      return true;
    }
  } catch (e) {
    console.log('Error inserting User: ' + e);
  }
  return false;
}
export async function deleteUserToUserId(userId: number): Promise<Boolean> {
  try {
    let response = await axios.delete(baseUrl + `/${userId}`);
    if (response.status === 204) {
      return true;
    }
  } catch (e) {
    console.log('Error inserting User: ' + e);
  }
  return false;
}

/**
 * User A will stop following User B
 * @param userIdA
 * @param userIdB
 */
export async function removeUserIdBFromFollowingOfUserIdA(
  userIdA: number,
  userIdB: number
): Promise<Boolean> {
  try {
    let response = await axios.delete(
      baseUrl + `/follow/${userIdA}/${userIdB}`
    );
    if (response.status === 204) {
      return true;
    }
  } catch (e) {
    console.log('Error inserting User: ' + e);
  }
  return false;
}
export async function removeMovieIdFromWatchlistOfUserId(
  userId: number,
  movieId: number
): Promise<Boolean> {
  try {
    let response = await axios.delete(
      baseUrl + `/watchlist/${userId}/${movieId}`
    );
    if (response.status === 204) {
      return true;
    }
  } catch (e) {
    console.log('Error deleting from Watchlist User: ' + e);
  }
  return false;
}

export async function getFollowingOfUserIdInFollowers(
  userId: number
): Promise<Recommendation[]> {
  let res: Recommendation[] = [];
  try {
    let response = await axios.get(baseUrl + `/followingMutual/${userId}`);
    if (response.status === 200) {
      res = response.data.data as Recommendation[];
    }
  } catch (e) {
    console.log(e);
  }
  return res;
}
