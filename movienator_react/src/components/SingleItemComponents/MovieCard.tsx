import { Movie } from '../../types/Movie';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
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
    <Card sx={{ maxWidth: 150, minWidth: 150 }} onClick={manageClick}>
      <CardMedia
        component="img"
        alt={movie.imagePath != null ? movie.title : 'No image available'}
        height="210"
        image={`https://image.tmdb.org/t/p/w154${movie.imagePath}`}
      />
      <CardContent>
        <Typography variant={'body2'}>
          {movie.releaseDate !== undefined
            ? new Date(movie.releaseDate).getFullYear()
            : 'Not known'}
        </Typography>
        <Typography variant={'subtitle2'}>{movie.title}</Typography>
      </CardContent>
    </Card>
  );
}
