//Route: movienator3000.com/home
import MoviesList from '../components/ListComponents/MoviesList';
import ReviewsList from '../components/ListComponents/ReviewsList';
import AllGenresList from '../components/ListComponents/AllGenresList';
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
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import MovieSearchbar from '../components/GeneralComponents/MovieSearchbar';

export default function HomePage() {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState<Movie[] | null>(null);
  const [popular, setPopular] = useState<Movie[] | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[] | null>(null);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [genres, setGenres] = useState<Genre[] | null>(null);
  const [cookies, setCookies] = useCookies(['userName']);

  useEffect(() => {
    //Rauswerfen wenn nicht eingeloggt
    if (!cookies.userName) {
      navigate('/login');
    }
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
    <main>
      <div>Hier ist die Home Page</div>
      <MovieSearchbar />
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
            <MoviesList movies={watchlist} title="Your Watchlist" />
            <MoviesList movies={popular} title="Popular Movies" />
            <MoviesList
              movies={recommendations}
              title="Recommendations For You"
            />
            <ReviewsList data={reviews} />
            <AllGenresList data={genres} />
          </Stack>
        </>
      )}
    </main>
  );
}
