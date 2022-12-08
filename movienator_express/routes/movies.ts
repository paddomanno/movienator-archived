import Movie from '../entity/movie';
import User from '../entity/user';
import Actor from '../entity/actor';
import {
  Between,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import Genre from "../entity/genre";

const expressMovie = require('express');
const movieRouter = expressMovie.Router();


//Get all the movies from the database
movieRouter.get('/all', async (req, res) => {
  try {
    const allMovies: Movie[] = await Movie.find({
      relations: { actors: true, reviews: true , genres: true},
    });
    allMovies.sort((a, b) => a.title.localeCompare(b.title));
    res.status(200).json({
      data: allMovies,
    });
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

// Get one movie by its id
movieRouter.get('/one/:id', async (req, res) => {
  try {
    const oneMovie: Movie = await Movie.findOne({
      where: { movieId: parseInt(req.params.id) },
      relations: { actors: true, reviews: true ,genres: true},
    });
    if (oneMovie) {
      res.status(200).json({
        data: oneMovie,
      });
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Gets all the movies that actor played in
//Better use the extern Api for this
movieRouter.get('/actor/:id', async (req, res) => {
  try {
    const actor: Actor = await Actor.findOne({
      where: { actorId: parseInt(req.params.id) },
      relations: ['movies','movies.reviews','movies.actors','movies.genres'],
    });
    if (actor != null) {
      let actorMovies: Movie[] = actor.movies;
      actorMovies.sort((a, b) => a.title.localeCompare(b.title));
      res.status(200).json({
        data: actorMovies,
      });
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Gets all the movies that user has reviewed
movieRouter.get('/user/:id', async (req, res) => {
  try {
    const user: User = await User.findOne({
      where: { userId: parseInt(req.params.id) },
      relations: ['reviews', 'reviews.review_movie','reviews.review_movie.reviews','reviews.review_movie.actors','reviews.review_movie.genres'],
    });

    if (user != null) {
      let userMovies: Movie[] = [];
      user.reviews.forEach((review) => {
        userMovies.push(review.review_movie);
      });
      userMovies.sort((a, b) => a.title.localeCompare(b.title));
      res.status(200).json({
        data: userMovies,
      });
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Gets all the movies that are on the watchlist of that user
movieRouter.get('/watchlist/:uId', async (req, res) => {
  try {
    const user: User = await User.findOne({
      where: { userId: parseInt(req.params.uId) },
      relations: ['watchlist','watchlist.actors','watchlist.reviews','watchlist.genres'],
    });
    if (user != null) {
      let userWatchlist: Movie[] = user.watchlist;
      userWatchlist.sort((a, b) => a.title.localeCompare(b.title));
      res.status(200).json({
        data: userWatchlist,
      });
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Gets all movies with a min time
movieRouter.get('/time/min/:min', async (req, res) => {
  //TODO Catch negative values
  try {
    let min: number = parseInt(req.params.min)
    if(min <= 0 || isNaN(min)){
      throw `${parseInt(req.params.min)} is not a valid number`
    }
    const movies: Movie[] = await Movie.find({
      where: {
        lengthMinutes: MoreThanOrEqual(min),
      },
      relations: { reviews: true, actors: true ,genres: true},
    });
    movies.sort((a, b) => a.title.localeCompare(b.title));
    res.status(200).json({
      data: movies,
    });
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Gets all movies with a max time
movieRouter.get('/time/max/:max', async (req, res) => {
  try {
    let max: number = parseInt(req.params.max)
    if(max <= 0 || isNaN(max)){
      throw `${parseInt(req.params.max)} is not a valid number`
    }
    const movies: Movie[] = await Movie.find({
      where: {
        lengthMinutes: LessThanOrEqual(max),
      },
      relations: { reviews: true, actors: true , genres: true},
    });
    movies.sort((a, b) => a.title.localeCompare(b.title));
    res.status(200).json({
      data: movies,
    });
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Gets all movies released in this time span
movieRouter.get('/date/:min/:max', async (req, res) => {
  try {
    let dateMin: Date = new Date(req.params.min)
    let dateMax: Date = new Date(req.params.max)
    if(isNaN(dateMin.getTime()) || isNaN(dateMax.getTime()) || dateMax.getTime() < dateMin.getTime()){
      throw "Not a valid data range"
    }
    const movies: Movie[] = await Movie.find({
      where: {
        releaseDate: Between<Date>(
          dateMin,
          dateMax
        ),
      },
      relations: { reviews: true, actors: true , genres: true},
    });
    movies.sort((a, b) => a.title.localeCompare(b.title));
    res.status(200).json({
      data: movies,
    });
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Gets all movies where the name matches the searched word
movieRouter.get('/name/:word', async (req, res) => {
  try {
    const movies: Movie[] = await Movie.find({
      where: { title: ILike(`%${req.params.word}%`) },
      relations: { reviews: true, actors: true , genres: true},
    });
    movies.sort((a, b) => a.title.localeCompare(b.title));
    res.status(200).json({
      data: movies,
    });
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Gets all movies with a min average rating of x
movieRouter.get('/rating/:min', async (req, res) => {
  try {
    if(isNaN(+req.params.min) || parseInt(req.params.min) < 0){
      throw "Not a valid number"
    }
    const movies: Movie[] = await Movie.find({
      relations: { reviews: true, actors: true , genres: true},
    });
    let minMovies: Movie[] = movies.filter((movie) => {
      let numReviews: number = 0;
      let sumReviews: number = 0;
      movie.reviews.forEach((review) => {
        sumReviews += review.rating;
        numReviews++;
      });
      return sumReviews / numReviews > parseInt(req.params.min);
    });
    minMovies.sort((a, b) => a.title.localeCompare(b.title));
    res.status(200).json({
      data: minMovies,
    });
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Gets all movies to that genre
//Genre can either be the genres name or its id
movieRouter.get('/genre/:genre', async (req, res) => {
  try {
    const genre: Genre = await Genre.findOne({
      where: [{ genreName: req.params.genre },
        {genreId: parseInt(req.params.genre)}],
      relations: ['movies','movies.genres','movies.actors','movies.reviews'],
    });
    if(genre) {
      let movies: Movie[] = genre.movies
      movies.sort((a, b) => a.title.localeCompare(b.title));
      res.status(200).json({
        data: movies,
      });
    }
    else {
      res.status(404).json()
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Gets all movies than the two user both have on their watchlist and haven't reviewed yet
//TODO: "havent reviewed yet" not implemented. Maybe automatically remove movie from watchlist once it is reviewed?
movieRouter.get('/mutual/:aId/:bId', async (req, res) => {
  try {
    let userA = await User.findOne({
      where: { userId: parseInt(req.params.aId) },
      relations:  ['watchlist','watchlist.actors','watchlist.reviews','watchlist.genres'],
    });
    let userB = await User.findOne({
      where: { userId: parseInt(req.params.bId) },
      relations:  ['watchlist','watchlist.actors','watchlist.reviews','watchlist.genres'],
    });
    if (userA && userB) {
      let resMovies = userA.watchlist.filter((movieA) =>
        userB.watchlist.some(
          (movieB) => movieB.movieId == movieA.movieId
        )
      );
      res.status(200).json({
        data: resMovies,
      });
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Inserts a new movie from the body
//First check if the movie exists already, if not, insert it
//Actors should be set already and inserted / updated at the same time
//Genres should be set already and inserted / updated at the same time
movieRouter.post('/', async (req, res?) => {
  try {
    let newMovie: Movie = req.body as Movie;
    //Hab die orm to gemacht, dass beim movie saven, alle genres und actors mit gespeichert werden
    await Movie.save(newMovie)
    newMovie = await Movie.findOne({
      where: { movieId: newMovie.movieId },
      relations: { actors: true, reviews: true , genres: true},
    });
    res.status(201).json({
      data: newMovie,
    });
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Update the movie in the body
//Make sure to NOT update the primary keys or relations
//We shouldn't really use this
movieRouter.put('/', async (req, res?) => {
  try {
    let movieBody = req.body as Movie;
    let movie: Movie = await Movie.findOne({
      where: { movieId: movieBody.movieId },
    });
    if (movie) {
      Object.keys(movie).forEach((key) => {
        if (key != 'movieId' && key != 'reviews' && key != 'actors' && key != 'genres') {
          movie[key] = movieBody[key];
        }
      });
      await movie.save();
      movie = await Movie.findOne({
        where: { movieId: movie.movieId },
        relations: { actors: true, reviews: true },
      });
      res.status(201).json({
        data: movie,
      });
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
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
      res.status(204);
    } else {
      res.status(404).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

module.exports = movieRouter;
