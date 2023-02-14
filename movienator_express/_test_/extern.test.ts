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
import request from 'supertest';
import app from '../app';
import Movie from '../entity/movie';
import Actor from '../entity/actor';
import Genre from '../entity/genre';
import Review from '../entity/review';
import nock from 'nock';
import path from 'path';

beforeAll(async () => {
  await TestDatabaseManager.getInstance().connectTestDatabase();
  nock.back.fixtures = path.join(__dirname, '__nock-fixtures__');
  if (process.env['NOCK_RECORDING']) {
    nock.back.setMode('record'); // change to 'record' or 'update' when writing new tests or API changes, see https://github.com/nock/nock#modes
  } else {
    nock.back.setMode('lockdown');
  }
}, 10_000);

afterAll(async () => {
  await TestDatabaseManager.getInstance().resetTestDatabase();
});

beforeEach(async () => {
  await TestDatabaseManager.getInstance().resetTestDatabase();
  await createTestData();
}, 10_000);

async function createTestData() {
  // 436270 is Black Adam
  // 724495 is The Woman Kind
  // 8784 is Daniel Craig
  // 28 is Action
  const user1 = User.create({
    firstName: 'Maggus',
    lastName: 'Rühl',
    userName: 'Roswita',
    password: 'pw',
    comment: 'Schwer und falsch',
    birthday: new Date(),
    following: [],
    followers: [],
  });
  await user1.save();
}

function removeSecretsFromRecords(nockRecords: nock.Definition[]) {
  return nockRecords.map((record) => {
    if (typeof record.path === 'string') {
      record.path = record.path.replace(
        process.env['MOVIE_API_KEY'],
        'MOVIE_API_KEY'
      );
    }
    return record;
  });
}

