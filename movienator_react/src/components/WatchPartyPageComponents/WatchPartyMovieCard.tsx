import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MovieWithScore } from '../../types/Recommendation';

type Props = {
  movie: MovieWithScore;
};

export default function WatchPartyMovieCard({ movie }: Props) {
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
          height="231"
          image={`https://image.tmdb.org/t/p/w154${movie.imagePath}`}
        />
        <CardContent>
          <Typography variant={'body2'}>
            {new Date(movie.releaseDate).getTime() !== new Date(0).getTime()
              ? new Date(movie.releaseDate).getFullYear()
              : 'Date not known'}
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
          <Typography
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            variant={'body2'}
          >
            {`Score: ${movie.score}`}
          </Typography>
        </CardContent>
      </Card>
    </IconButton>
  );
}
