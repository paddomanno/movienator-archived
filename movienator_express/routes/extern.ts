import Movie from '../entity/movie';
import Actor from '../entity/actor';
import Review from '../entity/review';
import Genre from '../entity/genre';
import User from '../entity/user';
import WatchProvider from '../entity/watchProvider';

import expressExtern from 'express';
const externRouter = expressExtern.Router();
import axios from 'axios';

const API_KEY = process.env['MOVIE_API_KEY'];
const BASE_URL = 'https://api.themoviedb.org/3';

/**
 * These routes should not communicate with our local database at all.
 * They should just receive the Data from the external API and put it into
 * our own datatypes to return (again, without saving the data to the database)
 */

async function getImageToActor(actorId: number): Promise<string | null> {
  let resString: string | null = null;
  try {
    const query: string =
      BASE_URL + `/person/${actorId}/images?` + `api_key=${API_KEY}`;
    const response = await axios.get(query, {
      headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' },
      params: { trophies: true },
    });
    if (response.status == 200) {
      if (response.data.profiles.length >= 1) {
        resString = response.data.profiles[0].file_path;
      }
    }
  } catch (e) {
    console.log(e);
  }
  return resString;
}

/**
 * Returns the first YouTube video id for the given movie
 */
async function getVideoToMovie(movieId: number): Promise<string> {
  let resKey = 'null';
  try {
    const query: string =
      BASE_URL + `/movie/${movieId}/videos?` + `api_key=${API_KEY}`;
    const response = await axios.get(query, {
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
  } catch (e) {
    console.log(e);
  }
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
  getVideos = false
): Promise<Movie[]> {
  const resMovies: Movie[] = [];
  // for each movie
  for (const id of ids) {
    // get the full movie object
    const query: string = BASE_URL + `/movie/${id}?` + `api_key=${API_KEY}`;
    const response = await axios.get(query, {
      headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' },
      params: { trophies: true },
    });
    if (response.status !== 200) {
      continue;
    }

    // fill our own genres array
    const genres: Genre[] = [];
    response.data.genres.forEach((genre) => {
      const oneGenre: Genre = new Genre();
      oneGenre.genreId = genre.id;
      oneGenre.genreName = genre.name;
      genres.push(oneGenre);
    });

    // fill our own movie object
    const oneMovie: Movie = new Movie();
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
  const movieIds: number[] = [];
  const res = await axios.get(query + `&page=${page}`, {
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

/**
 * Returns a list of movies that fit this search word
 * The actors array is NOT filled
 * The genre array IS filled
 * The watchProviders array is NOT filles
 * see search/movies
 */
externRouter.get('/search/movie/:word', async (req, res) => {
  try {
    const query: string =
      BASE_URL +
      '/search/movie?' +
      `api_key=${API_KEY}` +
      `&query=${req.params.word}`;
    const page: number = parseInt(req.query.page.toString());
    const resMovies: Movie[] = await getMoviesToQuery(query, 50, page);
    return res.status(200).json({
      data: resMovies,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Returns the first X actors that are playing in a movie
externRouter.get('/actor/movie/:id', async (req, res) => {
  const MAX_ACTORS = 10;
  try {
    const resActors: Actor[] = [];
    const actorsQuery: string =
      BASE_URL + `/movie/${req.params.id}/credits?` + `api_key=${API_KEY}`;
    const actors = await axios.get(actorsQuery, {
      headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' },
      params: { trophies: true },
    });
    if (actors.status == 200) {
      actors.data.cast.forEach((castMember) => {
        const oneActor: Actor = new Actor();
        oneActor.actorId = castMember.id;
        oneActor.name = castMember.original_name;
        oneActor.movies = [];
        if (resActors.length < MAX_ACTORS) {
          resActors.push(oneActor);
        }
      });
    }
    return res.status(200).json({
      data: resActors,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Get a single actor by id
externRouter.get('/actor/:id', async (req, res) => {
  try {
    const resActor: Actor = new Actor();
    const actorsQuery: string =
      BASE_URL + `/person/${req.params.id}?` + `api_key=${API_KEY}`;
    const actor = await axios.get(actorsQuery, {
      headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' },
      params: { trophies: true },
    });
    if (actor.status == 200) {
      resActor.name = actor.data.name;
      resActor.actorId = actor.data.id;
    }
    return res.status(200).json({
      data: resActor,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Returns a list of actors fitting that search word
//The movies array is NOT filled
//See search/people -> known for
externRouter.get('/search/actor/:name', async (req, res) => {
  const MAX_RESULTS = 20;
  try {
    const resActors: Actor[] = [];
    const query: string =
      BASE_URL +
      '/search/person?' +
      `api_key=${API_KEY}` +
      `&query=${req.params.name}`;
    const response = await axios.get(query, {
      headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' },
      params: { trophies: true },
    });
    if (response.status == 200) {
      for (const result of response.data.results) {
        if (
          result.known_for_department == 'Acting' &&
          resActors.length < MAX_RESULTS
        ) {
          const newActor: Actor = new Actor();
          newActor.actorId = result.id;
          newActor.name = result.name;
          newActor.movies = [];
          newActor.imagePath = await getImageToActor(result.id);
          resActors.push(newActor);
        }
      }
    }
    return res.status(200).json({
      data: resActors,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Get a single movie by id
externRouter.get('/movie/one/:id', async (req, res) => {
  try {
    const resMovies: Movie[] = await getMoviesToIds(
      [parseInt(req.params.id)],
      30,
      true
    );
    return res.status(200).json({
      data: resMovies[0],
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Returns a list of Movies that this actor has played in
//The actors array is NOT filled
//The genre array IS filled
//The watchProvider array is NOT filled
externRouter.get('/movies/actor/:id', async (req, res) => {
  const MAX_RESULTS = 70;
  try {
    let resMovies: Movie[] = [];
    const query: string =
      BASE_URL +
      `/person/${req.params.id}/movie_credits?` +
      `api_key=${API_KEY}`;
    const response = await axios.get(query, {
      headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' },
      params: { trophies: true },
    });
    if (response.status == 200) {
      const movieIds: number[] = [];
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
    return res.status(200).json({
      data: resMovies,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Returns a list of movies that this user might like
//The actors array is NOT filled
//The genre array IS filled
//The watchProvider array is NOT filled
externRouter.get('/user/:uId/recommendations', async (req, res) => {
  const MAX_DIF_REVIEWS = 10; // max number of movie recommendations returned in total
  const MAX_REC_PER_REVIEW = 2; // max number of movie recommendations given for each reviewed movie
  try {
    if (isNaN(+req.params.uId)) {
      throw "Can't get recommendations for user - User ID Not a valid number";
    }

    //Get user by id
    const user: User = await User.findOne({
      where: { userId: parseInt(req.params.uId) },
    });

    if (user === null) {
      return res.status(404).json();
    }

    //Get top-rated reviews of that user
    const reviews: Review[] = await Review.find({
      where: { reviewUserUserId: parseInt(req.params.uId) },
    });
    reviews.sort((a, b) => b.rating - a.rating);
    const reviewedMovieIds = reviews.map((review) => review.reviewMovieMovieId);

    //Get recommendations for each of the top-rated movies of that user
    const recommendedMovieIds: number[] = [];

    for (let i = 0; i < reviews.length; i++) {
      if (recommendedMovieIds.length >= MAX_DIF_REVIEWS) break;

      const query: string =
        BASE_URL +
        `/movie/${reviews[i].reviewMovieMovieId}/recommendations?` +
        `api_key=${API_KEY}`;
      const res = await axios.get(query, {
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'identity',
        },
        params: { trophies: true },
      });

      if (res.status !== 200) {
        continue;
      }

      const thisMovieRecommendations = res.data.results;

      //Collect Movie ids from the first n=MAX_REC_PER_REVIEW recommendations
      let recsPerReviewCounter = 0;
      for (let x = 0; x < thisMovieRecommendations.length; x++) {
        if (recsPerReviewCounter >= MAX_REC_PER_REVIEW) {
          break;
        }

        //only add movie as recommendation if the movie has not yet been reviewed by the user
        const thisRecommendedMovie = thisMovieRecommendations[x];
        if (
          reviewedMovieIds.includes(thisRecommendedMovie.id) ||
          recommendedMovieIds.includes(thisRecommendedMovie.id)
        ) {
          continue;
        } else {
          recommendedMovieIds.push(thisRecommendedMovie.id);
          recsPerReviewCounter++;
        }
      }
    }

    //Get movie objects to the saved movie ids
    const resMovies: Movie[] = await getMoviesToIds(
      recommendedMovieIds,
      MAX_DIF_REVIEWS * MAX_REC_PER_REVIEW
    );
    return res.status(200).json({
      data: resMovies,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Returns a list of recommendations for a single movie
//The actors array is NOT filled
//The genre array IS filled
externRouter.get('/movie/:mId/recommendations', async (req, res) => {
  try {
    if (isNaN(+req.params.mId)) {
      throw 'Not a valid Number';
    }
    let resMovies: Movie[] = [];
    const query: string =
      BASE_URL + `/movie/${req.params.mId}/similar?` + `api_key=${API_KEY}`;
    const thisMovieRec = await axios.get(query, {
      headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' },
      params: { trophies: true },
    });
    if (thisMovieRec.status == 200) {
      const movieIds: number[] = [];
      thisMovieRec.data.results.forEach((result) => {
        movieIds.push(result.id);
      });
      resMovies = await getMoviesToIds(movieIds, 20);
    }
    return res.status(200).json({
      data: resMovies,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Returns a list of the currently popular movies
//The actors array is NOT filled
//The genre array IS filled
//The watchProvider array is NOT filled
//See movie/popular
externRouter.get('/popular', async (req, res) => {
  try {
    const query: string = BASE_URL + '/movie/popular?' + `api_key=${API_KEY}`;
    const page: number = parseInt(req.query.page.toString());
    const resMovies = await getMoviesToQuery(query, 50, page);
    return res.status(200).json({
      data: resMovies,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Returns a list of all genres there are
//Movies are not filled
externRouter.get('/genres', async (req, res) => {
  try {
    const resGenres: Genre[] = [];

    const query: string =
      BASE_URL + `/genre/movie/list?` + `api_key=${API_KEY}`;

    const genreRes = await axios.get(query, {
      headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' },
      params: { trophies: true },
    });

    if (genreRes.status !== 200) {
      return res.status(500).json();
    }

    genreRes.data.genres.forEach((genre) => {
      const newGen: Genre = new Genre();
      newGen.genreId = genre.id;
      newGen.genreName = genre.name;
      resGenres.push(newGen);
    });

    return res.status(200).json({
      data: resGenres,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Get movies from a genre by genre id
externRouter.get('/movie/genre/:id', async (req, res) => {
  try {
    if (isNaN(+req.params.id)) {
      throw 'Not a valid number';
    }
    const query: string =
      BASE_URL +
      '/discover/movie?' +
      `with_genres=${req.params.id}` +
      `&api_key=${API_KEY}`;
    const page: number = parseInt(req.query.page.toString());
    const resMovies = await getMoviesToQuery(query, 50, page);
    if (resMovies.length == 0) {
      return res.status(404).json();
    } else {
      return res.status(200).json({
        data: resMovies,
      });
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Get a single genre by its id
externRouter.get('/genre/:id', async (req, res) => {
  try {
    if (isNaN(+req.params.id)) {
      throw 'Not a valid number';
    }
    const genreId: number = parseInt(req.params.id);
    let resGenre: Genre = null;
    const query: string =
      BASE_URL + `/genre/movie/list?` + `api_key=${API_KEY}`;
    const genreRes = await axios.get(query, {
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
        return res.status(200).json({
          data: resGenre,
        });
      } else {
        return res.status(500).json();
      }
    } else {
      return res.status(500).json();
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

// Returns all watchProviders available (US)
// Movies are not filled
externRouter.get('/watchProviders', async (req, res) => {
  try {
    const resProviders: WatchProvider[] = [];
    const watchRegion = 'US';
    const query: string =
      BASE_URL +
      `/watch/providers/movie?` +
      `api_key=${API_KEY}&&watch_region=${watchRegion}`;
    const providersRes = await axios.get(query, {
      headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' },
      params: { trophies: true },
    });
    if (providersRes.status == 200) {
      providersRes.data.results.forEach((provider) => {
        const newWP: WatchProvider = new WatchProvider();
        newWP.providerId = provider.provider_id;
        newWP.providerName = provider.provider_name;
        resProviders.push(newWP);
      });
      return res.status(200).json({
        data: resProviders,
      });
    } else {
      return res.status(500).json();
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

// Returns the watchProviders for this movie id in the specified country, or DE by default
externRouter.get('/watchProviders/movie/:id/:country', async (req, res) => {
  try {
    if (isNaN(+req.params.id)) {
      throw 'Not a valid number';
    }
    const movieId: number = parseInt(req.params.id);
    const resultProviders: WatchProvider[] = [];
    const query: string =
      BASE_URL + `/movie/${movieId}/watch/providers?api_key=${API_KEY}`;
    const apiResponse = await axios.get(query, {
      headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' },
      params: { trophies: true },
    });
    const country = apiResponse.data.results[req.params.country]
      ? req.params.country
      : 'DE';
    const providersInCountry = apiResponse.data.results[country];

    if (apiResponse.status == 200) {
      providersInCountry?.flatrate?.forEach((provider) => {
        const newWP: WatchProvider = new WatchProvider();
        newWP.providerId = provider.provider_id;
        newWP.providerName = provider.provider_name;
        resultProviders.push(newWP);
      });
      return res.status(200).json({
        data: { country: country, providers: resultProviders },
      });
    } else {
      return res.status(500).json();
    }
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Return the results of a hatespeech check on a given text
externRouter.get('/hateSpeech', async (req, res) => {
  try {
    const response = await axios({
      url: 'https://community-purgomalum.p.rapidapi.com/containsprofanity',
      method: 'get',
      params: { text: req.query.text },
      headers: {
        'X-RapidAPI-Key': process.env['HATESPEECH_API_KEY'],
        'X-RapidAPI-Host': 'community-purgomalum.p.rapidapi.com',
      },
    });
    if (response.status == 200) {
      return res.status(200).json({
        data: response.data as boolean,
      });
    } else {
      return res.status(500).json();
    }
  } catch (e) {
    return res.status(500).json();
  }
});

export default externRouter;
