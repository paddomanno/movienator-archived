import {
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getMoviesToName, searchActorsByName } from '../services/ExternService';
import { useNavigate, useParams } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import { Actor } from '../types/Actor';
import Grid2 from '@mui/material/Unstable_Grid2';
import { useCookies } from 'react-cookie';
import ActorCardLarge from '../components/SingleItemComponents/ActorCardLarge';
import { Movie } from '../types/Movie';
import ActorMovieSearchBar from '../components/GeneralComponents/ActorMovieSearchBar';
import MoviesList from '../components/ListComponents/MoviesList';
import MoviesListOneLine from '../components/ListComponents/MoviesListOneLine';
import ActorsListOneLine from '../components/ListComponents/ActorsListOneLine';

export default function ActorMovieSearchPage() {
  const [actors, setActors] = useState<Actor[] | null>(null);
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [page, setPage] = useState<number>(1);
  const { searchWord } = useParams();
  const navigate = useNavigate();
  const [cookies] = useCookies(['userName']);

  useEffect(() => {
    if (!cookies.userName) {
      navigate('/login');
    }
    if (searchWord !== undefined) {
      searchActorsByName(searchWord).then((res) => {
        setActors(res);
      });
      getMoviesToName(searchWord, page).then((res) => {
        setMovies(res);
      });
    }
  }, [searchWord]);

  function toHomePage(e: any) {
    e.preventDefault();
    navigate('/home');
  }

  return (
    <>
      <Stack spacing={1} direction={'column'}>
        <Card>
          <CardContent>
            <Stack spacing={1} direction={'row'}>
              <IconButton onClick={toHomePage}>
                <HomeIcon />
              </IconButton>
              <ActorMovieSearchBar data={searchWord} />
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Grid2 container spacing={0}>
              {actors != null ? (
                <>
                  <ActorsListOneLine
                    actors={actors}
                    title="Actors:"
                    handleClick={() => navigate('/search/actor/' + searchWord)}
                  />
                </>
              ) : (
                <Typography>No actors here</Typography>
              )}
            </Grid2>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            {movies != null ? (
              <>
                <MoviesListOneLine
                  movies={movies}
                  title="Movies:"
                  handleClick={() => navigate('/search/movie/' + searchWord)}
                />
              </>
            ) : (
              <Typography>No movies here</Typography>
            )}
          </CardContent>
        </Card>
      </Stack>
    </>
  );
}
