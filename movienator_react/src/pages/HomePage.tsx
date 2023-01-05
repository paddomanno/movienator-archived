//Route: movienator3000.com/home
import ReviewsListHomePage from '../components/ListComponents/ReviewsListHomePage';
import AllGenresList from '../components/ListComponents/AllGenresList';
import React, { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import { Review } from '../types/Review';
import { Genre } from '../types/Genre';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import { getWatchlistMovies } from '../services/MovieService';
import {
  getAllGenres,
  getPopularMovies,
  getUserRecommendations,
} from '../services/ExternService';
import { getReviewsOfFollowing } from '../services/ReviewService';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import ActorSearchBar from '../components/GeneralComponents/ActorSearchBar';
import MovieSearchBar from '../components/GeneralComponents/MovieSearchbar';
import MoviesListOneLine from '../components/ListComponents/MoviesListOneLine';

export default function HomePage() {
  const MAX_MOVIES_PER_LIST = 10;
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState<Movie[] | null>(null);
  const [popular, setPopular] = useState<Movie[] | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[] | null>(null);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [genres, setGenres] = useState<Genre[] | null>(null);
  const [cookies] = useCookies(['userName', 'userId']);

  useEffect(() => {
    //Rauswerfen wenn nicht eingeloggt
    if (!cookies.userName) {
      navigate('/login');
    }
    getWatchlistMovies(cookies.userId as number).then((movies) => {
      setWatchlist(movies.slice(0, MAX_MOVIES_PER_LIST));
    });
    getPopularMovies(1).then((movies) => {
      setPopular(movies.slice(0, MAX_MOVIES_PER_LIST));
    });
    getUserRecommendations(cookies.userId as number).then((movies) => {
      setRecommendations(movies.slice(0, MAX_MOVIES_PER_LIST));
    });
    getReviewsOfFollowing(cookies.userId as number).then((reviews) => {
      setReviews(reviews.slice(0, MAX_MOVIES_PER_LIST));
    });
    getAllGenres().then((genres) => {
      setGenres(genres);
    });
  }, []);

  return (
    <main>
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
            <Card sx={{ backgroundColor: grey.A200 }}>
              <CardContent>
                <Stack
                  direction={'row'}
                  spacing={2}
                  justifyContent={'space-around'}
                >
                  <MovieSearchBar />
                  <ActorSearchBar />
                </Stack>
              </CardContent>
            </Card>

            <MoviesListOneLine
              movies={watchlist}
              title="Your Watchlist"
              handleClick={() => navigate('/watchlist')}
            />
            <MoviesListOneLine
              movies={popular}
              title="Popular Movies"
              handleClick={() => navigate('/popular')}
            />
            <MoviesListOneLine
              movies={recommendations}
              title="Recommendations For You"
              handleClick={() => navigate('/recommendations')}
            />
            <ReviewsListHomePage reviews={reviews} />
            <AllGenresList genres={genres} />
          </Stack>
        </>
      )}
    </main>
  );
}
