import Genre from '../entity/genre';
import Review from '../entity/review';

import expressGenres from 'express';
const genresRouter = expressGenres.Router();

//Returns all the genres there currently are in the database
//Movies array is filled
genresRouter.get('/all', async (req, res) => {
  try {
    const allGenres: Genre[] = await Genre.find({
      relations: { movies: true },
    });
    if (allGenres) {
      allGenres.sort((a, b) => a.genreName.localeCompare(b.genreName));
    }
    return res.status(200).json({
      data: allGenres,
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

//Returns the favorite genre of a specified user
genresRouter.get('/favorite/:uId', async (req, res) => {
  try {
    if (isNaN(+req.params.uId)) {
      throw 'Not a number';
    }
    const allReviews: Review[] = await Review.find({
      where: { reviewUserUserId: parseInt(req.params.uId) },
      relations: ['review_movie', 'review_movie.genres'],
    });
    if (allReviews.length === 0) {
      return res.status(404).json();
    }

    // Give a score to each genre
    // based on every review written by the user
    // and the rating they gave
    const scoreMap = new Map<number, number>();
    const genreMap = new Map<number, Genre>();
    allReviews.forEach((review) => {
      review.review_movie.genres.forEach((genre) => {
        if (!genreMap.has(genre.genreId)) {
          genreMap.set(genre.genreId, genre);
        }
        if (!scoreMap.has(genre.genreId)) {
          scoreMap.set(genre.genreId, 0);
        }
        scoreMap.set(
          genre.genreId,
          scoreMap.get(genre.genreId) - 2 + review.rating
        );
      });
    });

    // Get the genre with the highest score
    const resGenre: number = Array.from(scoreMap.entries()).reduce((a, b) =>
      a[1] < b[1] ? b : a
    )[0];
    return res.status(200).json({
      data: genreMap.get(resGenre),
    });
  } catch (er) {
    console.log(er);
    return res.status(500).json();
  }
});

export default genresRouter;
