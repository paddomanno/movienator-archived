import Movie from '../entity/movie';
import Review from '../entity/review';
import User from '../entity/user';

import expressReview from 'express';
const reviewRouter = expressReview.Router();

//Returns all reviews from the database, ordered by the last Updated value
reviewRouter.get('/all', async (req, res) => {
  try {
    const allReviews: Review[] = await Review.find({
      relations: ['review_movie', 'review_user', 'review_user.profileImage'],
    });
    if (allReviews) {
      allReviews.sort((a, b) => Number(b.lastUpdated) - Number(a.lastUpdated));
      return res.status(200).json({
        data: allReviews,
      });
    } else {
      return res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Gets the one specific review of that user to that movie
reviewRouter.get('/one/:mId/:uId', async (req, res) => {
  try {
    const requestedReview: Review = await Review.findOne({
      where: {
        reviewMovieMovieId: parseInt(req.params.mId),
        reviewUserUserId: parseInt(req.params.uId),
      },
      relations: ['review_movie', 'review_user', 'review_user.profileImage'],
    });

    if (requestedReview) {
      return res.status(200).json({
        data: requestedReview,
      });
    } else {
      return res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Gets all reviews to that movie, ordered by the last updated value
reviewRouter.get('/movie/:id', async (req, res) => {
  try {
    const requestedMovie = await Movie.findOne({
      where: { movieId: parseInt(req.params.id) },
      relations: [
        'reviews',
        'reviews.review_movie',
        'reviews.review_user',
        'reviews.review_user.profileImage',
      ],
    });

    if (!requestedMovie) {
      return res.status(404).json();
    }
    const reviews = requestedMovie.reviews.sort(
      (a, b) => Number(b.lastUpdated) - Number(a.lastUpdated)
    );
    return res.status(200).json({
      data: reviews,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Gets all reviews done by that user, ordered by the last updated value
reviewRouter.get('/user/own/:id', async (req, res) => {
  try {
    const requestedUser = await User.findOne({
      where: { userId: parseInt(req.params.id) },
      relations: [
        'reviews',
        'reviews.review_movie',
        'reviews.review_user',
        'reviews.review_user.profileImage',
      ],
    });
    if (!requestedUser) {
      return res.status(404).json();
    }
    const reviews = requestedUser.reviews.sort(
      (a, b) => Number(b.lastUpdated) - Number(a.lastUpdated)
    );
    return res.status(200).json({
      data: reviews,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Gets all reviews done by users that user is following, ordered by last updated
reviewRouter.get('/user/following/:id', async (req, res) => {
  try {
    const requestedUser = await User.findOne({
      where: { userId: parseInt(req.params.id) },
      relations: [
        'following',
        'following.reviews',
        'following.reviews.review_user',
        'following.reviews.review_user.profileImage',
        'following.reviews.review_movie',
      ],
    });
    if (!requestedUser) {
      return res.status(404).json();
    }
    const reviews = requestedUser.following.reduce(
      (reviews, followedUser) => [...reviews, ...followedUser.reviews],
      []
    );
    reviews.sort((a, b) => Number(b.lastUpdated) - Number(a.lastUpdated));
    return res.status(200).json({
      data: reviews,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Gets all reviews done by users that user is following to a specific movie, ordered by last updated
reviewRouter.get('/user/following/:uId/review/:mId', async (req, res) => {
  try {
    const requestedUser = await User.findOne({
      where: { userId: parseInt(req.params.uId) },
      relations: [
        'following',
        'following.reviews',
        'following.reviews.review_user',
        'following.reviews.review_user.profileImage',
        'following.reviews.review_movie',
      ],
    });
    if (!requestedUser) {
      return res.status(404).json();
    }
    let reviews: Review[] = requestedUser.following.reduce(
      (reviews, followedUser) => [...reviews, ...followedUser.reviews],
      []
    );
    reviews = reviews.filter((review) => {
      return review.review_movie.movieId == parseInt(req.params.mId);
    });
    reviews.sort((a, b) => Number(b.lastUpdated) - Number(a.lastUpdated));
    return res.status(200).json({
      data: reviews,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});
//Gets Reviews to a movie from people the user is NOT following
reviewRouter.get('/user/notFollowing/:uId/review/:mId', async (req, res) => {
  try {
    const requestedUser = await User.findOne({
      where: { userId: parseInt(req.params.uId) },
      relations: { following: true },
    });
    if (!requestedUser) {
      return res.status(404).json();
    }
    const allReviewsToMovie: Review[] = await Review.find({
      where: { reviewMovieMovieId: parseInt(req.params.mId) },
      relations: ['review_movie', 'review_user', 'review_user.profileImage'],
    });
    let resReviews: Review[] = [];
    resReviews = allReviewsToMovie.filter((review) => {
      return !requestedUser.following.some((user) => {
        return (
          user.userId === review.reviewUserUserId ||
          requestedUser.userId === review.reviewUserUserId
        );
      });
    });
    resReviews.sort((a, b) => Number(b.lastUpdated) - Number(a.lastUpdated));
    return res.status(200).json({
      data: resReviews,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Gets all reviews done by users that user is following and having been updated since the timestamp, ordered by last updated
reviewRouter.get('/user/following/:id/:time', async (req, res) => {
  try {
    const timestamp: number = Date.parse(req.params.time);
    if (isNaN(timestamp)) {
      throw new Error('timestamp is NaN');
    }

    const requestedUser = await User.findOne({
      where: { userId: parseInt(req.params.id) },
      relations: [
        'following',
        'following.reviews',
        'following.reviews.review_user',
        'following.reviews.review_user.profileImage',
        'following.reviews.review_movie',
      ],
    });
    if (!requestedUser) {
      return res.status(404).json();
    }
    const reviews = requestedUser.following.reduce(
      (reviews, followedUser) => [...reviews, ...followedUser.reviews],
      []
    );
    const filteredReviews = reviews.filter((rev: Review) => {
      return rev.lastUpdated.valueOf() >= timestamp;
    });
    filteredReviews.sort(
      (a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime()
    );
    return res.status(200).json({
      data: filteredReviews,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Gets all reviews that have been updated since the timestamp, ordered by last updated
reviewRouter.get('/time/:time', async (req, res) => {
  try {
    const timestamp = new Date(req.params.time);
    if (isNaN(timestamp.getTime())) {
      throw new Error('timestamp is NaN');
    }
    const allReviews: Review[] = await Review.find({
      relations: ['review_movie', 'review_user', 'review_user.profileImage'],
    });
    if (!allReviews) {
      return res.status(404).json();
    }
    const filteredReviews = allReviews.filter((rev: Review) => {
      console.log(
        `Comparing ${rev.lastUpdated.getTime()} < ${timestamp.getTime()}: ${
          rev.lastUpdated.getTime() >= timestamp.getTime()
        }`
      );
      return rev.lastUpdated.getTime() >= timestamp.getTime();
    });
    filteredReviews.sort(
      (a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime()
    );
    return res.status(200).json({
      data: filteredReviews,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Saves a new review
reviewRouter.post('/', async (req, res) => {
  try {
    let newReview: Review = req.body as Review;

    // check if User and Movie exist
    const userForReview: User = await User.findOne({
      where: { userId: newReview.reviewUserUserId },
    });

    const movieForReview: Movie = await Movie.findOne({
      where: { movieId: newReview.reviewMovieMovieId },
    });

    if (!userForReview || !movieForReview) {
      return res.status(404).json();
    }
    await Review.save(newReview);
    newReview = await Review.findOne({
      where: {
        reviewMovieMovieId: newReview.reviewMovieMovieId,
        reviewUserUserId: newReview.reviewUserUserId,
      },
      relations: { review_movie: true, review_user: true },
    });
    return res.status(201).json({
      data: newReview,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Update the specific review
//Make sure to NOT update the primary keys or relations
reviewRouter.put('/', async (req, res) => {
  try {
    const updatedReview = req.body as Review;

    const requestedReview: Review = await Review.findOne({
      where: {
        reviewMovieMovieId: updatedReview.reviewMovieMovieId,
        reviewUserUserId: updatedReview.reviewUserUserId,
      },
    });
    if (!requestedReview) {
      return res.status(404).json();
    }
    // requestedReview.lastUpdated = new Date()
    Object.keys(updatedReview).forEach((key) => {
      if (
        key != 'reviewMovieMovieId' &&
        key != 'reviewUserUserId' &&
        key != 'review_user' &&
        key != 'review_movie'
      ) {
        requestedReview[key] = req.body[key];
      }
    });
    await requestedReview.save();

    return res.status(201).json({
      data: requestedReview,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Delete the review with that userId and movieId
reviewRouter.delete('/:uId/:mId', async (req, res) => {
  try {
    const requestedReview = await Review.findOne({
      where: {
        reviewMovieMovieId: parseInt(req.params.mId),
        reviewUserUserId: parseInt(req.params.uId),
      },
    });
    if (requestedReview) {
      await requestedReview.remove();
      return res.status(204).json();
    } else {
      return res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

export default reviewRouter;
