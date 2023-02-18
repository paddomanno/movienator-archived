import { MovieListProps } from '../../props/MovieProps';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import MovieCard from '../SingleItemComponents/MovieCard';

export default function OtherProfileMutualReviewed({ movies }: MovieListProps) {
  return (
    <Card sx={{ flexGrow: 1 }}>
      <CardContent>
        <Typography variant={'h5'}>Movies you have both reviewed: </Typography>
        <Stack direction={'row'} overflow={'auto'}>
          {movies.map((movie) => (
            <MovieCard movie={movie} key={movie.movieId} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
