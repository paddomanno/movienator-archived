import { Movie } from '../../types/Movie';
import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

type Props = {
  movie: Movie;
};

export default function MovieCard({ movie }: Props) {
  const navigate = useNavigate();
  function manageClick() {
    navigate('/movie/' + movie.movieId);
  }
  return (
    <IconButton onClick={manageClick}>
      <Card sx={{ maxWidth: 150, minWidth: 150 }}>
        <CardMedia
          component="img"
          alt={movie.imagePath != null ? movie.title : 'No image available'}
          height="225"
          image={`https://image.tmdb.org/t/p/w154${movie.imagePath}`}
        />
        <CardContent>
          <Typography variant={'body2'}>
            {movie.releaseDate !== undefined
              ? new Date(movie.releaseDate).getFullYear()
              : 'Not known'}
          </Typography>
          <Typography
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            variant={'body2'}
          >
            {movie.title}
          </Typography>
        </CardContent>
      </Card>
    </IconButton>
  );
}
