import { MovieListProps } from '../../props/MovieProps';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import MovieCard from '../SingleItemComponents/MovieCard';

export default function OtherProfileMutualWatchlist({
  movies,
}: MovieListProps) {
  return (
    <Card sx={{ flexGrow: 1 }}>
      <CardContent>
        <Typography variant={'h5'}>
          Movies you have both on your Watchlist:{' '}
        </Typography>
        <Stack direction={'row'} overflow={'auto'}>
          {movies.map((movie) => (
            <MovieCard movie={movie} key={movie.movieId} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
