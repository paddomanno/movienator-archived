import { NullableUser, User } from '../types/User';
import axios, { AxiosError } from 'axios';

const baseUrl = 'http://localhost:8080/user';
export async function getAllUsers(): Promise<User[]> {
  let resArray: User[] = [];
  try {
    const response = await axios.get(baseUrl + `/all`);
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
  try {
    if (isNaN(+userIdentifier)) {
      const response = await axios.get(
        baseUrl + `/one/username/${userIdentifier}`
      );
      return response.data.data as User;
    } else {
      const response = await axios.get(baseUrl + `/one/id/${userIdentifier}`);
      return response.data.data as User;
    }
  } catch (err) {
    if (err instanceof AxiosError && err.response?.status === 404) {
      return null;
    } else {
      console.error('Error fetching User: ', err);
      throw new Error('Something went wrong. Please try again later.');
    }
  }
}
export async function searchUsersByUserNameQuery(
  word: string
): Promise<User[]> {
  let resArray: User[] = [];
  try {
    const response = await axios.get(baseUrl + `/username/${word}`);
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
    const response = await axios.get(baseUrl + `/followers/${userId}`);
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
    const response = await axios.get(baseUrl + `/following/${userId}`);
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
    const response = await axios.get(
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
): Promise<User[] | null> {
  let resArray: User[] = [];
  try {
    const response = await axios.get(
      baseUrl + `/following/${userId}/watchlist/${movieId}`
    );
    if (response.status === 200) {
      resArray = response.data.data as User[];
    }
  } catch (err) {
    if (err instanceof AxiosError && err.response?.status === 404) {
      return null;
    } else {
      console.error('Error fetching User: ', err);
      throw new Error('Something went wrong. Please try again later.');
    }
  }
  return resArray;
}
export async function createUser(newUser: NullableUser): Promise<boolean> {
  try {
    const response = await axios.post(baseUrl + '/', newUser);
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
): Promise<boolean> {
  try {
    const response = await axios.post(
      baseUrl + `/follow/${userAId}/${userBId}`
    );
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
): Promise<boolean> {
  try {
    const response = await axios.post(
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
export async function updateUser(user: User): Promise<boolean> {
  try {
    const response = await axios.put(baseUrl, user);
    if (response.status === 201) {
      return true;
    }
  } catch (e) {
    console.log('Error inserting User: ' + e);
  }
  return false;
}
export async function deleteUserToUserId(userId: number): Promise<boolean> {
  try {
    const response = await axios.delete(baseUrl + `/${userId}`);
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
): Promise<boolean> {
  try {
    const response = await axios.delete(
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
): Promise<boolean> {
  try {
    const response = await axios.delete(
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
): Promise<User[]> {
  let res: User[] = [];
  try {
    const response = await axios.get(baseUrl + `/followingMutual/${userId}`);
    if (response.status === 200) {
      res = response.data.data as User[];
    }
  } catch (e) {
    console.log(e);
  }
  return res;
}
