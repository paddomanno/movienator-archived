import {
  afterAll,
  beforeAll,
  beforeEach,
  expect,
  describe,
  it,
} from '@jest/globals';
import { TestDatabaseManager } from './test_utils/TestDatabaseManager';
import User from '../entity/user';
import Movie from '../entity/movie';
import Actor from '../entity/actor';
import Genre from '../entity/genre';
import Recommendation from '../entity/recommendation';
import app from '../app';
import request from 'supertest';

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
  let actor1: Actor = Actor.create({
    name: 'Maggus',
    actorId: 1,
  });

  let genre1: Genre = Genre.create({
    genreName: 'Fantasy',
    genreId: 1,
  });

  let user1 = User.create({
    firstName: 'AAA',
    lastName: 'AAA',
    userName: 'AAA',
    password: 'aa',
    comment: 'AAA',
    birthday: new Date(),
    following: [],
    followers: [],
  });
  await user1.save();

  let user2 = User.create({
    firstName: 'BBB',
    lastName: 'BBB',
    userName: 'BBB',
    password: 'bb',
    comment: 'BBB',
    birthday: new Date(),
    following: [],
    followers: [],
  });
  await user2.save();

  let user3 = User.create({
    firstName: 'CCC',
    lastName: 'CCC',
    userName: 'CCC',
    password: 'cc',
    comment: 'CCC',
    birthday: new Date(),
    following: [],
    followers: [],
  });
  await user3.save();

  let movie1: Movie = Movie.create({
    movieId: 1,
    title: 'AAA',
    adultContent: false,
    actors: [actor1],
    genres: [genre1],
    reviews: [],
    lengthMinutes: 100,
    releaseDate: new Date('2022-01-01'),
  });
  await movie1.save();

  let movie2: Movie = Movie.create({
    movieId: 2,
    title: 'BBB',
    adultContent: false,
    actors: [actor1],
    genres: [genre1],
    reviews: [],
    lengthMinutes: 100,
    releaseDate: new Date('2022-01-01'),
  });
  await movie2.save();

  let recommendation1: Recommendation = Recommendation.create({
    sendingUser: user1,
    receivingUser: user2,
    recommendedMovie: movie1,
    message: 'AAA',
  });
  await recommendation1.save();

  let recommendation2: Recommendation = Recommendation.create({
    sendingUser: user3,
    receivingUser: user2,
    recommendedMovie: movie2,
    message: 'BBB',
  });
  await recommendation2.save();

  let recommendation3: Recommendation = Recommendation.create({
    sendingUser: user3,
    receivingUser: user1,
    recommendedMovie: movie2,
    message: 'CCC',
  });
  await recommendation3.save();
}

