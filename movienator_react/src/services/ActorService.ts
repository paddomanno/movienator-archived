import { Actor } from '../types/Actor';
import axios from 'axios';
import { Console } from 'inspector';

const baseUrl: string = 'http://localhost:8080/actors';
export async function getAllActors(): Promise<Actor[]> {
  let resArray: Actor[] = [];
  try {
    let response = await axios.get(baseUrl + '/all');
    if (response.status === 200) {
      resArray = response.data.data as Actor[];
    }
  } catch (e) {
    console.log('Error fetching actors: ' + e);
  }
  return resArray;
}

export async function getOneActorToId(actorId: number): Promise<Actor | null> {
  let resActor: Actor | null = null;
  try {
    let response = await axios.get(baseUrl + `/one/${actorId}`);
    if (response.status === 200) {
      resActor = response.data.data as Actor;
    }
  } catch (e) {
    console.log('Error fetching actor: ' + e);
  }
  return resActor;
}

export async function getActorsToMovie(movieId: number): Promise<Actor[]> {
  let resArray: Actor[] = [];
  try {
    let response = await axios.get(baseUrl + `/movies/`);
    if (response.status === 200) {
      resArray = response.data.data as Actor[];
    }
  } catch (e) {
    console.log('Error fetching actors to movie' + e);
  }
  return resArray;
}
