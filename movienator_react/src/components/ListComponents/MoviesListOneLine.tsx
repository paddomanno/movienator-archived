import { Movie } from '../../types/Movie';
import {
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import MovieCard from '../SingleItemComponents/MovieCard';
import { grey } from '@mui/material/colors';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

type Props = {
  movies: Movie[];
  title: string;
  handleClick: (e: any) => void;
};

export default function MoviesListOneLine({
  title,
  movies,
  handleClick,
}: Props) {
  return (
    <Card sx={{ backgroundColor: grey.A200 }}>
      <CardContent>
        <Typography>{title}</Typography>
        {movies.length > 0 ? (
          <Stack direction={'row'} spacing={1} justifyContent={'space-between'}>
            <Stack direction={'row'} spacing={1} overflow={'auto'}>
              {movies.map((movie) => (
                <MovieCard movie={movie} />
              ))}
            </Stack>
            <IconButton
              onClick={handleClick}
              size={'large'}
              sx={{ backgroundColor: grey.A400 }}
            >
              <ArrowForwardIcon sx={{ width: 100 }} />
            </IconButton>
          </Stack>
        ) : (
          <Typography>No movies here</Typography>
        )}
      </CardContent>
    </Card>
  );
}