describe('Recommendationtest', () => {
  describe('Get Single Route', () => {
    describe('Good case', () => {
      it('Should return the recommendation', async () => {
        let response = await request(app).get('/recommendation/one/1/2/1');
        expect(response.statusCode).toBe(200);
        const rec: Recommendation = response.body.data;
        expect(rec.sendingUser.userId).toBe(1);
        expect(rec.receivingUser.userId).toBe(2);
        expect(rec.recommendedMovie.movieId).toBe(1);
        expect(rec.message).toBe('AAA');
      });
    });
    describe('Bad case', () => {
      it('Sending user wrong', async () => {
        let response = await request(app).get('/recommendation/one/9/2/1');
        expect(response.statusCode).toBe(404);
      });
      it('Receiving user wrong', async () => {
        let response = await request(app).get('/recommendation/one/1/9/1');
        expect(response.statusCode).toBe(404);
      });
      it('Recommended movie wrong', async () => {
        let response = await request(app).get('/recommendation/one/1/2/9');
        expect(response.statusCode).toBe(404);
      });
      it('Sending user not number', async () => {
        let response = await request(app).get('/recommendation/one/aaa/2/1');
        expect(response.statusCode).toBe(500);
      });
      it('Receiving user not number', async () => {
        let response = await request(app).get('/recommendation/one/1/aaa/1');
        expect(response.statusCode).toBe(500);
      });
      it('Recommended movie not number', async () => {
        let response = await request(app).get('/recommendation/one/1/2/aaa');
        expect(response.statusCode).toBe(500);
      });
    });
  });
  describe('Get For User Route', () => {
    describe('Good case', () => {
      it('Should return a list of recommendations', async () => {
        let response = await request(app).get('/recommendation/for/2');
        expect(response.statusCode).toBe(200);
        const recs: Recommendation[] = response.body.data as Recommendation[];
        expect(recs.length).toBe(2);
        expect(recs[0].message).toBe('AAA');
        expect(recs[0].recommendedMovie.movieId).toBe(1);
        expect(recs[0].receivingUser.userId).toBe(2);
        expect(recs[0].sendingUser.userId).toBe(1);
      });
    });
    describe('Bad case', () => {
      it('Should be empty', async () => {
        let response = await request(app).get('/recommendation/for/9');
        expect(response.statusCode).toBe(200);
        const recs: Recommendation[] = response.body.data as Recommendation[];
        expect(recs.length).toBe(0);
      });
      it('Should return 500', async () => {
        let response = await request(app).get('/recommendation/for/aaa');
        expect(response.statusCode).toBe(500);
      });
    });
  });
  describe('Get From User Route', () => {
    describe('Good case', () => {
      it('Should return a list of recommendations', async () => {
        let response = await request(app).get('/recommendation/from/3');
        expect(response.statusCode).toBe(200);
        const recs: Recommendation[] = response.body.data as Recommendation[];
        expect(recs.length).toBe(2);
        expect(recs[0].recommendedMovie.movieId).toBe(2);
        expect(recs[0].sendingUser.userId).toBe(3);
      });
    });
    describe('Bad case', () => {
      it('Should be empty', async () => {
        let response = await request(app).get('/recommendation/from/9');
        expect(response.statusCode).toBe(200);
        const recs: Recommendation[] = response.body.data as Recommendation[];
        expect(recs.length).toBe(0);
      });
      it('Should return 500', async () => {
        let response = await request(app).get('/recommendation/from/aaa');
        expect(response.statusCode).toBe(500);
      });
    });
  });
  describe('Get For User For Movie', () => {
    describe('Good case', () => {
      it('Should return a list of recommendations', async () => {
        let response = await request(app).get('/recommendation/forMovie/2/2');
        expect(response.statusCode).toBe(200);
        const recs: Recommendation[] = response.body.data as Recommendation[];
        expect(recs.length).toBe(1);
        expect(recs[0].message).toBe('BBB');
      });
    });
    describe('Bad case', () => {
      it('Should be empty', async () => {
        let response = await request(app).get('/recommendation/forMovie/9/2');
        expect(response.statusCode).toBe(200);
        const recs: Recommendation[] = response.body.data as Recommendation[];
        expect(recs.length).toBe(0);
      });
      it('Should return 500', async () => {
        let response = await request(app).get('/recommendation/forMovie/aaa/2');
        expect(response.statusCode).toBe(500);
      });
      it('Should be empty', async () => {
        let response = await request(app).get('/recommendation/forMovie/2/9');
        expect(response.statusCode).toBe(200);
        const recs: Recommendation[] = response.body.data as Recommendation[];
        expect(recs.length).toBe(0);
      });
      it('Should return 500', async () => {
        let response = await request(app).get('/recommendation/forMovie/2/aaa');
        expect(response.statusCode).toBe(500);
      });
    });
  });
  describe('Post new Route', () => {
    describe('Good case', () => {
      it('Insert with only keys', async () => {
        let recommendation3: Recommendation = Recommendation.create({
          sendingUserUserId: 1,
          receivingUserUserId: 2,
          recommendedMovieMovieId: 2,
          message: 'DDD',
        });
        let response = await request(app)
          .post('/recommendation/')
          .send(recommendation3);
        expect(response.statusCode).toBe(201);
        const singleRecommendation: Recommendation =
          await Recommendation.findOne({
            where: {
              sendingUserUserId: 1,
              receivingUserUserId: 2,
              recommendedMovieMovieId: 2,
            },
            relations: [
              'sendingUser',
              'sendingUser.profileImage',
              'receivingUser',
              'receivingUser.profileImage',
              'recommendedMovie',
            ],
          });
        expect(singleRecommendation.message).toBe('DDD');
        expect(singleRecommendation.recommendedMovie.movieId).toBe(2);
        expect(singleRecommendation.sendingUser.userId).toBe(1);
        expect(singleRecommendation.receivingUser.userId).toBe(2);
      });
      it('Insert with only objects', async () => {
        let userA: User = await User.findOne({
          where: { userId: 1 },
        });
        let userB: User = await User.findOne({
          where: { userId: 2 },
        });
        let movie: Movie = await Movie.findOne({
          where: { movieId: 2 },
        });
        let recommendation3: Recommendation = Recommendation.create({
          sendingUser: userA,
          receivingUser: userB,
          recommendedMovie: movie,
          message: 'DDD',
        });
        let response = await request(app)
          .post('/recommendation/')
          .send(recommendation3);
        expect(response.statusCode).toBe(201);
        const singleRecommendation: Recommendation =
          await Recommendation.findOne({
            where: {
              sendingUserUserId: 1,
              receivingUserUserId: 2,
              recommendedMovieMovieId: 2,
            },
            relations: [
              'sendingUser',
              'sendingUser.profileImage',
              'receivingUser',
              'receivingUser.profileImage',
              'recommendedMovie',
            ],
          });
        expect(singleRecommendation.message).toBe('DDD');
        expect(singleRecommendation.recommendedMovie.movieId).toBe(2);
        expect(singleRecommendation.sendingUser.userId).toBe(1);
        expect(singleRecommendation.receivingUser.userId).toBe(2);
      });
      it('Insert with keys and objects', async () => {
        let userA: User = await User.findOne({
          where: { userId: 1 },
        });
        let userB: User = await User.findOne({
          where: { userId: 2 },
        });
        let movie: Movie = await Movie.findOne({
          where: { movieId: 2 },
        });
        let recommendation3: Recommendation = Recommendation.create({
          sendingUser: userA,
          sendingUserUserId: 1,
          receivingUser: userB,
          receivingUserUserId: 2,
          recommendedMovie: movie,
          recommendedMovieMovieId: 2,
          message: 'DDD',
        });
        let response = await request(app)
          .post('/recommendation/')
          .send(recommendation3);
        expect(response.statusCode).toBe(201);
        const singleRecommendation: Recommendation =
          await Recommendation.findOne({
            where: {
              sendingUserUserId: 1,
              receivingUserUserId: 2,
              recommendedMovieMovieId: 2,
            },
            relations: [
              'sendingUser',
              'sendingUser.profileImage',
              'receivingUser',
              'receivingUser.profileImage',
              'recommendedMovie',
            ],
          });
        expect(singleRecommendation.message).toBe('DDD');
        expect(singleRecommendation.recommendedMovie.movieId).toBe(2);
        expect(singleRecommendation.sendingUser.userId).toBe(1);
        expect(singleRecommendation.receivingUser.userId).toBe(2);
      });
    });
    it('Already exisiting does update', async () => {
      let recommendation3: Recommendation = Recommendation.create({
        sendingUserUserId: 1,
        receivingUserUserId: 2,
        recommendedMovieMovieId: 1,
        message: 'XXX',
      });
      let response = await request(app)
        .post('/recommendation/')
        .send(recommendation3);
      expect(response.statusCode).toBe(201);
      const singleRecommendation: Recommendation = await Recommendation.findOne(
        {
          where: {
            sendingUserUserId: 1,
            receivingUserUserId: 2,
            recommendedMovieMovieId: 1,
          },
        }
      );
      expect(singleRecommendation.message).toBe('XXX');
    });
    describe('Bad case', () => {
      it('Sending user wrong', async () => {
        let recommendation: Recommendation = Recommendation.create({
          sendingUserUserId: 9,
          receivingUserUserId: 2,
          recommendedMovieMovieId: 2,
          message: 'DDD',
        });
        let response = await request(app)
          .post('/recommendation/')
          .send(recommendation);
        expect(response.statusCode).toBe(404);
      });
      it('Receiving user wrong', async () => {
        let recommendation: Recommendation = Recommendation.create({
          sendingUserUserId: 1,
          receivingUserUserId: 9,
          recommendedMovieMovieId: 2,
          message: 'DDD',
        });
        let response = await request(app)
          .post('/recommendation/')
          .send(recommendation);
        expect(response.statusCode).toBe(404);
      });
      it('Recommended movie wrong', async () => {
        let recommendation: Recommendation = Recommendation.create({
          sendingUserUserId: 1,
          receivingUserUserId: 2,
          recommendedMovieMovieId: 9,
          message: 'DDD',
        });
        let response = await request(app)
          .post('/recommendation/')
          .send(recommendation);
        expect(response.statusCode).toBe(404);
      });
    });
  });
  describe('Delete Route', () => {
    describe('Good case', () => {
      it('Should delete entry', async () => {
        let response = await request(app).delete('/recommendation/1/2/1');
        expect(response.statusCode).toBe(204);
        const singleRecommendation: Recommendation =
          await Recommendation.findOne({
            where: {
              sendingUserUserId: 1,
              receivingUserUserId: 2,
              recommendedMovieMovieId: 1,
            },
          });
        expect(singleRecommendation).toBeNull();
      });
    });
    describe('Bad case', () => {
      it('Should throw 404', async () => {
        let response = await request(app).delete('/recommendation/9/2/1');
        expect(response.statusCode).toBe(404);
        const singleRecommendation: Recommendation =
          await Recommendation.findOne({
            where: {
              sendingUserUserId: 1,
              receivingUserUserId: 2,
              recommendedMovieMovieId: 1,
            },
          });
        expect(singleRecommendation == null).toBeFalsy();
      });
      it('Should throw 404', async () => {
        let response = await request(app).delete('/recommendation/1/9/1');
        expect(response.statusCode).toBe(404);
        const singleRecommendation: Recommendation =
          await Recommendation.findOne({
            where: {
              sendingUserUserId: 1,
              receivingUserUserId: 2,
              recommendedMovieMovieId: 1,
            },
          });
        expect(singleRecommendation == null).toBeFalsy();
      });
      it('Should throw 404', async () => {
        let response = await request(app).delete('/recommendation/1/2/9');
        expect(response.statusCode).toBe(404);
        const singleRecommendation: Recommendation =
          await Recommendation.findOne({
            where: {
              sendingUserUserId: 1,
              receivingUserUserId: 2,
              recommendedMovieMovieId: 1,
            },
          });
        expect(singleRecommendation == null).toBeFalsy();
      });
      it('Should throw 404', async () => {
        let response = await request(app).delete('/recommendation/aaa/2/1');
        expect(response.statusCode).toBe(500);
      });
      it('Should throw 404', async () => {
        let response = await request(app).delete('/recommendation/1/aaa/1');
        expect(response.statusCode).toBe(500);
      });
      it('Should throw 404', async () => {
        let response = await request(app).delete('/recommendation/1/2/aaa');
        expect(response.statusCode).toBe(500);
      });
    });
  });
});
