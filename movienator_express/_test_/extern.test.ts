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

describe('Externtest', () => {
  describe('Testing movieSearch Route', () => {
    it('Should return an array of Movies with max length of 20', async () => {
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
    });
    it('Should fill the genres array but not actors', async () => {
      const response = await request(app).get(
        '/extern/search/movie/Harry?page=1'
      );
      expect(response.statusCode).toBe(200);
      const movies: Movie[] = response.body.data as Movie[];
      expect(movies.at(0).actors.length).toBe(0);
      expect(movies.at(0).genres.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Testing actorSearch Route', () => {
    it('Should return an Array of Actors', async () => {
      const response = await request(app).get('/extern/search/actor/Daniel');
      expect(response.statusCode).toBe(200);
      const actors: Actor[] = response.body.data as Actor[];
      expect(actors.length).toBeGreaterThanOrEqual(1);
      expect(actors.at(0).actorId).toBeDefined();
      expect(actors.at(0).name).toBeDefined();
    });
    it('Should not fill the movies array of the actors', async () => {
      const response = await request(app).get('/extern/search/actor/Daniel');
      expect(response.statusCode).toBe(200);
      const actors: Actor[] = response.body.data as Actor[];
      expect(actors.at(0).movies.length).toBe(0);
    });
  });

  describe('Testing getActorsToMovie Route', () => {
    it('Should return an array of Actors', async () => {
      const response = await request(app).get('/extern/actor/movie/436270');
      expect(response.statusCode).toBe(200);
      const actors: Actor[] = response.body.data as Actor[];
      expect(actors.length).toBeGreaterThanOrEqual(1);
      expect(actors.length).toBeLessThanOrEqual(10);
      expect(actors.at(0).name).toBeDefined();
      expect(actors.at(0).actorId).toBeDefined();
    });

    it("Should return 500 if the movie ID doesn't exist", async () => {
      const response = await request(app).get('/extern/actor/movie/xxxx');
      expect(response.statusCode).toBe(500);
    });
  });

  describe('Testing getMoviesToActor Route', () => {
    it('Should return an Array of Movies', async () => {
      const response = await request(app).get('/extern/movies/actor/8784');
      expect(response.statusCode).toBe(200);
      const movies: Movie[] = response.body.data as Movie[];
      expect(movies.length).toBeGreaterThanOrEqual(1);
      expect(movies.length).toBeLessThanOrEqual(70);
      expect(movies.at(0).movieId).toBeDefined();
      expect(movies.at(0).title).toBeDefined();
      expect(movies.at(0).adultContent).toBeDefined();
    }, 25_000);

    it('Should fill the genres array but not the actors array', async () => {
      const response = await request(app).get('/extern/movies/actor/8784');
      expect(response.statusCode).toBe(200);
      const movies: Movie[] = response.body.data as Movie[];
      expect(movies.at(0).actors.length).toBe(0);
      expect(movies.at(0).genres.length).toBeGreaterThanOrEqual(1);
    }, 10_000);

    it("Should return 500 if the actors doesn't exist", async () => {
      const response = await request(app).get('/extern/movies/actor/xxxxx');
      expect(response.statusCode).toBe(500);
    }, 10_000);
  });

  describe('Testing userRecommendations Route', () => {
    it('Should return an Array of Movies', async () => {
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
    });

    it("Should return 404 if the User doesn't exist", async () => {
      // 436270 is Black Adam
      const response = await request(app).get(
        '/extern/user/10/recommendations'
      );
      expect(response.statusCode).toBe(404);
    });

    it('Should return 500 if the param is not a number', async () => {
      // 436270 is Black Adam
      const response = await request(app).get(
        '/extern/user/blabla/recommendations'
      );
      expect(response.statusCode).toBe(500);
    });
  });

  describe('Testing movieRecommendations', () => {
    it('Should return an array of Movies', async () => {
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
    });

    it("Should return 500 if the movie doesn't exist", async () => {
      // 436270 is Black Adam
      const response = await request(app).get(
        '/extern/movie/-1/recommendations'
      );
      expect(response.statusCode).toBe(500);
    });

    it('Should return 500 if the param is not a number', async () => {
      // 436270 is Black Adam
      const response = await request(app).get(
        '/extern/movie/blabla/recommendations'
      );
      expect(response.statusCode).toBe(500);
    });
  });

  describe('Testing getPopular Route', () => {
    it('Should return an array of Movies', async () => {
      const response = await request(app).get('/extern/popular?page=1');
      expect(response.statusCode).toBe(200);
      const movies: Movie[] = response.body.data as Movie[];
      expect(movies.length).toBeGreaterThanOrEqual(1);
      expect(movies.length).toBeLessThanOrEqual(20);
      expect(movies.at(0).movieId).toBeDefined();
      expect(movies.at(0).title).toBeDefined();
      expect(movies.at(0).adultContent).toBeDefined();
    });

    it('Should fill genres but not actors', async () => {
      const response = await request(app).get('/extern/popular?page=1');
      expect(response.statusCode).toBe(200);
      const movies: Movie[] = response.body.data as Movie[];
      expect(movies.at(0).actors.length).toBe(0);
      expect(movies.at(0).genres.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Testing getAllGenres', () => {
    it('Should return an array of Genres', async () => {
      const response = await request(app).get('/extern/genres');
      expect(response.statusCode).toBe(200);
      const genres: Genre[] = response.body.data as Genre[];
      expect(genres.length).toBeGreaterThanOrEqual(1);
      expect(genres.at(0).genreId).toBeDefined();
      expect(genres.at(0).genreName).toBeDefined();
    });
  });

  describe('Testing getMoviesToGenre Route', () => {
    it('Should return an array of Movies', async () => {
      const response = await request(app).get('/extern/movie/genre/28?page=1');
      expect(response.statusCode).toBe(200);
      const movies: Movie[] = response.body.data as Movie[];
      expect(movies.length).toBeGreaterThanOrEqual(1);
      expect(movies.length).toBeLessThanOrEqual(20);
      expect(movies.at(0).movieId).toBeDefined();
      expect(movies.at(0).title).toBeDefined();
      expect(movies.at(0).adultContent).toBeDefined();
    });

    it('Should fill the genres array but not actors', async () => {
      const response = await request(app).get('/extern/movie/genre/28?page=1');
      expect(response.statusCode).toBe(200);
      const movies: Movie[] = response.body.data as Movie[];
      expect(movies.at(0).actors.length).toBe(0);
      expect(movies.at(0).genres.length).toBeGreaterThanOrEqual(1);
    });

    it('Should return 500 if the param is not a number', async () => {
      const response = await request(app).get('/extern/movie/genre/xxx?page=1');
      expect(response.statusCode).toBe(500);
    });

    it("Should return 500 if the genre doesn't exist", async () => {
      const response = await request(app).get(
        '/extern/movie/genre/99999?page=1'
      );
      expect(response.statusCode).toBe(404);
    });
  });

  describe('Testing the hatespeech API', () => {
    it('should return false if profanity was detected', async () => {
      const response = await request(app).get('/extern/hatespeech?text=FUCK');
      expect(response.statusCode).toBe(200);
      expect(response.body.data as boolean).toBeTruthy();
    });
    it('should return false if no profanity was detected', async () => {
      const response = await request(app).get('/extern/hatespeech?text=HELLO');
      expect(response.statusCode).toBe(200);
      expect(response.body.data as boolean).toBeFalsy();
    });
  });
});
