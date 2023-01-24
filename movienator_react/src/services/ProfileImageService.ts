import { ProfileImage } from '../types/ProfileImage';
import axios from 'axios';

const baseUrl = 'http://localhost:8080/profileImage';
export async function getAllProfileImages(): Promise<ProfileImage[]> {
  let resArray: ProfileImage[] = [];
  try {
    const response = await axios.get(baseUrl + `/all`);
    if (response.status === 200) {
      resArray = response.data.data as ProfileImage[];
    }
  } catch (e) {
    console.log('Error fetching Images: ' + e);
  }
  return resArray;
}

export async function getOneProfileImageToRessourceLink(
  ref: string
): Promise<ProfileImage | null> {
  let resImage: ProfileImage | null = null;
  try {
    const response = await axios.get(baseUrl + `/ref/${ref}`);
    if (response.status === 200) {
      resImage = response.data.data as ProfileImage;
    }
  } catch (e) {
    console.log('Error fetching Image: ' + e);
  }
  return resImage;
}
export async function getImageToUserId(
  userId: number
): Promise<ProfileImage | null> {
  let resImage: ProfileImage | null = null;
  try {
    const response = await axios.get(baseUrl + `/user/${userId}`);
    if (response.status === 200) {
      resImage = response.data.data as ProfileImage;
    }
  } catch (e) {
    console.log('Error fetching Image: ' + e);
  }
  return resImage;
}
export async function createImage(newImage: ProfileImage): Promise<boolean> {
  try {
    const response = await axios.post(baseUrl, newImage);
    if (response.status === 201) {
      return true;
    }
  } catch (e) {
    console.log('Error inserting Image: ' + e);
  }
  return false;
}
export async function updateImage(newImage: ProfileImage): Promise<boolean> {
  try {
    const response = await axios.put(baseUrl, newImage);
    if (response.status === 201) {
      return true;
    }
  } catch (e) {
    console.log('Error updating Image: ' + e);
  }
  return false;
}
export async function deleteImageToImageId(imageId: number): Promise<boolean> {
  try {
    const response = await axios.delete(baseUrl + `/${imageId}`);
    if (response.status === 204) {
      return true;
    }
  } catch (e) {
    console.log('Error deleting Image: ' + e);
  }
  return false;
}
export async function updateUserImageToImageIdAndUserId(
  imageId: string,
  userId: number
): Promise<boolean> {
  try {
    const response = await axios.put(baseUrl + `/image/${userId}/${imageId}`);
    if (response.status === 201) {
      return true;
    }
  } catch (e) {
    console.log('Error setting Image: ' + e);
  }
  return false;
}
export async function deleteUserImageToUserId(
  userId: number
): Promise<boolean> {
  try {
    const response = await axios.delete(baseUrl + `/image/${userId}`);
    if (response.status === 204) {
      return true;
    }
  } catch (e) {
    console.log('Error removing Image: ' + e);
  }
  return false;
}
