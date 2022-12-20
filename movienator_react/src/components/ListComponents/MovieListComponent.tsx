import { Movie } from '../../types/Movie';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import SingleMovieFrameComponent from '../SingleItemComponents/SingleMovieFrameComponent';

export default function MovieListComponent(props: any) {
  const movies: Movie[] = props.data as Movie[];

  let type: String;
  switch (props.type as String) {
    case 'watchlist':
      type = 'Watchlist';
      break;
    case 'popular':
      type = 'Popular Movies';
      break;
    case 'recommendations':
      type = 'Your Recommendations';
      break;
    default:
      type = 'Undefined Type';
  }

  return (
    <Card sx={{ backgroundColor: 'lightgrey' }}>
      <CardContent>
        <Typography>{type}</Typography>
        {movies.length > 0 ? (
          <Stack direction={'row'} spacing={0} overflow={'auto'}>
            {movies.map((movie) => (
              <SingleMovieFrameComponent data={movie} />
            ))}
          </Stack>
        ) : (
          <Typography>No Movies in your {type}</Typography>
        )}
      </CardContent>
    </Card>
  );
}
