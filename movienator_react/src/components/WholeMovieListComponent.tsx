import { Movie } from '../types/Movie';
import { Card, CardContent, Stack } from '@mui/material';
import SingleMovieFrameComponent from './SingleItemComponents/SingleMovieFrameComponent';
import Grid2 from '@mui/material/Unstable_Grid2';
import { grey } from '@mui/material/colors';

export default function WholeMovieListComponent(props: any) {
  const movies: Movie[] = props.data as Movie[];
  return (
    <Card sx={{ backgroundColor: grey.A200 }}>
      <CardContent>
        <Grid2 container spacing={1}>
          {movies.map((movie) => (
            <Grid2>
              <SingleMovieFrameComponent data={movie} />
            </Grid2>
          ))}
        </Grid2>
      </CardContent>
    </Card>
  );
}
