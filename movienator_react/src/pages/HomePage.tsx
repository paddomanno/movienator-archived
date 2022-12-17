//Route: movienator3000.com/home
import MovieListComponent from '../components/ListComponents/MovieListComponent';
import ReviewListComponent from '../components/ListComponents/ReviewListComponent';
import GenreListComponent from '../components/ListComponents/GenreListComponent';
import { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import { Review } from '../types/Review';
import { Genre } from '../types/Genre';
import { Stack, Typography } from '@mui/material';
import { getWatchlistMovies } from '../services/MovieService';
import {
  getAllGenres,
  getPopularMovies,
  getUserRecommendations,
} from '../services/ExternService';
import { getReviewsOfFollowing } from '../services/ReviewService';
import MovieSearchBarComponent from '../components/MovieSearchBarComponent';

export default function HomePage() {
  const [watchlist, setWatchlist] = useState<Movie[] | null>(null);
  const [popular, setPopular] = useState<Movie[] | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[] | null>(null);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [genres, setGenres] = useState<Genre[] | null>(null);

  useEffect(() => {
    getWatchlistMovies(1).then((movies) => {
      setWatchlist(movies);
    });
    getPopularMovies().then((movies) => {
      setPopular(movies);
    });
    getUserRecommendations(1).then((movies) => {
      setRecommendations(movies);
    });
    getReviewsOfFollowing(1).then((reviews) => {
      setReviews(reviews);
    });
    getAllGenres().then((genres) => {
      setGenres(genres);
    });
  }, []);

  return (
    <div>
      <div>Hier ist die Home Page</div>
      <MovieSearchBarComponent />
      {watchlist == null ||
      popular == null ||
      recommendations == null ||
      reviews == null ||
      genres == null ? (
        <>
          <Typography>Loading...</Typography>
        </>
      ) : (
        <>
          <Stack direction={'column'} spacing={1}>
            <MovieListComponent data={watchlist} type={'watchlist'} />
            <MovieListComponent data={popular} type={'popular'} />
            <MovieListComponent
              data={recommendations}
              type={'recommendations'}
            />
            <ReviewListComponent data={reviews} />
            <GenreListComponent data={genres} />
          </Stack>
        </>
      )}
    </div>
  );
}
