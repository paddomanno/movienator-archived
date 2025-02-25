import Movie from '../entity/movie';
import WatchProvider from '../entity/watchProvider';

import expressWatchProvider from 'express';
const watchProviderRoutes = expressWatchProvider.Router();

//Returns all the watchproviders there currently are in the database
//Movies array is filled
watchProviderRoutes.get('/all', async (req, res) => {
  try {
    const allWatchProviders: WatchProvider[] = await WatchProvider.find({
      relations: { movies: true },
    });
    if (allWatchProviders) {
      allWatchProviders.sort((a, b) =>
        a.providerName.localeCompare(b.providerName)
      );
    }
    return res.status(200).json({
      data: allWatchProviders,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

// Gets all providers for a movie with the specific movieId
watchProviderRoutes.get('/movie/:mID', async (req, res) => {
  try {
    if (isNaN(+req.params.mID)) {
      throw `${req.params.mID} is not a valid number`;
    }
    const oneMovie: Movie = await Movie.findOne({
      where: { movieId: parseInt(req.params.mID) },
      relations: { watchProviders: true },
    });
    if (!oneMovie) {
      return res.status(404).json();
    }
    const movieProviders: WatchProvider[] = oneMovie.watchProviders;
    movieProviders.sort((a, b) => a.providerName.localeCompare(b.providerName));

    return res.status(200).json({
      data: movieProviders,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

export default watchProviderRoutes;
