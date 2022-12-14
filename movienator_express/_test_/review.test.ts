import {
  afterAll,
  beforeAll,
  beforeEach,
  afterEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import { TestDatabaseManager } from './test_utils/TestDatabaseManager';
import Review from '../entity/review';
import Movie from '../entity/movie';
import User from '../entity/user';
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
  let movie: Movie = new Movie();
  movie.movieId = 1;
  movie.title = 'Movie';
  movie.adultContent = false;
  await movie.save();

  let movie2: Movie = new Movie();
  movie2.movieId = 2;
  movie2.title = 'Movie2';
  movie2.adultContent = false;
  await movie2.save();

  let movieWithoutReviews: Movie = new Movie();
  movieWithoutReviews.movieId = 3;
  movieWithoutReviews.title = 'Movie3';
  movieWithoutReviews.adultContent = false;
  await movieWithoutReviews.save();

  let user: User = new User();
  user.firstName = 'Kevin';
  user.lastName = 'Hasse';
  user.userName = 'keha';
  user.password = 'root';
  user.birthday = new Date();
  user.following = [];
  user.followers = [];
  // await user.save();

  let user2: User = new User();
  user2.firstName = 'Isidora';
  user2.lastName = 'Jankovic';
  user2.userName = 'isij';
  user2.password = 'root';
  user2.birthday = new Date();
  user2.following = [];
  user2.followers = [];
  // await user2.save();

  let userFollowsUserNoReview: User = new User();
  userFollowsUserNoReview.firstName = 'Nick';
  userFollowsUserNoReview.lastName = 'Wilhelm';
  userFollowsUserNoReview.userName = 'niwi';
  userFollowsUserNoReview.password = 'root';
  userFollowsUserNoReview.birthday = new Date();
  userFollowsUserNoReview.following = [];
  userFollowsUserNoReview.followers = [];
  // await userFollowsUserNoReview.save();

  let userWithoutReviews: User = new User();
  userWithoutReviews.firstName = 'Patrick';
  userWithoutReviews.lastName = 'Fender';
  userWithoutReviews.userName = 'pafe';
  userWithoutReviews.password = 'root';
  userWithoutReviews.birthday = new Date();
  userWithoutReviews.following = [];
  userWithoutReviews.followers = [];
  // await userWithoutReviews.save();

  user2.following.push(user); // Isidora follows Kevin
  userFollowsUserNoReview.following.push(userWithoutReviews); // Nick follows Patrick

  await user.save();
  await user2.save();
  await userFollowsUserNoReview.save();
  await userWithoutReviews.save();

  // review of isij for movie2
  let review3: Review = new Review();
  review3.reviewMovieMovieId = 2;
  review3.reviewUserUserId = 2;
  review3.title = 'Liked it!';
  review3.content = 'Pretty good';
  review3.rating = 8;
  review3.lastUpdated = new Date('2022-03-21');
  review3.review_movie = movie2;
  review3.review_user = user2;
  await review3.save();

  // review of isij for movie
  let review2: Review = new Review();
  review2.reviewMovieMovieId = 1;
  review2.reviewUserUserId = 2;
  review2.title = 'Nah';
  review2.content = 'Could be better';
  review2.rating = 1;
  review2.lastUpdated = new Date('2022-03-22');
  review2.review_movie = movie;
  review2.review_user = user2;
  await review2.save();

  // review of keha
  let review: Review = new Review();
  review.reviewMovieMovieId = 1;
  review.reviewUserUserId = 1;
  review.title = 'My first review';
  review.content = 'Best movie ever';
  review.rating = 5;
  review.lastUpdated = new Date('2022-03-23');
  review.review_movie = movie;
  review.review_user = user;
  await review.save();

  // review of keha
  let review4: Review = new Review();
  review4.reviewMovieMovieId = 2;
  review4.reviewUserUserId = 1;
  review4.title = 'Yeeah';
  review4.content = 'cool';
  review4.rating = 7;
  review4.lastUpdated = new Date('2022-03-22');
  review4.review_movie = movie2;
  review4.review_user = user;
  await review4.save();
}

