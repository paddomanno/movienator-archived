import {
  afterAll,
  beforeAll,
  describe,
  expect,
  beforeEach,
  it,
} from '@jest/globals';
import { TestDatabaseManager } from './test_utils/TestDatabaseManager';
import User from '../entity/user';
import Movie from '../entity/movie';
import Review from '../entity/review';
import request from 'supertest';
import app from '../app';

beforeAll(async () => {
  await TestDatabaseManager.getInstance().connectTestDatabase();
}, 10_000);

afterAll(async () => {
  await TestDatabaseManager.getInstance().resetTestDatabase();
});

beforeEach(async () => {
  await TestDatabaseManager.getInstance().resetTestDatabase();
  await createTestData();
}, 10_000);

async function createTestData() {
  let newMovie1: Movie = Movie.create({
    movieId: 1,
    title: 'Testmovie',
    adultContent: false,
    actors: [],
    reviews: [],
    genres: [],
  });

  await Movie.save(newMovie1);

  let newUser1: User = User.create({
    firstName: 'Maggus',
    lastName: 'Rühl',
    userName: 'Roswita',
    password: 'pw',
    comment: 'Schwer und falsch',
    birthday: new Date('2000-01-16'),
    following: [],
    followers: [],
    watchlist: [],
  });

  let newUser2: User = User.create({
    firstName: 'Tschai',
    lastName: 'Katla',
    userName: 'tschai111',
    password: '123',
    comment: 'Masse ist Macht',
    birthday: new Date('2003-02-22'),
    following: [],
    followers: [],
    watchlist: [],
  });

  let newUser3: User = User.create({
    firstName: 'Ronnie',
    lastName: 'Colman',
    userName: 'MrOlympia',
    password: 'secret',
    comment: 'Yeah Buddy',
    birthday: new Date('2001-11-11'),
    following: [],
    followers: [],
    watchlist: [],
  });

  await newUser1.save();
  await newUser2.save();
  await newUser3.save();

  newUser1.following.push(newUser2);
  newUser1.followers.push(newUser2);
  newUser2.following.push(newUser3);
  newUser2.following.push(newUser1);
  newUser2.followers.push(newUser3);
  newUser2.followers.push(newUser1);
  newUser3.following.push(newUser2);
  newUser3.followers.push(newUser2);
  newUser3.watchlist.push(newMovie1);

  await newUser1.save();
  await newUser2.save();
  await newUser3.save();

  /* GEHT AUCH SO
  newUser2.following = [newUser3, newUser1];
  await newUser2.save();

  newUser3 = await User.findOne({
    where: { userId: 3 },
    relations: { following: true, followers: true, watchlist: true },
  });
  newUser3.following.push(newUser2);
  newUser3.watchlist.push(newMovie1);
  await newUser3.save();

  newUser1 = await User.findOne({
    where: { userId: 1 },
    relations: { following: true, followers: true, watchlist: true },
  });
  newUser1.following.push(newUser2);
  await newUser1.save();
   */

  //Gewünschter zustand:
  // 1 is following 2 and followed by 2
  // 2 is following 3,1 and followed by 3,1
  // 3 is following 2 and followed by 2

  let controlUser = await User.findOne({
    where: { userId: 1 },
    relations: { following: true, followers: true, watchlist: true },
  });
  console.log(controlUser);
  controlUser = await User.findOne({
    where: { userId: 2 },
    relations: { following: true, followers: true, watchlist: true },
  });
  console.log(controlUser);
  controlUser = await User.findOne({
    where: { userId: 3 },
    relations: { following: true, followers: true, watchlist: true },
  });
  console.log(controlUser);

  //Maggus reviews the Testmovie
  let newReview1 = Review.create({
    reviewMovieMovieId: 1,
    reviewUserUserId: 1,
    title: 'Bruddaler Film',
    content: 'Des wars mit dem Review',
    rating: 5,
    lastUpdated: new Date('2019-10-11'),
  });
  await Review.save(newReview1);

  let newReview2 = Review.create({
    reviewMovieMovieId: 1,
    reviewUserUserId: 2,
    title: 'Bruddaler Film',
    content: 'Des wars mit dem Review',
    rating: 5,
    lastUpdated: new Date('2019-10-11'),
  });
  await newReview2.save();
}

