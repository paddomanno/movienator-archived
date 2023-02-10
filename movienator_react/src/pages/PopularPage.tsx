//Route: movienator3000.com/genreMovies/:genreId
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import { getPopularMoviesToPagenumber } from '../services/ExternService';
import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { useCookies } from 'react-cookie';
import MoviesList from '../components/ListComponents/MoviesList';

export default function PopularPage() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [cookies] = useCookies(['userName']);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    if (!cookies.userName) {
      navigate('/login');
    }
    document.title = 'Most Popular Movies';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getPopularMoviesToPagenumber(page).then((movies) => {
      setMovies(movies);
    });
  });

  useEffect(() => {
    setMovies(null);
    getPopularMoviesToPagenumber(page).then((movies) => {
      setMovies(movies);
    });
  }, [page]);

  function decrementPage(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    if (page > 1) {
      setPage(page - 1);
    }
  }

  function incrementPage(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    setPage(page + 1);
  }

  return (
    <Stack direction={'column'} spacing={1}>
      <Card>
        <CardContent>
          <Typography>Most Popular Movies</Typography>
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
            <Button variant={'contained'} onClick={decrementPage}>
              Prev Page
            </Button>
            <Button variant={'contained'} onClick={incrementPage}>
              Next Page
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
