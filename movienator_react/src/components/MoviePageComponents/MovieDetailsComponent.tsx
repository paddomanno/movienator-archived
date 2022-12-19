import { Movie } from '../../types/Movie';
import { Typography } from '@mui/material';

export default function MovieDetailsComponent(props: any) {
  const movie: Movie = props.data as Movie;
  return (
    <>
      <Typography variant={'h2'}>{movie.title}</Typography>
    </>
  );
}
