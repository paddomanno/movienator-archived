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
  try {
    await TestDatabaseManager.getInstance().connectTestDatabase();
    await TestDatabaseManager.getInstance().resetTestDatabase();

    await createTestData();
  } catch (error) {
    console.log(error);
  }

  //console.log("Starting Review Tests")
});

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

  let user: User = new User();
  user.firstName = 'Kevin';
  user.lastName = 'Hasse';
  user.userName = 'keha';
  user.password = 'root';
  user.birthday = new Date();
  await user.save();

  let user2: User = new User();
  user2.firstName = 'Isidora';
  user2.lastName = 'Jankovic';
  user2.userName = 'isij';
  user2.password = 'root';
  user2.birthday = new Date();
  await user2.save();

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
}

afterAll(async () => {
  await TestDatabaseManager.getInstance().resetTestDatabase();
  //console.log("Finishing Review Test")
});

describe('ReviewTests', () => {
  describe('getAllReviews route', () => {
    describe('good case (reviews exist)', () => {
      it('should return the reviews sorted by newest and status 200', async () => {
        let response = await request(app).get('/review/all');
        expect(response.statusCode).toBe(200);
        const allReviews: Review[] = response.body.data;
        expect(allReviews.length).toBe(3);
        expect(allReviews.at(0).title).toBe('My first review');
        expect(allReviews.at(0).review_movie.title).toBe('Movie');
        expect(allReviews.at(0).review_user.firstName).toBe('Kevin');
      });
    });
    describe('bad cases', () => {
      describe('given no reviews exist', () => {
        // TODO: wie testen mit leerer datenbank? wenn wir hier die db leeren
        // funktionieren die tests danach nicht mehr, wenn beforeEach/afterEach statt
        // beforeAll/afterAll benutzt wird geht nur der erste Test
        // it('should return 404', async () => {
        //   await TestDatabaseManager.getInstance().resetTestDatabase();
        //   let response = await request(app).get('/review/all');
        //   expect(response.statusCode).toBe(404);
        //   const allReviews: Review[] = response.body.data;
        //   expect(allReviews.length).toBe(0);
        // });
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
        it('should return 404', () => {
          // TODO: implement
        });
      });
      describe('given movie id doesnt exist', () => {
        it('should return 404', () => {
          // TODO: implement
        });
      });
    });
  });

  describe('getUserFollowingReviews route', () => {
    describe('good case', () => {
      it('should return all reviews done by users that user is following, ordered by last updated, and status 200', async () => {
        // TODO: implement
        //Correct Order
        //User and Movie are filled
      });
    });
    describe('bad cases', () => {
      describe('given user id doesnt exist', () => {
        it('should return 404', () => {
          // TODO: implement
        });
      });
      describe('given user doesnt follow anyone', () => {
        it('should return 404', () => {
          // TODO: implement
        });
      });
      describe('given no reviews made by followed users', () => {
        it('should return 404', () => {
          // TODO: implement
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
        expect(allReviewsOfUser.at(0).review_movie.title).toBe(
          'Movie'
        );
        expect(allReviewsOfUser.at(0).review_user.firstName).toBe(
          'Isidora'
        );
      });
    });
    describe('bad cases', () => {
      describe('given user id doesnt exist', () => {
        it('should return 404', () => {
          // TODO: implement
        });
      });
      describe('given user doesnt have any reviews', () => {
        it('should return 404', () => {
          // TODO: implement
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
        expect(allReviewsOfMovie.at(0).review_movie.title).toBe(
          'Movie'
        );
        expect(allReviewsOfMovie.at(0).review_user.firstName).toBe(
          'Kevin'
        );
      });
    });
    describe('bad cases', () => {
      describe('given movie id doesnt exist', () => {
        it('should return 404', () => {
          // TODO: implement
        });
      });
      describe('given no reviews for that movie exist', () => {
        it('should return 404', () => {
          // TODO: implement
        });
      });
    });
  });

  describe('getUserFollowingReviewsSinceDate route', () => {
    describe('good case', () => {
      it('should return all reviews done by users that user is following and having been updated since the timestamp, ordered by last updated, and status 200', async () => {
        // TODO: abklaeren TODOs in route bevor tests gemacht werden
        //Filter Correct
        //Correct Order
        //User and Movie are filled
      });
    });
    describe('bad cases', () => {
      // TODO: bad case tests ausdenken je nachdem wie die route funktionieren soll
      describe('given movie id doesnt exist', () => {
        it('should return 404', () => {
          // TODO: implement
        });
      });
      describe('given no reviews for that movie exist', () => {
        it('should return 404', () => {
          // TODO: implement
        });
      });
    });
  });
  describe('getAllSinceTime route', () => {
    describe('good case', () => {
      it('should return all reviews since that time and status 200', async () => {
        // TODO: implement
        //Filter Correct
        //Correct Order
        //User and Movie are filled
      });
    });
    describe('bad cases', () => {
      describe('given no reviews since that time exist', () => {
        it('should return 404', () => {
          // TODO: implement
        });
      });
      describe('given timestamp is wrong format', () => {
        it('should return 400', () => {
          // TODO: 400 richtig?
          // TODO: implement
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

        let response = await request(app)
          .post('/review/')
          .send(review);
        expect(response.statusCode).toBe(201);
        expect(response.body.data.title).toBe('Liked');
        //201 res code
        //Check values after
      });
    });
    describe('bad cases', () => {
      describe('given user id doesnt exist', () => {
        it('should return 400', () => {
          // TODO: implement
        });
      });
      describe('given movie id doesnt exist', () => {
        it('should return 400', () => {
          // TODO: implement
        });
      });
      describe('given ...', () => {
        it('should return 404', () => {
          // TODO: welche felder sind alles required? für jedes eigenen test
        });
      });
    });
  });

  describe('updateReview route', () => {
    describe('good case', () => {
      it('should return the updated review and status 201', async () => {
        let review: Review = await Review.findOne({
          where: { reviewMovieMovieId: 1, reviewUserUserId: 1 },
        });
        review.rating = 8;
        let response = await request(app).put('/review').send(review);
        expect(response.statusCode).toBe(201);

        // TODO: implement
        //Correct Order

        //Check values after
      });
    });
    describe('bad cases', () => {
      describe('given user id doesnt exist', () => {
        it('should return 400', () => {
          // TODO: implement
        });
      });
      describe('given movie id doesnt exist', () => {
        it('should return 400', () => {
          // TODO: implement
        });
      });
      describe('given ...', () => {
        it('should return 404', () => {
          // TODO: welche felder sind alles required? für jedes eigenen test
        });
      });
    });
  });
  describe('deleteReview route', () => {
    describe('good case', () => {
      it('should return nothing and status 204', async () => {
        let response = await request(app).delete('/review/2/1');
        expect(response.statusCode).toBe(204);
        let reviewsOfMovie = await request(app).get(
          '/review/movie/1'
        );
        expect(reviewsOfMovie.statusCode).toBe(200);
        const allReviewsOfMovie: Review[] = response.body.data;
        // expect(allReviewsOfMovie.length).toBe(1);
        //User not exisiting after
      });
    });
    describe('bad cases', () => {
      describe('given user id doesnt exist', () => {
        it('should return 400', () => {
          // TODO: implement
        });
      });
      describe('given movie id doesnt exist', () => {
        it('should return 400', () => {
          // TODO: implement
        });
      });
      describe('given no review exists from that user for that movie', () => {
        it('should return 404', () => {
          // TODO: 404 richtig?
          // TODO: implement
        });
      });
    });
  });
});
