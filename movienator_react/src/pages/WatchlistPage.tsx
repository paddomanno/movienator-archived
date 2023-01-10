//Route: movienator3000.com/watchlist
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { getWatchlistMoviesToUserId } from '../services/MovieService';
import { Movie } from '../types/Movie';
import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import MoviesList from '../components/ListComponents/MoviesList';

export default function WatchlistPage() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [cookies] = useCookies(['userName', 'userId']);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    if (!cookies.userName) {
      navigate('/login');
    }
    getWatchlistMoviesToUserId(cookies.userId).then((movies) => {
      setMovies(movies);
    });
  }, []);

  useEffect(() => {
    setMovies(null);
    getWatchlistMoviesToUserId(cookies.userId).then((movies) => {
      setMovies(movies);
    });
  }, [page]);

  function decrementPage(e: any) {
    e.preventDefault();
    if (page > 1) {
      setPage(page - 1);
    }
  }

  function incrementPage(e: any) {
    e.preventDefault();
    setPage(page + 1);
  }

  return (
    <Stack direction={'column'} spacing={1}>
      <Card>
        <CardContent>
          <Typography>Your Watchlist</Typography>
        </CardContent>
      </Card>
      {movies != null ? (
        <>
          <MoviesList movies={movies} />
        </>
      ) : (
        <>
          <Typography>Loading...</Typography>
        </>
      )}
      <Card>
        <CardContent>
          <Stack direction={'row'} spacing={2}>
            <Button
              variant={'contained'}
              onClick={decrementPage}
              disabled={page == 1}
            >
              Prev Page
            </Button>
            <Button
              variant={'contained'}
              onClick={incrementPage}
              disabled={movies == null || movies.length < 20}
            >
              Next Page
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
