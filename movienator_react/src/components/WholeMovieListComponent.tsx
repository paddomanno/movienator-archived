import { Movie } from '../types/Movie';
import { Card, CardContent, Stack } from '@mui/material';
import SingleMovieFrameComponent from './SingleItemComponents/SingleMovieFrameComponent';

export default function WholeMovieListComponent(props: any) {
  const movies: Movie[] = props.data as Movie[];
  return (
    <Card sx={{ backgroundColor: 'lightgrey' }}>
      <CardContent>
        <Stack direction={'row'} spacing={1} flexWrap={'wrap'}>
          {movies.map((movie) => (
            <SingleMovieFrameComponent data={movie} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
