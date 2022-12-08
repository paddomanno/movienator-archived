import Movie from '../entity/movie';
import Review from '../entity/review';
import User from '../entity/user';

const expressReview = require('express');
const reviewRouter = expressReview.Router();

//TODO Routing implementieren

//Returns all reviews from the database, ordered by the last Updated value
reviewRouter.get('/all', async (req, res) => {
  try {
    const allReviews: Review[] = await Review.find({
      relations: { review_movie: true, review_user: true },
    });
    if (allReviews) {
      allReviews.sort(
        (a, b) => Number(a.lastUpdated) - Number(b.lastUpdated)
      );
      res.status(200).json({
        data: allReviews,
      });
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Gets the one specific review of that user to that movie
//TODO implement
reviewRouter.get('/one/:mId/:uId',async (req,res)=>{
  try {
    const requestedReview = await Review.findOne({
      where: {
        reviewMovieMovieId: parseInt(req.params.mId),
        reviewUserUserId: parseInt(req.params.uId),
      },
    });
    if (requestedReview) {
      res.status(204).json({
        data: requestedReview,
      });
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
})

//Gets all reviews to that movie, ordered by the last Updated value
reviewRouter.get('/movie/:id', async (req, res) => {
  try {
    const requestedMovie = await Movie.findOne({
      where: { movieId: parseInt(req.params.id) },
      relations: { reviews: true },
    });

    if (requestedMovie) {
      const reviews = requestedMovie.reviews.sort(
        (a, b) => Number(a.lastUpdated) - Number(b.lastUpdated)
      );
      res.status(200).json({
        data: reviews,
      });
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Gets all reviews done by that user, ordered by the last Updated value
reviewRouter.get('/user/own/:id', async (req, res) => {
  try {
    const requestedUser = await User.findOne({
      where: { userId: parseInt(req.params.id) },
      relations: { reviews: true },
    });

    if (requestedUser) {
      const reviews = requestedUser.reviews.sort(
        (a, b) => Number(a.lastUpdated) - Number(b.lastUpdated)
      );
      res.status(200).json({
        data: reviews,
      });
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
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
        'following.reviews.review_movie',
      ],
    });
    if (requestedUser) {
      const reviews = requestedUser.following.reduce(
        (reviews, followedUser) => [
          ...reviews,
          ...followedUser.reviews,
        ],
        []
      );
      reviews.sort(
        (a, b) => Number(a.lastUpdated) - Number(b.lastUpdated)
      );
      res.status(200).json({
        data: reviews,
      });
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Gets all reviews done by users that user is following and having been updated since the timestamp, ordered by last updated
// TODO: Send 404 when no reviews since the timestamp?
// TODO: Error handling (for example '0' as :time)
reviewRouter.get('/user/following/:id/:time', async (req, res) => {
  try {
    const timestamp : number = Date.parse(req.params.time);
    if (isNaN(timestamp)) {
      throw new Error('timestamp is NaN');
    }

    const requestedUser = await User.findOne({
      where: { userId: parseInt(req.params.id) },
      relations: [
        'following',
        'following.reviews',
        'following.reviews.review_user',
        'following.reviews.review_movie',
      ],
    });
    if (requestedUser) {
      const reviews = requestedUser.following.reduce(
        (reviews, followedUser) => [
          ...reviews,
          ...followedUser.reviews,
        ],
        []
      );
      const filteredReviews = reviews.filter((rev: Review) => {
        // console.log(
        //   `Comparing ${rev.lastUpdated.valueOf()} < ${timestamp}: ${
        //     rev.lastUpdated.valueOf() < timestamp
        //   }`
        // );
        return rev.lastUpdated.valueOf() < timestamp;
      });
      filteredReviews.sort(
        (a, b) => Number(a.lastUpdated) - Number(b.lastUpdated)
      );
      res.status(200).json({
        data: filteredReviews,
      });
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Gets all reviews that have been updated since the timestamp, ordered by last updated
// TODO: Send 404 when no reviews since the timestamp?
// TODO: Error handling (for example '0' as :time)
reviewRouter.get('/time/:time', async (req, res) => {
  try {
    const timestamp = Date.parse(req.params.time); // TODO: return error when timestamp is wrong format
    if (isNaN(timestamp)) {
      throw new Error('timestamp is NaN');
    }
    const allReviews: Review[] = await Review.find({
      relations: { review_movie: true, review_user: true },
    });
    if (allReviews) {
      const filteredReviews = allReviews.filter((rev: Review) => {
        // console.log(
        //   `Comparing ${rev.lastUpdated.valueOf()} < ${timestamp}: ${
        //     rev.lastUpdated.valueOf() < timestamp
        //   }`
        // );
        return rev.lastUpdated.valueOf() < timestamp;
      });
      filteredReviews.sort(
        (a, b) => Number(a.lastUpdated) - Number(b.lastUpdated)
      );
      res.status(200).json({
        data: filteredReviews,
      });
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Saves a new review
reviewRouter.post('/', async (req, res) => {
  try {
    let newReview: Review = req.body as Review; // TODO: not working lol
    /* is supposed to work with just user id and movie id
    example req body:
{
    "reviewMovieMovieId": 0,
    "reviewUserUserId": 1,
    "title": "NEW REVIEW 1",
    "content": "It was ok",
    "rating": 5
}
    */
    //TODO: Is working like this.
    await Review.save(newReview);
    newReview = await Review.findOne({
      where: {
        reviewMovieMovieId: newReview.reviewMovieMovieId,
        reviewUserUserId: newReview.reviewUserUserId,
      },
      relations: { review_movie: true, review_user: true },
    });
    res.status(201).json({
      data: newReview,
    });
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Update the specific review
//Make sure to NOT update the primary keys or relations
reviewRouter.put('/', async (req, res) => {
  try {
    let updatedReview = req.body as Review;
    const requestedReview: Review = await Review.findOne({
      where: {
        reviewMovieMovieId: updatedReview.reviewMovieMovieId,
        reviewUserUserId: updatedReview.reviewUserUserId,
      },
    });
    if (requestedReview) {
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

      res.status(201).json({
        data: requestedReview,
      });
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
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
      res.status(204).json();
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

module.exports = reviewRouter;
