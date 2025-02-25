//Route: movienator3000.com/home
import AllGenresList from '../components/ListComponents/AllGenresList';
import React, { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import { Genre } from '../types/Genre';
import { Box, Stack, Typography } from '@mui/material';
import { getWatchlistMoviesToUserId } from '../services/MovieService';
import {
  getAllGenres,
  getPopularMoviesToPagenumber,
  getUserRecommendationsToUserId,
} from '../services/ExternService';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import MoviesListOneLine from '../components/ListComponents/MoviesListOneLine';
import ActorMovieSearchBar from '../components/GeneralComponents/ActorMovieSearchBar';

export default function HomePage() {
  const MAX_MOVIES_PER_LIST = 10;
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState<Movie[] | null>(null);
  const [popular, setPopular] = useState<Movie[] | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[] | null>(null);
  const [genres, setGenres] = useState<Genre[] | null>(null);
  const [cookies] = useCookies(['userName', 'userId']);

  useEffect(() => {
    //Rauswerfen wenn nicht eingeloggt
    if (!cookies.userName) {
      navigate('/login');
    }
    document.title = 'Movienator3000';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!cookies.userId) {
      return;
    }
    getWatchlistMoviesToUserId(cookies.userId as number).then((movies) => {
      setWatchlist(movies.slice(0, MAX_MOVIES_PER_LIST));
    });
    getPopularMoviesToPagenumber(1).then((movies) => {
      setPopular(movies.slice(0, MAX_MOVIES_PER_LIST));
    });
    getUserRecommendationsToUserId(cookies.userId as number).then((movies) => {
      setRecommendations(movies.slice(0, MAX_MOVIES_PER_LIST));
    });
    getAllGenres().then((genres) => {
      setGenres(genres);
    });
  }, [cookies.userId]);

  return (
    <main>
      {watchlist == null ||
      popular == null ||
      recommendations == null ||
      genres == null ? (
        <Typography>Loading...</Typography>
      ) : (
        <Stack direction={'column'} spacing={1}>
          <Box m="auto" marginTop={'1rem'}>
            <ActorMovieSearchBar initialSearchWord={''} />
          </Box>

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
          <AllGenresList genres={genres} />
        </Stack>
      )}
    </main>
  );
}
