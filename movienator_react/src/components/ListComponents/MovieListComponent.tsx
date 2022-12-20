import { Movie } from '../../types/Movie';
import {
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import SingleMovieFrameComponent from '../SingleItemComponents/SingleMovieFrameComponent';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { grey } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

export default function MovieListComponent(props: any) {
  const movies: Movie[] = props.data as Movie[];
  const navigate = useNavigate();

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

  function handleClick(e: any) {
    e.preventDefault();
    switch (props.type as String) {
      case 'watchlist':
        navigate('/watchlist');
        break;
      case 'popular':
        navigate('/popular');
        break;
      case 'recommendations':
        navigate('/recommendations');
        break;
      default:
        navigate('/home');
        type = 'Undefined Type';
    }
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
            <IconButton
              onClick={handleClick}
              size={'large'}
              sx={{ backgroundColor: grey.A400 }}
            >
              <ArrowForwardIcon sx={{ width: 100 }} />
            </IconButton>
          </Stack>
        ) : (
          <Typography>No Movies in your {type}</Typography>
        )}
      </CardContent>
    </Card>
  );
}
