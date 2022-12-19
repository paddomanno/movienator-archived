import { Card, CardContent, IconButton, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import MovieSearchBarComponent from '../components/MovieSearchBarComponent';
import { Movie } from '../types/Movie';
import WholeMovieListComponent from '../components/WholeMovieListComponent';
import { searchMoviesByName } from '../services/ExternService';
import { useNavigate, useParams } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import HomeIcon from '@mui/icons-material/Home';

export default function MovieSearchPage() {
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const { searchWord } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchWord != undefined) {
      searchMoviesByName(searchWord).then((res) => {
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
        <Card sx={{ backgroundColor: grey.A200 }}>
          <CardContent>
            <Stack spacing={1} direction={'row'}>
              <IconButton onClick={toHomePage}>
                <HomeIcon />
              </IconButton>
              <MovieSearchBarComponent data={searchWord} />
            </Stack>
          </CardContent>
        </Card>
        {movies != null ? <WholeMovieListComponent data={movies} /> : <></>}
      </Stack>
    </>
  );
}
