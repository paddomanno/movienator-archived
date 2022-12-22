import Movie from '../entity/movie';
import Actor from '../entity/actor';
import Review from '../entity/review';
import Genre from '../entity/genre';
import User from '../entity/user';

const expressExtern = require('express');
const externRouter = expressExtern.Router();
const axios = require('axios');

const API_KEY = 'fb73e59a39ce4d841ab2597bdf8b7003';
const BASE_URL = 'https://api.themoviedb.org/3';

/**
 * These routes should not communicate with our local database at all.
 * They should just receive the Data from the external API and put it into
 * Our own datatypes to return (again, without saving the data to the database)
 */

async function getImageToActor(actorId: number): Promise<string | null> {
  let resString: string | null = null;
  try {
    let query: string =
      BASE_URL + `/person/${actorId}/images?` + `api_key=${API_KEY}`;
    let response = await axios.get(query, {
      headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' },
      params: { trophies: true },
    });
    if (response.status == 200) {
      if (response.data.profiles.length >= 1) {
        resString = response.data.profiles[0].file_path;
      }
    }
  } catch (e) {}
  return resString;
}

async function getVideoToMovie(movieId: number): Promise<string> {
  let resKey: string = 'null';
  try {
    let query: string =
      BASE_URL + `/movie/${movieId}/videos?` + `api_key=${API_KEY}`;
    //console.log(query)
    let response = await axios.get(query, {
      headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' },
      params: { trophies: true },
    });
    if (response.status == 200) {
      response.data.results.forEach((result) => {
        if (result.site == 'YouTube' && result.type == 'Trailer') {
          if (resKey == 'null') {
            resKey = result.key as string;
          }
        }
      });
    }
  } catch (e) {}
  return resKey;
}

/**
 * Return an array of movies with the given Ids. Actors are not filled. Genres are filled
 * @param ids
 * @param maxAmount The maximum amount of movies that will be returned
 * @param getVideos
 */
async function getMoviesToIds(
  ids: number[],
  maxAmount: number,
  getVideos: boolean = false
): Promise<Movie[]> {
  let resMovies: Movie[] = [];
  for (const id of ids) {
    let query: string = BASE_URL + `/movie/${id}?` + `api_key=${API_KEY}`;
    let response = await axios.get(query, {
      headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' },
      params: { trophies: true },
    });
    if (response.status == 200) {
      let genres: Genre[] = [];
      response.data.genres.forEach((genre) => {
        let oneGenre: Genre = new Genre();
        oneGenre.genreId = genre.id;
        oneGenre.genreName = genre.name;
        genres.push(oneGenre);
      });
      let oneMovie: Movie = new Movie();
      oneMovie.movieId = response.data.id;
      oneMovie.title = response.data.original_title;
      oneMovie.overview = response.data.overview;
      if (response.data.release_date) {
        oneMovie.releaseDate = new Date(response.data.release_date);
      } else {
        oneMovie.releaseDate = new Date(0);
      }
      oneMovie.lengthMinutes = response.data.runtime;
      oneMovie.adultContent = response.data.adult;
      oneMovie.imagePath = response.data.poster_path;
      if (getVideos) {
        oneMovie.videoPath = await getVideoToMovie(response.data.id);
      } else {
        oneMovie.videoPath = 'null';
      }
      oneMovie.actors = [];
      oneMovie.reviews = [];
      oneMovie.genres = genres;
      if (resMovies.length < maxAmount) {
        resMovies.push(oneMovie);
      }
    }
  }
  return resMovies;
}

/**
 * Returns an Array of Movies that are returned by this query
 * @param query
 * @param maxAmount The maximum amount of movies that will be returned
 */
async function getMoviesToQuery(
  query: string,
  maxAmount: number,
  page?: number
): Promise<Movie[]> {
  let movieIds: number[] = [];
  let res: any;
  res = await axios.get(query + `&page=${page}`, {
    headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' },
    params: { trophies: true },
  });
  if (res.status == 200) {
    res.data.results.forEach((result) => {
      if (movieIds.length < maxAmount) {
        movieIds.push(result.id);
      }
    });
  }
  page++;
  //console.log('Got page ' + res.data.page + ' of ' + res.data.total_pages);
  return await getMoviesToIds(movieIds, maxAmount);
}

