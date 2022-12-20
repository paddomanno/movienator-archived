//Route: movienator3000.com/genreMovies/:genreId
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import {
  getMoviesToGenre,
  getPopularMovies,
  getSingleGenre,
} from '../services/ExternService';
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
    getPopularMovies(page).then((movies) => {
      setMovies(movies);
    });
  }, []);

  useEffect(() => {
    setMovies(null);
    getPopularMovies(page).then((movies) => {
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
