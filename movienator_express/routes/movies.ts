import Movie from '../entity/movie';
import User from '../entity/user';
import Actor from '../entity/actor';
import { Between, ILike, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import Genre from '../entity/genre';
import Review from '../entity/review';

import expressMovie from 'express';
const movieRouter = expressMovie.Router();

//Get all the movies from the database
movieRouter.get('/all', async (req, res) => {
  try {
    const allMovies: Movie[] = await Movie.find({
      relations: {
        actors: true,
        reviews: true,
        genres: true,
        watchProviders: true,
      },
    });
    allMovies.sort((a, b) => a.title.localeCompare(b.title));
    return res.status(200).json({
      data: allMovies,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

// Get one movie by its id
movieRouter.get('/one/:id', async (req, res) => {
  try {
    if (isNaN(+req.params.id)) {
      throw `${req.params.id} is not a valid number`;
    }
    const oneMovie: Movie = await Movie.findOne({
      where: { movieId: parseInt(req.params.id) },
      relations: {
        actors: true,
        reviews: true,
        genres: true,
        watchProviders: true,
      },
    });
    if (oneMovie) {
      return res.status(200).json({
        data: oneMovie,
      });
    } else {
      return res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Gets all the movies that actor played in
//Better use the extern Api for this
movieRouter.get('/actor/:id', async (req, res) => {
  try {
    if (isNaN(+req.params.id)) {
      throw `${req.params.id} is not a valid number`;
    }
    const actor: Actor = await Actor.findOne({
      where: { actorId: parseInt(req.params.id) },
      relations: ['movies', 'movies.reviews', 'movies.actors', 'movies.genres'],
    });
    if (actor != null) {
      const actorMovies: Movie[] = actor.movies;
      actorMovies.sort((a, b) => a.title.localeCompare(b.title));
      return res.status(200).json({
        data: actorMovies,
      });
    } else {
      return res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Gets all the movies that user has reviewed
movieRouter.get('/user/:id', async (req, res) => {
  try {
    if (isNaN(+req.params.id)) {
      throw `${req.params.id} is not a valid number`;
    }
    const user: User = await User.findOne({
      where: { userId: parseInt(req.params.id) },
      relations: [
        'reviews',
        'reviews.review_movie',
        'reviews.review_movie.reviews',
        'reviews.review_movie.actors',
        'reviews.review_movie.genres',
        'reviews.review_movie.watchProviders',
      ],
    });

    if (user == null) {
      return res.status(404).json();
    }

    const userMovies: Movie[] = [];
    user.reviews.forEach((review) => {
      userMovies.push(review.review_movie);
    });
    userMovies.sort((a, b) => a.title.localeCompare(b.title));
    return res.status(200).json({
      data: userMovies,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Gets all the movies that are on the watchlist of that user
movieRouter.get('/watchlist/:uId', async (req, res) => {
  try {
    if (isNaN(+req.params.uId)) {
      throw `${req.params.uId} is not a valid number`;
    }
    const user: User = await User.findOne({
      where: { userId: parseInt(req.params.uId) },
      relations: [
        'watchlist',
        'watchlist.actors',
        'watchlist.reviews',
        'watchlist.genres',
        'watchlist.watchProviders',
      ],
    });
    if (!user) {
      return res.status(404).json();
    }
    const userWatchlist: Movie[] = user.watchlist;
    userWatchlist.sort((a, b) => a.title.localeCompare(b.title));
    return res.status(200).json({
      data: userWatchlist,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Gets all movies with a min time
movieRouter.get('/time/min/:min', async (req, res) => {
  try {
    const min: number = parseInt(req.params.min);
    if (min <= 0 || isNaN(min)) {
      throw `${req.params.min} is not a valid number`;
    }
    const movies: Movie[] = await Movie.find({
      where: {
        lengthMinutes: MoreThanOrEqual(min),
      },
      relations: {
        reviews: true,
        actors: true,
        genres: true,
        watchProviders: true,
      },
    });
    movies.sort((a, b) => a.title.localeCompare(b.title));
    return res.status(200).json({
      data: movies,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Gets all movies with a max time
movieRouter.get('/time/max/:max', async (req, res) => {
  try {
    const max: number = parseInt(req.params.max);
    if (max <= 0 || isNaN(max)) {
      throw `${req.params.max} is not a valid number`;
    }
    const movies: Movie[] = await Movie.find({
      where: {
        lengthMinutes: LessThanOrEqual(max),
      },
      relations: {
        reviews: true,
        actors: true,
        genres: true,
        watchProviders: true,
      },
    });
    movies.sort((a, b) => a.title.localeCompare(b.title));
    return res.status(200).json({
      data: movies,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Gets all movies released in this time span
movieRouter.get('/date/:min/:max', async (req, res) => {
  try {
    const dateMin: Date = new Date(req.params.min);
    const dateMax: Date = new Date(req.params.max);
    if (
      isNaN(dateMin.getTime()) ||
      isNaN(dateMax.getTime()) ||
      dateMax.getTime() < dateMin.getTime()
    ) {
      throw 'Not a valid data range';
    }
    const movies: Movie[] = await Movie.find({
      where: {
        releaseDate: Between<Date>(dateMin, dateMax),
      },
      relations: {
        reviews: true,
        actors: true,
        genres: true,
        watchProviders: true,
      },
    });
    movies.sort((a, b) => a.title.localeCompare(b.title));
    return res.status(200).json({
      data: movies,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Gets all movies where the name matches the searched word
movieRouter.get('/name/:word', async (req, res) => {
  try {
    const movies: Movie[] = await Movie.find({
      where: { title: ILike(`%${req.params.word}%`) },
      relations: {
        reviews: true,
        actors: true,
        genres: true,
        watchProviders: true,
      },
    });
    movies.sort((a, b) => a.title.localeCompare(b.title));
    return res.status(200).json({
      data: movies,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Gets all movies with a min average rating of x
movieRouter.get('/rating/:min', async (req, res) => {
  try {
    if (isNaN(+req.params.min) || parseInt(req.params.min) < 0) {
      throw 'Not a valid rating';
    }
    const movies: Movie[] = await Movie.find({
      relations: {
        reviews: true,
        actors: true,
        genres: true,
        watchProviders: true,
      },
    });
    const minMovies: Movie[] = movies.filter((movie) => {
      let numReviews = 0;
      let sumReviews = 0;
      movie.reviews.forEach((review) => {
        sumReviews += review.rating;
        numReviews++;
      });
      return sumReviews / numReviews > parseInt(req.params.min);
    });
    minMovies.sort((a, b) => a.title.localeCompare(b.title));
    return res.status(200).json({
      data: minMovies,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Gets all movies to that genre
//Genre can either be the genres name or its id
movieRouter.get('/genre/:genre', async (req, res) => {
  try {
    let genre: Genre;
    if (isNaN(+req.params.genre)) {
      // Get movies by genre name
      genre = await Genre.findOne({
        where: { genreName: req.params.genre },
        relations: [
          'movies',
          'movies.genres',
          'movies.actors',
          'movies.reviews',
        ],
      });
    } else {
      // Get movies by genre id
      genre = await Genre.findOne({
        where: { genreId: parseInt(req.params.genre) },
        relations: [
          'movies',
          'movies.genres',
          'movies.actors',
          'movies.reviews',
        ],
      });
    }
    if (genre) {
      // Return the movies
      const movies: Movie[] = genre.movies;
      movies.sort((a, b) => a.title.localeCompare(b.title));
      return res.status(200).json({
        data: movies,
      });
    } else {
      return res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Gets all movies than the two user both have on their watchlist
movieRouter.get('/mutual/watchlist/:aId/:bId', async (req, res) => {
  try {
    if (isNaN(+req.params.aId) || isNaN(+req.params.bId)) {
      throw `${req.params.aId} or ${req.params.bId} Not a valid number`;
    }
    const userA = await User.findOne({
      where: { userId: parseInt(req.params.aId) },
      relations: [
        'watchlist',
        'watchlist.actors',
        'watchlist.reviews',
        'watchlist.genres',
        'watchlist.watchProviders',
      ],
    });
    const userB = await User.findOne({
      where: { userId: parseInt(req.params.bId) },
      relations: [
        'watchlist',
        'watchlist.actors',
        'watchlist.reviews',
        'watchlist.genres',
        'watchlist.watchProviders',
      ],
    });
    if (userA && userB) {
      const resMovies = userA.watchlist.filter((movieA) =>
        userB.watchlist.some((movieB) => movieB.movieId == movieA.movieId)
      );
      return res.status(200).json({
        data: resMovies,
      });
    } else {
      return res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Gets all movies that the two users have both reviewed
movieRouter.get('/mutual/review/:aId/:bId', async (req, res) => {
  try {
    if (isNaN(+req.params.aId) || isNaN(+req.params.bId)) {
      throw `${req.params.aId} or ${req.params.bId} Not a valid number`;
    }
    const userA = await User.findOne({
      where: { userId: parseInt(req.params.aId) },
    });
    const userB = await User.findOne({
      where: { userId: parseInt(req.params.bId) },
    });
    if (!userA || !userB) {
      return res.status(404).json();
    }
    const userAReviews = await Review.find({
      where: { reviewUserUserId: userA.userId },
      relations: [
        'review_movie',
        'review_movie.genres',
        'review_movie.actors',
        'review_movie.reviews',
        'review_movie.watchProviders',
      ],
    });
    const userBReviews = await Review.find({
      where: { reviewUserUserId: userB.userId },
      relations: [
        'review_movie',
        'review_movie.genres',
        'review_movie.actors',
        'review_movie.reviews',
        'review_movie.watchProviders',
      ],
    });
    const resReviews = userAReviews.filter((reviewA) =>
      userBReviews.some(
        (reviewB) => reviewB.reviewMovieMovieId == reviewA.reviewMovieMovieId
      )
    );
    const resMovies = resReviews.map((review) => review.review_movie);
    return res.status(200).json({
      data: resMovies,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Inserts a new movie from the body
//First check if the movie exists already, if not, insert it
//Actors should be set already and inserted / updated at the same time
//Genres should be set already and inserted / updated at the same time
//WatchProviders should be set already and inserted / updated at the same time
movieRouter.post('/', async (req, res?) => {
  try {
    let newMovie: Movie = req.body as Movie;
    const existingMovie: Movie = await Movie.findOne({
      where: { movieId: newMovie.movieId },
    });
    if (existingMovie == null) {
      await Movie.save(newMovie);
    }
    newMovie = await Movie.findOne({
      where: { movieId: newMovie.movieId },
      relations: {
        actors: true,
        reviews: true,
        genres: true,
        watchProviders: true,
      },
    });
    return res.status(201).json({
      data: newMovie,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Update the movie in the body
//We shouldn't really use this
movieRouter.put('/', async (req, res?) => {
  try {
    const movieBody = req.body as Movie;
    let movie: Movie = await Movie.findOne({
      where: { movieId: movieBody.movieId },
    });
    if (!movie) {
      return res.status(404).json();
    }
    // update movie keys, except for primary keys or relations
    Object.keys(movie).forEach((key) => {
      if (
        key != 'movieId' &&
        key != 'reviews' &&
        key != 'actors' &&
        key != 'genres' &&
        key != 'watchProviders'
      ) {
        movie[key] = movieBody[key];
      }
    });
    await movie.save();

    // return the updated movie object
    movie = await Movie.findOne({
      where: { movieId: movie.movieId },
      relations: { actors: true, reviews: true },
    });
    return res.status(201).json({
      data: movie,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Delete the movie with that id
movieRouter.delete('/:id', async (req, res?) => {
  try {
    const movie: Movie = await Movie.findOne({
      where: { movieId: parseInt(req.params.id) },
    });
    if (movie) {
      await movie.remove();
      return res.status(204).json();
    } else {
      return res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

export default movieRouter;
