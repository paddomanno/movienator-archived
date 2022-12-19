//Route: movienator3000.com/home
import MovieListComponent from '../components/ListComponents/MovieListComponent';
import ReviewListComponent from '../components/ListComponents/ReviewListComponent';
import GenreListComponent from '../components/ListComponents/GenreListComponent';
import React, { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import { Review } from '../types/Review';
import { Genre } from '../types/Genre';
import {
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { getWatchlistMovies } from '../services/MovieService';
import {
  getAllGenres,
  getPopularMovies,
  getUserRecommendations,
} from '../services/ExternService';
import { getReviewsOfFollowing } from '../services/ReviewService';
import MovieSearchBarComponent from '../components/MovieSearchBarComponent';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import HomeIcon from '@mui/icons-material/Home';
import ActorSearchBar from '../components/ActorSearchBar';

export default function HomePage() {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState<Movie[] | null>(null);
  const [popular, setPopular] = useState<Movie[] | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[] | null>(null);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [genres, setGenres] = useState<Genre[] | null>(null);
  const [cookies, setCookies] = useCookies(['userName', 'userId']);

  useEffect(() => {
    //Rauswerfen wenn nicht eingeloggt
    if (!cookies.userName) {
      navigate('/login');
    }
    getWatchlistMovies(cookies.userId as number).then((movies) => {
      setWatchlist(movies);
    });
    getPopularMovies().then((movies) => {
      setPopular(movies);
    });
    getUserRecommendations(cookies.userId as number).then((movies) => {
      setRecommendations(movies);
    });
    getReviewsOfFollowing(cookies.userId as number).then((reviews) => {
      setReviews(reviews);
    });
    getAllGenres().then((genres) => {
      setGenres(genres);
    });
  }, []);

  return (
    <div>
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
                  <MovieSearchBarComponent />
                  <ActorSearchBar />
                </Stack>
              </CardContent>
            </Card>
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
