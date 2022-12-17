import { Movie } from '../../types/Movie';
import { Typography } from '@mui/material';

export default function MovieDetailsComponent(props: any) {
  const movie: Movie = props.data as Movie;
  return (
    <>
      <div>Showing Movie Infos & Actors</div>
      {movie.actors.map((actor) => (
        <Typography>{actor.name}</Typography>
      ))}
    </>
  );
}
