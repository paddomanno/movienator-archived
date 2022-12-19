import { Movie } from '../../types/Movie';
import { Typography } from '@mui/material';

export default function MovieDetails(props: any) {
  const movie: Movie = props.data as Movie;
  return (
    // TODO: Show user list with friends who watchlisted this movie
    <>
      <div>Showing Movie Infos & Actors</div>
      {movie.actors.map((actor) => (
        <Typography>{actor.name}</Typography>
      ))}
    </>
  );
}
