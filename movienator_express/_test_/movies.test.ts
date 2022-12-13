import {
  afterAll,
  beforeAll,
  describe,
  expect,
  beforeEach,
  it,
} from '@jest/globals';
import { TestDatabaseManager } from './test_utils/TestDatabaseManager';
import Movie from '../entity/movie';
import Actor from '../entity/actor';
import Genre from '../entity/genre';
import User from '../entity/user';
import Review from '../entity/review';

import request from 'supertest';
import app from '../app';
import { response } from 'express';
import exp from 'constants';

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

  let movie1: Movie = Movie.create({
    movieId: 1,
    title: 'Aaaa',
    adultContent: false,
    actors: [actor1],
    genres: [genre1],
    reviews: [],
    lengthMinutes: 100,
    releaseDate: new Date('2022-01-01'),
  });
  await movie1.save();

  let review1: Review = Review.create({
    reviewMovieMovieId: 1,
    reviewUserUserId: 1,
    title: 'Good',
    content: 'Was good',
    rating: 1,
    lastUpdated: new Date(),
  });
  await review1.save();

  let movie2: Movie = new Movie();
  movie2.movieId = 2;
  movie2.title = 'Bbbb';
  movie2.adultContent = false;
  movie2.actors = [actor1];
  movie2.lengthMinutes = 200;
  movie2.releaseDate = new Date('2022-03-03');
  await movie2.save();

  let movie3: Movie = new Movie();
  movie3.movieId = 3;
  movie3.title = 'Ccccb';
  movie3.adultContent = true;
  movie3.lengthMinutes = 300;
  movie3.releaseDate = new Date('2022-05-05');
  await movie3.save();

  user1.watchlist = [movie1, movie2];
  await user1.save();

  let user2 = User.create({
    firstName: 'Maggus',
    lastName: 'Rühl',
    userName: 'Roswita',
    password: 'pw',
    comment: 'Schwer und falsch',
    birthday: new Date(),
    following: [],
    followers: [],
    watchlist: [movie1],
  });
  await user2.save();
  let user3 = User.create({
    firstName: 'Maggus',
    lastName: 'Rühl',
    userName: 'Roswita',
    password: 'pw',
    comment: 'Schwer und falsch',
    birthday: new Date(),
    following: [],
    followers: [],
  });
  await user3.save();
}