describe('ReviewTests', () => {
  describe('getAllReviews route', () => {
    describe('good case (reviews exist)', () => {
      it('should return the reviews sorted by newest and status 200', async () => {
        let response = await request(app).get('/review/all');
        expect(response.statusCode).toBe(200);
        const allReviews: Review[] = response.body.data;
        expect(allReviews.length).toBe(4);
        expect(allReviews.at(0).title).toBe('My first review');
        expect(allReviews.at(0).review_movie.title).toBe('Movie');
        expect(allReviews.at(0).review_user.firstName).toBe('Kevin');
      });
    });
    describe('bad cases', () => {
      describe('given no reviews exist', () => {
        it('should return 200', async () => {
          await TestDatabaseManager.getInstance().resetTestDatabase();
          let response = await request(app).get('/review/all');
          expect(response.statusCode).toBe(200);
          const allReviews: Review[] = response.body.data;
          expect(allReviews.length).toBe(0);
        });
      });
    });
  });

  describe('getSingleReview route', () => {
    describe('good case', () => {
      it('getSingleReview', async () => {
        let response = await request(app).get('/review/one/1/2');
        expect(response.statusCode).toBe(200);
        const review: Review = response.body.data;
        expect(review.review_movie.title).toBe('Movie');
        expect(review.review_user.firstName).toBe('Isidora');
      });
    });
    describe('bad cases', () => {
      describe('given user id doesnt exist', () => {
        it('should return 404', async () => {
          let response = await request(app).get('/review/one/1/11');
          expect(response.statusCode).toBe(404);
        });
      });
      describe('given movie id doesnt exist', () => {
        it('should return 404', async () => {
          let response = await request(app).get('/review/one/3/2');
          expect(response.statusCode).toBe(404);
        });
      });
    });
  });

  describe('getUserFollowingReviews route', () => {
    describe('good case', () => {
      it('should return all reviews done by users that user is following, ordered by last updated, and status 200', async () => {
        let response = await request(app).get('/review/user/following/2');
        expect(response.statusCode).toBe(200);
        const kevinsReviews: Review[] = response.body.data;
        expect(kevinsReviews.length).toBe(2);
        expect(kevinsReviews.at(0).title).toBe('My first review');
        expect(kevinsReviews.at(0).review_movie.movieId).toBe(1);
        expect(kevinsReviews.at(0).review_user.userId).toBe(1);
      });
    });
    describe('given user doesnt follow anyone', () => {
      it('should return 200 and empty array', async () => {
        let response = await request(app).get('/review/user/following/1');
        expect(response.statusCode).toBe(200);
        const reviews: Review[] = response.body.data;
        expect(reviews.length).toBe(0);
      });
    });
    describe('given no reviews made by followed users', () => {
      it('should return 200 and empty array', async () => {
        let response = await request(app).get('/review/user/following/3');
        expect(response.statusCode).toBe(200);
        const reviews: Review[] = response.body.data;
        expect(reviews.length).toBe(0);
      });
    });
    describe('bad cases', () => {
      describe('given user id doesnt exist', () => {
        it('should return 404', async () => {
          let response = await request(app).get('/review/user/following/11');
          expect(response.statusCode).toBe(404);
        });
      });
    });
  });

  describe('getUserOwnReviews route', () => {
    describe('good case', () => {
      it('should return the users own reviews and status 200', async () => {
        let response = await request(app).get('/review/user/own/2');
        expect(response.statusCode).toBe(200);
        const allReviewsOfUser: Review[] = response.body.data;
        // console.log(allReviewsOfUser);
        expect(allReviewsOfUser.length).toBe(2);
        expect(allReviewsOfUser.at(0).title).toBe('Nah');
        expect(allReviewsOfUser.at(0).review_movie.title).toBe('Movie');
        expect(allReviewsOfUser.at(0).review_user.firstName).toBe('Isidora');
      });
    });
    describe('given user doesnt have any reviews', () => {
      it('should return 200 and empty array', async () => {
        let response = await request(app).get('/review/user/own/3');
        expect(response.statusCode).toBe(200);
        const reviews: Review[] = response.body.data;
        expect(reviews.length).toBe(0);
      });
    });
    describe('bad cases', () => {
      describe('given user id doesnt exist', () => {
        it('should return 404', async () => {
          let response = await request(app).get('/review/user/own/11');
          expect(response.statusCode).toBe(404);
        });
      });
    });
  });

  describe('getReviewsToMovie route', () => {
    describe('good case', () => {
      it('should return reviews for that movie and status 200', async () => {
        let response = await request(app).get('/review/movie/1');
        expect(response.statusCode).toBe(200);
        const allReviewsOfMovie: Review[] = response.body.data;
        // console.log(allReviewsOfMovie);
        expect(allReviewsOfMovie.length).toBe(2);
        expect(allReviewsOfMovie.at(0).title).toBe('My first review');
        expect(allReviewsOfMovie.at(0).review_movie.title).toBe('Movie');
        expect(allReviewsOfMovie.at(0).review_user.firstName).toBe('Kevin');
      });
    });
    describe('given no reviews for that movie exist', () => {
      it('should return 200 and empty array', async () => {
        let response = await request(app).get('/review/movie/3');
        expect(response.statusCode).toBe(200);
        const reviews: Review[] = response.body.data;
        expect(reviews.length).toBe(0);
      });
    });
    describe('bad cases', () => {
      describe('given movie id doesnt exist', () => {
        it('should return 404', async () => {
          let response = await request(app).get('/review/movie/11');
          expect(response.statusCode).toBe(404);
        });
      });
    });
  });

  describe('getUserFollowingReviewsSinceDate route', () => {
    describe('good case', () => {
      it('should return all reviews done by users that user is following and having been updated since the timestamp, ordered by last updated, and status 200', async () => {
        const date = new Date('2022-03-21');
        let response = await request(app).get(
          `/review/user/following/2/${date}`
        );
        expect(response.statusCode).toBe(200);
        const reviewsOfFollowersSinceTime: Review[] = response.body.data;
        expect(reviewsOfFollowersSinceTime.length).toBe(2);
        expect(reviewsOfFollowersSinceTime.at(0).title).toBe('My first review');
        expect(reviewsOfFollowersSinceTime.at(0).review_movie.title).toBe(
          'Movie'
        );
        expect(reviewsOfFollowersSinceTime.at(0).review_user.firstName).toBe(
          'Kevin'
        );
      });
    });
    describe('bad cases', () => {
      // bad case tests ausdenken je nachdem wie die route funktionieren soll -> wie mit 0 und falsch formatiert
      // Kevin - Würde sagen timestamp 0 oder in der Zukunft ist beides ok, macht zwar nicht viel Sinn, aber es gibt ja richtige Ergebnise für beide Fälle (alle bzw keine)
      // Id oder timestamp falsch formatiert sollte 500 sein.
      describe('given user id doesnt exist', () => {
        it('should return 404', async () => {
          let response = await request(app).get(
            '/review/user/following/11/2022-03-21'
          );
          expect(response.statusCode).toBe(404);
        });
      });
      describe('given timestamp is not a number', () => {
        it('should return 500', async () => {
          let response = await request(app).get(
            '/review/user/following/2/timestamp'
          );
          expect(response.statusCode).toBe(500);
        });
      });
    });
  });

  describe('getAllSinceTime route', () => {
    describe('good case', () => {
      it('should return all reviews since that time and status 200', async () => {
        let date = new Date('2022-03-22');
        let response = await request(app).get(`/review/time/${date}`);
        expect(response.statusCode).toBe(200);
        const reviewsSinceTime: Review[] = response.body.data;
        expect(reviewsSinceTime.length).toBe(3);
        expect(reviewsSinceTime.at(0).title).toBe('My first review');
        expect(reviewsSinceTime.at(0).review_movie.title).toBe('Movie');
        expect(reviewsSinceTime.at(0).review_user.firstName).toBe('Kevin');
      });
    });
    describe('given no reviews since that time exist', () => {
      it('should return 200 and empty array', async () => {
        let date = new Date('2022-03-24');
        let response = await request(app).get(`/review/time/${date}`);
        expect(response.statusCode).toBe(200);
        const reviewsSinceTime: Review[] = response.body.data;
        expect(reviewsSinceTime.length).toBe(0);
      });
    });
    describe('bad cases', () => {
      describe('given timestamp is not a number', () => {
        it('should return 500', async () => {
          let response = await request(app).get('/review/time/asffj');
          expect(response.statusCode).toBe(500);
        });
      });
    });
  });

  describe('updateReview route', () => {
    describe('good case', () => {
      it('should return the updated review and status 201', async () => {
        let review: Review = await Review.findOne({
          where: { reviewMovieMovieId: 2, reviewUserUserId: 2 },
        });
        review.title = 'New title';
        review.rating = 8;
        review.lastUpdated = new Date();
        let response = await request(app).put('/review').send(review);
        expect(response.statusCode).toBe(201);

        let allReviewsOrdered = await request(app).get('/review/all');
        const allReviews: Review[] = allReviewsOrdered.body.data;
        expect(allReviews.at(0).title).toBe('New title');
        expect(allReviews.at(0).rating).toBe(8);
        expect(allReviews.at(0).content).toBe('Pretty good');
        expect(allReviews.at(0).review_movie.movieId).toBe(2);
        expect(allReviews.at(0).review_user.userId).toBe(2);
      });
    });
    describe('bad cases', () => {
      describe('given user id doesnt exist', () => {
        it('should return 404', async () => {
          let review: Review = await Review.findOne({
            where: { reviewMovieMovieId: 1, reviewUserUserId: 1 },
          });
          review.reviewUserUserId = 11;
          let response = await request(app).put('/review/').send(review);
          expect(response.statusCode).toBe(404);
        });
      });
      describe('given movie id doesnt exist', () => {
        it('should return 404', async () => {
          let review: Review = await Review.findOne({
            where: { reviewMovieMovieId: 1, reviewUserUserId: 1 },
          });
          review.reviewMovieMovieId = 11;
          let response = await request(app).put('/review/').send(review);
          expect(response.statusCode).toBe(404);
        });
      });
    });
  });

  describe('postNewReview route', () => {
    describe('good case', () => {
      it('should return the new review and status 201', async () => {
        let review: Review = new Review();
        review.reviewUserUserId = 1;
        review.reviewMovieMovieId = 1;
        review.title = 'Liked';
        review.content = 'Was good';
        review.rating = 5;
        review.lastUpdated = new Date();

        let response = await request(app).post('/review/').send(review);
        expect(response.statusCode).toBe(201);
        expect(response.body.data.title).toBe('Liked');
      });
    });
    describe('bad cases', () => {
      describe('given user id doesnt exist', () => {
        it('should return 400', async () => {
          let review: Review = new Review();
          review.reviewUserUserId = 11;
          review.reviewMovieMovieId = 1;
          review.title = 'Liked';
          review.content = 'Was good';
          review.rating = 5;
          review.lastUpdated = new Date();

          let response = await request(app).post('/review/').send(review);
          expect(response.statusCode).toBe(404);
        });
      });
      describe('given movie id doesnt exist', () => {
        it('should return 400', async () => {
          let review: Review = new Review();
          review.reviewUserUserId = 1;
          review.reviewMovieMovieId = 11;
          review.title = 'Liked';
          review.content = 'Was good';
          review.rating = 5;
          review.lastUpdated = new Date();

          let response = await request(app).post('/review/').send(review);
          expect(response.statusCode).toBe(404);
        });
      });
      describe('given not all required information (no title)', () => {
        it('should return 500', async () => {
          // welche felder sind alles required? für jedes eigenen test
          // Kevin - In der Entität klasse kann man sehen was required ist. Alles war nicht die nullable annotation hat. (bei review ist aber glaub ich alles benötigt)
          // Glaube aber nicht, dass wir wirklich für jedes fehlende Feld einen eigenen Test brauchen. Aber wenn ihr Zeit habt, schadets auch nicht
          let noValidReview: Review = Review.create({
            reviewUserUserId: 3,
            reviewMovieMovieId: 1,
            content:'Was good',
            rating: 5,
            lastUpdated: new Date(),
          });

          let response = await request(app).post('/review/').send(noValidReview);
          expect(response.statusCode).toBe(500);
        });
      });
    });
  });

  describe('deleteReview route', () => {
    describe('good case', () => {
      it('should return nothing and status 204', async () => {
        let response = await request(app).delete('/review/2/1');
        expect(response.statusCode).toBe(204);
        let reviewsOfMovie = await request(app).get('/review/movie/1');
        expect(reviewsOfMovie.statusCode).toBe(200);
        const allReviewsOfMovie: Review[] = reviewsOfMovie.body.data;
        expect(allReviewsOfMovie.length).toBe(1);
        //User not exisiting after
      });
    });
    describe('bad cases', () => {
      describe('given user id doesnt exist', () => {
        it('should return 404', async () => {
          let response = await request(app).delete('/review/11/1');
          expect(response.statusCode).toBe(404);
        });
      });
      describe('given movie id doesnt exist', () => {
        it('should return 404', async () => {
          let response = await request(app).delete('/review/2/11');
          expect(response.statusCode).toBe(404);
        });
      });
      describe('given no review exists from that user for that movie', () => {
        it('should return 404', async () => {
          let response = await request(app).delete('/review/3/2');
          expect(response.statusCode).toBe(404);
        });
      });
    });
  });
});
