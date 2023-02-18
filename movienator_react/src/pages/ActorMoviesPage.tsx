//Route: movienator3000.com/genreMovies/:genreId
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import { getMoviesToActor, getOneActorToId } from '../services/ExternService';
import { Typography, Paper } from '@mui/material';
import { useCookies } from 'react-cookie';
import { Actor } from '../types/Actor';
import MoviesList from '../components/ListComponents/MoviesList';

export default function ActorMoviesPage() {
  const navigate = useNavigate();
  const { actorId } = useParams();
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [actor, setActor] = useState<Actor | null>(null);
  const [cookies] = useCookies(['userName']);

  useEffect(() => {
    if (!cookies.userName) {
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof actorId == 'string') {
      getOneActorToId(parseInt(actorId)).then((actor) => {
        setActor(actor);
      });
      getMoviesToActor(parseInt(actorId)).then((movies) => {
        setMovies(movies);
      });
    }
  }, [actorId]);

  useEffect(() => {
    if (actor) {
      document.title = actor.name + ' Movies';
    } else {
      document.title = 'Actors Movies';
    }
  }, [actor]);

  return (
    <Paper>
      {movies != null && actor != null ? (
        <Paper>
          <Typography>Movies with {actor.name}</Typography>
          <MoviesList movies={movies} />
        </Paper>
      ) : (
        <Paper>
          <Typography>Loading...</Typography>
        </Paper>
      )}
    </Paper>
  );
}
