import {
  Button,
  Card,
  CardContent,
  IconButton,
  Paper,
  Stack,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import { getMoviesToName } from '../services/ExternService';
import { useNavigate, useParams } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import MoviesList from '../components/ListComponents/MoviesList';
import ActorMovieSearchBar from '../components/GeneralComponents/ActorMovieSearchBar';

export default function MovieSearchPage() {
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [page, setPage] = useState<number>(1);
  const { searchWord } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setMovies(null);
    if (searchWord != undefined) {
      getMoviesToName(searchWord, page).then((res) => {
        setMovies(res);
      });
    }
  }, [searchWord, page]);

  function toHomePage(e: React.MouseEvent): void {
    e.preventDefault();
    navigate('/home');
  }

  function decrementPage(e: React.MouseEvent): void {
    e.preventDefault();
    if (page > 1) {
      setPage(page - 1);
    }
  }

  function incrementPage(e: React.MouseEvent): void {
    e.preventDefault();
    setPage(page + 1);
  }
  return (
    <Paper>
      <Stack spacing={1} direction={'column'}>
        <Card variant="outlined">
          <CardContent>
            <Stack spacing={1} direction={'row'}>
              <IconButton onClick={toHomePage}>
                <HomeIcon />
              </IconButton>
              <ActorMovieSearchBar initialSearchWord={searchWord ?? ''} />
            </Stack>
          </CardContent>
        </Card>
        {movies != null ? <MoviesList movies={movies} /> : <Paper></Paper>}
        <Card variant="outlined">
          <CardContent>
            <Stack direction={'row'} spacing={2}>
              <Button
                disabled={page == 1}
                variant={'contained'}
                onClick={decrementPage}
              >
                Prev Page
              </Button>
              <Button
                variant={'contained'}
                onClick={incrementPage}
                disabled={movies != null && movies.length < 20}
              >
                Next Page
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Paper>
  );
}