describe('Externtest', () => {
  describe('Testing movieSearch Route', () => {
    it('Should return an array of Movies with max length of 20', async () => {
      const { nockDone } = await nock.back('get-movieSearch-1.json', {
        afterRecord: removeSecretsFromRecords,
      });
      nock.enableNetConnect(/(localhost|127\.0\.0\.1)/); // nock disables external requests, this enables localhost connections

      const response = await request(app).get(
        '/extern/search/movie/Harry?page=1'
      );
      expect(response.statusCode).toBe(200);
      const movies: Movie[] = response.body.data as Movie[];
      expect(movies.length).toBeGreaterThanOrEqual(1);
      expect(movies.length).toBeLessThanOrEqual(20);
      expect(movies.at(0).movieId).toBeDefined();
      expect(movies.at(0).title).toBeDefined();
      expect(movies.at(0).adultContent).toBeDefined();
      nockDone();
    });
    it('Should fill the genres array but not actors', async () => {
      const { nockDone } = await nock.back('get-movieSearch-2.json', {
        afterRecord: removeSecretsFromRecords,
      });
      nock.enableNetConnect(/(localhost|127\.0\.0\.1)/); // nock disables external requests, this enables localhost connections

      const response = await request(app).get(
        '/extern/search/movie/Harry?page=1'
      );
      expect(response.statusCode).toBe(200);
      const movies: Movie[] = response.body.data as Movie[];
      expect(movies.at(0).actors.length).toBe(0);
      expect(movies.at(0).genres.length).toBeGreaterThanOrEqual(1);
      nockDone();
    });
  });

  describe('Testing actorSearch Route', () => {
    it('Should return an Array of Actors', async () => {
      const { nockDone } = await nock.back('get-actorSearch-1.json', {
        afterRecord: removeSecretsFromRecords,
      });
      nock.enableNetConnect(/(localhost|127\.0\.0\.1)/); // nock disables external requests, this enables localhost connections

      const response = await request(app).get('/extern/search/actor/Daniel');
      expect(response.statusCode).toBe(200);
      const actors: Actor[] = response.body.data as Actor[];
      expect(actors.length).toBeGreaterThanOrEqual(1);
      expect(actors.at(0).actorId).toBeDefined();
      expect(actors.at(0).name).toBeDefined();
      nockDone();
    });
    it('Should not fill the movies array of the actors', async () => {
      const { nockDone } = await nock.back('get-actorSearch-2.json', {
        afterRecord: removeSecretsFromRecords,
      });
      nock.enableNetConnect(/(localhost|127\.0\.0\.1)/); // nock disables external requests, this enables localhost connections

      const response = await request(app).get('/extern/search/actor/Daniel');
      expect(response.statusCode).toBe(200);
      const actors: Actor[] = response.body.data as Actor[];
      expect(actors.at(0).movies.length).toBe(0);
      nockDone();
    });
  });

  describe('Testing getActorsToMovie Route', () => {
    it('Should return an array of Actors', async () => {
      const { nockDone } = await nock.back('get-getActorsToMovie-1.json', {
        afterRecord: removeSecretsFromRecords,
      });
      nock.enableNetConnect(/(localhost|127\.0\.0\.1)/); // nock disables external requests, this enables localhost connections

      const response = await request(app).get('/extern/actor/movie/436270');
      expect(response.statusCode).toBe(200);
      const actors: Actor[] = response.body.data as Actor[];
      expect(actors.length).toBeGreaterThanOrEqual(1);
      expect(actors.length).toBeLessThanOrEqual(10);
      expect(actors.at(0).name).toBeDefined();
      expect(actors.at(0).actorId).toBeDefined();
      nockDone();
    });

    it("Should return 500 if the movie ID doesn't exist", async () => {
      const { nockDone } = await nock.back('get-getActorsToMovie-2.json', {
        afterRecord: removeSecretsFromRecords,
      });
      nock.enableNetConnect(/(localhost|127\.0\.0\.1)/); // nock disables external requests, this enables localhost connections

      const response = await request(app).get('/extern/actor/movie/xxxx');
      expect(response.statusCode).toBe(500);
      nockDone();
    });
  });

  describe('Testing getMoviesToActor Route', () => {
    it('Should return an Array of Movies', async () => {
      const { nockDone } = await nock.back('get-getMoviesToActor-1.json', {
        afterRecord: removeSecretsFromRecords,
      });
      nock.enableNetConnect(/(localhost|127\.0\.0\.1)/); // nock disables external requests, this enables localhost connections

      const response = await request(app).get('/extern/movies/actor/8784');
      expect(response.statusCode).toBe(200);
      const movies: Movie[] = response.body.data as Movie[];
      expect(movies.length).toBeGreaterThanOrEqual(1);
      expect(movies.length).toBeLessThanOrEqual(70);
      expect(movies.at(0).movieId).toBeDefined();
      expect(movies.at(0).title).toBeDefined();
      expect(movies.at(0).adultContent).toBeDefined();
      nockDone();
    }, 25_000);

    it('Should fill the genres array but not the actors array', async () => {
      const { nockDone } = await nock.back('get-getMoviesToActor-2.json', {
        afterRecord: removeSecretsFromRecords,
      });
      nock.enableNetConnect(/(localhost|127\.0\.0\.1)/); // nock disables external requests, this enables localhost connections

      const response = await request(app).get('/extern/movies/actor/8784');
      expect(response.statusCode).toBe(200);
      const movies: Movie[] = response.body.data as Movie[];
      expect(movies.at(0).actors.length).toBe(0);
      expect(movies.at(0).genres.length).toBeGreaterThanOrEqual(1);
      nockDone();
    }, 10_000);

    it("Should return 500 if the actors doesn't exist", async () => {
      const { nockDone } = await nock.back('get-getMoviesToActor-3.json', {
        afterRecord: removeSecretsFromRecords,
      });
      nock.enableNetConnect(/(localhost|127\.0\.0\.1)/); // nock disables external requests, this enables localhost connections

      const response = await request(app).get('/extern/movies/actor/xxxxx');
      expect(response.statusCode).toBe(500);
      nockDone();
    }, 10_000);
  });

  describe('Testing userRecommendations Route', () => {
    it('Should return an Array of Movies', async () => {
      const { nockDone } = await nock.back('get-userRecommendations-1.json', {
        afterRecord: removeSecretsFromRecords,
      });
      nock.enableNetConnect(/(localhost|127\.0\.0\.1)/); // nock disables external requests, this enables localhost connections

      // 436270 is Black Adam
      // 724495 is The Woman Kind
      let movie: Movie = Movie.create({
        movieId: 436270,
        title: 'Black Adam',
        adultContent: false,
        actors: [],
        genres: [],
        reviews: [],
      });
      await movie.save();
      movie = Movie.create({
        movieId: 724495,
        title: 'The Woman Kind',
        adultContent: false,
        actors: [],
        genres: [],
        reviews: [],
      });
      await movie.save();
      let review: Review = Review.create({
        reviewMovieMovieId: 436270,
        reviewUserUserId: 1,
        title: 'Bruddaler Film',
        content: 'Des wars mit dem Review',
        rating: 5,
        lastUpdated: new Date('2019-10-11'),
      });
      await review.save();
      review = Review.create({
        reviewMovieMovieId: 724495,
        reviewUserUserId: 1,
        title: 'Bruddaler Film',
        content: 'Des wars mit dem Review',
        rating: 5,
        lastUpdated: new Date('2019-10-11'),
      });
      await review.save();

      const response = await request(app).get('/extern/user/1/recommendations');
      expect(response.statusCode).toBe(200);
      const movies: Movie[] = response.body.data as Movie[];
      expect(movies.length).toBeGreaterThanOrEqual(1);
      expect(movies.length).toBeLessThanOrEqual(20);
      expect(movies.at(0).actors.length).toBe(0);
      expect(movies.at(0).genres.length).toBeGreaterThanOrEqual(1);
      expect(movies.at(0).movieId).toBeDefined();
      expect(movies.at(0).title).toBeDefined();
      expect(movies.at(0).adultContent).toBeDefined();
      nockDone();
    });

    it("Should return 404 if the User doesn't exist", async () => {
      const { nockDone } = await nock.back('get-userRecommendations-2.json', {
        afterRecord: removeSecretsFromRecords,
      });
      nock.enableNetConnect(/(localhost|127\.0\.0\.1)/); // nock disables external requests, this enables localhost connections

      // 436270 is Black Adam
      const response = await request(app).get(
        '/extern/user/10/recommendations'
      );
      expect(response.statusCode).toBe(404);
      nockDone();
    });

    it('Should return 500 if the param is not a number', async () => {
      const { nockDone } = await nock.back('get-userRecommendations-3.json', {
        afterRecord: removeSecretsFromRecords,
      });
      nock.enableNetConnect(/(localhost|127\.0\.0\.1)/); // nock disables external requests, this enables localhost connections

      // 436270 is Black Adam
      const response = await request(app).get(
        '/extern/user/blabla/recommendations'
      );
      expect(response.statusCode).toBe(500);
      nockDone();
    });
  });

  describe('Testing movieRecommendations', () => {
    it('Should return an array of Movies', async () => {
      const { nockDone } = await nock.back('get-movieRecommendations-1.json', {
        afterRecord: removeSecretsFromRecords,
      });
      nock.enableNetConnect(/(localhost|127\.0\.0\.1)/); // nock disables external requests, this enables localhost connections

      // 436270 is Black Adam
      const response = await request(app).get(
        '/extern/movie/436270/recommendations'
      );
      expect(response.statusCode).toBe(200);
      const movies: Movie[] = response.body.data as Movie[];
      expect(movies.length).toBeGreaterThanOrEqual(1);
      expect(movies.length).toBeLessThanOrEqual(20);
      expect(movies.at(0).actors.length).toBe(0);
      expect(movies.at(0).genres.length).toBeGreaterThanOrEqual(1);
      expect(movies.at(0).movieId).toBeDefined();
      expect(movies.at(0).title).toBeDefined();
      expect(movies.at(0).adultContent).toBeDefined();
      nockDone();
    });

    it("Should return 500 if the movie doesn't exist", async () => {
      const { nockDone } = await nock.back('get-movieRecommendations-2.json', {
        afterRecord: removeSecretsFromRecords,
      });
      nock.enableNetConnect(/(localhost|127\.0\.0\.1)/); // nock disables external requests, this enables localhost connections

      // 436270 is Black Adam
      const response = await request(app).get(
        '/extern/movie/-1/recommendations'
      );
      expect(response.statusCode).toBe(500);
      nockDone();
    });

    it('Should return 500 if the param is not a number', async () => {
      const { nockDone } = await nock.back('get-movieRecommendations-3.json', {
        afterRecord: removeSecretsFromRecords,
      });
      nock.enableNetConnect(/(localhost|127\.0\.0\.1)/); // nock disables external requests, this enables localhost connections

      // 436270 is Black Adam
      const response = await request(app).get(
        '/extern/movie/blabla/recommendations'
      );
      expect(response.statusCode).toBe(500);
      nockDone();
    });
  });

  describe('Testing getPopular Route', () => {
    it('Should return an array of Movies', async () => {
      const { nockDone } = await nock.back('get-getPopular-1.json', {
        afterRecord: removeSecretsFromRecords,
      });
      nock.enableNetConnect(/(localhost|127\.0\.0\.1)/); // nock disables external requests, this enables localhost connections

      const response = await request(app).get('/extern/popular?page=1');
      expect(response.statusCode).toBe(200);
      const movies: Movie[] = response.body.data as Movie[];
      expect(movies.length).toBeGreaterThanOrEqual(1);
      expect(movies.length).toBeLessThanOrEqual(20);
      expect(movies.at(0).movieId).toBeDefined();
      expect(movies.at(0).title).toBeDefined();
      expect(movies.at(0).adultContent).toBeDefined();
      nockDone();
    });

    it('Should fill genres but not actors', async () => {
      const { nockDone } = await nock.back('get-getPopular-2.json', {
        afterRecord: removeSecretsFromRecords,
      });
      nock.enableNetConnect(/(localhost|127\.0\.0\.1)/); // nock disables external requests, this enables localhost connections

      const response = await request(app).get('/extern/popular?page=1');
      expect(response.statusCode).toBe(200);
      const movies: Movie[] = response.body.data as Movie[];
      expect(movies.at(0).actors.length).toBe(0);
      expect(movies.at(0).genres.length).toBeGreaterThanOrEqual(1);
      nockDone();
    });
  });

  describe('Testing getAllGenres', () => {
    it('Should return an array of Genres', async () => {
      const { nockDone } = await nock.back('get-getAllGenres-1.json', {
        afterRecord: removeSecretsFromRecords,
      });
      nock.enableNetConnect(/(localhost|127\.0\.0\.1)/); // nock disables external requests, this enables localhost connections

      const response = await request(app).get('/extern/genres');
      expect(response.statusCode).toBe(200);
      const genres: Genre[] = response.body.data as Genre[];
      expect(genres.length).toBeGreaterThanOrEqual(1);
      expect(genres.at(0).genreId).toBeDefined();
      expect(genres.at(0).genreName).toBeDefined();
      nockDone();
    });
  });

  describe('Testing getMoviesToGenre Route', () => {
    it('Should return an array of Movies', async () => {
      const { nockDone } = await nock.back('get-getMoviesToGenre-1.json', {
        afterRecord: removeSecretsFromRecords,
      });
      nock.enableNetConnect(/(localhost|127\.0\.0\.1)/); // nock disables external requests, this enables localhost connections

      const response = await request(app).get('/extern/movie/genre/28?page=1');
      expect(response.statusCode).toBe(200);
      const movies: Movie[] = response.body.data as Movie[];
      expect(movies.length).toBeGreaterThanOrEqual(1);
      expect(movies.length).toBeLessThanOrEqual(20);
      expect(movies.at(0).movieId).toBeDefined();
      expect(movies.at(0).title).toBeDefined();
      expect(movies.at(0).adultContent).toBeDefined();
      nockDone();
    });

    it('Should fill the genres array but not actors', async () => {
      const { nockDone } = await nock.back('get-getMoviesToGenre-2.json', {
        afterRecord: removeSecretsFromRecords,
      });
      nock.enableNetConnect(/(localhost|127\.0\.0\.1)/); // nock disables external requests, this enables localhost connections

      const response = await request(app).get('/extern/movie/genre/28?page=1');
      expect(response.statusCode).toBe(200);
      const movies: Movie[] = response.body.data as Movie[];
      expect(movies.at(0).actors.length).toBe(0);
      expect(movies.at(0).genres.length).toBeGreaterThanOrEqual(1);
      nockDone();
    });

    it('Should return 500 if the param is not a number', async () => {
      const { nockDone } = await nock.back('get-getMoviesToGenre-3.json', {
        afterRecord: removeSecretsFromRecords,
      });
      nock.enableNetConnect(/(localhost|127\.0\.0\.1)/); // nock disables external requests, this enables localhost connections

      const response = await request(app).get('/extern/movie/genre/xxx?page=1');
      expect(response.statusCode).toBe(500);
      nockDone();
    });

    it("Should return 500 if the genre doesn't exist", async () => {
      const { nockDone } = await nock.back('get-getMoviesToGenre-4.json', {
        afterRecord: removeSecretsFromRecords,
      });
      nock.enableNetConnect(/(localhost|127\.0\.0\.1)/); // nock disables external requests, this enables localhost connections

      const response = await request(app).get(
        '/extern/movie/genre/99999?page=1'
      );
      expect(response.statusCode).toBe(404);
      nockDone();
    });
  });

  describe('Testing the hatespeech API', () => {
    it('should return false if profanity was detected', async () => {
      const { nockDone } = await nock.back('get-hatespeech-1.json', {
        afterRecord: removeSecretsFromRecords,
      });
      nock.enableNetConnect(/(localhost|127\.0\.0\.1)/); // nock disables external requests, this enables localhost connections

      const response = await request(app).get('/extern/hatespeech?text=FUCK');
      expect(response.statusCode).toBe(200);
      expect(response.body.data as boolean).toBeTruthy();
      nockDone();
    });
    it('should return false if no profanity was detected', async () => {
      const { nockDone } = await nock.back('get-hatespeech-2.json', {
        afterRecord: removeSecretsFromRecords,
      });
      nock.enableNetConnect(/(localhost|127\.0\.0\.1)/); // nock disables external requests, this enables localhost connections

      const response = await request(app).get('/extern/hatespeech?text=HELLO');
      expect(response.statusCode).toBe(200);
      expect(response.body.data as boolean).toBeFalsy();
      nockDone();
    });
  });
});
