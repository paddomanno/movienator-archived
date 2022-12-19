//Route: movienator3000.com/genreMovies/:genreId
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import { getMoviesToGenre, getSingleGenre } from '../services/ExternService';
import { Typography } from '@mui/material';
import { Genre } from '../types/Genre';
import { useCookies } from 'react-cookie';
import MoviesList from '../components/ListComponents/MoviesList';

export default function GenreMoviesPage() {
  const navigate = useNavigate();
  const { genreId } = useParams();
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [genre, setGenre] = useState<Genre | null>(null);
  const [cookies, setCookies] = useCookies(['userName']);

  useEffect(() => {
    if (!cookies.userName) {
      navigate('/login');
    }
    if (typeof genreId == 'string') {
      getMoviesToGenre(parseInt(genreId)).then((movies) => {
        setMovies(movies);
      });
      getSingleGenre(parseInt(genreId)).then((genre) => {
        setGenre(genre);
      });
    }
  }, []);

  return (
    <div>
      {movies != null && genre != null ? (
        <>
          <Typography>Movies of Genre {genre.genreName}</Typography>
          <MoviesList title="" movies={movies} />
        </>
      ) : (
        <>
          <Typography>Movies of Genre ...</Typography>
          <Typography>Loading...</Typography>
        </>
      )}
    </div>
  );
}