//Returns a list of movies that fit this search word
//The actors array is NOT filled
//The genre array IS filled
//see search/movies
externRouter.get('/search/movie/:word', async (req, res) => {
  try {
    let query: string =
      BASE_URL +
      '/search/movie/?' +
      `api_key=${API_KEY}` +
      `&query=${req.params.word}`;
    let page: number = parseInt(req.query.page);
    let resMovies: Movie[] = await getMoviesToQuery(query, 50, page);
    res.status(200).json({
      data: resMovies,
    });
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Returns the first X actors that are playing in a movie
externRouter.get('/actor/movie/:id', async (req, res) => {
  const MAX_ACTORS: number = 10;
  try {
    let resActors: Actor[] = [];
    let actorsQuery: string =
      BASE_URL + `/movie/${req.params.id}/credits?` + `api_key=${API_KEY}`;
    let actors = await axios.get(actorsQuery, {
      headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' },
      params: { trophies: true },
    });
    if (actors.status == 200) {
      actors.data.cast.forEach((castMember) => {
        let oneActor: Actor = new Actor();
        oneActor.actorId = castMember.id;
        oneActor.name = castMember.original_name;
        oneActor.movies = [];
        if (resActors.length < MAX_ACTORS) {
          resActors.push(oneActor);
        }
      });
    }
    res.status(200).json({
      data: resActors,
    });
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});
externRouter.get('/actor/:id', async (req, res) => {
  try {
    let resActor: Actor = new Actor();
    let actorsQuery: string =
      BASE_URL + `/person/${req.params.id}?` + `api_key=${API_KEY}`;
    let actor = await axios.get(actorsQuery, {
      headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' },
      params: { trophies: true },
    });
    if (actor.status == 200) {
      resActor.name = actor.data.name;
      resActor.actorId = actor.data.id;
    }
    res.status(200).json({
      data: resActor,
    });
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Returns a list of actors fitting that search word
//The movies array is NOT filled
//See search/people -> known for
externRouter.get('/search/actor/:name', async (req, res) => {
  const MAX_RESULTS: number = 20;
  try {
    let resActors: Actor[] = [];
    let query: string =
      BASE_URL +
      '/search/person?' +
      `api_key=${API_KEY}` +
      `&query=${req.params.name}`;
    let response = await axios.get(query, {
      headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' },
      params: { trophies: true },
    });
    if (response.status == 200) {
      for (const result of response.data.results) {
        if (
          result.known_for_department == 'Acting' &&
          resActors.length < MAX_RESULTS
        ) {
          let newActor: Actor = new Actor();
          newActor.actorId = result.id;
          newActor.name = result.name;
          newActor.movies = [];
          newActor.imagePath = await getImageToActor(result.id);
          resActors.push(newActor);
        }
      }
      resActors.sort((a, b) => a.name.localeCompare(b.name));
    }
    res.status(200).json({
      data: resActors,
    });
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

externRouter.get('/movie/one/:id', async (req, res) => {
  try {
    let resMovies: Movie[] = await getMoviesToIds(
      [parseInt(req.params.id)],
      30,
      true
    );
    res.status(200).json({
      data: resMovies[0],
    });
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Returns a list of Movies that this actor has played in
//The actors array is NOT filled
//The genre array IS filled
externRouter.get('/movies/actor/:id', async (req, res) => {
  const MAX_RESULTS = 70;
  try {
    let resMovies: Movie[] = [];
    let query: string =
      BASE_URL +
      `/person/${req.params.id}/movie_credits?` +
      `api_key=${API_KEY}`;
    let response = await axios.get(query, {
      headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' },
      params: { trophies: true },
    });
    if (response.status == 200) {
      let movieIds: number[] = [];
      response.data.cast.forEach((cast) => {
        if (movieIds.length <= MAX_RESULTS) {
          movieIds.push(cast.id);
        }
      });
      resMovies = await getMoviesToIds(movieIds, MAX_RESULTS);
      resMovies.sort(
        (a, b) => b.releaseDate.getTime() - a.releaseDate.getTime()
      );
    }
    res.status(200).json({
      data: resMovies,
    });
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Returns a list of movies that this user might like
//The actors array is NOT filled
//The genre array IS filled
externRouter.get('/user/:uId/recommendations', async (req, res) => {
  const MAX_DIF_REVIEWS: number = 10;
  const MAX_REC_PER_REVIEW: number = 2;
  try {
    if (isNaN(+req.params.uId)) {
      throw 'Not a valid number';
    }
    let user: User = await User.findOne({
      where: { userId: parseInt(req.params.uId) },
    });
    if (user != null) {
      let reviews: Review[] = await Review.find({
        where: { reviewUserUserId: parseInt(req.params.uId) },
      });
      reviews.sort((a, b) => b.rating - a.rating);
      let movieIds: number[] = [];

      //Get recommendations for the top-rated movies of that user
      let i: number = 0;
      while (i < reviews.length && i < MAX_DIF_REVIEWS) {
        let query: string =
          BASE_URL +
          `/movie/${reviews[i].reviewMovieMovieId}/similar?` +
          `api_key=${API_KEY}`;
        let thisMovieRec = await axios.get(query, {
          headers: {
            Accept: 'application/json',
            'Accept-Encoding': 'identity',
          },
          params: { trophies: true },
        });

        if (thisMovieRec.status == 200) {
          //Collect Movie ids from the first 2 recommendations
          let x: number = 0;
          while (
            x < thisMovieRec.data.results.length &&
            x < MAX_REC_PER_REVIEW
          ) {
            movieIds.push(thisMovieRec.data.results[x].id);
            x++;
          }
        }
        i++;
      }
      let resMovies: Movie[] = await getMoviesToIds(
        movieIds,
        MAX_DIF_REVIEWS * MAX_REC_PER_REVIEW
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

//Returns a list of recommendations for a movie
//The actors array is NOT filled
//The genre array IS filled
externRouter.get('/movie/:mId/recommendations', async (req, res) => {
  try {
    if (isNaN(+req.params.mId)) {
      throw 'Not a valid Number';
    }
    let resMovies: Movie[] = [];
    let query: string =
      BASE_URL + `/movie/${req.params.mId}/similar?` + `api_key=${API_KEY}`;
    let thisMovieRec = await axios.get(query, {
      headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' },
      params: { trophies: true },
    });
    if (thisMovieRec.status == 200) {
      let movieIds: number[] = [];
      thisMovieRec.data.results.forEach((result) => {
        movieIds.push(result.id);
      });
      resMovies = await getMoviesToIds(movieIds, 20);
    }
    res.status(200).json({
      data: resMovies,
    });
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Returns a list of the currently popular movies
//The actors array is NOT filled
//The genre array IS filled
//See movie/popular
externRouter.get('/popular', async (req, res) => {
  try {
    let query: string = BASE_URL + '/movie/popular?' + `api_key=${API_KEY}`;
    let page: number = parseInt(req.query.page);
    let resMovies = await getMoviesToQuery(query, 50, page);
    res.status(200).json({
      data: resMovies,
    });
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

//Returns a list of all genres there are
//Movies are not filled
externRouter.get('/genres', async (req, res) => {
  try {
    let resGenres: Genre[] = [];
    let query: string = BASE_URL + `/genre/movie/list?` + `api_key=${API_KEY}`;
    let genreRes = await axios.get(query, {
      headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' },
      params: { trophies: true },
    });
    if (genreRes.status == 200) {
      genreRes.data.genres.forEach((genre) => {
        let newGen: Genre = new Genre();
        newGen.genreId = genre.id;
        newGen.genreName = genre.name;
        resGenres.push(newGen);
      });
      res.status(200).json({
        data: resGenres,
      });
    } else {
      res.status(500).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

externRouter.get('/movie/genre/:id', async (req, res) => {
  try {
    if (isNaN(+req.params.id)) {
      throw 'Not a valid number';
    }
    let query: string =
      BASE_URL +
      '/discover/movie?' +
      `with_genres=${req.params.id}` +
      `&api_key=${API_KEY}`;
    let page: number = parseInt(req.query.page);
    let resMovies = await getMoviesToQuery(query, 50, page);
    if (resMovies.length == 0) {
      res.status(404).json();
    } else {
      res.status(200).json({
        data: resMovies,
      });
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

externRouter.get('/genre/:id', async (req, res) => {
  try {
    if (isNaN(+req.params.id)) {
      throw 'Not a valid number';
    }
    let genreId: number = parseInt(req.params.id);
    let resGenre: Genre = null;
    let query: string = BASE_URL + `/genre/movie/list?` + `api_key=${API_KEY}`;
    let genreRes = await axios.get(query, {
      headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' },
      params: { trophies: true },
    });
    if (genreRes.status == 200) {
      genreRes.data.genres.forEach((genre) => {
        if (genre.id === genreId) {
          resGenre = new Genre();
          resGenre.genreId = genre.id;
          resGenre.genreName = genre.name;
        }
      });
      if (resGenre != null) {
        res.status(200).json({
          data: resGenre,
        });
      } else {
        res.status(500).json();
      }
    } else {
      res.status(500).json();
    }
  } catch (er) {
    console.log(er);
    res.status(500).json();
  }
});

module.exports = externRouter;