describe('GET Tests', () => {
  it('Get follow backs 1', async () => {
    const response = await request(app).get('/user/followingMutual/1');
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].userId).toBe(2);
    expect(response.body.data[0].followers.length).toBeGreaterThanOrEqual(1);
    expect(response.body.data[0].following.length).toBeGreaterThanOrEqual(1);
  });
  it('Get follow backs 1', async () => {
    const response = await request(app).get('/user/followingMutual/2');
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(2);
    expect(response.body.data[0].userId).toBe(1);
    expect(response.body.data[0].followers.length).toBeGreaterThanOrEqual(1);
    expect(response.body.data[0].following.length).toBeGreaterThanOrEqual(1);
    expect(response.body.data[0].reviews.length).toBeGreaterThanOrEqual(1);
  });
  it('Get all users from database TEST', async () => {
    const response = await request(app)
      .get('/user/all')
      .send()
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
    //Attention: They are sorted by lastName (Coleman, Katla, Rühl)
    expect(response.body.data[2].firstName).toBe('Maggus');
    expect(response.body.data[1].firstName).toBe('Tschai');
    expect(response.body.data[0].firstName).toBe('Ronnie');
  });

  it('Get user with existing Id TEST', async () => {
    const response = await request(app)
      .get('/user/one/id/1')
      .send()
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
    expect(response.body.data.userId).toBe(1);
    expect(response.body.data.firstName).toBe('Maggus');
    expect(response.body.data.lastName).toBe('Rühl');
  });

  it('Get user with NON-existing Id TEST', async () => {
    const response = await request(app)
      .get('/user/one/id/99')
      .send()
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toBe(404);
  });

  it('Get user with existing userName TEST', async () => {
    const response = await request(app)
      .get('/user/one/username/Roswita')
      .send()
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
    expect(response.body.data.userName).toBe('Roswita');
    expect(response.body.data.firstName).toBe('Maggus');
    expect(response.body.data.lastName).toBe('Rühl');
  });

  it('Get user with NON-existing userName TEST', async () => {
    const response = await request(app)
      .get('/user/one/username/maaaan')
      .send()
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toBe(404);
  });

  it('Get all users whose usernames match the search query TEST', async () => {
    const response = await request(app)
      .get('/user/username/ros')
      .send()
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(2);
    expect(response.body.data[0].firstName).toBe('Maggus');
  });

  it('Get all users whose usernames match the UNMATCHABLE search query TEST', async () => {
    const response = await request(app)
      .get('/user/username/asduieufnaskdikwqer')
      .send()
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(0);
  });

  it('Get all users that are following a single user TEST', async () => {
    const response = await request(app)
      .get('/user/followers/1')
      .send()
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].firstName).toBe('Tschai');
  });

  it('Get all users that are following a NON-EXISTING user TEST', async () => {
    const response = await request(app)
      .get('/user/followers/99')
      .send()
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toBe(404);
  });

  it('Get all users that a single user is following TEST', async () => {
    const response = await request(app)
      .get('/user/following/3')
      .send()
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].firstName).toBe('Tschai');
  });

  it('Get all users that a NON-EXISTING user is following TEST', async () => {
    const response = await request(app)
      .get('/user/following/99')
      .send()
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toBe(404);
  });

  it('Get all users that a single user is following and that rated a stated movie TEST', async () => {
    const response = await request(app)
      .get('/user/following/3/rated/1') //All users Ronnie is following that reviewed the testmovie
      .send()
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].firstName).toBe('Tschai');
  });

  it('Get all users that a NON-EXISTING user is following and that rated a stated movie TEST', async () => {
    const response = await request(app)
      .get('/user/following/99/rated/1')
      .send()
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toBe(404);
  });

  it('Get all users that a single user is following and that rated a NON-EXISTING movie TEST', async () => {
    const response = await request(app)
      .get('/user/following/3/rated/99')
      .send()
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toBe(404);
  });

  it('Get all users that a single user is following and have a stated movie on their watchlist TEST', async () => {
    const response = await request(app)
      .get('/user/following/2/watchlist/1') //All users tschai is following that have the testmovie on their watchlist
      .send()
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].firstName).toBe('Ronnie');
  });

  it('Get all users that a NON-EXISTING user is following and have a stated movie on their watchlist TEST', async () => {
    const response = await request(app)
      .get('/user/following/99/watchlist/1')
      .send()
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toBe(404);
  });

  it('Get all users that a single user is following and have a NON-EXISTING movie on their watchlist TEST', async () => {
    const response = await request(app)
      .get('/user/following/3/watchlist/99')
      .send()
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toBe(404);
  });
});

