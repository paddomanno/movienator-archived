import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SingleGenreProps } from '../../props/GenreProps';

export default function GenreCard({ genre }: SingleGenreProps) {
  const navigate = useNavigate();
  function manageClick() {
    navigate('/genreMovies/' + genre.genreId);
  }
  return (
    <IconButton onClick={manageClick}>
      <Card
        sx={{
          maxWidth: 175,
          minWidth: 175,
        }}
        raised={true}
      >
        <CardMedia
          component="img"
          alt={genre.genreName}
          height="125"
          image={`${process.env.PUBLIC_URL}/Images/Genres/${genre.genreName}.jpg`}
        />
        <CardContent>
          <Typography
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            variant={'body2'}
          >
            {genre.genreName}
          </Typography>
        </CardContent>
      </Card>
    </IconButton>
  );
}
