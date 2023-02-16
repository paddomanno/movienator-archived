import Movie from '../entity/movie';
import Recommendation from '../entity/recommendation';
import User from '../entity/user';

import expressRecommendation from 'express';
const recommendationRouter = expressRecommendation.Router();

//Get a single recommendation
//sent by user with id aId
//sent to user with id bId
//recommending movie with id mId
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
      return res.status(200).json({
        data: singleRecommendation,
      });
    } else {
      return res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json();
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
    return res.status(200).json({
      data: resRecommendations,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Get all recommendations sent by a user
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
    return res.status(200).json({
      data: resRecommendations,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
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
    return res.status(200).json({
      data: resRecommendations,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Insert recommendation
recommendationRouter.post('/', async (req, res) => {
  try {
    const newRecommendation: Recommendation = req.body as Recommendation;
    const oldRec: Recommendation = await Recommendation.findOne({
      where: {
        sendingUserUserId: newRecommendation.sendingUserUserId,
        receivingUserUserId: newRecommendation.receivingUserUserId,
        recommendedMovieMovieId: newRecommendation.recommendedMovieMovieId,
      },
    });
    if (oldRec != null) {
      // This movie was already recommended to that user by that user
      // so just update the message text
      oldRec.message = newRecommendation.message;
      await oldRec.save();
      return res.status(201).json();
    } else {
      // Check if users and movie exist
      const userA: User = await User.findOne({
        where: { userId: newRecommendation.receivingUserUserId },
      });
      const userB: User = await User.findOne({
        where: { userId: newRecommendation.sendingUserUserId },
      });
      const movie: Movie = await Movie.findOne({
        where: { movieId: newRecommendation.recommendedMovieMovieId },
      });
      if (userA && userB && movie) {
        await Recommendation.save(newRecommendation);
        return res.status(201).json();
      } else {
        return res.status(404).json();
      }
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Update recommendation text
recommendationRouter.put('/', async (req, res) => {
  try {
    const updateRecommendation: Recommendation = req.body as Recommendation;
    const resRecommendation = await Recommendation.findOne({
      where: {
        receivingUserUserId: updateRecommendation.receivingUserUserId,
        sendingUserUserId: updateRecommendation.sendingUserUserId,
        recommendedMovieMovieId: updateRecommendation.recommendedMovieMovieId,
      },
    });
    if (resRecommendation != null) {
      resRecommendation.message = updateRecommendation.message;
      await resRecommendation.save();
      return res.status(201).json();
    } else {
      return res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json();
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
      return res.status(204).json();
    } else {
      return res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

export default recommendationRouter;
