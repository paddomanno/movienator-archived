//Route: movienator3000.com/genreMovies/:genreId
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import { getMoviesToActor, getSingleActor } from '../services/ExternService';
import { Typography } from '@mui/material';
import { useCookies } from 'react-cookie';
import { Actor } from '../types/Actor';
import MoviesList from '../components/ListComponents/MoviesList';

export default function ActorMoviesPage() {
  const navigate = useNavigate();
  const { actorId } = useParams();
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [actor, setActor] = useState<Actor | null>(null);
  const [cookies, setCookies] = useCookies(['userName']);

  useEffect(() => {
    if (!cookies.userName) {
      navigate('/login');
    }
    if (typeof actorId == 'string') {
      getSingleActor(parseInt(actorId)).then((actor) => {
        setActor(actor);
      });
      getMoviesToActor(parseInt(actorId)).then((movies) => {
        setMovies(movies);
      });
    }
  }, []);

  return (
    <div>
      {movies != null && actor != null ? (
        <>
          <Typography>Movies with {actor.name}</Typography>
          <MoviesList movies={movies} />
        </>
      ) : (
        <>
          <Typography>Loading...</Typography>
        </>
      )}
    </div>
  );
}