describe('POST Tests', () => {
  it('Creating a new user TEST', async () => {
    let newUser4 = User.create({
      firstName: 'Chris',
      lastName: 'Bumstead',
      userName: 'Cbum',
      password: 'pw1',
      comment: 'Classic',
      birthday: new Date('2011-02-12'),
    });

    const response = await request(app)
      .post('/user/')
      .send(newUser4)
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toBe(201);

    const resultUser = await User.findOne({
      where: { userId: 4 },
      relations: ['following', 'followers', 'watchlist'],
    });
    expect(resultUser.firstName).toBe('Chris');
    expect(resultUser.watchlist.length).toBe(0);
  });

  it('Try creating a user where userId is not NULL TEST', async () => {
    let newUser4 = User.create({
      userId: 2332,
      firstName: 'Chris',
      lastName: 'Bumstead',
      userName: 'Cbum',
      password: 'pw1',
      comment: 'Classic',
      birthday: new Date('2011-02-12'),
    });

    const response = await request(app)
      .post('/user/')
      .send(newUser4)
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toBe(500);
  });

  it('Adds: user a is now following user b TEST', async () => {
    const response = await request(app)
      .post('/user/follow/3/1') //x is now following Maggus
      .send()
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toBe(201);

    const resultUser = await User.findOne({
      where: { userId: 3 },
      relations: ['following'],
    });
    expect(resultUser.following.length).toBe(2);
    expect(resultUser.following[0].firstName).toBe('Maggus');
  });

  it('Adds: user a is now following user b (one user is NON-EXISTING) TEST', async () => {
    const response = await request(app)
      .post('/user/follow/99/1')
      .send()
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toBe(404);
  });

  it('Adds stated movie to the watchlist of stated user TEST', async () => {
    const response = await request(app)
      .post('/user/watchlist/1/1') ///watchlist/:uId/:mId -> Maggus gets Testmovie on his watchlist
      .send()
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toBe(201);

    const resultUser = await User.findOne({
      where: { userId: 1 },
      relations: ['watchlist'],
    });
    expect(resultUser.watchlist.length).toBe(1);
    expect(resultUser.watchlist[0].title).toBe('Testmovie');
  });

  it('Adds stated movie to the watchlist of stated user (movie and/or user are NON-EXISTING) TEST', async () => {
    const response = await request(app)
      .post('/user/watchlist/2/99')
      .send()
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toBe(404);
  });
});

describe('PUT Tests', () => {
  it('Updates existing user TEST', async () => {
    let updatedUser1 = User.create({
      userId: 1,
      firstName: 'Markus',
    });

    const response = await request(app)
      .put('/user/')
      .send(updatedUser1)
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toBe(201);

    const resultUser = await User.findOne({
      where: { userId: 1 },
    });
    expect(resultUser.firstName).toBe('Markus');
  });

  it('Updates NON-existing user TEST', async () => {
    let updatedUser1 = User.create({
      userId: 99,
      firstName: 'Markus',
    });

    const response = await request(app)
      .put('/user/')
      .send(updatedUser1)
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toBe(404);
  });

  it('Tries updating existing user (But overwrites a relation) TEST', async () => {
    let updatedUser1 = User.create({
      userId: 3,
      firstName: 'MarkusUpdated',
      watchlist: [], //Redefines a relation
    });

    const response = await request(app)
      .put('/user/')
      .send(updatedUser1)
      .expect('Content-Type', 'application/json; charset=utf-8');
    expect(response.statusCode).toBe(201);

    const resultUser = await User.findOne({
      where: { userId: 3 },
      relations: { watchlist: true },
    });
    expect(resultUser.firstName).toBe('MarkusUpdated');
    expect(resultUser.watchlist.length).toBe(1);
  });
});

describe('DELETE Tests', () => {
  it('Deletes user with stated Id TEST', async () => {
    const response = await request(app).delete('/user/1').send();
    expect(response.statusCode).toBe(204);
  });

  it('Tries deleting NON-EXISTING user', async () => {
    const response = await request(app).delete('/user/99').send();
    expect(response.statusCode).toBe(404);
  });

  it('User a is now no more following user b TEST', async () => {
    const userBefore = await User.findOne({
      where: { userId: 3 },
      relations: ['following'],
    });
    expect(userBefore.following.length).toBe(1);
    expect(userBefore.following.at(0).userId).toBe(2);
    const response = await request(app)
      .delete('/user/follow/3/2') // /follow/:aId/:bId
      .send();
    expect(response.statusCode).toBe(204);
    const userA = await User.findOne({
      where: { userId: 3 },
      relations: ['following'],
    });
    expect(userA.following.length).toBe(0);
  });

  it('User a is now no more following user b (at least one NON-EXISTING user) TEST', async () => {
    const response = await request(app)
      .delete('/user/follow/3/99') // /follow/:aId/:bId
      .send();
    expect(response.statusCode).toBe(404);
  });

  it('Deletes movie from a users watchlist TEST', async () => {
    const response = await request(app)
      .delete('/user/watchlist/2/1') // :uId/:mId"
      .send();
    expect(response.statusCode).toBe(204);
    const userA = await User.findOne({
      where: { userId: 2 },
      relations: ['watchlist'],
    });
    expect(userA.watchlist.length).toBe(0);
  });

  it('Deletes movie from a users watchlist (either movie or user or both are NON-EXISTING) TEST', async () => {
    const response = await request(app)
      .delete('/user/watchlist/99/1') // :uId/:mId"
      .send();
    expect(response.statusCode).toBe(404);
  });
});
