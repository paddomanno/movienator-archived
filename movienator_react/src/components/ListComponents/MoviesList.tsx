import { Movie } from '../../types/Movie';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import MovieCard from '../SingleItemComponents/MovieCard';

type Props = {
  movies: Movie[];
  title: string;
};

export default function MoviesList({ title, movies }: Props) {
  return (
    <Card sx={{ backgroundColor: 'lightgrey' }}>
      <CardContent>
        <Typography>{title}</Typography>
        {movies.length > 0 ? (
          <Stack direction={'row'} spacing={1} overflow={'auto'}>
            {movies.map((movie) => (
              <MovieCard movie={movie} />
            ))}
          </Stack>
        ) : (
          <Typography>No movies here</Typography>
        )}
      </CardContent>
    </Card>
  );
}
