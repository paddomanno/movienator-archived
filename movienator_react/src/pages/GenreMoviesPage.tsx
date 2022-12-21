//Route: movienator3000.com/genreMovies/:genreId
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import { getMoviesToGenre, getSingleGenre } from '../services/ExternService';
import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { Genre } from '../types/Genre';
import { useCookies } from 'react-cookie';
import MoviesList from '../components/ListComponents/MoviesList';

export default function GenreMoviesPage() {
  const navigate = useNavigate();
  const { genreId } = useParams();
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [genre, setGenre] = useState<Genre | null>(null);
  const [cookies] = useCookies(['userName']);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    if (!cookies.userName) {
      navigate('/login');
    }
    if (typeof genreId == 'string') {
      getMoviesToGenre(parseInt(genreId), page).then((movies) => {
        setMovies(movies);
      });
      getSingleGenre(parseInt(genreId)).then((genre) => {
        setGenre(genre);
      });
    }
  }, []);

  useEffect(() => {
    setMovies(null);
    if (typeof genreId == 'string') {
      getMoviesToGenre(parseInt(genreId), page).then((movies) => {
        setMovies(movies);
      });
    }
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
          {genre != null ? (
            <Typography>Movies of Genre {genre.genreName}</Typography>
          ) : (
            <Typography>Movies of Genre ...</Typography>
          )}
        </CardContent>
      </Card>
      {movies != null ? (
        <>
          <MoviesList title="" movies={movies} />
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
              disabled={page == 1}
              onClick={decrementPage}
            >
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
