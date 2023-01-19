import { Movie } from '../../types/Movie';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import MovieCard from '../SingleItemComponents/MovieCard';
import { grey } from '@mui/material/colors';
import Grid2 from '@mui/material/Unstable_Grid2';
import { MovieWithScore } from '../../types/Recommendation';
import WatchPartyMovieCard from './WatchPartyMovieCard';

type Props = {
  movies: MovieWithScore[];
  title?: string;
};

export default function WatchPartyResultsList({ title, movies }: Props) {
  return (
    <Card sx={{ backgroundColor: grey.A200 }}>
      <CardContent>
        {title ?? <Typography>{title}</Typography>}
        {movies.length > 0 ? (
          <Grid2 container spacing={1} justifyContent="center">
            {movies.map((movie) => (
              <Grid2>
                <WatchPartyMovieCard movie={movie} />
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
