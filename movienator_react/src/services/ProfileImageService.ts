import { ProfileImage } from '../types/ProfileImage';
import axios from 'axios';

const baseUrl: string = 'http://localhost:8080/profileImage';
export async function getAllProfileImages(): Promise<ProfileImage[]> {
  let resArray: ProfileImage[] = [];
  try {
    let response = await axios.get(baseUrl + `/all`);
    if (response.status === 200) {
      resArray = response.data.data as ProfileImage[];
    }
  } catch (e) {
    console.log('Error fetching Images: ' + e);
  }
  return resArray;
}

export async function getOneProfileImage(
  ref: string
): Promise<ProfileImage | null> {
  let resImage: ProfileImage | null = null;
  try {
    let response = await axios.get(baseUrl + `/ref/${ref}`);
    if (response.status === 200) {
      resImage = response.data.data as ProfileImage;
    }
  } catch (e) {
    console.log('Error fetching Image: ' + e);
  }
  return resImage;
}
export async function getImageOfUser(
  userId: number
): Promise<ProfileImage | null> {
  let resImage: ProfileImage | null = null;
  try {
    let response = await axios.get(baseUrl + `/user/${userId}`);
    if (response.status === 200) {
      resImage = response.data.data as ProfileImage;
    }
  } catch (e) {
    console.log('Error fetching Image: ' + e);
  }
  return resImage;
}
export async function postImage(newImage: ProfileImage): Promise<Boolean> {
  try {
    let response = await axios.post(baseUrl, newImage);
    if (response.status === 201) {
      return true;
    }
  } catch (e) {
    console.log('Error inserting Image: ' + e);
  }
  return false;
}
export async function updateImage(newImage: ProfileImage): Promise<Boolean> {
  try {
    let response = await axios.put(baseUrl, newImage);
    if (response.status === 201) {
      return true;
    }
  } catch (e) {
    console.log('Error updating Image: ' + e);
  }
  return false;
}
export async function deleteImage(imageId: number): Promise<Boolean> {
  try {
    let response = await axios.delete(baseUrl + `/${imageId}`);
    if (response.status === 204) {
      return true;
    }
  } catch (e) {
    console.log('Error deleting Image: ' + e);
  }
  return false;
}
export async function setUserImage(
  imageId: string,
  userId: number
): Promise<Boolean> {
  try {
    let response = await axios.put(baseUrl + `/image/${userId}/${imageId}`);
    if (response.status === 201) {
      return true;
    }
  } catch (e) {
    console.log('Error setting Image: ' + e);
  }
  return false;
}
export async function deleteUserImage(userId: number): Promise<Boolean> {
  try {
    let response = await axios.delete(baseUrl + `/image/${userId}`);
    if (response.status === 204) {
      return true;
    }
  } catch (e) {
    console.log('Error removing Image: ' + e);
  }
  return false;
}