describe('MovieTests', () => {
  describe('Testing getAll Route', () => {
    it('Should return an array of all movies, ordered by title', async () => {
      let response = await request(app).get('/movie/all');
      expect(response.statusCode).toBe(200);
      let movies: Movie[] = response.body.data as Movie[];
      expect(movies.length).toBe(3);
      expect(movies.at(0).title).toBe('Aaaa');
      expect(movies.at(0).genres.length).toBeGreaterThanOrEqual(1);
      expect(movies.at(0).actors.length).toBeGreaterThanOrEqual(1);
      expect(movies.at(0).reviews.length).toBeGreaterThanOrEqual(1);
    });
    it('Should fill all relations', async () => {
      let response = await request(app).get('/movie/all');
      expect(response.statusCode).toBe(200);
      let movies: Movie[] = response.body.data as Movie[];
      expect(movies.at(0).genres.length).toBeGreaterThanOrEqual(1);
      expect(movies.at(0).actors.length).toBeGreaterThanOrEqual(1);
      expect(movies.at(0).reviews.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Testing getOne Route', () => {
    it('Should return a single movie', async () => {
      let response = await request(app).get('/movie/one/1');
      expect(response.statusCode).toBe(200);
      let movie: Movie = response.body.data as Movie;
      expect(movie.movieId).toBe(1);
    });

    it('Should fill all the relations', async () => {
      let response = await request(app).get('/movie/one/1');
      expect(response.statusCode).toBe(200);
      let movie: Movie = response.body.data as Movie;
      expect(movie.genres.at(0).genreName).toBe('Fantasy');
      expect(movie.actors.at(0).name).toBe('Maggus');
      expect(movie.reviews.at(0).reviewUserUserId).toBe(1);
    });

    it('Should return 404 if the movies doesnt exist', async () => {
      let response = await request(app).get('/movie/one/10');
      expect(response.statusCode).toBe(404);
    });

    it('Should return 500 if the passed value is not a number', async () => {
      let response = await request(app).get('/movie/one/blabla');
      expect(response.statusCode).toBe(500);
    });
  });

  describe('Testing getMovieToActor Route', () => {
    it('Should return movies of that actor ordered by title', async () => {
      let response = await request(app).get('/movie/actor/1');
      expect(response.statusCode).toBe(200);
      let movies: Movie[] = response.body.data as Movie[];
      expect(movies.length).toBe(2);
      expect(movies.at(0).title).toBe('Aaaa');
      expect(movies.at(1).title).toBe('Bbbb');
    });

    it('Should fill all the relations', async () => {
      let response = await request(app).get('/movie/actor/1');
      expect(response.statusCode).toBe(200);
      let movies: Movie[] = response.body.data as Movie[];
      expect(movies.at(0).actors.length).toBeGreaterThanOrEqual(1);
      expect(movies.at(0).reviews.length).toBeGreaterThanOrEqual(1);
      expect(movies.at(0).genres.length).toBeGreaterThanOrEqual(1);
    });

    it("Should return 404 if the actor doesn't exist", async () => {
      let response = await request(app).get('/movie/actor/10');
      expect(response.statusCode).toBe(404);
    });

    it('Should return 500 if the passed value is not a number', async () => {
      let response = await request(app).get('/movie/actor/blabla');
      expect(response.statusCode).toBe(500);
    });
  });

  describe('Testing getReviewedByUser Route', () => {
    it('Should return the Reviewed Movies ordered by name', async () => {
      let response = await request(app).get('/movie/user/1');
      expect(response.statusCode).toBe(200);
      let movies: Movie[] = response.body.data as Movie[];
      expect(movies.length).toBe(1);
      expect(movies.at(0).title).toBe('Aaaa');
    });

    it('Should fill all the relations', async () => {
      let response = await request(app).get('/movie/user/1');
      expect(response.statusCode).toBe(200);
      let movies: Movie[] = response.body.data as Movie[];
      expect(movies.at(0).actors.length).toBeGreaterThanOrEqual(1);
      expect(movies.at(0).reviews.length).toBeGreaterThanOrEqual(1);
      expect(movies.at(0).genres.length).toBeGreaterThanOrEqual(1);
    });

    it("Should return 404 if the movies doesn't exist", async () => {
      let response = await request(app).get('/movie/user/10');
      expect(response.statusCode).toBe(404);
    });

    it('Should return 500 if the passed value is not a number', async () => {
      let response = await request(app).get('/movie/user/blabla');
      expect(response.statusCode).toBe(500);
    });
  });

  describe('Testing getWatchlistByUser Route', () => {
    it('Should return all reviewed movies of that user ordered by title', async () => {
      let response = await request(app).get('/movie/watchlist/1');
      expect(response.statusCode).toBe(200);
      let movies: Movie[] = response.body.data as Movie[];
      expect(movies.length).toBe(2);
      expect(movies.at(0).title).toBe('Aaaa');
    });

    it('Should fill all the relations', async () => {
      let response = await request(app).get('/movie/watchlist/1');
      expect(response.statusCode).toBe(200);
      let movies: Movie[] = response.body.data as Movie[];
      expect(movies.at(0).actors.length).toBeGreaterThanOrEqual(1);
      expect(movies.at(0).reviews.length).toBeGreaterThanOrEqual(1);
      expect(movies.at(0).genres.length).toBeGreaterThanOrEqual(1);
    });

    it('Should return 404 if the user doesnt exist', async () => {
      let response = await request(app).get('/movie/watchlist/10');
      expect(response.statusCode).toBe(404);
    });

    it('Should return 500 if the passed value is not a number', async () => {
      let response = await request(app).get('/movie/watchlist/blabla');
      expect(response.statusCode).toBe(500);
    });
  });

  describe('Testing moviesByMinTime Route', () => {
    it('Should return an array with movies ordered by title', async () => {
      let response = await request(app).get('/movie/time/min/200');
      expect(response.statusCode).toBe(200);
      let movies: Movie[] = response.body.data as Movie[];
      expect(movies.length).toBe(2);
      expect(movies.at(0).movieId).toBe(2);
      expect(movies.at(1).movieId).toBe(3);
      //Reviews, Actors, Genres filled
    });

    it('Should fill all the relations', async () => {
      let response = await request(app).get('/movie/time/min/200');
      expect(response.statusCode).toBe(200);
      let movies: Movie[] = response.body.data as Movie[];
      expect(movies.length).toBe(2);
      expect(movies.at(0).actors.length).toBeGreaterThanOrEqual(1);
    });

    it('Should return 500 if the param is negative', async () => {
      let response = await request(app).get('/movie/time/min/-200');
      expect(response.statusCode).toBe(500);
    });

    it('Should return 500 if the param is zero', async () => {
      let response = await request(app).get('/movie/time/min/0');
      expect(response.statusCode).toBe(500);
    });

    it('Should return 500 if the passed value is not a number', async () => {
      let response = await request(app).get('/movie/time/min/blabla');
      expect(response.statusCode).toBe(500);
    });
  });

  describe('Testing moviesByMaxTime Route', () => {
    it('Should return array of movies ordered by title', async () => {
      let response = await request(app).get('/movie/time/max/200');
      expect(response.statusCode).toBe(200);
      let movies: Movie[] = response.body.data as Movie[];
      expect(movies.length).toBe(2);
      expect(movies.at(0).movieId).toBe(1);
      expect(movies.at(1).movieId).toBe(2);
    });

    it('Should fill all the relations', async () => {
      let response = await request(app).get('/movie/time/max/200');
      expect(response.statusCode).toBe(200);
      let movies: Movie[] = response.body.data as Movie[];
      expect(movies.length).toBe(2);
      expect(movies.at(0).actors.length).toBeGreaterThanOrEqual(1);
      expect(movies.at(0).reviews.length).toBeGreaterThanOrEqual(1);
      expect(movies.at(0).genres.length).toBeGreaterThanOrEqual(1);
    });

    it('Should return 500 if the param is negative', async () => {
      let response = await request(app).get('/movie/time/max/-200');
      expect(response.statusCode).toBe(500);
    });

    it('Should return 500 if the param is zero', async () => {
      let response = await request(app).get('/movie/time/max/0');
      expect(response.statusCode).toBe(500);
    });

    it('Should return 500 if the passed value is not a number', async () => {
      let response = await request(app).get('/movie/time/min/blabla');
      expect(response.statusCode).toBe(500);
    });
  });

  describe('Testing moviesByDateRange Route', () => {
    it('Should return an array of movies ordered by title', async () => {
      let dateMin = new Date('2022-02-02');
      let dateMax = new Date('2022-06-06');
      let response = await request(app).get(
        `/movie/date/${dateMin}/${dateMax}`
      );
      expect(response.statusCode).toBe(200);
      let movies: Movie[] = response.body.data as Movie[];
      expect(movies.length).toBe(2);
      expect(movies.at(0).movieId).toBe(2);
      expect(movies.at(1).movieId).toBe(3);
    });

    it('Should fill all the relations', async () => {
      let dateMin = new Date('2022-02-02');
      let dateMax = new Date('2022-06-06');
      let response = await request(app).get(
        `/movie/date/${dateMin}/${dateMax}`
      );
      expect(response.statusCode).toBe(200);
      let movies: Movie[] = response.body.data as Movie[];
      expect(movies.at(0).actors.length).toBeGreaterThanOrEqual(1);
    });

    it('Should return 500 if the second param is not a valid date', async () => {
      let dateMin = new Date('2022-02-02');
      let response = await request(app).get(`/movie/date/${dateMin}/blabla`);
      expect(response.statusCode).toBe(500);
    });

    it('Should return 500 if the first param is not a valid date', async () => {
      let dateMax = new Date('2022-02-02');
      let response = await request(app).get(`/movie/date/blabla/${dateMax}`);
      expect(response.statusCode).toBe(500);
    });

    it('Should return 500 if the max date is before the min date', async () => {
      let dateMin = new Date('2022-02-02');
      let dateMax = new Date('2022-06-06');
      let response = await request(app).get(
        `/movie/date/${dateMax}/${dateMin}`
      );
      expect(response.statusCode).toBe(500);
    });
  });

  describe('Testing moviesByWord Route', () => {
    it('Should return an array of movies ordered by title', async () => {
      let response = await request(app).get('/movie/name/b');
      expect(response.statusCode).toBe(200);
      let movies: Movie[] = response.body.data as Movie[];
      expect(movies.length).toBe(2);
      expect(movies.at(0).movieId).toBe(2);
      expect(movies.at(1).movieId).toBe(3);
    });

    it('Should fill all the relations', async () => {
      let response = await request(app).get('/movie/name/b');
      expect(response.statusCode).toBe(200);
      let movies: Movie[] = response.body.data as Movie[];
      expect(movies.at(0).actors.length).toBeGreaterThanOrEqual(1);
    });

    it('Should return an empty array if no movies are found', async () => {
      let response = await request(app).get('/movie/name/xxx');
      expect(response.statusCode).toBe(200);
      let movies: Movie[] = response.body.data as Movie[];
      expect(movies.length).toBe(0);
    });
  });

  describe('Testing moviesByRating Route', () => {
    it('Should return an array of movies ordered by title', async () => {
      //3 Users now in database 1,2,3
      //3 Movies now in database 1,2,3

      {
        let review1: Review = Review.create({
          reviewMovieMovieId: 1,
          reviewUserUserId: 1,
          title: 'Good',
          content: 'Was good',
          rating: 1,
          lastUpdated: new Date(),
        });
        await review1.save();
        let review2: Review = Review.create({
          reviewMovieMovieId: 1,
          reviewUserUserId: 2,
          title: 'Good',
          content: 'Was good',
          rating: 2,
          lastUpdated: new Date(),
        });
        await review2.save();
        let review3: Review = Review.create({
          reviewMovieMovieId: 1,
          reviewUserUserId: 3,
          title: 'Good',
          content: 'Was good',
          rating: 3,
          lastUpdated: new Date(),
        });
        await review3.save();
      }
      // Movie 1 avg rating now 2
      {
        let review1: Review = Review.create({
          reviewMovieMovieId: 2,
          reviewUserUserId: 1,
          title: 'Good',
          content: 'Was good',
          rating: 3,
          lastUpdated: new Date(),
        });
        await review1.save();
        let review2: Review = Review.create({
          reviewMovieMovieId: 2,
          reviewUserUserId: 2,
          title: 'Good',
          content: 'Was good',
          rating: 3,
          lastUpdated: new Date(),
        });
        await review2.save();
        let review3: Review = Review.create({
          reviewMovieMovieId: 2,
          reviewUserUserId: 3,
          title: 'Good',
          content: 'Was good',
          rating: 4,
          lastUpdated: new Date(),
        });
        await review3.save();
      }
      // Movie 2 avg rating 3,3
      {
        let review1: Review = Review.create({
          reviewMovieMovieId: 3,
          reviewUserUserId: 1,
          title: 'Good',
          content: 'Was good',
          rating: 5,
          lastUpdated: new Date(),
        });
        await review1.save();
        let review2: Review = Review.create({
          reviewMovieMovieId: 3,
          reviewUserUserId: 2,
          title: 'Good',
          content: 'Was good',
          rating: 5,
          lastUpdated: new Date(),
        });
        await review2.save();
        let review3: Review = Review.create({
          reviewMovieMovieId: 3,
          reviewUserUserId: 3,
          title: 'Good',
          content: 'Was good',
          rating: 5,
          lastUpdated: new Date(),
        });
        await review3.save();
      }
      //Movie 3 rating 5

      //1 -> 2; 2 -> 3,3; 3 -> 5
      let response = await request(app).get('/movie/rating/3');
      expect(response.statusCode).toBe(200);
      let movies: Movie[] = response.body.data as Movie[];
      expect(movies.length).toBe(2);
      expect(movies.at(0).movieId).toBe(2);
      expect(movies.at(1).movieId).toBe(3);
      expect(movies.at(0).actors.length).toBeGreaterThanOrEqual(1);
      expect(movies.at(0).reviews.length).toBe(3);
    });

    it('Should return 500 if no number is passed', async () => {
      let response = await request(app).get('/movie/rating/blabla');
      expect(response.statusCode).toBe(500);
    });

    it('Should return 500 if a negative value is passed', async () => {
      let response = await request(app).get('/movie/rating/-1');
      expect(response.statusCode).toBe(500);
    });
  });

  describe('Testing getMoviesByGenre Route', () => {
    //Existing Genre is: 1 - Fantasy
    it('Should return an array of movies with that genre id', async () => {
      let response = await request(app).get('/movie/genre/1');
      expect(response.statusCode).toBe(200);
      let movies: Movie[] = response.body.data as Movie[];
      expect(movies.length).toBe(1);
      expect(movies.at(0).actors.length).toBeGreaterThanOrEqual(1);
      expect(movies.at(0).genres.length).toBe(1);
      expect(movies.at(0).reviews.length).toBeGreaterThanOrEqual(1);
    });

    it('Should return an array of movies with that genre name', async () => {
      let response = await request(app).get('/movie/genre/Fantasy');
      expect(response.statusCode).toBe(200);
      let movies: Movie[] = response.body.data as Movie[];
      expect(movies.length).toBe(1);
      expect(movies.at(0).actors.length).toBeGreaterThanOrEqual(1);
      expect(movies.at(0).genres.length).toBe(1);
      expect(movies.at(0).reviews.length).toBeGreaterThanOrEqual(1);
    });

    it('Should return 404 if that genre id doesnt exist', async () => {
      let response = await request(app).get('/movie/genre/10');
      expect(response.statusCode).toBe(404);
    });

    it('Should return 404 if that genre name doesnt exist', async () => {
      let response = await request(app).get('/movie/genre/blabla');
      expect(response.statusCode).toBe(404);
    });
  });

  describe('Testing getMutualWatchlist', () => {
    it('Should return an array of Movies', async () => {
      let response = await request(app).get('/movie/mutual/watchlist/1/2');
      expect(response.statusCode).toBe(200);
      let movies: Movie[] = response.body.data as Movie[];
      expect(movies.length).toBe(1);
      expect(movies.at(0).movieId).toBe(1);
    });

    it('Should fill all the relations', async () => {
      let response = await request(app).get('/movie/mutual/watchlist/1/2');
      expect(response.statusCode).toBe(200);
      let movies: Movie[] = response.body.data as Movie[];
      expect(movies.at(0).actors.length).toBeGreaterThanOrEqual(1);
      expect(movies.at(0).genres.length).toBe(1);
      expect(movies.at(0).reviews.length).toBeGreaterThanOrEqual(1);
    });

    it("Should return 404 if the first user doesn't exist", async () => {
      let response = await request(app).get('/movie/mutual/watchlist/100/2');
      expect(response.statusCode).toBe(404);
    });

    it("Should return 404 if the second user doesn't exist", async () => {
      let response = await request(app).get('/movie/mutual/watchlist/1/200');
      expect(response.statusCode).toBe(404);
    });

    it('Should return 500 if the first value is not a number', async () => {
      let response = await request(app).get('/movie/mutual/watchlist/blabla/2');
      expect(response.statusCode).toBe(500);
    });

    it('Should return 500 if the second value is not a number', async () => {
      let response = await request(app).get('/movie/mutual/watchlist/1/blabla');
      expect(response.statusCode).toBe(500);
    });
  });

  describe('Testing getMutualReview', () => {
    it('Should return an array of movies ordered by title', async () => {
      let review2: Review = Review.create({
        reviewMovieMovieId: 1,
        reviewUserUserId: 2,
        title: 'Good',
        content: 'Was good',
        rating: 1,
        lastUpdated: new Date(),
      });
      await review2.save();

      let response = await request(app).get('/movie/mutual/review/1/2');
      expect(response.statusCode).toBe(200);
      let movies: Movie[] = response.body.data as Movie[];
      expect(movies.length).toBe(1);
      expect(movies.at(0).movieId).toBe(1);
    });

    it('Should fill all the relations', async () => {
      let review2: Review = Review.create({
        reviewMovieMovieId: 1,
        reviewUserUserId: 2,
        title: 'Good',
        content: 'Was good',
        rating: 1,
        lastUpdated: new Date(),
      });
      await review2.save();

      let response = await request(app).get('/movie/mutual/review/1/2');
      expect(response.statusCode).toBe(200);
      let movies: Movie[] = response.body.data as Movie[];
      expect(movies.at(0).actors.length).toBeGreaterThanOrEqual(1);
      expect(movies.at(0).genres.length).toBe(1);
      expect(movies.at(0).reviews.length).toBeGreaterThanOrEqual(1);
    });

    it('Should return 404 if the first user doenst exist', async () => {
      let response = await request(app).get('/movie/mutual/review/100/2');
      expect(response.statusCode).toBe(404);
    });

    it('Should return 404 if the second user doenst exist', async () => {
      let response = await request(app).get('/movie/mutual/review/1/200');
      expect(response.statusCode).toBe(404);
    });

    it('Should return 500 if the first value is not a number', async () => {
      let response = await request(app).get('/movie/mutual/review/blabla/2');
      expect(response.statusCode).toBe(500);
    });

    it('Should return 500 if the second value is not a number', async () => {
      let response = await request(app).get('/movie/mutual/review/1/blabla');
      expect(response.statusCode).toBe(500);
    });
  });

  describe('Testing postMove Route', () => {
    it('Should insert the movie along with the actors and genres', async () => {
      let actor2: Actor = new Actor();
      actor2.name = 'Maggus';
      actor2.actorId = 2;

      let genre2: Genre = new Genre();
      genre2.genreId = 2;
      genre2.genreName = 'Krimi';

      let movie4: Movie = Movie.create({
        movieId: 4,
        title: 'Aaaa',
        adultContent: false,
        actors: [actor2],
        genres: [genre2],
        reviews: [],
      });

      let response = await request(app).post('/movie/').send(movie4);
      expect(response.statusCode).toBe(201);

      let newMovie = await Movie.findOne({
        where: { movieId: 4 },
        relations: { genres: true, actors: true, reviews: true },
      });
      expect(newMovie.movieId).toBe(4);
      expect(newMovie.actors.length).toBe(1);
      expect(newMovie.genres.length).toBe(1);
    });

    it('Should return 500 if needed fields are missing', async () => {
      let movie5: Movie = Movie.create({
        movieId: 5,
        title: 'Aaaa',
        //Adult content missing
        actors: [],
        genres: [],
        reviews: [],
      });

      let response = await request(app).post('/movie/').send(movie5);
      expect(response.statusCode).toBe(500);
    });

    it('Should not override the relations if an existing movie is posted again', async () => {
      let movie1: Movie = Movie.create({
        movieId: 1,
        title: 'Aaaa',
        adultContent: false,
        actors: [],
        genres: [],
        reviews: [],
      });

      let response = await request(app).post('/movie/').send(movie1);
      expect(response.statusCode).toBe(201);

      let movie: Movie = await Movie.findOne({
        where: { movieId: 1 },
        relations: { genres: true, actors: true, reviews: true },
      });
      expect(movie.reviews.length).toBeGreaterThanOrEqual(1);
      expect(movie.actors.length).toBeGreaterThanOrEqual(1);
      expect(movie.genres.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Testing updateMovie Route', () => {
    it('Should update the movie but not the relations', async () => {
      let movie1: Movie = Movie.create({
        movieId: 1,
        title: 'Aaaa',
        adultContent: true,
        actors: [],
        genres: [],
        reviews: [],
      });

      let response = await request(app).put('/movie/').send(movie1);
      expect(response.statusCode).toBe(201);

      let movie: Movie = await Movie.findOne({
        where: { movieId: 1 },
        relations: { genres: true, actors: true, reviews: true },
      });
      expect(movie.adultContent).toBe(true);
      expect(movie.reviews.length).toBeGreaterThanOrEqual(1);
      expect(movie.actors.length).toBeGreaterThanOrEqual(1);
      expect(movie.genres.length).toBeGreaterThanOrEqual(1);
    });

    it("Should return 404 if the movie doesn't exist", async () => {
      let movie1: Movie = Movie.create({
        movieId: 10,
        title: 'Aaaa',
        adultContent: true,
        actors: [],
        genres: [],
        reviews: [],
      });

      let response = await request(app).put('/movie/').send(movie1);
      expect(response.statusCode).toBe(404);
    });
  });

  describe('Testing deleteMovie Route', () => {
    it('Should delete the movie with that id', async () => {
      let movieBefore: Movie = await Movie.findOne({ where: { movieId: 1 } });
      expect(movieBefore.movieId).toBe(1);

      let response = await request(app).delete('/movie/1');
      expect(response.statusCode).toBe(204);

      let movieAfter: Movie = await Movie.findOne({ where: { movieId: 1 } });
      expect(movieAfter).toBeNull();
    });

    it("Should return 404 if that movie doesn't exist", async () => {
      let response = await request(app).delete('/movie/40');
      expect(response.statusCode).toBe(404);
    });

    it('Should 500 if the passed value is not a number', async () => {
      let response = await request(app).delete('/movie/blabla');
      expect(response.statusCode).toBe(500);
    });
  });
});
