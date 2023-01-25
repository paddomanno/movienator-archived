import Actor from '../entity/actor';
import Movie from '../entity/movie';

import expressActor from'express';
const actorRouter = expressActor.Router();

//Gets all actors from the database
actorRouter.get('/all', async (req, res) => {
  try {
    const allActors: Actor[] = await Actor.find({
      relations: { movies: true },
    });
    if (allActors) {
      allActors.sort((a, b) => a.name.localeCompare(b.name));
      res.status(200).json({
        data: allActors,
      });
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Gets one actor by his id
actorRouter.get('/one/:id', async (req, res) => {
  try {
    const requestedActor = await Actor.findOne({
      where: { actorId: parseInt(req.params.id) },
      relations: { movies: true },
    });
    if (requestedActor) {
      res.status(200).json({
        data: requestedActor,
      });
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Gets all the actors to the movie with that id
actorRouter.get('/movie/:id', async (req, res) => {
  try {
    const movie: Movie = await Movie.findOne({
      where: { movieId: parseInt(req.params.id) },
      relations: ['actors', 'actors.movies'],
    });

    if (movie) {
      const allActorsFromMovie: Actor[] = movie.actors;
      allActorsFromMovie.sort((a, b) => a.name.localeCompare(b.name));
      res.status(200).json({
        data: allActorsFromMovie,
      });
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Updates the actor sent in the body
//Make sure to NOT update the primary keys or relations
// TODO: 'We shouldnt use this' ??
actorRouter.put('/', async (req, res) => {
  try {
    const updatedActor: Actor = req.body as Actor;
    const requestedActor: Actor = await Actor.findOne({
      where: { actorId: updatedActor.actorId },
    });
    if (requestedActor) {
      Object.keys(updatedActor).forEach((key) => {
        if (key != 'actorId' && key != 'movies') {
          requestedActor[key] = req.body[key];
        }
      });
      await requestedActor.save();

      res.status(201).json({
        data: requestedActor,
      });
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Deletes the actor with that id
actorRouter.delete('/:id', async (req, res) => {
  try {
    const requestedActor = await Actor.findOne({
      where: { actorId: parseInt(req.params.id) },
    });
    if (requestedActor) {
      await requestedActor.remove();
      res.status(204).json();
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

export default actorRouter;
