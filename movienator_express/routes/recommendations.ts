import Movie from '../entity/movie';
import Recommendation from '../entity/recommendation';
import User from '../entity/user';

const expressRecommendation = require('express');
const recommendationRouter = expressRecommendation.Router();

//Get a single recommendation
recommendationRouter.get('/one/:aId/:bId/:mId', async (req, res) => {
  try {
    if (
      isNaN(+req.params.aId) ||
      isNaN(+req.params.bId) ||
      isNaN(+req.params.mId)
    ) {
      throw 'Not a valid number';
    }
    const singleRecommendation: Recommendation = await Recommendation.findOne({
      where: {
        sendingUserUserId: parseInt(req.params.aId),
        receivingUserUserId: parseInt(req.params.bId),
        recommendedMovieMovieId: parseInt(req.params.mId),
      },
      relations: [
        'sendingUser',
        'sendingUser.profileImage',
        'receivingUser',
        'receivingUser.profileImage',
        'recommendedMovie',
      ],
    });
    if (singleRecommendation != null) {
      res.status(200).json({
        data: singleRecommendation,
      });
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Get all recommendations for a user
recommendationRouter.get('/for/:Id', async (req, res) => {
  try {
    if (isNaN(+req.params.Id)) {
      throw 'Not a valid number';
    }
    const resRecommendations: Recommendation[] = await Recommendation.find({
      where: { receivingUserUserId: parseInt(req.params.Id) },
      relations: [
        'sendingUser',
        'sendingUser.profileImage',
        'receivingUser',
        'receivingUser.profileImage',
        'recommendedMovie',
      ],
    });
    resRecommendations.sort((a, b) =>
      a.recommendedMovie.title.localeCompare(b.recommendedMovie.title)
    );
    res.status(200).json({
      data: resRecommendations,
    });
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Get all recommendations from a user
recommendationRouter.get('/from/:Id', async (req, res) => {
  try {
    if (isNaN(+req.params.Id)) {
      throw 'Not a valid number';
    }
    const resRecommendations: Recommendation[] = await Recommendation.find({
      where: { sendingUserUserId: parseInt(req.params.Id) },
      relations: [
        'sendingUser',
        'sendingUser.profileImage',
        'receivingUser',
        'receivingUser.profileImage',
        'recommendedMovie',
      ],
    });
    resRecommendations.sort((a, b) =>
      a.recommendedMovie.title.localeCompare(b.recommendedMovie.title)
    );
    res.status(200).json({
      data: resRecommendations,
    });
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Get all recommendations for a user for a single movie
recommendationRouter.get('/forMovie/:uId/:mId', async (req, res) => {
  try {
    if (isNaN(+req.params.uId) || isNaN(+req.params.mId)) {
      throw 'Not a valid number';
    }
    const resRecommendations: Recommendation[] = await Recommendation.find({
      where: {
        receivingUserUserId: parseInt(req.params.uId),
        recommendedMovieMovieId: parseInt(req.params.mId),
      },
      relations: [
        'sendingUser',
        'sendingUser.profileImage',
        'receivingUser',
        'receivingUser.profileImage',
        'recommendedMovie',
      ],
    });
    resRecommendations.sort((a, b) =>
      a.recommendedMovie.title.localeCompare(b.recommendedMovie.title)
    );
    res.status(200).json({
      data: resRecommendations,
    });
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Insert recommendation
recommendationRouter.post('/', async (req, res) => {
  try {
    let newRecommendation: Recommendation = req.body as Recommendation;
    let userA: User = await User.findOne({
      where: { userId: newRecommendation.receivingUserUserId },
    });
    let userB: User = await User.findOne({
      where: { userId: newRecommendation.sendingUserUserId },
    });
    let movie: Movie = await Movie.findOne({
      where: { movieId: newRecommendation.recommendedMovieMovieId },
    });
    if (userA != null && userB != null && movie != null) {
      await Recommendation.save(newRecommendation);
      res.status(201).json();
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Update recommendation text
recommendationRouter.put('/', async (req, res) => {
  try {
    let updateRecommendation: Recommendation = req.body as Recommendation;
    let resRecommendation = await Recommendation.findOne({
      where: {
        receivingUserUserId: updateRecommendation.receivingUserUserId,
        sendingUserUserId: updateRecommendation.sendingUserUserId,
        recommendedMovieMovieId: updateRecommendation.recommendedMovieMovieId,
      },
    });
    if (resRecommendation != null) {
      resRecommendation.message = updateRecommendation.message;
      await resRecommendation.save();
      res.status(201).json();
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Delete recommendation
recommendationRouter.delete('/:aId/:bId/:mId', async (req, res) => {
  try {
    if (
      isNaN(+req.params.aId) ||
      isNaN(+req.params.bId) ||
      isNaN(+req.params.mId)
    ) {
      throw 'Not a valid number';
    }
    const singleRecommendation: Recommendation = await Recommendation.findOne({
      where: {
        sendingUserUserId: parseInt(req.params.aId),
        receivingUserUserId: parseInt(req.params.bId),
        recommendedMovieMovieId: parseInt(req.params.mId),
      },
    });
    if (singleRecommendation != null) {
      await singleRecommendation.remove();
      res.status(204).json();
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

module.exports = recommendationRouter;
