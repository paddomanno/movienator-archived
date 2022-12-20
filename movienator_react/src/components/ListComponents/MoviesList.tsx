import { Movie } from '../../types/Movie';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import MovieCard from '../SingleItemComponents/MovieCard';
import { grey } from '@mui/material/colors';
import Grid2 from '@mui/material/Unstable_Grid2';

type Props = {
  movies: Movie[];
  title?: string;
};

export default function MoviesList({ title, movies }: Props) {
  return (
    <Card sx={{ backgroundColor: grey.A200 }}>
      <CardContent>
        {title ?? <Typography>{title}</Typography>}
        {movies.length > 0 ? (
          <Grid2 container spacing={1}>
            {movies.map((movie) => (
              <Grid2>
                <MovieCard movie={movie} />
              </Grid2>
            ))}
          </Grid2>
        ) : (
          <Typography>No movies here</Typography>
        )}
      </CardContent>
    </Card>
  );
}
